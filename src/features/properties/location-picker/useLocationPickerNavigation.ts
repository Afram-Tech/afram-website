import { useMemo, useReducer } from "react";
import { getChildNodes, getRootNodes } from "./adapters";
import type { LocationPickerNode } from "./types";

export interface NavigationState {
  /** Places browsed into, root first — [] when listing the regions. */
  path: LocationPickerNode[];
}

export type NavigationAction =
  | { type: "DRILL_INTO"; node: LocationPickerNode }
  | { type: "BACK" }
  /** Jump to a breadcrumb: keep the first `depth` entries (0 = the root). */
  | { type: "GO_TO"; depth: number }
  /** Open somewhere specific, e.g. inside the current selection's parent. */
  | { type: "SET_PATH"; path: LocationPickerNode[] }
  | { type: "RESET" };

export const INITIAL_NAVIGATION_STATE: NavigationState = { path: [] };

/** Pure — exported separately so the state machine is testable on its own. */
export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case "DRILL_INTO":
      return { path: [...state.path, action.node] };
    case "BACK":
      return { path: state.path.slice(0, -1) };
    case "GO_TO":
      return { path: state.path.slice(0, Math.max(action.depth, 0)) };
    case "SET_PATH":
      return { path: action.path };
    case "RESET":
      return INITIAL_NAVIGATION_STATE;
  }
}

export interface UseLocationPickerNavigation {
  path: LocationPickerNode[];
  /** The places listed at this depth — the regions at the root, otherwise
   *  what's inside the last place browsed into. */
  nodes: LocationPickerNode[];
  /** The place being browsed inside — undefined at the root. */
  parent: LocationPickerNode | undefined;
  canGoBack: boolean;
  drillInto: (node: LocationPickerNode) => void;
  back: () => void;
  goTo: (depth: number) => void;
  setPath: (path: LocationPickerNode[]) => void;
  reset: () => void;
}

export function useLocationPickerNavigation(
  counts?: Record<string, number>,
): UseLocationPickerNavigation {
  const [state, dispatch] = useReducer(navigationReducer, INITIAL_NAVIGATION_STATE);
  const parent = state.path[state.path.length - 1];

  const nodes = useMemo(
    () => (parent ? getChildNodes(parent.id, counts) : getRootNodes(counts)),
    [parent, counts],
  );

  return {
    path: state.path,
    nodes,
    parent,
    canGoBack: state.path.length > 0,
    drillInto: (node) => dispatch({ type: "DRILL_INTO", node }),
    back: () => dispatch({ type: "BACK" }),
    goTo: (depth) => dispatch({ type: "GO_TO", depth }),
    setPath: (path) => dispatch({ type: "SET_PATH", path }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
