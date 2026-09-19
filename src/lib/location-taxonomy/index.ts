/**
 * Ghana location taxonomy: Region -> City/District (MMDA) -> Area.
 *
 * Dependency-free and framework-agnostic by design — no React, no Apollo, no
 * generated GraphQL types. This module is duplicated (not imported across a
 * package boundary) into afram-website, since the two are separate repos;
 * see the header note below before editing either copy.
 *
 * ┌─────────────────────────── KEEP IN SYNC ───────────────────────────────┐
 * │ This file, aliases.ts, types.ts and generated/ are duplicated at:      │
 * │   afram-web:     src/lib/location-taxonomy/                            │
 * │   afram-website: src/lib/location-taxonomy/                            │
 * │ Both copies carry identical contract tests (see location-taxonomy.     │
 * │ test.ts) so a change that breaks the contract in one repo is caught    │
 * │ before it's copied to the other. A shared npm package is the obvious   │
 * │ next step once a third consumer exists — not done yet, see the PR      │
 * │ description for this module for the tradeoff.                         │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Regions and districts are data-driven (generated/, from HDX COD-AB via
 * scripts/build-location-taxonomy.ts) — nothing here hardcodes a region or
 * district list by hand. Areas are curated separately (see docs/
 * location-search/AREA_CANDIDATES.md) and are not generated from a
 * boundary source, because neighbourhoods have no authoritative dataset.
 */
import { GENERATED_REGIONS } from "./generated/regions";
import { GENERATED_DISTRICTS } from "./generated/districts";
import type { AreaNode, DistrictNode, RegionNode } from "./types";

export type {
  AreaNode,
  DistrictNode,
  LngLat,
  RegionNode,
  LocationLevel,
  LocationNode,
} from "./types";

export const REGIONS: readonly RegionNode[] = GENERATED_REGIONS;
export const DISTRICTS: readonly DistrictNode[] = GENERATED_DISTRICTS;

/** Populated by whoever curates the area list (see AREA_CANDIDATES.md); empty
 *  until then — every function here degrades gracefully with no areas at all. */
export let AREAS: readonly AreaNode[] = [];

/** Test-only escape hatch — production code should not call this. */
export function __setAreasForTest(areas: readonly AreaNode[]): void {
  AREAS = areas;
}

const norm = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*\bregion\b\s*$/, "") // "Greater Accra Region" -> "greater accra"
    .trim();

/** Case/whitespace/diacritic/"...Region"-suffix-insensitive normalisation,
 *  for comparing a free-text value against a taxonomy name. Not an identity
 *  — two different names can normalise to the same string without being the
 *  same place (unlikely in this dataset, but callers doing exact lookups
 *  should prefer `findByAlias` + id, not string equality on this). */
export function normalizeLocationName(value: string): string {
  return norm(value);
}

const regionsByNormalizedName = new Map<string, RegionNode>();
for (const region of GENERATED_REGIONS) {
  regionsByNormalizedName.set(norm(region.name), region);
  for (const alias of region.aliases) regionsByNormalizedName.set(norm(alias), region);
}

const districtsByNormalizedName = new Map<string, DistrictNode>();
for (const district of GENERATED_DISTRICTS) {
  districtsByNormalizedName.set(norm(district.displayName), district);
  districtsByNormalizedName.set(norm(district.officialName), district);
}

const byId = new Map<string, RegionNode | DistrictNode | AreaNode>();
for (const r of GENERATED_REGIONS) byId.set(r.id, r);
for (const d of GENERATED_DISTRICTS) byId.set(d.id, d);

const bySlug = new Map<string, RegionNode | DistrictNode | AreaNode>();
for (const r of GENERATED_REGIONS) bySlug.set(r.slug, r);
for (const d of GENERATED_DISTRICTS) bySlug.set(d.slug, d);

function rebuildAreaIndex() {
  for (const a of AREAS) {
    byId.set(a.id, a);
    bySlug.set(a.slug, a);
  }
}

/**
 * Resolves free text to a region or district node via name/alias matching —
 * NOT a fuzzy or substring search (that's the picker's job); this is for
 * "does this string identify a known place at all," e.g. validating a
 * resolver's geocoder-fallback output before it's allowed to populate
 * `region`/`city`. Areas are matched too, once curated.
 */
export function findByAlias(value: string): RegionNode | DistrictNode | AreaNode | null {
  const key = norm(value);
  const areaMatch = AREAS.find(
    (a) => norm(a.name) === key || a.aliases.some((alias) => norm(alias) === key),
  );
  if (areaMatch) return areaMatch;
  return regionsByNormalizedName.get(key) ?? districtsByNormalizedName.get(key) ?? null;
}

export function getById(id: string): RegionNode | DistrictNode | AreaNode | null {
  rebuildAreaIndex();
  return byId.get(id) ?? null;
}

/** Slug -> node — the URL filter codec's lookup (?region=greater-accra),
 *  distinct from `getById`: a slug is never an internal join key (parentId,
 *  resolver output, metadata.location all use `id`), only a URL-facing one. */
export function getBySlug(slug: string): RegionNode | DistrictNode | AreaNode | null {
  rebuildAreaIndex();
  return bySlug.get(slug) ?? null;
}

/** Direct children of a region (its districts) or a district (its curated areas, if any). */
export function getChildren(parentId: string): (DistrictNode | AreaNode)[] {
  const districts = GENERATED_DISTRICTS.filter((d) => d.parentId === parentId);
  if (districts.length > 0) return districts;
  return AREAS.filter((a) => a.parentId === parentId);
}

/** Region -> ... -> node, root first. Empty if `id` isn't found. */
export function getPath(id: string): (RegionNode | DistrictNode | AreaNode)[] {
  rebuildAreaIndex();
  const node = byId.get(id);
  if (!node) return [];

  if ("aliases" in node && !("parentId" in node)) {
    // RegionNode
    return [node as RegionNode];
  }
  const parent = byId.get((node as DistrictNode | AreaNode).parentId);
  return parent ? [...getPath(parent.id), node] : [node];
}

export function getRegionById(id: string): RegionNode | null {
  return GENERATED_REGIONS.find((r) => r.id === id) ?? null;
}

export function getDistrictById(id: string): DistrictNode | null {
  return GENERATED_DISTRICTS.find((d) => d.id === id) ?? null;
}
