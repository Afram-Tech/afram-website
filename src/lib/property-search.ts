/**
 * searchProperties(filters, pagination) — client-side fallback over an
 * already-fetched page of rows, using the PropertySearchFilters shape the
 * URL codec (property-search-filters.ts) produces. Mirrors afram-web's
 * src/utils/search-properties.ts one-to-one in design (matching by
 * normalised location token, not a resolved taxonomy id — see that file's
 * own comment for why), adapted to this repo's `Property` type in place of
 * afram-web's `ProjectFromQuery`.
 *
 * No server-side implementation exists here either — fetchPublicProperties
 * still pulls a flat, unfiltered 200-row page (00-findings.md §A4); this
 * only reduces "filtering has to happen after the fact in JS" from a
 * string-equality bug to a normalised, taxonomy-aware match. The real fix
 * is the $filter argument GetPublicProperties doesn't declare yet — see
 * docs/location-search/backend-requirements.md (shared with afram-web).
 */
import type { Property } from "@/features/landing/data/properties";
import { getBySlug, normalizeLocationName } from "@/lib/location-taxonomy";
import type { PropertySearchFilters } from "@/lib/property-search-filters";

export interface SearchPropertiesPagination {
  offset: number;
  limit: number;
}

export interface SearchPropertiesResult {
  rows: Property[];
  /** True when there are more rows beyond this page, within the candidate
   *  set already fetched — never "more rows exist upstream," since there is
   *  no server-side filter to ask for another page from (see module doc). */
  hasMore: boolean;
}

export interface SearchPropertiesDeps {
  /** The already-fetched candidate rows this filters over. */
  candidateRows: Property[];
  /** Viewer-currency converter. Every listing here is already in one of a
   *  handful of currencies (property.currency); when absent, prices compare
   *  as-is, same as PropertiesBrowser does today. */
  convert?: (amount: number, fromCurrency?: string) => number;
}

const identityConvert = (amount: number) => amount;

/** city, region, and the street address — the free-text surface a listing's
 *  place name can appear in, same fields PropertiesBrowser's search box
 *  already reads via `location`. */
export function getPropertyLocationTokens(property: Property): string[] {
  return [property.city, property.region, property.address.street]
    .filter((v): v is string => Boolean(v))
    .map(normalizeLocationName);
}

export function getPropertySearchText(property: Property): string {
  return [property.name, ...getPropertyLocationTokens(property), property.type]
    .map(normalizeLocationName)
    .filter(Boolean)
    .join(" ");
}

/** Same UNAVAILABLE vocabulary as afram-web's propertyAvailability — shared
 *  backend PropertyStatus values, not duplicated logic by accident. Kept
 *  minimal here (just the two booleans filtering needs), not the full
 *  badge/CTA/tone classification afram-web's card UI also carries — this
 *  repo doesn't render that today, so building it would be new UI scope,
 *  not a search-engine port. */
const UNAVAILABLE_STATUSES = new Set(["sold", "under_offer", "delisted", "unlisted"]);

export function getPropertyAvailability(property: Property): {
  available: boolean;
  underOffer: boolean;
} {
  const status = normalizeLocationName(property.status);
  if (!status) return { available: true, underOffer: false };
  return {
    available: !UNAVAILABLE_STATUSES.has(status),
    underOffer: status === "under_offer",
  };
}

function matchesRegion(property: Property, regionSlug: string): boolean {
  const node = getBySlug(regionSlug);
  // RegionNode: has `name`, has no `parentId` (DistrictNode and AreaNode both do).
  if (!node || !("name" in node) || "parentId" in node) return false;
  const wanted = normalizeLocationName(node.name);
  return getPropertyLocationTokens(property).some((t) => t.includes(wanted));
}

function matchesCity(property: Property, citySlug: string): boolean {
  const city = getBySlug(citySlug);
  if (!city || !("displayName" in city)) return false;
  const wanted = normalizeLocationName(city.displayName);
  return getPropertyLocationTokens(property).some((t) => t.includes(wanted));
}

function matchesArea(property: Property, areaSlug: string): boolean {
  // AREAS is empty until the candidate list is curated (see afram-web's
  // AREA_CANDIDATES.md) — getBySlug can never resolve an area today, so
  // this always excludes every row while that's true. Written for when it
  // isn't, matching afram-web's own matchesArea exactly.
  const node = getBySlug(areaSlug);
  // AreaNode: has both `name` and `parentId` (DistrictNode has `parentId`
  // but no `name`; RegionNode has `name` but no `parentId`).
  if (!node || !("name" in node) || !("parentId" in node)) return false;
  const wanted = normalizeLocationName(node.name);
  return getPropertyLocationTokens(property).some((t) => t.includes(wanted));
}

function matchesBbox(property: Property, bbox: NonNullable<PropertySearchFilters["bbox"]>): boolean {
  if (!property.coordinates) return false; // can't place it, can't claim it's in the viewport
  const { lat, lng } = property.coordinates;
  return lat >= bbox.south && lat <= bbox.north && lng >= bbox.west && lng <= bbox.east;
}

function sortRows(
  rows: Property[],
  sort: PropertySearchFilters["sort"],
  convert: (amount: number, fromCurrency?: string) => number,
): Property[] {
  if (!sort || sort === "newest") return rows; // already in server (newest-first) order
  const priceOf = (property: Property) =>
    property.price > 0 ? convert(property.price, property.currency) : Infinity;
  const sorted = [...rows];
  sorted.sort((a, b) => (sort === "price_asc" ? priceOf(a) - priceOf(b) : priceOf(b) - priceOf(a)));
  return sorted;
}

/**
 * Filters+sorts+paginates an already-fetched candidate set. Cannot discover
 * rows the caller didn't already load — see the module doc for what closes
 * that gap (a real $filter argument on GetPublicProperties).
 */
export function clientSearchProperties(
  filters: PropertySearchFilters,
  pagination: SearchPropertiesPagination,
  deps: SearchPropertiesDeps,
): SearchPropertiesResult {
  const convert = deps.convert ?? identityConvert;

  let rows = deps.candidateRows.filter((property) => {
    if (filters.region && !matchesRegion(property, filters.region)) return false;
    if (filters.city && !matchesCity(property, filters.city)) return false;
    if (filters.area && !matchesArea(property, filters.area)) return false;

    if (filters.type) {
      const wanted = normalizeLocationName(filters.type);
      if (normalizeLocationName(property.type) !== wanted) return false;
    }

    if (filters.status) {
      const { available, underOffer } = getPropertyAvailability(property);
      if (filters.status === "available" && !available) return false;
      if (filters.status === "under_offer" && !underOffer) return false;
    }

    if (filters.bedrooms !== undefined && property.beds < filters.bedrooms) return false;

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      if (property.price <= 0) return false; // can't prove it's in range with no price at all
      const value = convert(property.price, property.currency);
      if (filters.priceMin !== undefined && value < filters.priceMin) return false;
      if (filters.priceMax !== undefined && value > filters.priceMax) return false;
    }

    if (filters.q) {
      const query = normalizeLocationName(filters.q);
      if (!getPropertySearchText(property).includes(query)) return false;
    }

    if (filters.bbox && !matchesBbox(property, filters.bbox)) return false;

    return true;
  });

  rows = sortRows(rows, filters.sort, convert);

  const page = rows.slice(pagination.offset, pagination.offset + pagination.limit);
  const hasMore = pagination.offset + pagination.limit < rows.length;

  return { rows: page, hasMore };
}
