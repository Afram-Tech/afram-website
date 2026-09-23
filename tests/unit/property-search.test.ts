import { describe, expect, it } from "vitest";
import { clientSearchProperties } from "@/lib/property-search";
import type { Property } from "@/features/landing/data/properties";
import type { PropertySearchFilters } from "@/lib/property-search-filters";

/** Minimal, fully-populated Property factory — every filter path this
 *  engine exercises reads a real field, not an optional one, so tests only
 *  override what they're asserting on. */
const property = (overrides: Partial<Property> = {}): Property => ({
  id: "prop1",
  slug: "test-property-abc123",
  name: "Test Property",
  location: "Ablekuma Central, Greater Accra",
  city: "Ablekuma Central",
  region: "Greater Accra",
  coordinates: { lat: 5.6037, lng: -0.187 },
  tags: [],
  price: 400_000,
  currency: "GHS",
  beds: 2,
  baths: 1,
  sqft: 1200,
  image: "https://example.com/img.jpg",
  status: "listed",
  type: "Apartment",
  images: ["https://example.com/img.jpg"],
  about: "",
  amenities: [],
  legal: {
    titleType: "Indenture",
    landCertificate: "On file",
    listingStatus: "Live on Afram Marketplace",
    verification: "Afram-verified listing",
  },
  address: { street: "", gps: "", propertyId: "prop1" },
  developer: "Afram Marketplace",
  priceHistory: [],
  isFeatured: false,
  ...overrides,
});

const filters = (overrides: Partial<PropertySearchFilters> = {}): PropertySearchFilters =>
  overrides;

describe("clientSearchProperties — region/city (real taxonomy slugs)", () => {
  it("matches a row by region slug", () => {
    const accra = property({ region: "Greater Accra" });
    const ashanti = property({ region: "Ashanti", city: "Kumasi Metropolitan" });
    const result = clientSearchProperties(
      filters({ region: "greater-accra" }),
      { offset: 0, limit: 10 },
      { candidateRows: [accra, ashanti] },
    );
    expect(result.rows).toEqual([accra]);
  });

  it("matches a row by city slug (the district's displayName, not officialName)", () => {
    const match = property({ city: "Ablekuma Central Municipal" });
    const other = property({ city: "Kumasi Metropolitan", region: "Ashanti" });
    const result = clientSearchProperties(
      filters({ city: "ablekuma-central" }),
      { offset: 0, limit: 10 },
      { candidateRows: [match, other] },
    );
    expect(result.rows).toEqual([match]);
  });

  it("an invalid/unknown slug matches nothing rather than throwing", () => {
    const row = property();
    const result = clientSearchProperties(
      filters({ region: "not-a-real-place" }),
      { offset: 0, limit: 10 },
      { candidateRows: [row] },
    );
    expect(result.rows).toEqual([]);
  });

  it("area always excludes every row today, since AREAS is empty pending approval", () => {
    const row = property();
    const result = clientSearchProperties(
      filters({ area: "east-legon" }),
      { offset: 0, limit: 10 },
      { candidateRows: [row] },
    );
    expect(result.rows).toEqual([]);
  });

  it("a property missing city/region entirely matches no region/city filter", () => {
    const noLocation = property({ city: null, region: null });
    const result = clientSearchProperties(
      filters({ region: "greater-accra" }),
      { offset: 0, limit: 10 },
      { candidateRows: [noLocation] },
    );
    expect(result.rows).toEqual([]);
  });
});

describe("clientSearchProperties — price range", () => {
  it("keeps rows within [priceMin, priceMax]", () => {
    const cheap = property({ price: 100_000 });
    const mid = property({ price: 500_000 });
    const expensive = property({ price: 2_000_000 });
    const result = clientSearchProperties(
      filters({ priceMin: 200_000, priceMax: 1_000_000 }),
      { offset: 0, limit: 10 },
      { candidateRows: [cheap, mid, expensive] },
    );
    expect(result.rows).toEqual([mid]);
  });

  it("excludes a row with no price when a price filter is active", () => {
    const noPrice = property({ price: 0 });
    const result = clientSearchProperties(
      filters({ priceMin: 0 }),
      { offset: 0, limit: 10 },
      { candidateRows: [noPrice] },
    );
    expect(result.rows).toEqual([]);
  });

  it("converts through the supplied currency function", () => {
    const usdRow = property({ price: 100, currency: "USD" });
    const convert = (amount: number, from?: string) => (from === "USD" ? amount * 10_000 : amount);
    const result = clientSearchProperties(
      filters({ priceMin: 500_000, priceMax: 2_000_000 }),
      { offset: 0, limit: 10 },
      { candidateRows: [usdRow], convert },
    );
    expect(result.rows).toEqual([usdRow]);
  });
});

describe("clientSearchProperties — bedrooms, type, status, q", () => {
  it("keeps rows with at least the requested bedroom count", () => {
    const studio = property({ beds: 0 });
    const twoBed = property({ beds: 2 });
    const result = clientSearchProperties(
      filters({ bedrooms: 2 }),
      { offset: 0, limit: 10 },
      { candidateRows: [studio, twoBed] },
    );
    expect(result.rows).toEqual([twoBed]);
  });

  it("matches type exactly, case-insensitively", () => {
    const apartment = property({ type: "Apartment" });
    const house = property({ type: "House" });
    const result = clientSearchProperties(
      filters({ type: "apartment" }),
      { offset: 0, limit: 10 },
      { candidateRows: [apartment, house] },
    );
    expect(result.rows).toEqual([apartment]);
  });

  it("matches status via availability", () => {
    const listed = property({ status: "listed" });
    const underOffer = property({ status: "under_offer" });
    const result = clientSearchProperties(
      filters({ status: "under_offer" }),
      { offset: 0, limit: 10 },
      { candidateRows: [listed, underOffer] },
    );
    expect(result.rows).toEqual([underOffer]);
  });

  it("sold/delisted/unlisted are all unavailable", () => {
    const sold = property({ status: "sold" });
    const delisted = property({ status: "delisted" });
    const unlisted = property({ status: "unlisted" });
    const listed = property({ status: "listed" });
    const result = clientSearchProperties(
      filters({ status: "available" }),
      { offset: 0, limit: 10 },
      { candidateRows: [sold, delisted, unlisted, listed] },
    );
    expect(result.rows).toEqual([listed]);
  });

  it("matches free text search across name/location/type", () => {
    const row = property({ name: "Goldenwood Park" });
    const other = property({ name: "Unrelated Listing" });
    const result = clientSearchProperties(
      filters({ q: "goldenwood" }),
      { offset: 0, limit: 10 },
      { candidateRows: [row, other] },
    );
    expect(result.rows).toEqual([row]);
  });
});

describe("clientSearchProperties — sort", () => {
  const cheap = property({ price: 100_000 });
  const mid = property({ price: 500_000 });
  const expensive = property({ price: 900_000 });

  it("newest (or no sort) preserves input order", () => {
    const result = clientSearchProperties(
      filters({}),
      { offset: 0, limit: 10 },
      { candidateRows: [expensive, cheap, mid] },
    );
    expect(result.rows).toEqual([expensive, cheap, mid]);
  });

  it("price_asc sorts ascending by price", () => {
    const result = clientSearchProperties(
      filters({ sort: "price_asc" }),
      { offset: 0, limit: 10 },
      { candidateRows: [expensive, cheap, mid] },
    );
    expect(result.rows).toEqual([cheap, mid, expensive]);
  });

  it("price_desc sorts descending by price", () => {
    const result = clientSearchProperties(
      filters({ sort: "price_desc" }),
      { offset: 0, limit: 10 },
      { candidateRows: [cheap, mid, expensive] },
    );
    expect(result.rows).toEqual([expensive, mid, cheap]);
  });
});

describe("clientSearchProperties — pagination", () => {
  const rows = Array.from({ length: 5 }, (_, i) => property({ id: `p${i}`, slug: `p-${i}` }));

  it("slices by offset/limit and reports hasMore correctly", () => {
    const page1 = clientSearchProperties(
      filters({}),
      { offset: 0, limit: 2 },
      { candidateRows: rows },
    );
    expect(page1.rows).toHaveLength(2);
    expect(page1.hasMore).toBe(true);

    const page3 = clientSearchProperties(
      filters({}),
      { offset: 4, limit: 2 },
      { candidateRows: rows },
    );
    expect(page3.rows).toHaveLength(1);
    expect(page3.hasMore).toBe(false);
  });
});

describe("clientSearchProperties — bbox", () => {
  const inBox = property({ coordinates: { lat: 5.6, lng: -0.2 } });
  const outOfBox = property({ coordinates: { lat: 6.7, lng: -1.6 } });
  const noCoordinates = property({ coordinates: null });
  const bbox = { west: -0.3, south: 5.5, east: -0.1, north: 5.7 };

  it("keeps only rows whose coordinates fall inside the box", () => {
    const result = clientSearchProperties(
      filters({ bbox }),
      { offset: 0, limit: 10 },
      { candidateRows: [inBox, outOfBox] },
    );
    expect(result.rows).toEqual([inBox]);
  });

  it("excludes a row with no coordinates at all — can't place it, can't claim it's in view", () => {
    const result = clientSearchProperties(
      filters({ bbox }),
      { offset: 0, limit: 10 },
      { candidateRows: [noCoordinates] },
    );
    expect(result.rows).toEqual([]);
  });
});

describe("clientSearchProperties — facets combine, not override", () => {
  it("a row must satisfy every active filter at once", () => {
    const match = property({
      region: "Greater Accra",
      type: "Apartment",
      price: 300_000,
      beds: 2,
    });
    const wrongBedrooms = property({
      region: "Greater Accra",
      type: "Apartment",
      price: 300_000,
      beds: 1,
    });
    const result = clientSearchProperties(
      filters({ region: "greater-accra", type: "apartment", priceMax: 500_000, bedrooms: 2 }),
      { offset: 0, limit: 10 },
      { candidateRows: [match, wrongBedrooms] },
    );
    expect(result.rows).toEqual([match]);
  });
});
