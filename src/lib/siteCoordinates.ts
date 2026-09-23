import { transformGhanaGridToWGS84 } from "@/lib/transformCoordinate";

/**
 * `Property.siteCoordinates` (a `JSONObject` server-side) is written in at
 * least three different shapes depending on which listing flow produced it —
 * see docs/location-search/00-findings.md §A3:
 *
 *   - single-unit, the dominant/production shape:
 *     { coordinates: [{ lat, lng, X, Y, Bearing, Distance }] }
 *   - OCR extraction / bulk unit demarcation:
 *     { origin?: {lat,lng}, coordinates?: [{X?,Y?,lat?,lng?,Bearing?}] }
 *   - raw GeoJSON-style nested arrays: [[[lng, lat], ...]]
 *   - a bare array of points, no wrapper at all
 *
 * This is the unwrap step every reader of siteCoordinates needs, extracted
 * from BulkUnitUploadDrawer.tsx (the one place it had already been written,
 * because that screen breaks on every shape above if it guesses wrong) so
 * the resolver doesn't have to re-derive it. Logic is unchanged from the
 * original — only the verbose per-call raw-payload console.log was dropped,
 * since a resolver call site is expected to run far more often than a
 * one-off bulk-upload screen and that log was pure noise, not a behaviour
 * the return value depends on. The "no coordinates found" warning stays,
 * since silence there previously covered a real failure mode.
 */
export interface SiteCoordinatePoint {
  lat: number;
  lng: number;
}

/** A raw coordinate entry can be a [lng, lat] tuple, an object carrying any
 *  mix of lat/lng/X/Y, or (once unwrapped enough) something else entirely —
 *  every field access below goes through this narrow-as-you-go, unknown at
 *  the boundary. */
type RawCoordEntry = Record<string, unknown> | unknown[];

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function numberField(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" || typeof value === "string") {
      const n = Number(value);
      if (n) return n;
    }
  }
  return 0;
}

export function extractPointsFromSiteCoordinates(rawSource: unknown): SiteCoordinatePoint[] {
  if (!rawSource) return [];

  // Handle the specific { origin, coordinates, id } structure or other nested siteCoordinates
  const sourceRecord = asRecord(rawSource);
  const nestedSiteCoordinates = asRecord(sourceRecord?.siteCoordinates);
  let coords: unknown = Array.isArray(rawSource)
    ? rawSource
    : (sourceRecord?.coordinates ?? nestedSiteCoordinates?.coordinates ?? sourceRecord?.siteCoordinates);

  // Handle GeoJSON standard or deep nesting: [[[lng, lat], ...]]
  while (
    Array.isArray(coords) &&
    Array.isArray(coords[0]) &&
    typeof coords[0][0] !== "number" &&
    !asRecord(coords[0])?.lat &&
    !asRecord(coords[0])?.Y
  ) {
    coords = coords[0];
  }

  if (!coords || !Array.isArray(coords) || coords.length === 0) {
    console.warn("extractPointsFromSiteCoordinates: no valid coordinates array found");
    return [];
  }

  // Map to {lat, lng, X, Y} objects for diagnosis
  const rawPoints = (coords as RawCoordEntry[]).map((coord) => {
    let lat = 0,
      lng = 0,
      X = 0,
      Y = 0;

    if (Array.isArray(coord)) {
      lng = Number(coord[0]);
      lat = Number(coord[1]);
      X = lng;
      Y = lat;
    } else {
      lat = numberField(coord, "lat", "Y");
      lng = numberField(coord, "lng", "X");
      X = numberField(coord, "X", "lng");
      Y = numberField(coord, "Y", "lat");
    }
    return { lat, lng, X, Y };
  });

  // Check if we already have valid Lat/Lng (WGS84 range).
  // Ghana is roughly Lat 4-11, Lng -4 to 2. We use a slightly wider check.
  const hasValidLatLng = rawPoints.every(
    (p) => Math.abs(p.lat) < 90 && Math.abs(p.lng) < 180 && p.lat !== 0 && p.lng !== 0,
  );

  if (hasValidLatLng) {
    return rawPoints.map((p) => ({ lat: p.lat, lng: p.lng }));
  }

  // Detect if these are likely Ghana Grid coordinates (huge numbers) in the fields.
  const looksLikeGhanaGrid = rawPoints.some((p) => Math.abs(p.X) > 180 || Math.abs(p.Y) > 90);

  if (looksLikeGhanaGrid) {
    try {
      return transformGhanaGridToWGS84(
        rawPoints.map((p) => ({ ...p, lat: 0, lng: 0, Bearing: 0, Distance: 0 })),
      ).map((p) => ({ lat: p.lat, lng: p.lng }));
    } catch (err) {
      console.error("extractPointsFromSiteCoordinates: Ghana Grid transform failed", err);
      // Last-ditch fallback to whatever we have.
      return rawPoints.map((p) => ({ lat: p.lat, lng: p.lng }));
    }
  }

  return rawPoints
    .map((p) => ({ lat: p.lat, lng: p.lng }))
    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== 0 && p.lng !== 0);
}

/** The centroid of a point list, or null for an empty list. Plain arithmetic
 *  mean — good enough for a roughly-convex property boundary of a handful of
 *  vertices, which is all this ever operates on. */
export function centroidOf(points: SiteCoordinatePoint[]): SiteCoordinatePoint | null {
  if (points.length === 0) return null;
  const sum = points.reduce((acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), {
    lat: 0,
    lng: 0,
  });
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}
