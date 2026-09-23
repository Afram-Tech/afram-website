import type { Property } from "@/features/landing/data/properties";

/**
 * Mirrors backend-requirements.md §3's PropertyMapMarker shape (shared with
 * afram-web) — deliberately not the full Property: a map view can have
 * hundreds of markers in the viewport, and this is the client-side
 * derivation standing in for getPropertyMapMarkers until that query exists
 * (see property-search.ts's own module doc for the same "no server yet"
 * situation). `slug` is added beyond the spec's shape — the real query
 * would need it too once implemented, for the marker to link anywhere.
 */
export interface PropertyMapMarker {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  currency: string;
  thumbnail: string | null;
  propertyType: string;
  status: string;
  region: string | null;
  city: string | null;
  /** The site boundary, only when it's a real 3+ point shape — see
   *  Property.boundary's own doc. */
  boundary: { lat: number; lng: number }[] | null;
}

/** Same PropertyStatus vocabulary as getPropertyAvailability
 *  (property-search.ts) — kept as its own string-only helper here since
 *  callers on this side (map markers, the list panel) only ever have a bare
 *  status string, not a full Property to hand that function. */
export function isMarkerUnavailable(status: string): boolean {
  return new Set(["sold", "under_offer", "delisted", "unlisted"]).has(status.toLowerCase());
}

/** Teal for an available listing, muted grey otherwise — afram's brand
 *  colour (`#007481`, the same value afram-web's LiveMapEdit and
 *  PropertyMap use for both stroke and pin) everywhere it's still
 *  meaningful to draw attention to the listing. Shared by the map pins and
 *  the list panel's status dot so the two always agree. */
export function markerColorFor(status: string): string {
  return isMarkerUnavailable(status) ? "#9296a0" : "#007481";
}

/** Drops every property with no resolved coordinates — a map has nothing
 *  honest to plot them at. See Property.coordinates' own doc for why that
 *  can be null (siteCoordinates missing, or in a shape the unwrap couldn't
 *  read). */
export function deriveMapMarkers(properties: Property[]): PropertyMapMarker[] {
  const markers: PropertyMapMarker[] = [];
  for (const property of properties) {
    if (!property.coordinates) continue;
    markers.push({
      id: property.id,
      slug: property.slug,
      name: property.name,
      lat: property.coordinates.lat,
      lng: property.coordinates.lng,
      price: property.price,
      currency: property.currency,
      thumbnail: property.image || null,
      propertyType: property.type,
      status: property.status,
      region: property.region,
      city: property.city,
      boundary: property.boundary,
    });
  }
  return markers;
}
