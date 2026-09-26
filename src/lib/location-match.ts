/**
 * Is this listing in that place?
 *
 * A place contains everything below it, so a listing is "in Greater Accra"
 * if it is filed under Greater Accra itself OR under any district (or, later,
 * area) inside it. The listing's place names (city, region, street) are
 * resolved to taxonomy nodes and widened to every ancestor, so a row that only
 * says "Tema" still counts as Greater Accra; a place matches when its id is
 * among them. Nothing here knows how many levels exist — getPath walks
 * whatever the taxonomy has — so a level added later is matchable without
 * touching this file.
 *
 * A substring test on the place's name is the last resort, and only for rows
 * the taxonomy couldn't place at all: for a placed row it would put a Western
 * North listing in "Western".
 *
 * Mirrors afram-web's src/utils/location-match.ts, which additionally reads
 * resolver ids from metadata.location — this repo's `Property` carries none.
 */
import type { Property } from "@/features/landing/data/properties";
import {
  findByAlias,
  getPath,
  normalizeLocationName,
  type LocationNode,
} from "@/lib/location-taxonomy";

/** city, region and street — the fields a listing's place name can be in. */
export function getPropertyLocationTokens(property: Property): string[] {
  return [property.city, property.region, property.address.street]
    .filter((v): v is string => Boolean(v))
    .map(normalizeLocationName);
}

/** Every taxonomy id this listing sits in, from the most specific place up. */
export function propertyLocationIds(property: Property): Set<string> {
  const ids = new Set<string>();
  for (const token of getPropertyLocationTokens(property)) {
    const node = findByAlias(token);
    if (node) for (const ancestor of getPath(node.id)) ids.add(ancestor.id);
  }
  return ids;
}

function nodeName(node: LocationNode): string {
  return "displayName" in node ? node.displayName : node.name;
}

/** True when the listing is in `node` or anywhere inside it. */
export function propertyIsInLocation(
  property: Property,
  node: LocationNode,
  ids: Set<string> = propertyLocationIds(property),
): boolean {
  if (ids.has(node.id)) return true;
  if (ids.size > 0) return false;
  const wanted = normalizeLocationName(nodeName(node));
  return getPropertyLocationTokens(property).some((t) => t.includes(wanted));
}

/** Listing counts per taxonomy id — each listing counted once in every place
 *  that contains it. Only as complete as the listings it's given. */
export function countPropertiesByLocation(properties: Property[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const property of properties) {
    for (const id of propertyLocationIds(property)) counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}
