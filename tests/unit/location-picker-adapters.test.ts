import { describe, expect, it } from "vitest";
import {
  childSummary,
  getAllNodes,
  getChildNodes,
  getRootNodes,
} from "@/features/properties/location-picker/adapters";

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
    // Once counts are known, a place missing from them holds nothing.
    expect(ashanti.count).toBe(0);
  });

  it("leaves counts unknown when none are supplied", () => {
    expect(getRootNodes().every((n) => n.count === undefined)).toBe(true);
  });

  it("reads each node's level off the taxonomy, with its child count", () => {
    const greaterAccra = getRootNodes().find((n) => n.slug === "greater-accra")!;
    expect(greaterAccra).toMatchObject({ level: "region", hasChildren: true });
    expect(greaterAccra.childCount).toBeGreaterThan(10);
    const [district] = getChildNodes(greaterAccra.id);
    expect(district).toMatchObject({ level: "city", hasChildren: false, childCount: 0 });
  });

  it("describes what browsing inside a place will show", () => {
    const greaterAccra = getRootNodes().find((n) => n.slug === "greater-accra")!;
    expect(childSummary(greaterAccra)).toBe(`${greaterAccra.childCount} districts`);
    expect(childSummary(getChildNodes(greaterAccra.id)[0])).toBeNull();
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
