import { draftMode } from "next/headers";
import { cache } from "react";

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

/**
 * Reads article content from Sanity.
 *
 * Published reads deliberately bypass `sanityFetch`: it stores responses in
 * Next's Data Cache with a one-year TTL, invalidated only by tag revalidation,
 * so newly published articles never appear on reload. The plain client is
 * uncached, which also opts these routes into dynamic rendering.
 *
 * Draft mode still goes through `sanityFetch` so the Studio's preview of
 * unpublished edits and Visual Editing overlays keep working.
 */
async function fetchArticleData<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const { isEnabled: isDraft } = await draftMode();

  if (isDraft) {
    const { data } = await sanityFetch({ query, params });
    return data as T;
  }

  return client.fetch<T>(query, params, { cache: "no-store" });
}

/**
 * Cached read, used by the home page and sitemap. Those routes must stay
 * statically cached — the home page also renders every property listing, and
 * re-rendering it per request is what exhausted the Worker CPU limit before.
 * Content here refreshes on deploy or tag revalidation, not on reload.
 */
export const getAllArticles = cache(async function getAllArticles(): Promise<Article[]> {
  if (!isSanityConfigured) return [];

  try {
    const { data } = await sanityFetch({ query: ALL_ARTICLES_QUERY });
    const docs = data as SanityArticleDoc[];
    return docs.map(mapArticle);
  } catch (error) {
    console.warn("Failed to fetch Insights articles from Sanity:", error);
    return [];
  }
});

/**
 * Uncached read for the Insights listing, so a reload always shows what is
 * currently published. Costs one Sanity round trip per request, which is
 * affordable here because the page is light — unlike the home page.
 */
export const getArticlesFresh = cache(async function getArticlesFresh(): Promise<Article[]> {
  if (!isSanityConfigured) return [];

  try {
    const docs = await fetchArticleData<SanityArticleDoc[]>(ALL_ARTICLES_QUERY);
    return docs.map(mapArticle);
  } catch (error) {
    console.warn("Failed to fetch Insights articles from Sanity:", error);
    return [];
  }
});

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

export const findArticleBySlug = cache(async function findArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  if (!isSanityConfigured) return undefined;

  try {
    const doc = await fetchArticleData<SanityArticleDoc | null>(ARTICLE_BY_SLUG_QUERY, { slug });
    return doc ? mapArticle(doc) : undefined;
  } catch (error) {
    console.warn(`Failed to fetch article "${slug}" from Sanity:`, error);
    return undefined;
  }
});

/** Format an ISO date string, e.g. "Jun 2, 2026". */
export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
