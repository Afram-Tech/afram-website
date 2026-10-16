import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/JsonLd";
import type { Property } from "@/features/landing/data/properties";
import { buildPropertyJsonLd, propertyHeadline, propertyTitle } from "@/lib/property-seo";
import { buildMetadata, clampDescription } from "@/lib/seo";

const property = (overrides: Partial<Property> = {}): Property => ({
  id: "prop1",
  slug: "test-property-abc123",
  name: "Test",
  location: "Accra, Greater Accra",
  city: "Accra",
  region: "Greater Accra",
  coordinates: null,
  boundary: null,
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
  address: { street: "Not available", gps: "", propertyId: "prop1" },
  developer: "Afram Marketplace",
  priceHistory: [],
  isFeatured: false,
  updatedAt: null,
  ...overrides,
});

describe("clampDescription", () => {
  it("leaves short text alone", () => {
    expect(clampDescription("Title-verified homes in Ghana.")).toBe(
      "Title-verified homes in Ghana.",
    );
  });

  it("cuts long text at a word boundary within 160 characters", () => {
    const long = "Verified homes and land for sale across Ghana ".repeat(6);
    const clamped = clampDescription(long);

    expect(clamped.length).toBeLessThanOrEqual(160);
    expect(clamped.endsWith("…")).toBe(true);
    expect(clamped).not.toMatch(/\s…$/);
  });
});

describe("buildMetadata", () => {
  it("clamps the description everywhere it's used", () => {
    const meta = buildMetadata({ title: "Page", description: "word ".repeat(80), path: "/x" });

    expect(String(meta.description).length).toBeLessThanOrEqual(160);
    expect(String(meta.openGraph?.description)).toBe(meta.description);
  });

  it("can keep a page out of the index without blocking its links", () => {
    const meta = buildMetadata({ title: "Map", description: "d", path: "/m", noindex: true });

    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});

describe("listing titles", () => {
  it("says Home rather than the API's 'single unit' label", () => {
    expect(propertyHeadline(property({ type: "single unit", beds: 4 }))).toBe(
      "4 Bedroom Home for Sale in Accra, Greater Accra",
    );
    expect(propertyHeadline(property({ type: "single unit", beds: 0 }))).toBe(
      "Property for Sale in Accra, Greater Accra",
    );
  });

  it("includes the name and brand when they fit in 60 characters", () => {
    expect(propertyTitle(property({ location: "Ho, Volta", name: "Unit 4" }))).toEqual({
      title: "2 Bedroom Apartment for Sale in Ho, Volta | Unit 4",
      absolute: false,
    });
  });

  it("drops the name, then the brand, as the headline grows", () => {
    expect(propertyTitle(property({ name: "Harvey Properties Limited" }))).toEqual({
      title: "2 Bedroom Apartment for Sale in Accra, Greater Accra",
      absolute: false,
    });
    expect(
      propertyTitle(property({ location: "Ablekuma Central, Greater Accra", type: "Townhouse" })),
    ).toEqual({
      title: "2 Bedroom Townhouse for Sale in Ablekuma Central, Greater Accra",
      absolute: true,
    });
  });
});

describe("listing structured data", () => {
  it("is a Product with an Offer when the listing has a price", () => {
    const data = buildPropertyJsonLd(property());

    expect(data["@type"]).toEqual(["Product", "Apartment"]);
    expect(data.offers).toMatchObject({ price: 400_000, priceCurrency: "GHS" });
  });

  it("is only the accommodation type when there's no price", () => {
    const data = buildPropertyJsonLd(property({ price: 0 }));

    expect(data["@type"]).toBe("Apartment");
    expect(data).not.toHaveProperty("offers");
  });
});

describe("JsonLd", () => {
  it("can't be closed early by text containing </script>", () => {
    const html = renderToStaticMarkup(<JsonLd data={{ name: "</script><b>x</b>" }} />);

    expect(html).not.toContain("</script><b>");
    expect(html).toContain("\\u003c/script>");
  });
});
