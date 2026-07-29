import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
}

export function buildMetadata({ title, description, path = "" }: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = `${title} — ${siteConfig.name}`;

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
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [siteConfig.ogImage],
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
