import type { Property } from "@/features/landing/data/properties";

/**
 * Counts and sample cards are derived from the live catalogue rather than
 * typed by hand, so a number on a persona page can never drift from what a
 * visitor finds on /properties.
 */
export function catalogueStats(properties: Property[]) {
  return {
    listings: properties.length,
    /** External developers — Afram's own marketplace listings are not a partner. */
    vendors: new Set(properties.map((p) => p.developer).filter((d) => d !== "Afram Marketplace"))
      .size,
    cities: new Set(properties.map((p) => p.location.split(",")[0].trim())).size,
  };
}

/**
 * A plain slice(0, count) tends to surface near-duplicate units that share a
 * price and spec, so this dedupes by price first — one per price point shows
 * the range the platform actually carries.
 */
export function sampleProperties(properties: Property[], count = 3): Property[] {
  const seen = new Set<number>();
  return properties
    .filter((p) => {
      if (seen.has(p.price)) return false;
      seen.add(p.price);
      return true;
    })
    .slice(0, count);
}
