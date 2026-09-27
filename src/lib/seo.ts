import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
  /** Page-specific share images (e.g. a listing's photos) — the site-wide
   *  Open Graph image when omitted. */
  images?: string[];
}

export function buildMetadata({
  title,
  description,
  path = "",
  images,
}: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = `${title} — ${siteConfig.name}`;
  const ogImages = images?.length
    ? images.map((src) => ({ url: src, alt: fullTitle }))
    : [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: fullTitle }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
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
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/afram-logo.svg`,
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
