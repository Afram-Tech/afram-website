import { useMemo, useReducer } from "react";
import { getChildNodes, getRootNodes } from "./adapters";
import type { LocationPickerLevel, LocationPickerNode } from "./types";

export interface NavigationState {
  /** Drilled-into nodes, root first — [] at the region level. */
  path: LocationPickerNode[];
}

export type NavigationAction =
  { type: "DRILL_INTO"; node: LocationPickerNode } | { type: "BACK" } | { type: "RESET" };

export const INITIAL_NAVIGATION_STATE: NavigationState = { path: [] };

/** Pure — exported separately from the hook so the state machine itself is
 *  testable without mounting anything. */
export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case "DRILL_INTO":
      return { path: [...state.path, action.node] };
    case "BACK":
      return { path: state.path.slice(0, -1) };
    case "RESET":
      return INITIAL_NAVIGATION_STATE;
  }
}

export const LEVEL_BY_DEPTH: LocationPickerLevel[] = ["region", "city", "area"];

export interface UseLocationPickerNavigation {
  path: LocationPickerNode[];
  level: LocationPickerLevel;
  /** This level's option list — all 16 regions at the root, or the
   *  current path's last node's children otherwise. */
  nodes: LocationPickerNode[];
  /** The node a click on "All {parentLabel}" would select — undefined at
   *  the root, where there is nothing to fall back to. */
  parent: LocationPickerNode | undefined;
  canGoBack: boolean;
  drillInto: (node: LocationPickerNode) => void;
  back: () => void;
  reset: () => void;
}

export function useLocationPickerNavigation(
  counts?: Record<string, number>,
): UseLocationPickerNavigation {
  const [state, dispatch] = useReducer(navigationReducer, INITIAL_NAVIGATION_STATE);

  const nodes = useMemo(() => {
    const parent = state.path[state.path.length - 1];
    return parent ? getChildNodes(parent.id, counts) : getRootNodes(counts);
  }, [state.path, counts]);

  return {
    path: state.path,
    level: LEVEL_BY_DEPTH[Math.min(state.path.length, LEVEL_BY_DEPTH.length - 1)],
    nodes,
    parent: state.path[state.path.length - 1],
    canGoBack: state.path.length > 0,
    drillInto: (node) => dispatch({ type: "DRILL_INTO", node }),
    back: () => dispatch({ type: "BACK" }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
