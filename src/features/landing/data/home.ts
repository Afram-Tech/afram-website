import { isSanityConfigured } from "@/sanity/lib/env";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";

type SanityImageSource = Parameters<typeof urlFor>[0];

export interface HomeRoleCardContent {
  eyebrow?: string;
  title?: string;
  link?: string;
  image?: string;
}

export interface HomePartnerContent {
  name: string;
  logo: string;
}

export interface HomePageContent {
  heroEyebrow?: string;
  heroHeading?: string;
  heroImage?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaLink?: string;
  roleCards?: HomeRoleCardContent[];
  partnerLogosHeading?: string;
  partners?: HomePartnerContent[];
  featuredPropertiesHeading?: string;
  featuredPropertiesSubheading?: string;
  featuredPropertiesCtaLabel?: string;
  featuredPropertiesCtaLink?: string;
  morePropertiesHeading?: string;
  morePropertiesCtaLabel?: string;
  morePropertiesCtaLink?: string;
  affordabilityEyebrow?: string;
  affordabilityTitle?: string;
  affordabilityIntro?: string;
  featuredArticlesHeading?: string;
  featuredArticlesSubheading?: string;
  featuredArticlesCtaLabel?: string;
  featuredArticlesCtaLink?: string;
}

interface SanityHomePageDoc extends Omit<HomePageContent, "heroImage" | "roleCards" | "partners"> {
  heroImage?: SanityImageSource;
  roleCards?: Array<{
    eyebrow?: string;
    title?: string;
    link?: string;
    image?: SanityImageSource;
  }>;
  partners?: Array<{ name?: string; logo?: SanityImageSource }>;
}

/** Empty arrays are treated the same as "not set yet" so a partially-authored document never blanks out a section that's still showing its static defaults. */
function nonEmpty<T>(arr: T[] | undefined): T[] | undefined {
  return arr && arr.length > 0 ? arr : undefined;
}

function mapHomePage(doc: SanityHomePageDoc): HomePageContent {
  return {
    ...doc,
    heroImage: doc.heroImage ? urlFor(doc.heroImage).width(1600).url() : undefined,
    roleCards: nonEmpty(
      doc.roleCards?.map((card) => ({
        eyebrow: card.eyebrow,
        title: card.title,
        link: card.link,
        image: card.image ? urlFor(card.image).width(600).url() : undefined,
      })),
    ),
    partners: nonEmpty(
      doc.partners
        ?.filter((p): p is { name: string; logo: SanityImageSource } => Boolean(p.name && p.logo))
        .map((p) => ({
          name: p.name,
          logo: urlFor(p.logo).width(280).height(96).fit("max").url(),
        })),
    ),
  };
}

/** Sanity's `homePage` singleton, or `null` if unset/unconfigured — callers fall back to each section's current static copy. */
export async function getHomePageContent(): Promise<HomePageContent | null> {
  if (!isSanityConfigured) return null;

  try {
    const { data } = await sanityFetch({ query: HOME_PAGE_QUERY });
    const doc = data as SanityHomePageDoc | null;
    return doc ? mapHomePage(doc) : null;
  } catch (error) {
    console.warn("Failed to fetch home page content from Sanity:", error);
    return null;
  }
}
