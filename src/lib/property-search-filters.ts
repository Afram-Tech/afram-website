/**
 * The Feature B filter model: Region -> City -> Area (slugs, via the
 * taxonomy) plus price/type/bedrooms/status/sort/q/page/bbox — and its pure
 * ⇄ URLSearchParams codec, so `/properties?region=greater-accra&price_min=
 * 500000` is the actual state, shareable and bookmarkable, not something
 * reconstructed from component state after the fact.
 *
 * Distinct from `browseFilters.ts`'s `Filters`/`applyClientFilters` (status/
 * location-string/type/price-band) — that's the dashboard's current browse
 * page, still wired to it. This is the target shape for the Location Picker
 * work; migrating BrowseProjects.tsx onto it is a separate, later step, not
 * done by adding this file.
 *
 * "Unknown or invalid params are ignored, never thrown" (the spec's own
 * words) is the operative rule throughout: a malformed URL degrades to
 * "that field wasn't set," never a crash or a garbage value reaching a
 * query.
 */
import { getBySlug } from "@/lib/location-taxonomy";

export const SEARCH_STATUSES = ["available", "under_offer"] as const;
export type SearchStatus = (typeof SEARCH_STATUSES)[number];

export const SEARCH_SORTS = ["newest", "price_asc", "price_desc"] as const;
export type SearchSort = (typeof SEARCH_SORTS)[number];

export interface SearchBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface PropertySearchFilters {
  /** Region/city/area SLUGS (?region=greater-accra) — never a p-code in the
   *  URL; see location-taxonomy's id-vs-slug split for why. */
  region?: string;
  city?: string;
  area?: string;
  priceMin?: number;
  priceMax?: number;
  /** Free text, data-driven elsewhere (property types aren't a fixed enum
   *  the codec can validate against — see browseFilters.ts's own comment on
   *  why a hardcoded type list was abandoned). */
  type?: string;
  bedrooms?: number;
  status?: SearchStatus;
  sort?: SearchSort;
  /** Free-text search. */
  q?: string;
  /** 1-based. Absent means page 1 — never written to the URL for page 1,
   *  so the canonical unfiltered URL has no ?page=1 clutter. */
  page?: number;
  bbox?: SearchBounds;
}

const PARAM_NAMES = {
  region: "region",
  city: "city",
  area: "area",
  priceMin: "price_min",
  priceMax: "price_max",
  type: "type",
  bedrooms: "bedrooms",
  status: "status",
  sort: "sort",
  q: "q",
  page: "page",
  bbox: "bbox",
} as const;

function parsePositiveFinite(raw: string | null): number | undefined {
  if (raw === null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parsePositiveInt(raw: string | null): number | undefined {
  if (raw === null) return undefined;
  if (!/^\d+$/.test(raw)) return undefined;
  const n = Number(raw);
  return n > 0 ? n : undefined;
}

function parseBbox(raw: string | null): SearchBounds | undefined {
  if (!raw) return undefined;
  const parts = raw.split(",").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return undefined;
  const [west, south, east, north] = parts;
  if (west < -180 || west > 180 || east < -180 || east > 180) return undefined;
  if (south < -90 || south > 90 || north < -90 || north > 90) return undefined;
  if (south >= north) return undefined;
  return { west, south, east, north };
}

function parseEnum<T extends string>(raw: string | null, allowed: readonly T[]): T | undefined {
  return raw && (allowed as readonly string[]).includes(raw) ? (raw as T) : undefined;
}

function parseSlug(raw: string | null): string | undefined {
  if (!raw) return undefined;
  return getBySlug(raw) ? raw : undefined;
}

function parseText(raw: string | null): string | undefined {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * URLSearchParams -> filters. Every field is independently optional and
 * independently validated — one bad param (a typo'd slug, a negative
 * price) drops only that field, the rest of the URL still parses.
 */
export function filtersFromSearchParams(params: URLSearchParams): PropertySearchFilters {
  const filters: PropertySearchFilters = {};

  const region = parseSlug(params.get(PARAM_NAMES.region));
  if (region) filters.region = region;

  const city = parseSlug(params.get(PARAM_NAMES.city));
  if (city) filters.city = city;

  const area = parseSlug(params.get(PARAM_NAMES.area));
  if (area) filters.area = area;

  const priceMin = parsePositiveFinite(params.get(PARAM_NAMES.priceMin));
  if (priceMin !== undefined) filters.priceMin = priceMin;

  const priceMax = parsePositiveFinite(params.get(PARAM_NAMES.priceMax));
  if (priceMax !== undefined) filters.priceMax = priceMax;

  const type = parseText(params.get(PARAM_NAMES.type));
  if (type) filters.type = type;

  const bedrooms = parsePositiveInt(params.get(PARAM_NAMES.bedrooms));
  if (bedrooms !== undefined) filters.bedrooms = bedrooms;

  const status = parseEnum(params.get(PARAM_NAMES.status), SEARCH_STATUSES);
  if (status) filters.status = status;

  const sort = parseEnum(params.get(PARAM_NAMES.sort), SEARCH_SORTS);
  if (sort) filters.sort = sort;

  const q = parseText(params.get(PARAM_NAMES.q));
  if (q) filters.q = q;

  const page = parsePositiveInt(params.get(PARAM_NAMES.page));
  if (page !== undefined && page !== 1) filters.page = page;

  const bbox = parseBbox(params.get(PARAM_NAMES.bbox));
  if (bbox) filters.bbox = bbox;

  return filters;
}

/**
 * filters -> URLSearchParams. Round-trips with filtersFromSearchParams for
 * every already-valid filters object (see the codec test's round-trip
 * property test) — an empty/default field is simply omitted, never written
 * as an empty string, so the URL stays as short as the actual filter state.
 */
export function filtersToSearchParams(filters: PropertySearchFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.region) params.set(PARAM_NAMES.region, filters.region);
  if (filters.city) params.set(PARAM_NAMES.city, filters.city);
  if (filters.area) params.set(PARAM_NAMES.area, filters.area);
  if (filters.priceMin !== undefined) params.set(PARAM_NAMES.priceMin, String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set(PARAM_NAMES.priceMax, String(filters.priceMax));
  if (filters.type) params.set(PARAM_NAMES.type, filters.type);
  if (filters.bedrooms !== undefined) params.set(PARAM_NAMES.bedrooms, String(filters.bedrooms));
  if (filters.status) params.set(PARAM_NAMES.status, filters.status);
  if (filters.sort) params.set(PARAM_NAMES.sort, filters.sort);
  if (filters.q) params.set(PARAM_NAMES.q, filters.q);
  if (filters.page !== undefined && filters.page !== 1) {
    params.set(PARAM_NAMES.page, String(filters.page));
  }
  if (filters.bbox) {
    const { west, south, east, north } = filters.bbox;
    params.set(PARAM_NAMES.bbox, [west, south, east, north].join(","));
  }

  return params;
}

export const DEFAULT_SEARCH_FILTERS: PropertySearchFilters = {};

export function hasActiveSearchFilters(filters: PropertySearchFilters): boolean {
  return Object.keys(filters).length > 0;
}
