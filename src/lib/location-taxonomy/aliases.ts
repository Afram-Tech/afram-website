/**
 * Known spelling mismatches between GHANA_REGIONS (this codebase's existing,
 * pre-2019-reorg-correct region list) and the HDX COD-AB source. Keyed by
 * HDX's spelling, valued by the canonical GHANA_REGIONS spelling.
 *
 * build-location-taxonomy.ts fails loudly if it finds an HDX region with no
 * matching GHANA_REGIONS entry and no alias here — so a future HDX update
 * that renames or splits a region cannot silently vanish from the taxonomy,
 * it has to be triaged and either aliased or added to GHANA_REGIONS.
 */
export const REGION_ALIASES: Record<string, string> = {
  "Northern East": "North East",
};
