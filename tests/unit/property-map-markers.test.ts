import { describe, expect, it } from "vitest";
import { deriveMapMarkers } from "@/features/properties/map/markers";
import type { Property } from "@/features/landing/data/properties";

const property = (overrides: Partial<Property> = {}): Property => ({
  id: "prop1",
  slug: "test-property-abc123",
  name: "Test Property",
  location: "Ablekuma Central, Greater Accra",
  city: "Ablekuma Central",
  region: "Greater Accra",
  coordinates: { lat: 5.6037, lng: -0.187 },
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
  address: { street: "", gps: "", propertyId: "prop1" },
  developer: "Afram Marketplace",
  priceHistory: [],
  isFeatured: false,
  ...overrides,
});

describe("deriveMapMarkers", () => {
  it("maps a property with coordinates to a marker", () => {
    const p = property();
    expect(deriveMapMarkers([p])).toEqual([
      {
        id: "prop1",
        slug: "test-property-abc123",
        name: "Test Property",
        lat: 5.6037,
        lng: -0.187,
        price: 400_000,
        currency: "GHS",
        thumbnail: "https://example.com/img.jpg",
        propertyType: "Apartment",
        status: "listed",
        region: "Greater Accra",
        city: "Ablekuma Central",
        boundary: null,
      },
    ]);
  });

  it("drops a property with no coordinates — nothing honest to plot", () => {
    const withCoords = property({ id: "a", coordinates: { lat: 5.6, lng: -0.2 } });
    const without = property({ id: "b", coordinates: null });
    expect(deriveMapMarkers([withCoords, without])).toEqual([
      expect.objectContaining({ id: "a" }),
    ]);
  });

  it("returns [] for an empty list", () => {
    expect(deriveMapMarkers([])).toEqual([]);
  });

  it("thumbnail is null when the property has no image", () => {
    const p = property({ image: "" });
    expect(deriveMapMarkers([p])[0].thumbnail).toBeNull();
  });

  it("passes the boundary through when the property has one", () => {
    const boundary = [
      { lat: 5.6, lng: -0.2 },
      { lat: 5.601, lng: -0.201 },
      { lat: 5.602, lng: -0.199 },
    ];
    const p = property({ boundary });
    expect(deriveMapMarkers([p])[0].boundary).toEqual(boundary);
  });
});
