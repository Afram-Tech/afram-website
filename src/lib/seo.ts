import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/** Google shows roughly this many characters of a description before it
 *  cuts it off. */
const MAX_DESCRIPTION = 160;

/** Shortens text to `max` characters at a word boundary, adding "…". */
export function clampDescription(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, "")}…`;
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
  /** Page-specific share images (e.g. a listing's photos) — the site-wide
   *  Open Graph image when omitted. */
  images?: string[];
  /** Use `title` as the whole <title>, without the " — Afram" suffix. For
   *  titles that are already long enough to be cut off in results. */
  absoluteTitle?: boolean;
  /** Keep the page out of search results while still letting crawlers
   *  follow its links. */
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "",
  images,
  absoluteTitle = false,
  noindex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = absoluteTitle ? title : `${title} — ${siteConfig.name}`;
  const summary = clampDescription(description);
  const ogImages = images?.length
    ? images.map((src) => ({ url: src, alt: fullTitle }))
    : [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: fullTitle }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: summary,
    alternates: { canonical: url },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      title: fullTitle,
      description: summary,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: summary,
      images: ogImages.map((image) => image.url),
      site: siteConfig.social.twitter,
      creator: siteConfig.social.twitter,
    },
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(faqs: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/apple-touch-icon.png`,
      width: 180,
      height: 180,
    },
    description: siteConfig.description,
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
    ],
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

/** Tells Google the site's name for the result's site-name line. Belongs on
 *  the home page. */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: [siteConfig.legalName, "Afram Marketplace"],
    url: `${siteConfig.url}/`,
    inLanguage: "en-GH",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

interface ArticleJsonLdInput {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  image?: string;
  /** The writer's name, credited as a Person; the company otherwise. */
  authorName?: string;
}

export function buildArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  image,
  authorName,
}: ArticleJsonLdInput) {
  const url = `${siteConfig.url}/insights/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title.slice(0, 110),
    description,
    url,
    mainEntityOfPage: url,
    datePublished,
    dateModified: datePublished,
    inLanguage: "en-GH",
    ...(image && { image: [image] }),
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}
