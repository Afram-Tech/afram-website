import type { CSSProperties } from "react";

/**
 * Afram is one teal, so every persona page reads the global accent. Pages still
 * pass a key; none of them re-themes anything.
 */
export type AccentKey = "blue" | "indigo" | "purple" | "emerald" | "fuchsia" | "teal";

const TEAL: CSSProperties = {};

export const ACCENT_VARS: Record<AccentKey, CSSProperties> = {
  blue: TEAL,
  indigo: TEAL,
  purple: TEAL,
  emerald: TEAL,
  fuchsia: TEAL,
  teal: TEAL,
};
