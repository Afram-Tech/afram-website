import { describe, expect, it } from "vitest";
import { getAllNodes, getChildNodes, getRootNodes } from "@/features/properties/location-picker/adapters";

describe("getRootNodes", () => {
  it("returns all 16 real regions", () => {
    expect(getRootNodes()).toHaveLength(16);
  });

  it("every region has hasChildren true — every region has districts", () => {
    expect(getRootNodes().every((n) => n.hasChildren)).toBe(true);
  });

  it("a region has no breadcrumb — it is the top level", () => {
    const greaterAccra = getRootNodes().find((n) => n.slug === "greater-accra")!;
    expect(greaterAccra.parentLabel).toBeUndefined();
  });

  it("attaches counts from the supplied map, by id (p-code)", () => {
    const nodes = getRootNodes({ GH07: 42 });
    const greaterAccra = nodes.find((n) => n.slug === "greater-accra")!;
    const ashanti = nodes.find((n) => n.slug === "ashanti")!;
    expect(greaterAccra.count).toBe(42);
    expect(ashanti.count).toBeUndefined();
  });

  it("carries the HDX alias where one exists", () => {
    const northEast = getRootNodes().find((n) => n.slug === "north-east")!;
    expect(northEast.aliases).toContain("Northern East");
  });
});

describe("getChildNodes", () => {
  it("returns a region's districts, each with hasChildren false (no areas yet)", () => {
    const districts = getChildNodes("GH07");
    expect(districts.length).toBeGreaterThan(0);
    expect(districts.every((n) => n.hasChildren === false)).toBe(true);
  });

  it("a district's breadcrumb is its parent region's name", () => {
    const districts = getChildNodes("GH07");
    const ablekumaCentral = districts.find((n) => n.slug === "ablekuma-central")!;
    expect(ablekumaCentral.parentLabel).toBe("Greater Accra");
  });

  it("returns [] for an id with no children (currently every district)", () => {
    expect(getChildNodes("GH0701")).toEqual([]);
  });

  it("returns [] for an id that doesn't exist", () => {
    expect(getChildNodes("not-a-real-id")).toEqual([]);
  });
});

describe("getAllNodes", () => {
  it("includes every region and every district (16 + 260)", () => {
    const all = getAllNodes();
    expect(all.filter((n) => n.hasChildren)).toHaveLength(16); // regions
    expect(all.filter((n) => !n.hasChildren)).toHaveLength(260); // districts (no areas yet)
  });
});
