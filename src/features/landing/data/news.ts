import { cache } from "react";

import { parseRss, type RssItem } from "@/lib/rss";

/**
 * Property and land headlines from Ghanaian publishers, read from their
 * public RSS feeds — shown beside (not instead of) the Afram team's own
 * Insights articles, which still come from Sanity.
 *
 * Only the headline, source, date and a link to the original are ever
 * displayed: no article text or images are copied.
 *
 * Each publisher's *tag* feeds are used rather than its main feed or a
 * search feed: the main feeds are general news (football, education…), and
 * MyJoyOnline's search feed ignores the search term. Tags are the
 * publishers' own editorial labels, so what comes back is on-topic without
 * any keyword guessing on our side. "rent" and "construction" were tried
 * and left out — they pull in rent allowances and producer-price stories.
 */

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  /** ISO 8601. */
  publishedAt: string;
}

interface NewsSource {
  name: string;
  origin: string;
  /** WordPress tag slugs — each read from `${origin}/tag/<slug>/feed/`. */
  tags: string[];
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: "MyJoyOnline",
    origin: "https://www.myjoyonline.com",
    tags: [
      "real-estate",
      "land",
      "lands-commission",
      "housing",
      "property",
      "mortgage",
      "affordable-housing",
      "land-guards",
    ],
  },
  {
    name: "The High Street Journal",
    origin: "https://thehighstreetjournal.com",
    // No "mortgage" tag on this site (its feed is empty).
    tags: [
      "real-estate",
      "land",
      "lands-commission",
      "housing",
      "property",
      "affordable-housing",
      "land-guards",
    ],
  },
];

/** Feeds refresh at most hourly — polite to publishers, fresh enough for news. */
const REVALIDATE_SECONDS = 3600;
/** A slow or unreachable feed is skipped rather than holding up the page. */
const FEED_TIMEOUT_MS = 8000;

async function fetchFeed(url: string): Promise<RssItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AframBot/1.0 (+https://afram.co) news headlines",
        Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.5",
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseRss(await response.text());
  } catch (error) {
    console.warn(`Skipping news feed ${url}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

/** Same story under several tags (or with tracking params) collapses to one. */
function storyKey(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname.replace(/^www\./, "")}${pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/** Merges per-feed results into one newest-first, de-duplicated list. */
export function mergeNews(feeds: { source: string; items: RssItem[] }[]): NewsItem[] {
  const byKey = new Map<string, NewsItem>();
  for (const { source, items } of feeds) {
    for (const item of items) {
      const key = storyKey(item.link);
      if (!byKey.has(key)) {
        byKey.set(key, {
          title: item.title,
          url: item.link,
          source,
          publishedAt: item.publishedAt,
        });
      }
    }
  }
  return [...byKey.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Every configured feed, fetched in parallel; deduped per request. */
export const getPropertyNews = cache(async function getPropertyNews(
  limit = 12,
): Promise<NewsItem[]> {
  const feeds = await Promise.all(
    NEWS_SOURCES.flatMap((source) =>
      source.tags.map(async (tag) => ({
        source: source.name,
        items: await fetchFeed(`${source.origin}/tag/${tag}/feed/`),
      })),
    ),
  );
  return mergeNews(feeds).slice(0, limit);
});
