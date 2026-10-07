# How the Insights news feed works

The Insights page (`/insights`) has two parts:

1. **Articles** — written by the Afram team in Sanity. Unchanged by this
   feature; see [`sanity-cms.md`](./sanity-cms.md).
2. **"Property & land news in Ghana"** — headlines about real estate, land
   and housing, pulled automatically from Ghanaian news sites' public RSS
   feeds. This doc covers that second part.

There are no API keys, accounts or environment variables involved. The
"APIs" are the publishers' own public RSS feeds.

## The flow

```
/insights (server component, re-rendered at most once an hour)
  │
  ├─ getArticlesFresh()      → Sanity articles (existing, unchanged)
  │
  └─ getPropertyNews()       → src/features/landing/data/news.ts
        │
        ├─ for every source × tag in NEWS_SOURCES (15 feeds), in parallel:
        │     fetch  https://<site>/tag/<tag>/feed/
        │       • cached by Next.js for 1 hour
        │       • 8-second timeout; a failed or slow feed is skipped
        │     parseRss(xml)  → src/lib/rss.ts
        │       • keeps title, link, publish date (and categories)
        │       • drops any item without a valid date or http(s) link
        │
        ├─ mergeNews()
        │     • the same story under several tags counts once
        │       (matched on domain + path, ignoring "www." and query strings)
        │     • sorted newest first
        │
        └─ first 12 stories
              │
              ▼
        <NewsHeadlines> → src/features/landing/NewsHeadlines.tsx
          • a card per story: source · date, headline, "Read on <source> ↗"
          • links open the publisher's article in a new tab
          • the whole section is hidden if there are no stories
```

## The files

- [`src/lib/rss.ts`](../src/lib/rss.ts) — a small RSS 2.0 reader for
  WordPress feeds. It isn't a general XML parser: it pulls out only the
  fields we display and drops anything it can't read cleanly. No new
  dependency was added for it.
- [`src/features/landing/data/news.ts`](../src/features/landing/data/news.ts) —
  the list of sources and tags (`NEWS_SOURCES`), the fetching, and the
  merging. This is the file to edit when adding or removing a feed.
- [`src/features/landing/NewsHeadlines.tsx`](../src/features/landing/NewsHeadlines.tsx) —
  the headline cards.
- [`src/app/insights/page.tsx`](../src/app/insights/page.tsx) — fetches
  articles and news together and renders the news section below the
  articles.
- [`tests/unit/news.test.ts`](../tests/unit/news.test.ts) — tests for the
  parser and the merge step.

## The feeds used

All are WordPress tag feeds, in the form `https://<site>/tag/<tag>/feed/`.

| Source | Tags read |
|---|---|
| MyJoyOnline (`https://www.myjoyonline.com`) | `real-estate`, `land`, `lands-commission`, `housing`, `property`, `mortgage`, `affordable-housing`, `land-guards` |
| The High Street Journal (`https://thehighstreetjournal.com`) | `real-estate`, `land`, `lands-commission`, `housing`, `property`, `affordable-housing`, `land-guards` |

That's 15 feed requests per refresh. Each MyJoyOnline tag feed returns up to
50 stories and each High Street Journal feed up to 10.

### Why tag feeds

Tags are the publishers' own editorial labels, so what comes back is
already on topic and we don't have to guess with keywords. The other options
were tried (October 2026) and rejected:

- **Main feeds** (`/feed/`) are general news — football, education,
  politics — with property stories rare.
- **Search feeds** (`/?s=<term>&feed=rss2`): MyJoyOnline ignores the search
  term and returns its latest general news. The High Street Journal's work,
  but are ordered by relevance rather than date.
- **`rent` and `construction` tags** exist on both sites but pull in
  off-topic stories (rent allowances for public workers, producer-price
  index reports), so they're left out.
- **The High Street Journal's `mortgage` tag** returns an empty feed.

### How each request is made

- Header `User-Agent: AframBot/1.0 (+https://afram.co) news headlines`, so
  publishers can see who is reading their feed.
- Header `Accept: application/rss+xml, application/xml;q=0.9, */*;q=0.5`.
- `next: { revalidate: 3600 }`, so each feed is fetched at most once an hour
  no matter how many people visit the page.
- `AbortSignal.timeout(8000)`: a feed that takes longer than 8 seconds is
  skipped.
- On any failure (timeout, non-200 response, unreadable feed) that feed
  contributes nothing and a warning is logged:
  `Skipping news feed <url>: <reason>`.

## What we show, and why only that

Each story shows **only** the headline, the publisher's name, the publish
date, and a link to the original article. We don't copy any article text,
excerpt or image. RSS feeds are published for exactly this kind of
headline-and-link use, and showing no more than that keeps the publisher's
page as the place the story is actually read, which keeps us clear of
copyright problems. The feeds do contain full article text
(`content:encoded`) and excerpts (`description`), but the parser deliberately
never reads them.

Links use `target="_blank" rel="noopener noreferrer"`.

## Freshness and failure behaviour

- The `/insights` page is rebuilt at most once an hour (shown as
  `Revalidate 1h` in `next build` output). New headlines can take up to
  about an hour to appear.
- If some feeds fail, the rest still show.
- If every feed fails, the news section is hidden entirely. The articles
  above it are unaffected.
- If a publisher renames or deletes a tag, that tag's feed returns nothing
  or an error and is silently skipped. Nothing breaks, but stories from
  that tag stop appearing, so it's worth re-checking the feeds occasionally
  (see below).

## Adding or changing a feed

1. Check the feed returns stories, and that they're on topic:

   ```sh
   curl -sL -A "Mozilla/5.0" https://www.myjoyonline.com/tag/real-estate/feed/ \
     | grep -o '<title>[^<]*' | head
   ```

   An empty result usually means the tag doesn't exist on that site.
2. Add the tag slug (or a new source with its `name`, `origin` and `tags`)
   to `NEWS_SOURCES` in
   [`news.ts`](../src/features/landing/data/news.ts).
3. Only WordPress-style feeds at `/tag/<slug>/feed/` work as-is. A source
   whose feeds live somewhere else needs `getPropertyNews` changed to take
   a full feed URL instead of building one from `origin` + tag.
4. To show more or fewer than 12 stories, change the `limit` passed to
   `getPropertyNews()` (its default is 12).

### Sources that didn't work (October 2026)

- **Citi Newsroom** (`citinewsroom.com/feed/`) — blocks feed requests with
  a 403.
- **Graphic Online** and **GhanaWeb** — their usual feed addresses returned
  a page with no stories. Their feeds may have moved; worth retrying.

## Testing

```sh
npx vitest run tests/unit/news.test.ts
```

This covers:

- reading title, link, date and categories, including CDATA and HTML
  entities like `&#8217;`;
- dropping items with no date or a non-http link;
- returning nothing (not crashing) for a non-feed page;
- leaving a malformed entity as-is instead of throwing;
- de-duplicating the same story across tags and URL variants, sorted
  newest first.

To see live output, run the dev server and open `/insights`. The news
section is below the articles.

## Paid alternatives considered

If the RSS approach ever proves too thin, a paid news API with a Ghana
filter can replace the feeds behind `getPropertyNews()` without changing
the page. Pricing as checked in October 2026:

| Service | Cost for commercial use | Notes |
|---|---|---|
| [GNews](https://gnews.io/pricing) | €49.99/month (Essential) | Ghana filter, real-time, 1,000 requests/day. Free plan is non-commercial only. The cheapest legitimate paid option. |
| [NewsData.io](https://newsdata.io/blog/pricing-plan-in-newsdata-io/) | From $199.99/month | Ghana supported. Free tier has a 12-hour delay; whether it allows commercial use couldn't be confirmed on their own pages. |
| [NewsAPI.org](https://newsapi.org/pricing) | $449/month (Business) | Free plan is development-only. |
| Google News RSS | Free | Returns plenty of Ghana results, but its terms don't clearly allow commercial use, so it wasn't used. |

A paid API would need its key stored as an environment variable. The RSS
approach needs none.
