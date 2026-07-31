import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { NAVIGATION_QUERY } from "@/sanity/lib/queries";

import type { NavGroup } from "@/config/navigation";

export interface NavigationContent {
  verifyLabel?: string;
  navGroups?: NavGroup[];
}

interface SanityNavigationDoc {
  verifyLabel?: string;
  navGroups?: Array<{
    label?: string;
    href?: string;
    accentColor?: string;
    exploreLabel?: string;
    items?: Array<{ label?: string; description?: string; href?: string }>;
  }>;
}

/** Drop any nav group/item missing the fields it needs to render safely. */
function mapNavigation(doc: SanityNavigationDoc): NavigationContent {
  const navGroups = doc.navGroups
    ?.filter((g): g is Required<Pick<typeof g, "label" | "href">> & typeof g =>
      Boolean(g.label && g.href),
    )
    .map((g): NavGroup => ({
      label: g.label,
      href: g.href,
      accentColor: g.accentColor ?? "",
      exploreLabel: g.exploreLabel ?? "options",
      items: (g.items ?? [])
        .filter((item) => Boolean(item.label && item.href))
        .map((item) => ({
          label: item.label!,
          description: item.description ?? "",
          href: item.href!,
        })),
    }));

  return {
    verifyLabel: doc.verifyLabel,
    navGroups: navGroups && navGroups.length > 0 ? navGroups : undefined,
  };
}

/** Sanity's `navigation` singleton, or `null` if unset/unconfigured — callers fall back to the static defaults in `config/navigation.ts`. */
export async function getNavigationContent(): Promise<NavigationContent | null> {
  if (!isSanityConfigured) return null;

  try {
    const doc = await client.fetch<SanityNavigationDoc | null>(NAVIGATION_QUERY);
    return doc ? mapNavigation(doc) : null;
  } catch (error) {
    console.warn("Failed to fetch navigation content from Sanity:", error);
    return null;
  }
}
