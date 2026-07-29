import { siteConfig } from "@/config/site";

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

interface BuildSeoOptions {
  title: string;
  description: string;
  path?: string;
}

export function buildSeo({ title, description, path = "" }: BuildSeoOptions): PageSeo {
  return {
    title: `${title} — ${siteConfig.name}`,
    description,
    canonical: `${siteConfig.url}${path}`,
    ogImage: `${siteConfig.url}${siteConfig.ogImage}`,
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
