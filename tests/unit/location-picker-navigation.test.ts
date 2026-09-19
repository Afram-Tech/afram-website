import { describe, expect, it } from "vitest";
import {
  INITIAL_NAVIGATION_STATE,
  navigationReducer,
  type NavigationState,
} from "@/features/properties/location-picker/useLocationPickerNavigation";
import type { LocationPickerNode } from "@/features/properties/location-picker/types";

const node = (id: string): LocationPickerNode => ({
  id,
  slug: id.toLowerCase(),
  label: id,
  aliases: [],
  hasChildren: true,
});

describe("navigationReducer", () => {
  it("starts at the root with an empty path", () => {
    expect(INITIAL_NAVIGATION_STATE).toEqual({ path: [] });
  });

  it("DRILL_INTO appends to the path", () => {
    const accra = node("Greater Accra");
    const state = navigationReducer(INITIAL_NAVIGATION_STATE, { type: "DRILL_INTO", node: accra });
    expect(state.path).toEqual([accra]);
  });

  it("DRILL_INTO twice builds a two-deep path, in order", () => {
    const accra = node("Greater Accra");
    const ablekuma = node("Ablekuma Central");
    let state: NavigationState = INITIAL_NAVIGATION_STATE;
    state = navigationReducer(state, { type: "DRILL_INTO", node: accra });
    state = navigationReducer(state, { type: "DRILL_INTO", node: ablekuma });
    expect(state.path).toEqual([accra, ablekuma]);
  });

  it("BACK pops the last entry", () => {
    const accra = node("Greater Accra");
    const ablekuma = node("Ablekuma Central");
    let state: NavigationState = { path: [accra, ablekuma] };
    state = navigationReducer(state, { type: "BACK" });
    expect(state.path).toEqual([accra]);
  });

  it("BACK at the root is a no-op, not an error", () => {
    const state = navigationReducer(INITIAL_NAVIGATION_STATE, { type: "BACK" });
    expect(state.path).toEqual([]);
  });

  it("RESET returns to the root regardless of depth", () => {
    const state: NavigationState = { path: [node("A"), node("B")] };
    expect(navigationReducer(state, { type: "RESET" })).toEqual({ path: [] });
  });
});
