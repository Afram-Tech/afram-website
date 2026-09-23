import { cache } from "react";

import { graphqlFetch } from "@/graphql/client";
import { GET_PUBLIC_PROPERTIES } from "@/graphql/documents";
import { centroidOf, extractPointsFromSiteCoordinates } from "@/lib/siteCoordinates";

export interface Property {
  id: string;
  slug: string;
  name: string;
  /** Display string, e.g. "Accra, Greater Accra" — unchanged, for existing
   *  consumers (cards, the detail page's map embed). Filtering should use
   *  `city`/`region` below instead: `location` collapses them, so two
   *  properties in different cities of the same region become unrelated
   *  strings with no way to filter "the whole region" independent of city —
   *  see docs/location-search/00-findings.md §A2. */
  location: string;
  /** Raw city/region text as the API returns it — not resolved against the
   *  taxonomy at fetch time (see getPropertyLocationTokens in
   *  property-search.ts, which normalises and matches these against a
   *  taxonomy node's canonical name at filter time instead, the same
   *  design afram-web's getProjectLocationTokens uses). Either can be
   *  null: a listing may have one without the other. */
  city: string | null;
  region: string | null;
  /** Centroid of `siteCoordinates`, resolved defensively — the field carries
   *  at least 4 different shapes depending on which flow captured it (single
   *  point, OCR/bulk origin+vertices, raw GeoJSON nesting, Ghana National
   *  Grid) — see lib/siteCoordinates.ts, ported from afram-web verbatim.
   *  null when a listing has no usable coordinates at all: the map view
   *  should skip these rather than plot a wrong/zero point. */
  coordinates: { lat: number; lng: number } | null;
  /** The full site boundary, only when it's a real shape — 3+ points, same
   *  threshold afram-web's LiveMapEdit/PropertyMap use before drawing a
   *  polygon at all (1-2 points there render a pin only, never a fill).
   *  null below that threshold, including when there are no coordinates. */
  boundary: { lat: number; lng: number }[] | null;
  tags: string[];
  price: number;
  currency: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: string;
  type: string;
  images: string[];
  about: string;
  amenities: string[];
  legal: {
    titleType: string;
    landCertificate: string;
    listingStatus: string;
    verification: string;
  };
  address: { street: string; gps: string; propertyId: string };
  developer: string;
  priceHistory: { date: string; event: string; price: number }[];
  isFeatured: boolean;
}

interface RawProperty {
  id: string;
  price: number;
  currency?: string | null;
  propertyType?: string | null;
  status?: string | null;
  bedroom?: number | null;
  fullBathroom?: number | null;
  halfBathroom?: number | null;
  squareFeet?: number | null;
  city?: string | null;
  region?: string | null;
  propertyNameOrNumber?: string | null;
  propertyDescription?: string | null;
  propertyCardDesc?: string | null;
  propertyAmenities?: (string | null)[] | null;
  titleType?: string | null;
  landCertificateNumber?: string | null;
  projectImages?: (string | null)[] | null;
  thumbnail?: string | null;
  streetAddress?: string | null;
  gpsAddress?: string | null;
  metadata?: unknown;
  siteCoordinates?: unknown;
}

interface RawProject {
  id: string;
  projectType?: string | null;
  property?: RawProperty | null;
}

interface GetPublicPropertiesResponse {
  getPublicProjects: RawProject[];
}

const LISTING_STATUS_LABELS: Record<string, string> = {
  listed: "Live on Afram Marketplace",
  pending: "Pending review",
  divided: "Subdivided listing",
  subdivision: "Subdivided listing",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapProperty(project: RawProject): Property | undefined {
  const property = project.property;
  if (!property) return undefined;

  const images = [
    ...new Set(
      [...(property.projectImages ?? []).filter(Boolean), property.thumbnail].filter(
        (src): src is string => Boolean(src),
      ),
    ),
  ];
  if (images.length === 0) return undefined;

  const name = property.propertyNameOrNumber || "Untitled Property";
  const slug = `${slugify(name)}-${property.id.slice(-6)}`;

  const tags = [
    property.bedroom != null ? `${property.bedroom} Bed` : null,
    property.propertyType,
    property.city || property.region,
  ].filter((tag): tag is string => Boolean(tag));

  const status = property.status ?? "unlisted";
  const isFeatured = Boolean(
    (property.metadata as Record<string, unknown> | null | undefined)?.isFeatured,
  );

  const sitePoints = extractPointsFromSiteCoordinates(property.siteCoordinates);

  return {
    id: property.id,
    slug,
    name,
    location: [property.city, property.region].filter(Boolean).join(", ") || "Ghana",
    city: property.city || null,
    region: property.region || null,
    coordinates: centroidOf(sitePoints),
    boundary: sitePoints.length > 2 ? sitePoints : null,
    tags,
    price: property.price,
    currency: property.currency || "USD",
    beds: property.bedroom ?? 0,
    baths: (property.fullBathroom ?? 0) + (property.halfBathroom ?? 0),
    sqft: property.squareFeet ?? 0,
    image: images[0],
    status,
    type: property.propertyType || "Property",
    images,
    about: property.propertyDescription || property.propertyCardDesc || "",
    amenities: (property.propertyAmenities ?? []).filter((a): a is string => Boolean(a)),
    legal: {
      titleType: property.titleType || "Not yet on file",
      landCertificate: property.landCertificateNumber ? "On file" : "Not available",
      listingStatus: LISTING_STATUS_LABELS[status] ?? "Unavailable",
      verification: "Afram-verified listing",
    },
    address: {
      street: property.streetAddress || "Not available",
      gps: property.gpsAddress || "Not available",
      propertyId: property.id,
    },
    developer: "Afram Marketplace",
    priceHistory: [
      {
        date: "Current",
        event: LISTING_STATUS_LABELS[status] ?? "Listed",
        price: property.price,
      },
    ],
    isFeatured,
  };
}

/**
 * Deduped per request: `generateMetadata` and the page body both need the list,
 * and this is a POST so Next's fetch cache does not cover it. Without `cache`
 * every property page fetches and maps all 200 listings twice.
 */
const fetchPublicProperties = cache(async function fetchPublicProperties(): Promise<Property[]> {
  try {
    const data = await graphqlFetch<
      GetPublicPropertiesResponse,
      { pagination: { offset: number; limit: number } }
    >(GET_PUBLIC_PROPERTIES, { pagination: { offset: 0, limit: 200 } });
    return data.getPublicProjects
      .filter((project) => (project.projectType ?? "").toLowerCase() !== "multiple units")
      .map(mapProperty)
      .filter((property): property is Property => Boolean(property));
  } catch (error) {
    console.warn("Failed to fetch public properties from Afram GraphQL API:", error);
    return [];
  }
});

export async function getAllProperties(): Promise<Property[]> {
  return fetchPublicProperties();
}

/** Properties tagged "isFeatured" from the dashboard. */
export async function getFeaturedProperties(): Promise<Property[]> {
  const properties = await fetchPublicProperties();
  return properties.filter((property) => Boolean(property.isFeatured) == true);
}

export async function findPropertyBySlug(slug: string): Promise<Property | undefined> {
  const properties = await fetchPublicProperties();
  return properties.find((property) => property.slug === slug);
}
