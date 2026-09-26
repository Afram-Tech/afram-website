import { describe, expect, it } from "vitest";
import type { Property } from "@/features/landing/data/properties";
import { getBySlug } from "@/lib/location-taxonomy";
import {
  countPropertiesByLocation,
  propertyIsInLocation,
  propertyLocationIds,
} from "@/lib/location-match";

const property = (fields: Partial<Pick<Property, "city" | "region">> & { street?: string }) =>
  ({
    city: fields.city ?? null,
    region: fields.region ?? null,
    address: { street: fields.street ?? "", gps: "", propertyId: "p1" },
  }) as Property;

const place = (slug: string) => getBySlug(slug)!;

describe("propertyLocationIds", () => {
  it("widens a district name to its region", () => {
    const ids = propertyLocationIds(property({ city: "Tema" }));
    expect(ids.has("GH0727")).toBe(true); // Tema
    expect(ids.has("GH07")).toBe(true); // Greater Accra
  });

  it("is empty for a listing with no place the taxonomy knows", () => {
    expect(propertyLocationIds(property({ city: "Atlantis" })).size).toBe(0);
    expect(propertyLocationIds(property({})).size).toBe(0);
  });
});

describe("propertyIsInLocation — a place contains everything inside it", () => {
  it("a listing filed only under a district is in that district's region", () => {
    const tema = property({ city: "Tema" });
    expect(propertyIsInLocation(tema, place("greater-accra"))).toBe(true);
    expect(propertyIsInLocation(tema, place("ashanti"))).toBe(false);
  });

  it("a listing filed under a region is in the region, not in each district", () => {
    const accra = property({ region: "Greater Accra" });
    expect(propertyIsInLocation(accra, place("greater-accra"))).toBe(true);
    expect(propertyIsInLocation(accra, place("ablekuma-central"))).toBe(false);
  });

  it("does not put a Western North listing in Western by substring", () => {
    const westernNorth = property({ region: "Western North" });
    expect(propertyIsInLocation(westernNorth, place("western-north"))).toBe(true);
    expect(propertyIsInLocation(westernNorth, place("western"))).toBe(false);
  });

  it("falls back to names only for listings the taxonomy can't place", () => {
    const unplaced = property({ street: "Near the Greater Accra Regional Hospital" });
    expect(propertyLocationIds(unplaced).size).toBe(0);
    expect(propertyIsInLocation(unplaced, place("greater-accra"))).toBe(true);
  });
});

describe("countPropertiesByLocation", () => {
  it("counts each listing once in every place that contains it", () => {
    const counts = countPropertiesByLocation([
      property({ city: "Tema" }),
      property({ region: "Greater Accra" }),
      property({ city: "Kumasi" }),
    ]);
    expect(counts).toMatchObject({ GH07: 2, GH0727: 1, GH02: 1, GH0228: 1 });
  });
});
