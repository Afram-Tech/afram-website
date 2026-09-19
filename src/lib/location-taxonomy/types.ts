/**
 * Region -> City/District (MMDA) -> Area. Framework- and GraphQL-agnostic on
 * purpose: this module is meant to be portable to afram-website unchanged
 * (see the "keep in sync" header on index.ts), so it must not import React,
 * Apollo, or the generated GraphQL types.
 */

/** [lng, lat] — GeoJSON's coordinate order, not [lat, lng]. */
export type LngLat = [number, number];

export interface RegionNode {
  /** HDX p-code, e.g. "GH01". Stable identity — never derived from the name.
   *  Internal joins (parentId, resolver output, metadata.location) always
   *  use this, never `slug`. */
  id: string;
  /** URL-safe form of `name`, e.g. "greater-accra" — for readable filter
   *  URLs (?region=greater-accra). Derived, not identity: if a name ever
   *  changed, the slug could too, while `id` would not. */
  slug: string;
  /** Canonical spelling — GHANA_REGIONS', not necessarily HDX's. */
  name: string;
  /** Other spellings this region is known by (e.g. HDX's "Northern East" for "North East"). */
  aliases: string[];
  centroid: LngLat;
}

export interface DistrictNode {
  /** HDX p-code, e.g. "GH0701". */
  id: string;
  /** URL-safe form of `displayName`, e.g. "ablekuma-central". */
  slug: string;
  /** Full legal MMDA name, e.g. "Ablekuma Central Municipal". Always mappable back to `id`. */
  officialName: string;
  /** What the picker shows and `Property.city` stores — officialName with a
   *  trailing Metropolitan/Municipal/District dropped, UNLESS that would
   *  collide with another district's stripped name, in which case this
   *  equals officialName. */
  displayName: string;
  /** Parent region's p-code. */
  parentId: string;
  centroid: LngLat;
}

export interface AreaNode {
  /** Slug-derived, same value as `slug` — areas are curated, not sourced
   *  from an authority with p-codes, so there is no separate stable id to
   *  keep distinct from the URL-facing slug the way region/district have. */
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  /** Parent district's p-code, assigned at build time by point-in-polygon on this area's centroid. */
  parentId: string;
  centroid: LngLat;
}

export type LocationNode = RegionNode | DistrictNode | AreaNode;
export type LocationLevel = "region" | "district" | "area";
