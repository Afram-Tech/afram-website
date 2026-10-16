# How the Insights news feed works

The Insights page (`/insights`) has two parts:

1. **Articles** — written by the Afram team in Sanity. Unchanged by this
   feature; see [`sanity-cms.md`](./sanity-cms.md).
2. **"Property & land news in Ghana"** — real estate, land and housing
   stories pulled automatically from Ghanaian news sites' public RSS feeds.
   Clicking one opens the full story in a side drawer, the "reader", where
   visitors can move through every story without leaving Afram. This doc
   covers that second part.

> **Before this goes live:** the reader shows publishers' full articles,
> text and images, on afram.co. That's republishing their content, so it
> needs written permission from MyJoyOnline and The High Street Journal (and
> a check of the government sites' terms for the two official feeds), or
> a content licence. Until then, set `READ_IN_DRAWER = false` in
> [`news.ts`](../src/features/landing/data/news.ts). See
> [What we show](#what-we-show-and-the-switch).

There are no API keys, accounts or environment variables involved. The
"APIs" are the publishers' own public RSS feeds. For the full catalogue of
sources (in use, candidates and paid APIs) and their data points, see
[`news-sources.md`](./news-sources.md).

## The flow

```
/insights (server component, re-rendered at most once an hour)
  │
  ├─ getArticlesFresh()      → Sanity articles (existing, unchanged)
  │
  └─ getPropertyNews()       → src/features/landing/data/news.ts
        │
        ├─ for every feed URL in NEWS_SOURCES (17 feeds), in parallel:
        │     fetch  https://<site>/tag/<tag>/feed/  (publishers)
        │            https://mlnr.gov.gh/feed/, https://www.lc.gov.gh/category/news/feed/
        │       • cached by Next.js for 1 hour
        │       • 8-second timeout; a failed or slow feed is skipped
        │     parseRss(xml)  → src/lib/rss.ts
        │       • keeps title, link, publish date, categories, summary,
        │         author, featured image and the article HTML
        │       • drops any item without a valid date or http(s) link
        │
        ├─ mergeNews()
        │     • the same story under several tags counts once
        │       (matched on domain + path, ignoring "www." and query strings)
        │     • sorted newest first
        │
        └─ first 12 stories
              │  only these have their article HTML turned into safe
              │  blocks → src/lib/article-blocks.ts
              ▼
        <NewsReader> → src/features/landing/news/NewsReader.tsx
          │  (or plain <NewsHeadlines> when READ_IN_DRAWER is false)
          ├─ a card per story: source · date, headline, "Read story · 2 min →"
          │    • each card is still a real link to the publisher, so
          │      crawlers, Ctrl/⌘-click and middle-click open the original
          │    • a plain click opens the story in the drawer instead
          └─ <Drawer> → src/components/ui/drawer/Drawer.tsx
               └─ <NewsStory> → src/features/landing/news/NewsStory.tsx
                    • typeset as news: kicker, serif headline, standfirst,
                      byline, full-width lead photo, drop cap, end mark
                    • a source note with "Read the original ↗";
                      "More stories" (next 3)
```

## The reader drawer

- **Opening:** clicking a card opens the drawer on that story. Pressing
  Enter on a focused card does the same. The URL doesn't change.
- **Moving between stories:** the ‹ › buttons in the header, the ← → keys,
  or the numbered "More stories" list at the bottom. The header shows the position
  ("6 of 12"). Each new story starts scrolled to the top, with focus on its
  heading so screen readers announce it.
- **Leaving:** the × button, Escape, or clicking the dimmed page. Focus
  returns to the card that opened the drawer. The ↗ button in the header,
  and "Read on <source>" at the end of each story, open the original in a
  new tab.
- **Layout:** full width on phones; on wider screens a square-cornered
  680px panel sliding in from the right, over a blurred backdrop. While it's open the page
  behind doesn't scroll and can't be tabbed into. With reduced motion
  turned on there's no slide animation.
- **Typesetting:** each story reads like a news article:
  - the publisher as a kicker, then the headline in Source Serif 4 (loaded
    only for the reader, through `news/fonts.ts`; the rest of the site
    stays Montserrat);
  - a standfirst, which is the feed's summary, shown only when it isn't
    just the opening paragraph again;
  - a byline row between rules (author, date, reading time);
  - a full-width lead photo credited to the publisher;
  - serif body text with a drop cap, pull-quote styling, captioned
    inline photos and an end mark;
  - then the source note and a numbered "More stories" list.
- **Stories without a body** (a feed item with no `content:encoded`) show
  their summary and the "Read on" link. Their cards link straight out.
- **Search engines:** the story text only reaches the browser inside the
  page's data; it isn't in the HTML Google indexes, and the drawer is
  marked `data-nosnippet`, so publishers' articles can't appear in results
  as Afram content.

### How article HTML is made safe

Publisher HTML is never rendered as HTML. `parseArticleHtml()` in
[`src/lib/article-blocks.ts`](../src/lib/article-blocks.ts) turns it into
plain data, and React renders that data:

- **Kept:** paragraphs, headings, quotes, bulleted and numbered lists,
  figures with captions, and inline bold, italic and line breaks.
- **Links:** kept only when they point to `http(s)`. They open in a new tab
  with `rel="noopener noreferrer nofollow"`.
- **Images:** kept only over `https`. They're loaded from the publisher's
  server with `referrerPolicy="no-referrer"` and hidden if they fail.
- **Dropped:** everything else, along with its contents. That includes
  scripts, styles, iframes, embeds, SVG, forms, buttons, video, audio, every
  attribute (`class`, `style`, `onclick`…) and every `javascript:` URL.

Checked against the live feeds in October 2026, all 24 recent articles from
both publishers converted cleanly (paragraphs, headings, lists, quotes,
inline images and links).

## The files

- [`src/lib/rss.ts`](../src/lib/rss.ts) — a small RSS 2.0 reader for
  WordPress feeds. It isn't a general XML parser: it pulls out only the
  fields we use and drops anything it can't read cleanly. No new
  dependency was added for it.
- [`src/lib/article-blocks.ts`](../src/lib/article-blocks.ts) — turns an
  article's HTML into safe blocks, and estimates reading time.
- [`src/features/landing/data/news.ts`](../src/features/landing/data/news.ts) —
  the list of sources and tags (`NEWS_SOURCES`), the fetching, the
  merging, and the `READ_IN_DRAWER` switch. This is the file to edit when
  adding or removing a feed.
- [`src/features/landing/NewsHeadlines.tsx`](../src/features/landing/NewsHeadlines.tsx) —
  the headline cards.
- [`src/features/landing/news/NewsReader.tsx`](../src/features/landing/news/NewsReader.tsx) —
  the cards plus the drawer: which story is open, the header, and the
  arrow keys.
- [`src/features/landing/news/NewsStory.tsx`](../src/features/landing/news/NewsStory.tsx) —
  one story in the drawer.
- [`src/components/ui/drawer/Drawer.tsx`](../src/components/ui/drawer/Drawer.tsx) —
  the reusable side drawer. It shares focus trapping, scroll locking and
  page inerting with the Modal through
  [`useModalBehaviour.ts`](../src/components/ui/modal/useModalBehaviour.ts).
- [`src/app/insights/page.tsx`](../src/app/insights/page.tsx) — fetches
  articles and news together and renders the news section below the
  articles.
- [`tests/unit/news.test.ts`](../tests/unit/news.test.ts) — tests for the
  feed parser, the article-block converter and the merge step.

## The feeds used

The two publishers are read through WordPress tag feeds, in the form
`https://<site>/tag/<tag>/feed/`. The two official sources are read from a
single full feed URL each.

| Source                                                       | Tags read                                                                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| MyJoyOnline (`https://www.myjoyonline.com`)                  | `real-estate`, `land`, `lands-commission`, `housing`, `property`, `mortgage`, `affordable-housing`, `land-guards` |
| The High Street Journal (`https://thehighstreetjournal.com`) | `real-estate`, `land`, `lands-commission`, `housing`, `property`, `affordable-housing`, `land-guards`             |

| Official source                       | Feed                                        | Filter                                                                                                       |
| ------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Ministry of Lands & Natural Resources | `https://mlnr.gov.gh/feed/`                 | `keywords`: about half its posts are mining or forestry, so only land/property titles or categories are kept |
| Lands Commission                      | `https://www.lc.gov.gh/category/news/feed/` | None. The news category only, because the main feed is mostly deed-registration notices                      |

That's 17 feed requests per refresh. Each MyJoyOnline tag feed returns up to
50 stories, each High Street Journal feed up to 10, and the ministry's feed
10 before filtering. The Lands Commission posts rarely, so it adds a story
every few months.

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

## What we show, and the switch

`READ_IN_DRAWER` in [`news.ts`](../src/features/landing/data/news.ts)
decides how much of a publisher's story Afram shows.

| `READ_IN_DRAWER` | Cards                                                 | What reaches the browser                                                                          |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `true` (current) | Open the full story in the reader drawer              | Headline, source, date, link, summary, author, featured image and the full article text as blocks |
| `false`          | Link straight to the publisher ("Read on <source> ↗") | Headline, source, date and link only                                                              |

**Copyright.** Publishers put the full text in their RSS feeds so feed
readers can show it to their own subscribers. That doesn't make it free for
another commercial website to republish. Linking to a headline is
generally fine; showing the whole article on afram.co, even with credit and
a link back, needs the publisher's permission. Until MyJoyOnline and The
High Street Journal have agreed in writing, keep the switch `false` in
production. Turning it off needs no other change: the drawer isn't
rendered, and no article text or images are fetched into the page.

Every story in the drawer names its publisher and date and links to the
original. Links use `target="_blank" rel="noopener noreferrer"`.

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

2. Add the feed to `NEWS_SOURCES` in
   [`news.ts`](../src/features/landing/data/news.ts): a new tag slug in a
   `tagFeeds(origin, [...])` list, or a new source with its `name` and
   full `feeds` URLs.
3. If the feed mixes property news with other topics (like the Ministry
   of Lands, which also covers mining and forestry), give the source
   `keywords`. Only items whose title or categories contain one of them —
   as whole words, any case — are kept, so "land" doesn't match
   "Lands Minister" or "landmark".
4. To show more or fewer than 12 stories, change the `limit` passed to
   `getPropertyNews()` (its default is 12).

For other sources, see [`news-sources.md`](./news-sources.md). It
covers every Ghanaian outlet and news API we've checked, with the data
points each one returns, and lists which feeds are blocked or stale.

## Testing

```sh
npx vitest run tests/unit/news.test.ts
```

This covers:

- reading title, link, date, categories, summary, author, featured image
  and article HTML, including CDATA and HTML entities like `&#8217;`;
- turning article HTML into blocks, and stripping scripts, iframes,
  `javascript:` links and non-https images;
- inline bold, italic and line breaks, and reading-time estimates;
- parsing article bodies only for the stories actually shown, and dropping
  a lead image that repeats the featured image;
- dropping items with no date or a non-http link;
- returning nothing (not crashing) for a non-feed page;
- leaving a malformed entity as-is instead of throwing;
- de-duplicating the same story across tags and URL variants, sorted
  newest first.

To see live output, run the dev server and open `/insights`. The news
section is below the articles; click a story to open the reader.

## Other sources and paid APIs

[`news-sources.md`](./news-sources.md) catalogues every other feed and news
API considered: the Ministry of Lands and Lands Commission feeds, GDELT, and
paid APIs (GNews, World News API, NewsData.io, Mediastack, NewsAPI.org).
For each it lists cost, Ghana coverage and the exact fields returned.
