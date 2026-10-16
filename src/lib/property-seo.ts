/**
 * Search-facing naming and structured data for listings.
 *
 * Two jobs:
 * 1. Name listings and listing collections the way people search for them
 *    ("2 bedroom apartment for sale in Adenta", "townhouses for sale in
 *    Kumasi"), for titles, headings and the crawlable collection pages under
 *    /properties/type/… and /properties/in/….
 * 2. Describe a listing to Google as schema.org data — a Product with an
 *    Offer (price, currency, availability, photos) that is also the
 *    Accommodation it's selling (bedrooms, floor size, address, geo). The
 *    Product/Offer half is what makes a listing eligible for the image +
 *    price treatment marketplaces like Jiji get in results; the
 *    Accommodation half is ignored by that feature but read by everything
 *    else that understands real estate.
 */
import { siteConfig } from "@/config/site";
import type { Property } from "@/features/landing/data/properties";
import { formatMoney, formatPropertySize, titleCase } from "@/lib/format";
import { propertyLocationIds } from "@/lib/location-match";
import {
  DISTRICTS,
  getById,
  getBySlug,
  getPath,
  REGIONS,
  type LocationNode,
} from "@/lib/location-taxonomy";

/** "Under_Offer " → "under offer" — for comparing the API's free-text
 *  type/status values. */
const norm = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");

/* ─── Property types ─── */

export interface PropertyTypePage {
  /** URL segment — /properties/type/<slug>. Plural, as people search. */
  slug: string;
  singular: string;
  plural: string;
  /** schema.org Accommodation subtype. */
  schemaType: string;
  /** Normalised `Property.type` values that belong here. */
  matches: string[];
}

/** Only types with a clear search phrase get a page. A listing whose type
 *  isn't here (e.g. the API's "single unit") still gets its own page and
 *  location pages — it just has no type collection to belong to. */
export const PROPERTY_TYPE_PAGES: PropertyTypePage[] = [
  {
    slug: "apartments",
    singular: "Apartment",
    plural: "Apartments",
    schemaType: "Apartment",
    matches: ["apartment", "apartments", "flat", "condo", "condominium"],
  },
  {
    slug: "houses",
    singular: "House",
    plural: "Houses",
    schemaType: "SingleFamilyResidence",
    matches: ["house", "houses", "detached", "semi detached", "bungalow"],
  },
  {
    slug: "townhouses",
    singular: "Townhouse",
    plural: "Townhouses",
    schemaType: "SingleFamilyResidence",
    matches: ["townhouse", "townhouses", "town house"],
  },
  {
    slug: "villas",
    singular: "Villa",
    plural: "Villas",
    schemaType: "SingleFamilyResidence",
    matches: ["villa", "villas"],
  },
  {
    slug: "land",
    singular: "Land",
    plural: "Land",
    schemaType: "Place",
    matches: ["land", "plot", "plots"],
  },
];

export function getTypePage(slug: string): PropertyTypePage | undefined {
  return PROPERTY_TYPE_PAGES.find((page) => page.slug === slug);
}

export function typePageFor(property: Property): PropertyTypePage | undefined {
  const type = norm(property.type);
  return PROPERTY_TYPE_PAGES.find((page) => page.matches.includes(type));
}

export function propertiesOfType(properties: Property[], page: PropertyTypePage): Property[] {
  return properties.filter((property) => typePageFor(property) === page);
}

/* ─── Locations ─── */

export function locationName(node: LocationNode): string {
  return "displayName" in node ? node.displayName : node.name;
}

/** "Adenta, Greater Accra" for a district; just the name for a region. */
export function locationLabel(node: LocationNode): string {
  const path = getPath(node.id);
  const region = path[0];
  return region && region.id !== node.id
    ? `${locationName(node)}, ${locationName(region)}`
    : locationName(node);
}

/** Only regions and districts get collection pages — areas are curated and
 *  sparse, and a district page already covers them. */
export function getLocationPage(slug: string): LocationNode | undefined {
  const node = getBySlug(slug);
  if (!node) return undefined;
  const isRegionOrDistrict =
    REGIONS.some((r) => r.id === node.id) || DISTRICTS.some((d) => d.id === node.id);
  return isRegionOrDistrict ? node : undefined;
}

export function propertiesInLocation(properties: Property[], node: LocationNode): Property[] {
  return properties.filter((property) => propertyLocationIds(property).has(node.id));
}

/** Region then district for a listing — the breadcrumb trail below
 *  "Properties". Empty when the taxonomy couldn't place it. */
export function locationTrail(property: Property): LocationNode[] {
  const ids = propertyLocationIds(property);
  const region = REGIONS.find((r) => ids.has(r.id));
  if (!region) return [];
  const district = DISTRICTS.find((d) => d.parentId === region.id && ids.has(d.id));
  return district ? [region, district] : [region];
}

/** Every region and district with at least one listing, with its listings. */
export function locationsWithListings(
  properties: Property[],
): { node: LocationNode; properties: Property[] }[] {
  const ids = new Set(properties.flatMap((property) => [...propertyLocationIds(property)]));
  return [...ids]
    .map((id) => getById(id))
    .filter((node): node is LocationNode => Boolean(node && getLocationPage(node.slug)))
    .map((node) => ({ node, properties: propertiesInLocation(properties, node) }))
    .sort((a, b) => b.properties.length - a.properties.length);
}

/** Every (type, location) pair with at least one listing. */
export function typeLocationPairs(
  properties: Property[],
): { type: PropertyTypePage; node: LocationNode; properties: Property[] }[] {
  return PROPERTY_TYPE_PAGES.flatMap((type) =>
    locationsWithListings(propertiesOfType(properties, type)).map(({ node, properties }) => ({
      type,
      node,
      properties,
    })),
  );
}

/* ─── Paths ─── */

export const typePath = (type: PropertyTypePage) => `/properties/type/${type.slug}`;
export const locationPath = (node: LocationNode) => `/properties/in/${node.slug}`;
export const typeLocationPath = (type: PropertyTypePage, node: LocationNode) =>
  `/properties/type/${type.slug}/in/${node.slug}`;

/* ─── Naming ─── */

const isSold = (property: Property) => norm(property.status) === "sold";

/** The API's catch-all project types. They describe how a project is
 *  structured, not what's for sale, so they make poor search phrases
 *  ("4 Bedroom Single Unit for Sale"). */
const GENERIC_TYPES = new Set(["single unit", "single units", "unit", "property", "properties"]);

/** What a buyer would call the listing: its type page's name, else the
 *  API's own type, else "Home" (has bedrooms) or "Property". */
function typeLabel(property: Property): string {
  const page = typePageFor(property);
  if (page) return page.singular;
  if (!GENERIC_TYPES.has(norm(property.type))) return titleCase(property.type);
  return property.beds > 0 ? "Home" : "Property";
}

/** "2 Bedroom Apartment for Sale in Adenta, Greater Accra" — the phrase a
 *  buyer would type, so it leads the page title. */
export function propertyHeadline(property: Property): string {
  const type = typeLabel(property);
  const beds = property.beds > 0 ? `${property.beds} Bedroom ` : "";
  const sale = isSold(property) ? "Sold" : "for Sale";
  return `${beds}${type} ${sale} in ${property.location}`;
}

/** Search results show about this many characters of a title. */
const MAX_TITLE = 60;
const BRAND_SUFFIX = ` — ${siteConfig.name}`;

/**
 * The listing's <title>: the search phrase first, then the listing's name
 * and the brand while they still fit in what Google displays. When even
 * the phrase plus brand is too long, the brand is dropped (`absolute`) so
 * the words people searched for aren't the part that gets cut off.
 */
export function propertyTitle(property: Property): { title: string; absolute: boolean } {
  const headline = propertyHeadline(property);
  const named = `${headline} | ${property.name}`;
  if (named.length + BRAND_SUFFIX.length <= MAX_TITLE) return { title: named, absolute: false };
  if (headline.length + BRAND_SUFFIX.length <= MAX_TITLE) {
    return { title: headline, absolute: false };
  }
  return { title: headline, absolute: true };
}

export function propertyDescription(property: Property): string {
  const type = typeLabel(property).toLowerCase();
  const beds = property.beds > 0 ? `${property.beds}-bedroom ` : "";
  const price = property.price > 0 ? ` for ${formatMoney(property.price, property.currency)}` : "";
  const specs = [
    property.baths > 0 ? `${property.baths} bath` : null,
    property.sqft > 0 ? formatPropertySize(property.sqft) : null,
  ]
    .filter(Boolean)
    .join(", ");
  return `${property.name}: ${beds}${type} ${isSold(property) ? "sold" : "for sale"} in ${property.location}${price}.${specs ? ` ${specs}.` : ""} Title-verified, with flexible financing on Afram.`;
}

/** "Apartments for Sale in Accra, Greater Accra" / "Properties for Sale in Ghana". */
export function collectionHeading(type?: PropertyTypePage, node?: LocationNode): string {
  const what = type?.plural ?? "Properties";
  return `${what} for Sale in ${node ? locationLabel(node) : "Ghana"}`;
}

export function collectionDescription(
  properties: Property[],
  type?: PropertyTypePage,
  node?: LocationNode,
): string {
  const what = (type?.plural ?? "properties").toLowerCase();
  const where = node ? locationLabel(node) : "Ghana";
  const count = properties.length;
  const priced = properties.filter((p) => p.price > 0);
  const from =
    priced.length > 0
      ? ` from ${formatMoney(Math.min(...priced.map((p) => p.price)), priced[0].currency)}`
      : "";
  return `Browse ${count} title-verified ${count === 1 ? what.replace(/s$/, "") : what} for sale in ${where}${from}. Titles checked with the Lands Commission; flexible financing available.`;
}

/* ─── Structured data ─── */

const absolute = (path: string) => `${siteConfig.url}${path}`;

function availability(property: Property): string {
  const status = norm(property.status);
  if (status === "sold") return "https://schema.org/SoldOut";
  if (status === "under offer") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

/**
 * Product + Accommodation for one listing. Google treats a Product with no
 * offer as invalid, so a listing without a price is described only as the
 * Accommodation.
 */
export function buildPropertyJsonLd(property: Property) {
  const url = absolute(`/properties/${property.slug}`);
  const type = typePageFor(property);
  const [region, district] = locationTrail(property);
  const accommodation = type?.schemaType ?? "Accommodation";
  const hasOffer = property.price > 0;

  return {
    "@context": "https://schema.org",
    "@type": hasOffer ? ["Product", accommodation] : accommodation,
    "@id": `${url}#listing`,
    name: `${property.name}: ${propertyHeadline(property)}`,
    // A listing's own copy is often a one-line stub ("Bedroom Apartments for
    // rent"); the generated sentence is more useful than that.
    description: property.about.length >= 80 ? property.about : propertyDescription(property),
    url,
    image: property.images,
    sku: property.id,
    category: `Real Estate > ${type?.plural ?? titleCase(property.type)}`,
    ...(property.beds > 0 && { numberOfBedrooms: property.beds, numberOfRooms: property.beds }),
    ...(property.baths > 0 && { numberOfBathroomsTotal: property.baths }),
    ...(property.sqft > 0 && {
      floorSize: { "@type": "QuantitativeValue", value: property.sqft, unitCode: "FTK" },
    }),
    ...(property.amenities.length > 0 && {
      amenityFeature: property.amenities.map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      })),
    }),
    address: {
      "@type": "PostalAddress",
      ...(property.address.street !== "Not available" && {
        streetAddress: property.address.street,
      }),
      addressLocality: district ? locationName(district) : (property.city ?? undefined),
      addressRegion: region ? locationName(region) : (property.region ?? undefined),
      addressCountry: "GH",
    },
    ...(property.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng,
      },
    }),
    ...(hasOffer && {
      offers: {
        "@type": "Offer",
        url,
        price: property.price,
        priceCurrency: property.currency,
        availability: availability(property),
        seller: { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url },
      },
    }),
  };
}

/** An ItemList of listing URLs, for collection pages. */
export function buildItemListJsonLd(properties: Property[], name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absolute(path),
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absolute(`/properties/${property.slug}`),
      name: property.name,
      image: property.image,
    })),
  };
}
