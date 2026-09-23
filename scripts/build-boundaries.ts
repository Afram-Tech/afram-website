#!/usr/bin/env bun
/**
 * Regenerates the Ghana administrative boundary GeoJSON shipped under
 * src/data/boundaries/. Nothing in that directory is hand-edited — this is
 * the only thing that writes it, so anyone can reproduce the shipped files
 * byte-for-byte from the same public source.
 *
 * Source: HDX COD-AB Ghana ("Ghana - Subnational Administrative Boundaries"),
 * data supplied by Ghana Statistical Service (GSS), distributed by UN OCHA.
 * License: CC BY-IGO 3.0. See docs/location-search/ATTRIBUTION.md for the
 * full notice this build must keep true — if you change what is stripped,
 * how it is simplified, or the source itself, update that file too.
 *
 * Usage:
 *   bun run scripts/build-boundaries.ts
 *   bun run scripts/build-boundaries.ts --update-pin   # source changed upstream; re-pin deliberately
 *
 * Requires: `unzip` on PATH, and `bunx mapshaper` (downloaded on first run,
 * not a project dependency — this script is the only thing that invokes it).
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as turf from "@turf/turf";

const SOURCE_URL =
  "https://data.humdata.org/dataset/dc4c17cf-59d9-478c-b2b7-acd889241194/resource/c8d647a7-f396-4108-9fe4-cf7b31731a73/download/gha_admin_boundaries.geojson.zip";

/**
 * Pinned by hand after manually reviewing what changed. A mismatch means HDX
 * has published a new version of the dataset since this was last pinned — the
 * whole point of pinning is that this is a deliberate, reviewed event, not
 * something the build silently absorbs. Re-run with --update-pin once you've
 * checked the diff (region/district counts, renamed p-codes) is expected.
 */
const PINNED_SOURCE_SHA256 = "fbc2a72af2bfc928045031aff76e36fab49dea48e858a4ac640d7070d2dc1e22";

const OUT_DIR = join(import.meta.dir, "..", "src", "data", "boundaries");

/** raw byte, gzip byte budgets — see docs/location-search/00-findings.md §Boundary data */
const BUDGETS = {
  "gha-admin1.geojson": 150 * 1024,
  "gha-admin2.geojson": 600 * 1024,
};

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function mapshaper(args: string[], cwd: string) {
  execFileSync("bunx", ["mapshaper", ...args], { cwd, stdio: "inherit" });
}

/** One LineString per polygon ring (outer + holes), across Polygon or MultiPolygon. */
function ringsToLines(geom: GeoJSON.Polygon | GeoJSON.MultiPolygon) {
  const polys = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
  return polys.flatMap((poly) => poly.map((ring) => turf.lineString(ring)));
}

/**
 * How far the simplified boundary drifted from the source, in metres — the
 * maximum, over every vertex of the source polygon, of that vertex's
 * distance to the nearest point on the simplified polygon's boundary. This
 * is source→simplified only (not a full Hausdorff distance), which is the
 * side that matters here: simplification only removes points, so a source
 * vertex ending up far from every simplified edge is exactly "this stretch
 * of border moved."
 */
function maxDeviationMeters(
  sourceGeom: GeoJSON.Polygon | GeoJSON.MultiPolygon,
  simplifiedGeom: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): number {
  const simplifiedLines = ringsToLines(simplifiedGeom);
  let max = 0;
  for (const srcLine of ringsToLines(sourceGeom)) {
    for (const coord of srcLine.geometry.coordinates) {
      const pt = turf.point(coord);
      let nearest = Infinity;
      for (const simLine of simplifiedLines) {
        const d = turf.nearestPointOnLine(simLine, pt, { units: "meters" }).properties
          .pointDistance;
        if (d < nearest) nearest = d;
      }
      if (nearest < Infinity) max = Math.max(max, nearest);
    }
  }
  return max;
}

type AdminFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, Record<string, string>>;

function reportDeviation(
  label: string,
  sourceFeatures: AdminFeature[],
  outFeatures: AdminFeature[],
  pcodeField: string,
) {
  const byPcode = new Map(outFeatures.map((f) => [f.properties[pcodeField], f]));
  let overallMax = 0;
  let worst = "";
  for (const src of sourceFeatures) {
    const pcode = src.properties[pcodeField];
    const out = byPcode.get(pcode);
    if (!out) continue;
    const dev = maxDeviationMeters(src.geometry, out.geometry);
    if (dev > overallMax) {
      overallMax = dev;
      worst = `${pcode} (${src.properties[pcodeField.replace("pcode", "name")]})`;
    }
  }
  console.log(`  ${label}: max deviation ${overallMax.toFixed(1)}m from source — worst: ${worst}`);
  return overallMax;
}

async function main() {
  const updatePin = process.argv.includes("--update-pin");
  const work = mkdtempSync(join(tmpdir(), "gha-boundaries-"));

  try {
    console.log(`Downloading source from ${SOURCE_URL}`);
    const res = await fetch(SOURCE_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
    const zipBuf = Buffer.from(await res.arrayBuffer());
    const hash = sha256(zipBuf);

    if (hash !== PINNED_SOURCE_SHA256) {
      if (!updatePin) {
        console.error(
          `\nSource file hash does not match the pinned value.\n` +
            `  expected: ${PINNED_SOURCE_SHA256}\n` +
            `  got:      ${hash}\n\n` +
            `HDX has published a new version of this dataset since it was last pinned.\n` +
            `Review what changed (region/district counts, renamed p-codes) before trusting\n` +
            `it, then re-run with --update-pin and update PINNED_SOURCE_SHA256 in this file.\n`,
        );
        process.exit(1);
      }
      console.warn(`Source hash changed — proceeding because --update-pin was passed.`);
      console.warn(`New hash to commit to PINNED_SOURCE_SHA256: ${hash}`);
    } else {
      console.log(`Source hash verified: ${hash}`);
    }

    const zipPath = join(work, "source.zip");
    writeFileSync(zipPath, zipBuf);
    execFileSync("unzip", ["-o", "-q", zipPath, "-d", join(work, "extracted")]);

    mkdirSync(OUT_DIR, { recursive: true });

    /* Pipeline, chosen after measuring the accuracy/size tradeoff (see the
       findings doc): "-simplify weighted 100%" is not a no-op — it still
       triggers mapshaper's shared-boundary topology build and -clean pass
       (so adjacent districts keep a common edge, no slivers/gaps), but
       removes ~0 points itself. `precision=0.0001` (~11m at this latitude)
       is the actual size lever, and lands both layers comfortably under
       budget while keeping deviation from the source at a few metres —
       dominated by quantisation rounding, not shape loss. Retaining more
       precision (1e-5) blows the region-layer budget; simplifying instead
       (holding precision fixed) moves borders by hundreds to low thousands
       of metres for no size benefit once precision is already the binding
       constraint. The deviation report this run prints below is the same
       measurement docs/location-search/00-findings.md §F records. */
    const REGION_FIELDS = "adm1_pcode,adm1_name,center_lat,center_lon";
    const DISTRICT_FIELDS = "adm2_pcode,adm2_name,adm1_pcode,center_lat,center_lon";
    const SIMPLIFY_ARGS = ["weighted", "100%", "keep-shapes", "planar"];
    const PRECISION = "0.0001";

    mapshaper(
      [
        join(work, "extracted", "gha_admin1.geojson"),
        "-filter-fields",
        REGION_FIELDS,
        "-simplify",
        ...SIMPLIFY_ARGS,
        "-clean",
        "-o",
        `precision=${PRECISION}`,
        "format=geojson",
        join(OUT_DIR, "gha-admin1.geojson"),
      ],
      work,
    );

    mapshaper(
      [
        join(work, "extracted", "gha_admin2.geojson"),
        "-filter-fields",
        DISTRICT_FIELDS,
        "-simplify",
        ...SIMPLIFY_ARGS,
        "-clean",
        "-o",
        `precision=${PRECISION}`,
        "format=geojson",
        join(OUT_DIR, "gha-admin2.geojson"),
      ],
      work,
    );

    console.log("\nSize report:");
    let overBudget = false;
    for (const [file, budget] of Object.entries(BUDGETS)) {
      const buf = readFileSync(join(OUT_DIR, file));
      const gz = gzipSync(buf, { level: 9 }).length;
      const status = gz <= budget ? "OK" : "OVER BUDGET";
      if (gz > budget) overBudget = true;
      console.log(
        `  ${file}: ${(buf.length / 1024).toFixed(0)}KB raw, ${(gz / 1024).toFixed(0)}KB gzip ` +
          `(budget ${(budget / 1024).toFixed(0)}KB) — ${status}`,
      );
    }

    if (overBudget) {
      console.error(
        "\nOne or more layers exceeded their size budget. Do not loosen accuracy " +
          "silently to fit — report the numbers instead (see boundary condition 2).",
      );
      process.exit(1);
    }

    console.log("\nDeviation report (source vertex → nearest simplified edge):");
    const admin1Source = JSON.parse(
      readFileSync(join(work, "extracted", "gha_admin1.geojson"), "utf-8"),
    ).features;
    const admin1Out = JSON.parse(
      readFileSync(join(OUT_DIR, "gha-admin1.geojson"), "utf-8"),
    ).features;
    const admin2Source = JSON.parse(
      readFileSync(join(work, "extracted", "gha_admin2.geojson"), "utf-8"),
    ).features;
    const admin2Out = JSON.parse(
      readFileSync(join(OUT_DIR, "gha-admin2.geojson"), "utf-8"),
    ).features;
    reportDeviation("regions (admin1)", admin1Source, admin1Out, "adm1_pcode");
    reportDeviation("districts (admin2)", admin2Source, admin2Out, "adm2_pcode");
    console.log(
      "\nIf these numbers move meaningfully from what's recorded in " +
        "docs/location-search/00-findings.md, update that doc too — the resolver's " +
        "border-distance tolerance is set from this figure.",
    );

    console.log(`\nWrote ${OUT_DIR}.`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

main();
