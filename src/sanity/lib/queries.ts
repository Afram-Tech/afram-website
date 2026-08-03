/** Shared projection — everything an Insights article needs except the body. */
const ARTICLE_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  cover,
  author,
  "date": publishedAt,
  readMinutes
`;

export const ALL_ARTICLES_QUERY = `
  *[_type == "insightArticle"] | order(publishedAt desc) {
    ${ARTICLE_CARD_FIELDS}
  }
`;

export const ALL_ARTICLE_SLUGS_QUERY = `
  *[_type == "insightArticle" && defined(slug.current)].slug.current
`;

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "insightArticle" && slug.current == $slug][0] {
    ${ARTICLE_CARD_FIELDS},
    body
  }
`;

export const NAVIGATION_QUERY = `
  *[_type == "navigation"][0] {
    verifyLabel,
    navGroups[] {
      label,
      href,
      accentColor,
      exploreLabel,
      items[] { label, description, href }
    }
  }
`;

export const FOOTER_QUERY = `
  *[_type == "footer"][0] {
    tagline,
    newsletterHeading,
    newsletterBody,
    newsletterButtonLabel,
    copyrightTemplate,
    companyLinks[] { label, href },
    socialLinks[] { label, href },
    legalLinks[] { label, href }
  }
`;

export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    heroEyebrow,
    heroHeading,
    heroImage,
    heroPrimaryCtaLabel,
    heroPrimaryCtaLink,
    heroSecondaryCtaLabel,
    heroSecondaryCtaLink,
    roleCards[] { eyebrow, title, link, image },
    partnerLogosHeading,
    partners[] { name, logo },
    featuredPropertiesHeading,
    featuredPropertiesSubheading,
    featuredPropertiesCtaLabel,
    featuredPropertiesCtaLink,
    morePropertiesHeading,
    morePropertiesCtaLabel,
    morePropertiesCtaLink,
    affordabilityEyebrow,
    affordabilityTitle,
    affordabilityIntro,
    featuredArticlesHeading,
    featuredArticlesSubheading,
    featuredArticlesCtaLabel,
    featuredArticlesCtaLink
  }
`;

export const HOW_IT_WORKS_PAGE_QUERY = `
  *[_type == "howItWorksPage"][0] {
    heroHeading,
    heroIntro,
    steps[] { title, description },
    verifyHeading,
    verifyBody,
    verifyCtaLabel,
    closingHeading
  }
`;
