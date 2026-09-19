import type { LocationPickerNode } from "./types";

export interface LocationPickerGroups {
  /** Top nodes by count, in count-descending order — [] when no node in
   *  the list has a known count (there is nothing meaningful to call
   *  "popular" without real numbers; a caller with no count data should
   *  simply not render the POPULAR section rather than show an arbitrary
   *  subset dressed up as it). */
  popular: LocationPickerNode[];
  /** The remaining nodes (everything not already shown as popular),
   *  grouped by the first letter of `label`, in [A-Z, #] order — `#` holds
   *  anything that doesn't start with a letter (none in the current Ghana
   *  data, kept for robustness rather than assumed impossible). */
  alphabetical: { letter: string; nodes: LocationPickerNode[] }[];
}

const byLabel = (a: LocationPickerNode, b: LocationPickerNode) => a.label.localeCompare(b.label);

function firstLetterOf(label: string): string {
  const ch = label.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : "#";
}

/**
 * Splits a level's node list into POPULAR (by count) + an alphabetically
 * grouped remainder — the exact shape the Jiji reference renders (popular
 * rows first, then a letter-indexed list of everything else).
 */
export function groupLocationNodes(
  nodes: LocationPickerNode[],
  popularCount = 6,
): LocationPickerGroups {
  const withCount = nodes.filter((n) => typeof n.count === "number" && n.count > 0);
  const popular = [...withCount]
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0) || byLabel(a, b))
    .slice(0, popularCount);
  const popularIds = new Set(popular.map((n) => n.id));

  const remainder = nodes.filter((n) => !popularIds.has(n.id)).sort(byLabel);

  const byLetter = new Map<string, LocationPickerNode[]>();
  for (const node of remainder) {
    const letter = firstLetterOf(node.label);
    byLetter.set(letter, [...(byLetter.get(letter) ?? []), node]);
  }

  const alphabetical = [...byLetter.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, group]) => ({ letter, nodes: group }));

  return { popular, alphabetical };
}
