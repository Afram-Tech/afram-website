import { cache } from "react";

import { parseArticleHtml, readingMinutes, type ArticleBlock } from "@/lib/article-blocks";
import { parseRss, type RssItem } from "@/lib/rss";

/**
 * Property and land headlines from Ghanaian publishers, read from their
 * public RSS feeds — shown beside (not instead of) the Afram team's own
 * Insights articles, which still come from Sanity.
 *
 * When `READ_IN_DRAWER` is on, the full story (text and images from the
 * feed) is shown in a drawer on /insights, credited to and linking back to
 * the publisher. That republishes the publisher's content, so it needs
 * their permission; with the flag off the cards show the headline, source,
 * date, the publisher's cover image (credited, loaded from their server) and
 * an outbound link, and no article text is sent to the browser. See
 * docs/insights-news.md.
 *
 * Each publisher's *tag* feeds are used rather than its main feed or a
 * search feed: the main feeds are general news (football, education…), and
 * MyJoyOnline's search feed ignores the search term. Tags are the
 * publishers' own editorial labels, so what comes back is on-topic without
 * any keyword guessing on our side. "rent" and "construction" were tried
 * and left out — they pull in rent allowances and producer-price stories.
 */

/** Show full stories in the /insights drawer instead of linking out. */
export const READ_IN_DRAWER = true;

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  /** ISO 8601. */
  publishedAt: string;
  summary?: string;
  author?: string;
  image?: string;
  /** The story as safe blocks; empty when the feed carried no body or
   *  `READ_IN_DRAWER` is off. */
  body: ArticleBlock[];
  readMinutes?: number;
}

/** Article blocks for one item, minus a leading copy of the featured image. */
function storyBody(item: RssItem): ArticleBlock[] {
  if (!READ_IN_DRAWER || !item.html) return [];
  const blocks = parseArticleHtml(item.html);
  const first = blocks[0];
  return first?.type === "image" && first.src === item.image ? blocks.slice(1) : blocks;
}

interface NewsSource {
  name: string;
  /** Full RSS feed URLs; see `tagFeeds` for WordPress tag feeds. */
  feeds: string[];
  /** When set, only items whose title or categories contain one of these
   *  words or phrases (whole words, any case) are kept — for feeds that mix
   *  property news with other topics. */
  keywords?: string[];
}

/** WordPress tag feeds: `${origin}/tag/<slug>/feed/` for each slug. */
function tagFeeds(origin: string, tags: string[]): string[] {
  return tags.map((tag) => `${origin}/tag/${tag}/feed/`);
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: "MyJoyOnline",
    feeds: tagFeeds("https://www.myjoyonline.com", [
      "real-estate",
      "land",
      "lands-commission",
      "housing",
      "property",
      "mortgage",
      "affordable-housing",
      "land-guards",
    ]),
  },
  {
    name: "The High Street Journal",
    // No "mortgage" tag on this site (its feed is empty).
    feeds: tagFeeds("https://thehighstreetjournal.com", [
      "real-estate",
      "land",
      "lands-commission",
      "housing",
      "property",
      "affordable-housing",
      "land-guards",
    ]),
  },
  {
    name: "Ministry of Lands & Natural Resources",
    feeds: ["https://mlnr.gov.gh/feed/"],
    // Half the ministry's posts are about mining and forestry. Matching is
    // whole-word, so "Lands Minister" alone doesn't count as land news.
    keywords: [
      "land",
      "lands commission",
      "stool lands",
      "housing",
      "property",
      "real estate",
      "mortgage",
      "lease",
      "land title",
      "land registration",
    ],
  },
  {
    name: "Lands Commission",
    // The news category only — the main feed is mostly deed-registration
    // notices. The bare lc.gov.gh host redirects here.
    feeds: ["https://www.lc.gov.gh/category/news/feed/"],
  },
];

/** Whether an item mentions one of `keywords` in its title or categories. */
export function matchesKeywords(item: RssItem, keywords: string[]): boolean {
  const haystack = [item.title, ...item.categories].join(" | ");
  return keywords.some((keyword) =>
    new RegExp(`\\b${keyword.replace(/ /g, "\\s+")}\\b`, "i").test(haystack),
  );
}

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

/** The displayed story for one feed item; the article body is parsed here,
 *  so only for stories that are actually shown. */
function toNewsItem(source: string, item: RssItem): NewsItem {
  const body = storyBody(item);
  return {
    title: item.title,
    url: item.link,
    source,
    publishedAt: item.publishedAt,
    body,
    // The cover image shows on the cards either way, loaded from the
    // publisher's own server and credited to them.
    image: item.image,
    ...(READ_IN_DRAWER && {
      summary: item.summary,
      author: item.author,
      ...(body.length > 0 && { readMinutes: readingMinutes(body) }),
    }),
  };
}

/** Merges per-feed results into one newest-first, de-duplicated list of
 *  the first `limit` stories. */
export function mergeNews(
  feeds: { source: string; items: RssItem[] }[],
  limit = Infinity,
): NewsItem[] {
  const byKey = new Map<string, { source: string; item: RssItem }>();
  for (const { source, items } of feeds) {
    for (const item of items) {
      const key = storyKey(item.link);
      if (!byKey.has(key)) byKey.set(key, { source, item });
    }
  }
  return [...byKey.values()]
    .sort((a, b) => b.item.publishedAt.localeCompare(a.item.publishedAt))
    .slice(0, limit)
    .map(({ source, item }) => toNewsItem(source, item));
}

/** Every configured feed, fetched in parallel; deduped per request. */
export const getPropertyNews = cache(async function getPropertyNews(
  limit = 12,
): Promise<NewsItem[]> {
  const feeds = await Promise.all(
    NEWS_SOURCES.flatMap(({ name, feeds, keywords }) =>
      feeds.map(async (url) => {
        const items = await fetchFeed(url);
        return {
          source: name,
          items: keywords ? items.filter((item) => matchesKeywords(item, keywords)) : items,
        };
      }),
    ),
  );
  return mergeNews(feeds, limit);
});
