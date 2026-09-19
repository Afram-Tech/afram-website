#!/usr/bin/env bun
/**
 * Regenerates src/lib/location-taxonomy/generated/{regions,districts}.ts
 * from the committed boundary GeoJSON (src/data/boundaries/). Nothing under
 * generated/ is hand-edited — run this after re-running build-boundaries.ts,
 * or after editing GHANA_REGIONS or the alias table this reads from.
 *
 * This does NOT touch the polygon geometry — it only lifts id/name/parent/
 * centroid out into small, always-loadable metadata arrays, so the picker's
 * search index never has to pull in 260 districts' worth of polygons just to
 * list their names. The resolver (point-in-polygon) reads the geometry files
 * directly, lazily, separately from this.
 *
 * Port note: identical to afram-web's scripts/build-location-taxonomy.ts
 * except for the GHANA_REGIONS import — afram-web pulls that from a
 * dashboard-upload-flow constant that doesn't exist in this repo, so it
 * lives locally at src/lib/location-taxonomy/ghana-regions.ts instead. See
 * the "KEEP IN SYNC" header on src/lib/location-taxonomy/index.ts.
 *
 * Usage: bun run scripts/build-location-taxonomy.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { GHANA_REGIONS } from "../src/lib/location-taxonomy/ghana-regions";
import { REGION_ALIASES } from "../src/lib/location-taxonomy/aliases";

const BOUNDARIES_DIR = join(import.meta.dir, "..", "src", "data", "boundaries");
const OUT_DIR = join(import.meta.dir, "..", "src", "lib", "location-taxonomy", "generated");

/** Strip the trailing administrative-unit-type suffix HDX puts on district
 *  names ("Ablekuma Central Municipal" -> "Ablekuma Central"), so the picker
 *  and the stored `city` value read the way a person searches, not the way
 *  an MMDA is legally named. Collision-checked below before use. */
function stripDistrictSuffix(name: string): string {
  return name.replace(/\s+(Metropolitan|Municipal|District)$/i, "").trim();
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slugifies every name, and on a collision (rare — only real name clashes
 *  survive slugify's own normalisation) disambiguates by appending the
 *  p-code, so two different places never end up sharing one filter URL. */
function slugsFor(entries: { pcode: string; name: string }[]): Map<string, string> {
  const bySlug = new Map<string, string[]>();
  for (const { pcode, name } of entries) {
    const slug = slugify(name);
    bySlug.set(slug, [...(bySlug.get(slug) ?? []), pcode]);
  }
  const result = new Map<string, string>();
  for (const { pcode, name } of entries) {
    const slug = slugify(name);
    const collides = (bySlug.get(slug) ?? []).length > 1;
    result.set(pcode, collides ? `${slug}-${pcode.toLowerCase()}` : slug);
  }
  return result;
}

interface AdminProperties {
  adm1_pcode: string;
  adm1_name: string;
  adm2_pcode: string;
  adm2_name: string;
  center_lat: number;
  center_lon: number;
}

type AdminFeature = GeoJSON.Feature<GeoJSON.Geometry, AdminProperties>;

function loadFeatures(path: string): AdminFeature[] {
  return JSON.parse(readFileSync(path, "utf-8")).features;
}

function main() {
  const admin1 = loadFeatures(join(BOUNDARIES_DIR, "gha-admin1.geojson"));
  const admin2 = loadFeatures(join(BOUNDARIES_DIR, "gha-admin2.geojson"));

  // ---- Regions ----
  // The canonical name is GHANA_REGIONS' spelling (already the official one
  // used elsewhere in this codebase); HDX's spelling, where it differs, is
  // recorded as an alias rather than overriding the canonical name.
  const regionByPcode = new Map(
    admin1.map((f) => [f.properties.adm1_pcode as string, f.properties]),
  );

  const regionNameToPcode = new Map<string, string>();
  for (const [pcode, props] of regionByPcode) {
    const hdxName = props.adm1_name as string;
    const alias = REGION_ALIASES[hdxName];
    const canonical = alias ?? hdxName;
    regionNameToPcode.set(canonical, pcode);
  }

  // Contract: every GHANA_REGIONS entry must resolve to exactly one HDX
  // p-code, and every HDX p-code must resolve to exactly one GHANA_REGIONS
  // entry. A build-time failure here is much cheaper than a silent gap a
  // buyer hits months later as "my region isn't in the list."
  const unmatchedRegions = GHANA_REGIONS.filter((name) => !regionNameToPcode.has(name));
  if (unmatchedRegions.length > 0) {
    throw new Error(
      `GHANA_REGIONS entries with no matching HDX region (add an alias in ` +
        `src/lib/location-taxonomy/aliases.ts): ${unmatchedRegions.join(", ")}`,
    );
  }
  const usedPcodes = new Set(GHANA_REGIONS.map((name) => regionNameToPcode.get(name)));
  const unmatchedPcodes = [...regionByPcode.keys()].filter((p) => !usedPcodes.has(p));
  if (unmatchedPcodes.length > 0) {
    throw new Error(
      `HDX regions with no matching GHANA_REGIONS entry: ` +
        unmatchedPcodes.map((p) => `${p} (${regionByPcode.get(p)?.adm1_name})`).join(", "),
    );
  }

  const regionSlugs = slugsFor(
    GHANA_REGIONS.map((name) => ({ pcode: regionNameToPcode.get(name)!, name })),
  );

  const regions = GHANA_REGIONS.map((name) => {
    const pcode = regionNameToPcode.get(name)!;
    const props = regionByPcode.get(pcode)!;
    return {
      id: pcode,
      slug: regionSlugs.get(pcode)!,
      name,
      aliases: [props.adm1_name].filter((n) => n !== name),
      centroid: [props.center_lon, props.center_lat] as [number, number],
    };
  });

  // ---- Districts ----
  const displayNameCounts = new Map<string, number>();
  const stripped = admin2.map((f) => stripDistrictSuffix(f.properties.adm2_name));
  for (const name of stripped) displayNameCounts.set(name, (displayNameCounts.get(name) ?? 0) + 1);

  const collisions = [...displayNameCounts.entries()].filter(([, count]) => count > 1);
  if (collisions.length > 0) {
    console.warn(
      `Display-name collisions after stripping MMDA suffixes — keeping the full ` +
        `official name for these instead:\n` +
        collisions.map(([name]) => `  "${name}"`).join("\n"),
    );
  }
  const collidingNames = new Set(collisions.map(([name]) => name));

  const districtSlugs = slugsFor(
    admin2.map((f) => ({
      pcode: f.properties.adm2_pcode as string,
      name: collidingNames.has(stripDistrictSuffix(f.properties.adm2_name))
        ? (f.properties.adm2_name as string)
        : stripDistrictSuffix(f.properties.adm2_name),
    })),
  );

  const districts = admin2.map((f) => {
    const p = f.properties;
    const strippedName = stripDistrictSuffix(p.adm2_name);
    return {
      id: p.adm2_pcode as string,
      slug: districtSlugs.get(p.adm2_pcode)!,
      officialName: p.adm2_name as string,
      displayName: collidingNames.has(strippedName) ? p.adm2_name : strippedName,
      parentId: p.adm1_pcode as string,
      centroid: [p.center_lon, p.center_lat] as [number, number],
    };
  });

  mkdirSync(OUT_DIR, { recursive: true });

  const header = (what: string) =>
    `/* eslint-disable */\n// GENERATED by scripts/build-location-taxonomy.ts — do not hand-edit.\n// Regenerate with: bun run scripts/build-location-taxonomy.ts\n// Source: src/data/boundaries/${what} (see docs/location-search/ATTRIBUTION.md)\n\n`;

  writeFileSync(
    join(OUT_DIR, "regions.ts"),
    header("gha-admin1.geojson") +
      `import type { RegionNode } from "../types";\n\nexport const GENERATED_REGIONS: RegionNode[] = ${JSON.stringify(regions, null, 2)};\n`,
  );

  writeFileSync(
    join(OUT_DIR, "districts.ts"),
    header("gha-admin2.geojson") +
      `import type { DistrictNode } from "../types";\n\nexport const GENERATED_DISTRICTS: DistrictNode[] = ${JSON.stringify(districts, null, 2)};\n`,
  );

  console.log(`Wrote ${regions.length} regions and ${districts.length} districts to ${OUT_DIR}`);
  if (collisions.length === 0) {
    console.log("No display-name collisions.");
  }
}

main();
