import { cache } from "react";

import { isSanityConfigured } from "@/sanity/lib/env";
import { sanityFetch } from "@/sanity/lib/live";
import { FOOTER_QUERY } from "@/sanity/lib/queries";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContent {
  tagline?: string;
  newsletterHeading?: string;
  newsletterBody?: string;
  newsletterButtonLabel?: string;
  copyrightTemplate?: string;
  companyLinks?: FooterLink[];
  socialLinks?: FooterLink[];
  legalLinks?: FooterLink[];
}

function cleanLinks(links?: Array<{ label?: string; href?: string }>): FooterLink[] | undefined {
  const cleaned = links
    ?.filter((l) => Boolean(l.label && l.href))
    .map((l) => ({ label: l.label!, href: l.href! }));
  return cleaned && cleaned.length > 0 ? cleaned : undefined;
}

/** Sanity's `footer` singleton, or `null` if unset/unconfigured — callers fall back to the static defaults in `config/navigation.ts` / `config/site.ts`. */
export const getFooterContent = cache(
  async function getFooterContent(): Promise<FooterContent | null> {
    if (!isSanityConfigured) return null;

    try {
      const { data } = await sanityFetch({ query: FOOTER_QUERY });
      const doc = data as FooterContent | null;
      if (!doc) return null;
      return {
        ...doc,
        companyLinks: cleanLinks(doc.companyLinks),
        socialLinks: cleanLinks(doc.socialLinks),
        legalLinks: cleanLinks(doc.legalLinks),
      };
    } catch (error) {
      console.warn("Failed to fetch footer content from Sanity:", error);
      return null;
    }
  },
);
