import { describe, expect, it } from "vitest";
import { groupLocationNodes } from "@/features/properties/location-picker/grouping";
import type { LocationPickerNode } from "@/features/properties/location-picker/types";

const node = (label: string, count?: number): LocationPickerNode => ({
  id: label,
  slug: label.toLowerCase(),
  label,
  aliases: [],
  count,
  level: "city",
  hasChildren: false,
  childCount: 0,
});

describe("groupLocationNodes — popular", () => {
  it("picks the top N by count, descending", () => {
    const nodes = [node("Ashanti", 1082), node("Central", 252), node("Greater Accra", 13609)];
    const { popular } = groupLocationNodes(nodes, 2);
    expect(popular.map((n) => n.label)).toEqual(["Greater Accra", "Ashanti"]);
  });

  it("excludes nodes with no count or a zero count from popular", () => {
    const nodes = [node("Known", 10), node("Unknown"), node("Zero", 0)];
    const { popular } = groupLocationNodes(nodes);
    expect(popular.map((n) => n.label)).toEqual(["Known"]);
  });

  it("is empty when nothing has a known count — no arbitrary 'popular' without real numbers", () => {
    const nodes = [node("A"), node("B"), node("C")];
    expect(groupLocationNodes(nodes).popular).toEqual([]);
  });

  it("breaks a count tie alphabetically", () => {
    const nodes = [node("Zeta", 5), node("Alpha", 5)];
    const { popular } = groupLocationNodes(nodes, 2);
    expect(popular.map((n) => n.label)).toEqual(["Alpha", "Zeta"]);
  });
});

describe("groupLocationNodes — alphabetical remainder", () => {
  it("groups everything not already shown as popular, by first letter", () => {
    const nodes = [
      node("Greater Accra", 13609),
      node("Brong Ahafo"),
      node("Bono"),
      node("Eastern"),
    ];
    const { alphabetical } = groupLocationNodes(nodes, 1);
    expect(alphabetical.map((g) => g.letter)).toEqual(["B", "E"]);
    expect(alphabetical.find((g) => g.letter === "B")?.nodes.map((n) => n.label)).toEqual([
      "Bono",
      "Brong Ahafo",
    ]);
  });

  it("sorts letter groups alphabetically and nodes within a group alphabetically", () => {
    const nodes = [node("Zebra"), node("Apple"), node("Ant"), node("Bee")];
    const { alphabetical } = groupLocationNodes(nodes, 0);
    expect(alphabetical.map((g) => g.letter)).toEqual(["A", "B", "Z"]);
    expect(alphabetical.find((g) => g.letter === "A")?.nodes.map((n) => n.label)).toEqual([
      "Ant",
      "Apple",
    ]);
  });

  it("does not duplicate a popular node into the alphabetical remainder", () => {
    const nodes = [node("Greater Accra", 13609)];
    const { popular, alphabetical } = groupLocationNodes(nodes, 1);
    expect(popular).toHaveLength(1);
    expect(alphabetical).toEqual([]);
  });
});
