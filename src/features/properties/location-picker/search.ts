import { normalizeLocationName } from "@/lib/location-taxonomy";
import type { LocationPickerNode } from "./types";

export interface LocationPickerSearchResult extends LocationPickerNode {
  /** 0 = exact match, 1 = prefix, 2 = substring — sort key, not shown. */
  rank: number;
}

/**
 * Ranked cross-level search: prefix beats substring beats nothing, checked
 * against label and every alias, case/diacritic/whitespace-insensitive via
 * the taxonomy's own normalizeLocationName (so "greater accra region" and
 * "Northern East" both find their node the same way findByAlias would).
 * Nodes with no match at all are dropped, not scored last — a flat search
 * result list, not a re-sorted full list.
 */
export function searchLocationNodes(
  nodes: LocationPickerNode[],
  query: string,
): LocationPickerSearchResult[] {
  const q = normalizeLocationName(query);
  if (!q) return [];

  const results: LocationPickerSearchResult[] = [];
  for (const node of nodes) {
    const terms = [node.label, ...node.aliases].map(normalizeLocationName);
    let best = Infinity;
    for (const term of terms) {
      if (term === q) best = Math.min(best, 0);
      else if (term.startsWith(q)) best = Math.min(best, 1);
      else if (term.includes(q)) best = Math.min(best, 2);
    }
    if (best < Infinity) results.push({ ...node, rank: best });
  }

  return results.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label));
}
