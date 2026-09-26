import {
  getChildren,
  getPath,
  REGIONS,
  type AreaNode,
  type DistrictNode,
  type RegionNode,
} from "@/lib/location-taxonomy";
import type { LocationPickerLevel, LocationPickerNode } from "./types";

/** A node's level from its own shape: regions have no parent, districts carry
 *  a displayName, areas are what's left. */
export function levelOf(node: RegionNode | DistrictNode | AreaNode): LocationPickerLevel {
  if (!("parentId" in node)) return "region";
  return "displayName" in node ? "city" : "area";
}

const LEVEL_NOUN: Record<LocationPickerLevel, [string, string]> = {
  region: ["region", "regions"],
  city: ["district", "districts"],
  area: ["area", "areas"],
};

/** "29 districts", "1 area" — what browsing inside a place will show. */
export function childSummary(node: LocationPickerNode): string | null {
  if (!node.hasChildren) return null;
  const childLevel: LocationPickerLevel = node.level === "region" ? "city" : "area";
  const [one, many] = LEVEL_NOUN[childLevel];
  return `${node.childCount} ${node.childCount === 1 ? one : many}`;
}

function label(node: RegionNode | DistrictNode | AreaNode): string {
  return "displayName" in node ? node.displayName : node.name;
}

/** DistrictNode carries no `aliases` field (see types.ts) — its officialName
 *  is the closest equivalent, since a search for the full legal name should
 *  still find it even though the row displays the shortened form. */
function aliasesFor(node: RegionNode | DistrictNode | AreaNode): string[] {
  if ("aliases" in node) return node.aliases;
  return node.officialName !== node.displayName ? [node.officialName] : [];
}

/** "Greater Accra" for a district, "Dansoman / Greater Accra" for an area —
 *  built from the taxonomy's own getPath, root first, dropping the node
 *  itself (a row never shows its own name as its own breadcrumb). */
function breadcrumbFor(nodeId: string): string | undefined {
  const path = getPath(nodeId);
  const ancestors = path.slice(0, -1);
  if (ancestors.length === 0) return undefined;
  return ancestors.map(label).reverse().join(" / ");
}

function toPickerNode(
  node: RegionNode | DistrictNode | AreaNode,
  counts: Record<string, number> | undefined,
): LocationPickerNode {
  const childCount = getChildren(node.id).length;
  return {
    id: node.id,
    slug: node.slug,
    label: label(node),
    aliases: aliasesFor(node),
    // Known counts make absence meaningful: a place missing from them has 0.
    count: counts ? (counts[node.id] ?? 0) : undefined,
    parentLabel: breadcrumbFor(node.id),
    level: levelOf(node),
    hasChildren: childCount > 0,
    childCount,
  };
}

/** The root level's option list — always all 16 regions, GHANA_REGIONS'
 *  order (not alphabetical — grouping.ts re-sorts for display). */
export function getRootNodes(counts?: Record<string, number>): LocationPickerNode[] {
  return REGIONS.map((r) => toPickerNode(r, counts));
}

/** Region → … → the node itself, as picker nodes — for opening the picker
 *  already browsing where the current selection lives. */
export function getPathNodes(id: string, counts?: Record<string, number>): LocationPickerNode[] {
  return getPath(id).map((n) => toPickerNode(n, counts));
}

/** parentId's children, mapped to picker nodes — [] when parentId has none
 *  (every district currently, until AREAS is populated) or doesn't exist. */
export function getChildNodes(
  parentId: string,
  counts?: Record<string, number>,
): LocationPickerNode[] {
  return getChildren(parentId).map((n) => toPickerNode(n, counts));
}

/** Every region + district + (once populated) area, flattened — the
 *  candidate set the cross-level search in search.ts ranks over. */
export function getAllNodes(counts?: Record<string, number>): LocationPickerNode[] {
  const districts = REGIONS.flatMap((r) => getChildren(r.id));
  const areas = districts.flatMap((d) => getChildren(d.id));
  return [...REGIONS, ...districts, ...areas].map((n) => toPickerNode(n, counts));
}
