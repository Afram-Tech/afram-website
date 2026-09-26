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
  /** Which level of the taxonomy this place is — read off the node itself,
   *  never inferred from drill depth or breadcrumbs, so a level added later
   *  is selectable the moment the taxonomy has it. */
  level: LocationPickerLevel;
  /** Whether there are places inside this one to browse. Selecting a row
   *  always filters to it; browsing inside is a separate action. */
  hasChildren: boolean;
  /** How many places are directly inside ("29 districts") — 0 for a leaf. */
  childCount: number;
}

/** "city" is the URL codec's name for the district (MMDA) level. */
export type LocationPickerLevel = "region" | "city" | "area";

/** What the picker hands back on a final selection. */
export interface LocationPickerSelection {
  level: LocationPickerLevel;
  id: string;
  slug: string;
  label: string;
}
