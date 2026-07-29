import type { PortableTextBlock } from "@portabletext/react";

import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { urlFor } from "@/sanity/lib/image";
import { ALL_ARTICLES_QUERY, ARTICLE_BY_SLUG_QUERY } from "@/sanity/lib/queries";

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
    slug: doc.slug,
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
    const docs = await client.fetch<SanityArticleDoc[]>(ALL_ARTICLES_QUERY);
    return docs.map(mapArticle);
  } catch (error) {
    console.warn("Failed to fetch Insights articles from Sanity:", error);
    return [];
  }
}

export async function findArticleBySlug(slug: string): Promise<Article | undefined> {
  if (!isSanityConfigured) return undefined;

  try {
    const doc = await client.fetch<SanityArticleDoc | null>(ARTICLE_BY_SLUG_QUERY, { slug });
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
