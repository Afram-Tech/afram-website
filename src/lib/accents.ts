export type AccentKey = "blue" | "indigo" | "purple" | "emerald" | "fuchsia";

function makeAccentVars(
  c50: string,
  c100: string,
  c200: string,
  c300: string,
  c400: string,
  c500: string,
  c600: string,
  c700: string,
) {
  return {
    "--color-accent-50": c50,
    "--color-accent-100": c100,
    "--color-accent-200": c200,
    "--color-accent-300": c300,
    "--color-accent-400": c400,
    "--color-accent-500": c500,
    "--color-accent-600": c600,
    "--color-accent-700": c700,
  };
}

export const ACCENT_VARS: Record<AccentKey, Record<string, string>> = {
  blue: makeAccentVars(
    "#eff6ff",
    "#dbeafe",
    "#bfdbfe",
    "#93c5fd",
    "#60a5fa",
    "#3b82f6",
    "#2563eb",
    "#1d4ed8",
  ),
  indigo: makeAccentVars(
    "#eef2ff",
    "#e0e7ff",
    "#c7d2fe",
    "#a5b4fc",
    "#818cf8",
    "#6366f1",
    "#4f46e5",
    "#4338ca",
  ),
  purple: makeAccentVars(
    "#faf5ff",
    "#f3e8ff",
    "#e9d5ff",
    "#d8b4fe",
    "#c084fc",
    "#a855f7",
    "#9333ea",
    "#7e22ce",
  ),
  emerald: makeAccentVars(
    "#f2faf6",
    "#d1fae5",
    "#a7f3d0",
    "#6ee7b7",
    "#34d399",
    "#10b981",
    "#059669",
    "#047857",
  ),
  fuchsia: makeAccentVars(
    "#fdf4ff",
    "#fae8ff",
    "#f5d0fe",
    "#f0abfc",
    "#e879f9",
    "#d946ef",
    "#c026d3",
    "#a21caf",
  ),
};
