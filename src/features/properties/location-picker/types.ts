/**
 * The picker's own node shape — deliberately not RegionNode/DistrictNode/
 * AreaNode directly, so the component and its pure logic (grouping, search,
 * navigation) don't have to branch on which taxonomy type they're holding.
 * See adapters.ts for the RegionNode/DistrictNode/AreaNode -> this mapping.
 */
export interface LocationPickerNode {
  /** Taxonomy id (p-code for region/district, slug for area) — what a
   *  selection is reported as. */
  id: string;
  /** URL-facing slug — what the filter codec reads/writes. */
  slug: string;
  label: string;
  /** Other names this node matches search on (HDX's spelling, etc.). */
  aliases: string[];
  /** Listing count, when known — the caller supplies this (see
   *  LocationPicker's `counts` prop); undefined means "not known," not
   *  zero, and the row omits the count rather than showing "0". */
  count?: number;
  /** Breadcrumb shown under the row once results span levels (search) or
   *  once drilled below the top level — e.g. "Greater Accra" for a
   *  district, "Dansoman / Greater Accra" for an area. */
  parentLabel?: string;
  /** Whether selecting this row drills down (true) or is a final
   *  selection (false) — a district currently has no children (AREAS is
   *  empty), so every district is a leaf today even though the taxonomy
   *  supports a third level. */
  hasChildren: boolean;
}

export type LocationPickerLevel = "region" | "city" | "area";

/** What the picker hands back on a final selection. */
export interface LocationPickerSelection {
  level: LocationPickerLevel;
  id: string;
  slug: string;
  label: string;
}
