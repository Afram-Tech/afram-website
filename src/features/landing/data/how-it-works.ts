import { isSanityConfigured } from "@/sanity/lib/env";
import { sanityFetch } from "@/sanity/lib/live";
import { HOW_IT_WORKS_PAGE_QUERY } from "@/sanity/lib/queries";

export interface HowItWorksStepContent {
  title?: string;
  description?: string;
}

export interface HowItWorksPageContent {
  heroHeading?: string;
  heroIntro?: string;
  steps?: HowItWorksStepContent[];
  verifyHeading?: string;
  verifyBody?: string;
  verifyCtaLabel?: string;
  closingHeading?: string;
}

/** Sanity's `howItWorksPage` singleton, or `null` if unset/unconfigured — callers fall back to the page's current static copy. */
export async function getHowItWorksPageContent(): Promise<HowItWorksPageContent | null> {
  if (!isSanityConfigured) return null;

  try {
    const { data } = await sanityFetch({ query: HOW_IT_WORKS_PAGE_QUERY });
    const doc = data as HowItWorksPageContent | null;
    if (!doc) return null;
    return {
      ...doc,
      steps: doc.steps && doc.steps.length > 0 ? doc.steps : undefined,
    };
  } catch (error) {
    console.warn("Failed to fetch How it Works content from Sanity:", error);
    return null;
  }
}
