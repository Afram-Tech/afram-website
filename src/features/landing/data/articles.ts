import type { PortableTextBlock } from "@portabletext/react";

import { stegaClean } from "@sanity/client/stega";

import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  ALL_ARTICLE_SLUGS_QUERY,
  ALL_ARTICLES_QUERY,
  ARTICLE_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  author: { name: string; role: string };
  date: string;
  readMinutes: number;
  body?: PortableTextBlock[];
}

interface SanityArticleDoc {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover: Parameters<typeof urlFor>[0];
  author: { name: string; role: string };
  date: string;
  readMinutes: number;
  body?: PortableTextBlock[];
}

function mapArticle(doc: SanityArticleDoc): Article {
  return {
    // Cleaned: used as a URL segment, React key, and lookup value — never
    // rendered as visible text, so stripping stega here costs nothing.
    slug: stegaClean(doc.slug),
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    cover: urlFor(doc.cover).width(1200).height(675).fit("crop").url(),
    author: doc.author,
    date: doc.date,
    readMinutes: doc.readMinutes,
    body: doc.body,
  };
}

export async function getAllArticles(): Promise<Article[]> {
  if (!isSanityConfigured) return [];

  try {
    const { data } = await sanityFetch({ query: ALL_ARTICLES_QUERY });
    const docs = data as SanityArticleDoc[];
    return docs.map(mapArticle);
  } catch (error) {
    console.warn("Failed to fetch Insights articles from Sanity:", error);
    return [];
  }
}

/**
 * Slugs for `generateStaticParams`. Uses the plain client rather than the live
 * `sanityFetch`, which reads `draftMode()` — unavailable at build time, where
 * there is no request. Stega is off since these are URL segments, not display text.
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return [];

  try {
    return await client.withConfig({ stega: false }).fetch<string[]>(ALL_ARTICLE_SLUGS_QUERY);
  } catch (error) {
    console.warn("Failed to fetch Insights article slugs from Sanity:", error);
    return [];
  }
}

export async function findArticleBySlug(slug: string): Promise<Article | undefined> {
  if (!isSanityConfigured) return undefined;

  try {
    const { data } = await sanityFetch({ query: ARTICLE_BY_SLUG_QUERY, params: { slug } });
    const doc = data as SanityArticleDoc | null;
    return doc ? mapArticle(doc) : undefined;
  } catch (error) {
    console.warn(`Failed to fetch article "${slug}" from Sanity:`, error);
    return undefined;
  }
}

/** Format an ISO date string, e.g. "Jun 2, 2026". */
export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
