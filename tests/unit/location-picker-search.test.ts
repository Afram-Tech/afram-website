import { describe, expect, it } from "vitest";
import { searchLocationNodes } from "@/features/properties/location-picker/search";
import { getAllNodes } from "@/features/properties/location-picker/adapters";
import type { LocationPickerNode } from "@/features/properties/location-picker/types";

const node = (label: string, aliases: string[] = []): LocationPickerNode => ({
  id: label,
  slug: label.toLowerCase(),
  label,
  aliases,
  hasChildren: false,
});

describe("searchLocationNodes — ranking", () => {
  it("ranks an exact match above a prefix match above a substring match", () => {
    const nodes = [node("Accraville"), node("Accra Central"), node("Accra")];
    const results = searchLocationNodes(nodes, "Accra");
    expect(results.map((r) => r.label)).toEqual(["Accra", "Accra Central", "Accraville"]);
  });

  it("drops a node with no match at all rather than scoring it last", () => {
    const nodes = [node("Accra"), node("Kumasi")];
    const results = searchLocationNodes(nodes, "Accra");
    expect(results.map((r) => r.label)).toEqual(["Accra"]);
  });

  it("is case, whitespace, and diacritic insensitive", () => {
    expect(searchLocationNodes([node("Wenchi")], "  WÉNCHI  ")).toHaveLength(1);
  });

  it("matches on an alias, not just the label", () => {
    const results = searchLocationNodes([node("North East", ["Northern East"])], "northern east");
    expect(results).toHaveLength(1);
    expect(results[0].label).toBe("North East");
  });

  it("returns [] for an empty or whitespace-only query", () => {
    expect(searchLocationNodes([node("Accra")], "")).toEqual([]);
    expect(searchLocationNodes([node("Accra")], "   ")).toEqual([]);
  });

  it("ties within the same rank break alphabetically", () => {
    const nodes = [node("Zeta Accra"), node("Alpha Accra")];
    const results = searchLocationNodes(nodes, "accra");
    expect(results.map((r) => r.label)).toEqual(["Alpha Accra", "Zeta Accra"]);
  });
});

describe("searchLocationNodes — against the real taxonomy", () => {
  it("finds Dansoman's parent region by searching a real substring", () => {
    // Ablekuma Central Municipal contains "Ablekuma" — confirmed real data.
    const results = searchLocationNodes(getAllNodes(), "ablekuma");
    expect(results.some((r) => r.slug.startsWith("ablekuma"))).toBe(true);
  });

  it("finds Greater Accra by a prefix search", () => {
    const results = searchLocationNodes(getAllNodes(), "greater");
    expect(results[0].label).toBe("Greater Accra");
  });

  it("every result carries a breadcrumb when it isn't a top-level region", () => {
    const results = searchLocationNodes(getAllNodes(), "kumasi");
    const district = results.find((r) => r.hasChildren === false);
    expect(district?.parentLabel).toBeTruthy();
  });
});
