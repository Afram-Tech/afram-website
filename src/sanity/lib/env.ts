/** Shared with afram-dashboard only by value — same project, same dataset. No code is shared between the two apps. */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-project";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-01-01";

/**
 * afram-dashboard's Studio, at /dashboard/cms. Used by Visual Editing overlays
 * to build "open in Studio" links. Defaults to the dashboard's local Vite dev
 * server; override with NEXT_PUBLIC_SANITY_STUDIO_URL once it has a real deploy URL.
 */
export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:5173/dashboard/cms";

export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

if (!isSanityConfigured) {
  console.warn(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set — falling back to a placeholder so the rest of the site can still build. Insights pages will render empty until a real Sanity project is configured.",
  );
}
