# Property & land news sources for Ghana

A catalogue of every source we use, or could use, for property, land and
housing news in Ghana. For each one it lists the endpoint, what it costs,
how much it returns, and the exact data points in each item.

How the news section uses these feeds (fetching, caching, merging, display)
is covered in [`insights-news.md`](./insights-news.md). This document is
the reference for choosing and adding sources.

**Last checked: 13 October 2026.** Every RSS feed below was requested from
a developer machine with the same headers the site sends
(`User-Agent: AframBot/1.0 (+https://afram.co) news headlines`). Item
counts and date ranges are what each feed returned that day. Prices and
limits for the paid APIs are from the providers' pages and third-party
listings; confirm them before subscribing.

## At a glance

| Source                                                                         | Type               | Cost                      | Status                  | Used today               |
| ------------------------------------------------------------------------------ | ------------------ | ------------------------- | ----------------------- | ------------------------ |
| [MyJoyOnline](#myjoyonline)                                                    | RSS (tag feeds)    | Free                      | Working                 | **Yes**, 8 tags          |
| [The High Street Journal](#the-high-street-journal)                            | RSS (tag feeds)    | Free                      | Working                 | **Yes**, 7 tags          |
| [Ministry of Lands & Natural Resources](#ministry-of-lands--natural-resources) | RSS                | Free                      | Working                 | No, recommended next     |
| [Lands Commission](#lands-commission)                                          | RSS                | Free                      | Working, rarely updated | No, worth adding         |
| [Daily Guide](#daily-guide)                                                    | RSS (tag feed)     | Free                      | Working, sparse         | No                       |
| [Graphic Online](#graphic-online)                                              | RSS (section feed) | Free                      | Working, off-topic      | No, needs keyword filter |
| [3News](#3news)                                                                | RSS (main feed)    | Free                      | Working, off-topic      | No, needs keyword filter |
| [Bank of Ghana](#bank-of-ghana)                                                | RSS                | Free                      | Working                 | No, context only         |
| [GDELT DOC 2.0](#gdelt-doc-20)                                                 | JSON/RSS API       | Free, no key              | Rate-limited            | No                       |
| [World News API](#world-news-api)                                              | JSON API           | From $39/month            | Not tested              | No                       |
| [GNews](#gnews)                                                                | JSON API           | From €49.99/month         | Not tested              | No                       |
| [NewsData.io](#newsdataio)                                                     | JSON API           | From $199.99/month        | Not tested              | No                       |
| [Mediastack](#mediastack)                                                      | JSON API           | From $24.99/month         | Not tested              | No                       |
| [NewsAPI.org](#newsapiorg)                                                     | JSON API           | $449/month                | Not tested              | No                       |
| [Google News RSS](#google-news-rss)                                            | RSS search         | Free, non-commercial only | Working                 | **Not allowed** for us   |
| [Bing News Search](#bing-news-search)                                          | JSON API           | —                         | **Retired 11 Aug 2025** | No                       |

## RSS data points

All the RSS sources are RSS 2.0. Most are WordPress sites, so they share
the same core fields. The table lists every field seen in the feeds, and
whether our parser ([`src/lib/rss.ts`](../src/lib/rss.ts)) reads it.

| Field                                          | What it holds                                                          | Example                                        | We read it                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| `title`                                        | Headline, often in CDATA with HTML entities                            | `Ghana Begins Review of 1999 Land Policy…`     | **Yes**                                    |
| `link`                                         | Article URL                                                            | `https://mlnr.gov.gh/…`                        | **Yes**                                    |
| `pubDate`                                      | Publish time, RFC 822                                                  | `Thu, 08 Oct 2026 19:32:03 +0000`              | **Yes** (as ISO 8601)                      |
| `category`                                     | Publisher's categories and tags, one element each                      | `National`, `Legal Insights`                   | **Yes** (kept for debugging, not shown)    |
| `guid`                                         | Stable ID, usually the WordPress post URL                              | `https://www.myjoyonline.com/?p=10033191026`   | No                                         |
| `dc:creator`                                   | Author name                                                            | `Ernest Arhinful`                              | Yes (reader drawer)                        |
| `author`                                       | Author, as `email (Name)` (3News only)                                 | `evans.effah@mg.com.gh (Evans Effah)`          | No                                         |
| `description`                                  | Excerpt, sometimes with HTML                                           | —                                              | Yes (summary, when there's no body)        |
| `content:encoded`                              | Full article HTML                                                      | —                                              | Yes (as safe blocks; see insights-news.md) |
| `media:content`                                | Featured image: `url`, `type`, `medium` attributes                     | `…/uploads/2026/10/MA-…-1024x925.jpg`          | Yes (featured image)                       |
| `media:description`                            | Caption for `media:content`                                            | —                                              | No                                         |
| `media:thumbnail`                              | Featured image URL (`url` attribute)                                   | `https://i0.wp.com/thehighstreetjournal.com/…` | Yes (featured image)                       |
| `enclosure`                                    | Attached media: image (3News), audio or video (some MyJoyOnline posts) | —                                              | Images only (featured image)               |
| `post-id`                                      | WordPress post ID (The High Street Journal only)                       | `146622`                                       | No                                         |
| `comments`, `wfw:commentRss`, `slash:comments` | Comments page URL, comments feed URL, comment count                    | —                                              | No                                         |

With `READ_IN_DRAWER` on, the /insights reader drawer shows the full
story: text, images, author and summary. That content belongs to the
publishers, and showing it needs their permission. See
[`insights-news.md`](./insights-news.md#what-we-show-and-the-switch).

## Sources in use

### MyJoyOnline

- **Site:** <https://www.myjoyonline.com>, Ghana's largest news site (Multimedia Group).
- **Endpoint pattern:** `https://www.myjoyonline.com/tag/<tag>/feed/`
- **Auth / cost:** none / free.
- **Max items per feed:** 50.
- **Fields:** `title`, `link`, `guid`, `pubDate`, `dc:creator`, `category`
  (several per item), `description`, `content:encoded`, `media:content`,
  `media:description`, `comments`, `wfw:commentRss`, `slash:comments`.
  Posts with embedded audio or video also carry `enclosure`,
  `media:thumbnail`, `media:player`, `media:title` and `media:rating`.

| Tag                  | Items | Oldest → newest         | Notes                     |
| -------------------- | ----- | ----------------------- | ------------------------- |
| `real-estate`        | 50    | 2021-09-23 → 2026-06-30 |                           |
| `land`               | 47    | 2020-03-18 → 2026-09-28 |                           |
| `lands-commission`   | 50    | 2022-04-22 → 2026-08-12 |                           |
| `housing`            | 50    | 2020-06-05 → 2026-10-08 | Most active               |
| `property`           | 9     | 2023-04-09 → 2026-09-11 |                           |
| `mortgage`           | 14    | 2020-03-23 → 2026-09-04 |                           |
| `affordable-housing` | 18    | 2020-01-25 → 2025-10-16 | No new stories for a year |
| `land-guards`        | 40    | 2020-02-19 → 2026-09-16 |                           |

### The High Street Journal

- **Site:** <https://thehighstreetjournal.com>, a Ghanaian business newspaper.
- **Endpoint pattern:** `https://thehighstreetjournal.com/tag/<tag>/feed/`
- **Auth / cost:** none / free.
- **Max items per feed:** 10.
- **Fields:** `title`, `link`, `guid`, `pubDate`, `dc:creator`, `category`,
  `description`, `content:encoded`, `media:thumbnail` (a Jetpack CDN
  image URL), `post-id`. A few posts also carry the comment fields.

| Tag                  | Items | Oldest → newest         | Notes       |
| -------------------- | ----- | ----------------------- | ----------- |
| `real-estate`        | 10    | 2025-12-15 → 2026-08-23 |             |
| `land`               | 10    | 2026-02-23 → 2026-09-15 |             |
| `lands-commission`   | 4     | 2025-11-14 → 2026-09-15 |             |
| `housing`            | 10    | 2025-12-03 → 2026-09-03 |             |
| `property`           | 2     | 2026-01-21 → 2026-06-01 | Very sparse |
| `affordable-housing` | 9     | 2025-03-15 → 2026-10-05 |             |
| `land-guards`        | 1     | 2026-04-16              | Very sparse |

There's no `mortgage` tag: its feed is empty.

## Free sources not yet used

Every source in this section returned a valid feed with our headers.

Our fetcher currently builds URLs as `<origin>/tag/<tag>/feed/`. Only Daily
Guide fits that pattern. The others need `NEWS_SOURCES` in
[`news.ts`](../src/features/landing/data/news.ts) to accept full feed URLs,
and the off-topic ones also need a keyword filter on the headline.

### Ministry of Lands & Natural Resources

- **Feed:** `https://mlnr.gov.gh/feed/`
- **Auth / cost:** none / free.
- **Result:** 10 items, 2026-08-17 → 2026-10-08.
- **Fields:** `title`, `link`, `guid`, `pubDate`, `dc:creator`, `category`
  (for example `News and Updates`), `description`, `content:encoded`, and
  comment fields. There's no featured-image field; images are only inside
  `content:encoded`.
- **Fit:** official land-policy news, for example "Ghana Begins Review of
  1999 Land Policy to Shape Modern Land Governance". The ministry also
  covers mining and forestry, so only 5 of the 10 items were about land.
  **Use with a keyword filter.**

### Lands Commission

- **News feed:** `https://lc.gov.gh/category/news/feed/`: 10 items,
  2025-06-10 → 2026-04-17. Official announcements. Useful, but posted
  only every few months.
- **All posts:** `https://lc.gov.gh/feed/`: 10 items, 2026-07-06 →
  2026-07-24. Almost all are formal "Notice of application for deeds
  registration" notices under the Land Act, 2020 (Act 1036), one per
  region. **Not news; don't use for the headlines section.** They could
  matter for a future title-monitoring feature.
- **Auth / cost:** none / free.
- **Fields:** `title`, `link`, `guid`, `pubDate`, `dc:creator`, `category`
  (`Articles`, `LRD Publications`), `description`, `content:encoded`, and
  comment fields. No featured-image field.

### Daily Guide

- **Feed:** `https://dailyguidenetwork.com/tag/real-estate/feed/`. It fits
  the current `/tag/` pattern.
- **Auth / cost:** none / free.
- **Result:** only 4 items, 2021-04-07 → 2026-07-07.
- **Fields:** `title`, `link`, `guid`, `pubDate`, `dc:creator`, `category`,
  `description`, `content:encoded`.
- **Other tags:** `land` and `housing` return 404. `lands-commission`
  works, but its latest story is from July 2025.

### Graphic Online

- **Feed:** `https://www.graphic.com.gh/business/business-news.feed?type=rss`.
  This is a Joomla section feed, not a WordPress tag feed.
- **Auth / cost:** none / free.
- **Result:** 25 items, all from the past week (2026-10-06 → 2026-10-13),
  but **none** were about land or property. It's general business news.
- **Fields:** `title`, `link`, `guid`, `pubDate`, `category`
  (`Business News`), `description` (HTML that includes an `<img>`). No
  author or `content:encoded`.
- **Fit:** only with a strict headline keyword filter, and expect low
  yield. Graphic also has `/news/general-news.feed?type=rss` (20 items)
  and `/features/features.feed?type=rss` (25 items).

### 3News

- **Feed:** `https://3news.com/feed/`. The tag feeds return no items.
- **Auth / cost:** none / free.
- **Result:** 50 items covering about one day, with 1 of the 50 about
  property ("Tackling Ghana's rent advance crisis…").
- **Fields:** `title`, `link`, `guid`, `pubDate` (GMT), `category`,
  `description`, `author` (`email (Name)`), `enclosure` (a 1200px image).
- **Fit:** only with a keyword filter. High volume, very low yield.

### Bank of Ghana

- **Feed:** `https://www.bog.gov.gh/news/feed/`
- **Auth / cost:** none / free.
- **Result:** 10 items, 2026-09-25 → 2026-10-13.
- **Fields:** `title`, `link`, `guid`, `pubDate`, `dc:creator`,
  `description`, `content:encoded`, and `category` on 6 of the 10 items.
- **Fit:** not property news. Only useful for mortgage and interest-rate
  context, such as policy-rate decisions.

## Sources that don't work

Checked on 13 October 2026.

| Source                  | URLs tried                                              | Result                                                  |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| Citi Newsroom           | `/feed/`, `/tag/land/feed/`, `/category/business/feed/` | Returns an HTML page instead of a feed (bot protection) |
| B&FT (thebftonline.com) | `/feed/`, `/tag/*/feed/`, `/category/real-estate/feed/` | 404                                                     |
| Ghana News Agency       | `/tag/{land,real-estate,housing}/feed/`                 | 404. `/category/business/feed/` works but had 1 item.   |
| Modern Ghana            | `/rssfeed/business.xml`                                 | 403                                                     |
| Asaase Radio            | `/tag/land/feed/`                                       | 403                                                     |
| News Ghana              | `/tag/*/feed/`                                          | 403                                                     |
| GhanaWeb                | `/GhanaHomePage/business/rss.xml`                       | 200 but empty                                           |
| Ghanaian Times          | `/tag/{land,housing}/feed/`                             | Works, but the latest item is from 2019                 |
| The Ghana Report        | `/tag/*/feed/`                                          | 404                                                     |
| BusinessGhana           | `/site/rss/news`                                        | 404                                                     |
| Norvan Reports          | `/tag/real-estate/feed/`                                | Works, but the latest item is from October 2025         |

A 403 means the site blocks automated requests. It would very likely block
our Cloudflare servers too, so these aren't worth retrying with a different
user agent.

## News search APIs

These index many publishers at once, so one request can cover outlets we
can't read through RSS. All except GDELT need an API key, which would be
stored as an environment variable. Any of them could replace or supplement
the RSS feeds behind `getPropertyNews()` without changing the page.

### GDELT DOC 2.0

- **Endpoint:** `https://api.gdeltproject.org/api/v2/doc/doc`
- **Auth / cost:** none / free.
- **Example:**
  `?query=("real estate" OR "lands commission" OR housing OR land) sourcecountry:ghana&mode=artlist&format=json&maxrecords=50&sort=datedesc`
  (URL-encode the query).
- **Ghana filter:** `sourcecountry:ghana` limits results to Ghanaian outlets.
- **Formats:** `json`, `rss`, `html`, `csv`.
- **Limits:** 75 results by default, up to 250 with `maxrecords`. Only the
  last 3 months are searchable. One request every 5 seconds per IP.
- **Fields (`mode=artlist`, JSON `articles[]`):** `url`, `url_mobile`,
  `title`, `seendate` (when GDELT saw it, not the publish time),
  `socialimage`, `domain`, `language`, `sourcecountry`.
- **Caveat:** six requests made 12 seconds apart on 13 Oct 2026 were all
  rejected with HTTP 429 ("Please limit requests to one every 5 seconds").
  The limit is per IP and unpredictable, and Cloudflare Workers share IPs.
  If used, fetch it from a scheduled job and cache the results; never call
  it on page render.

### World News API

- **Site:** <https://worldnewsapi.com>
- **Endpoint:** `GET https://api.worldnewsapi.com/search-news`
- **Auth:** API key.
- **Cost:** free plan with 50 points/day; paid from $39/month (500
  points/day). Whether the free plan allows commercial use wasn't confirmed.
- **Ghana filter:** `source-countries=gh`; `text=` for keywords.
- **Fields (`news[]`):** `id`, `title`, `text`, `summary`, `url`, `image`,
  `video`, `publish_date`, `authors`, `category`, `language`,
  `source_country`, `sentiment`.

### GNews

- **Site:** <https://gnews.io>
- **Endpoints:** `GET https://gnews.io/api/v4/search` and `/top-headlines`
- **Auth:** API key.
- **Cost:** the free plan (100 requests/day, 10 articles each, 12-hour
  delay) is **non-commercial only**. Essential costs €49.99/month
  (1,000 requests/day, up to 25 articles each).
- **Ghana filter:** `country=` parameter. Confirm Ghana is in its country list.
- **Fields (`articles[]`):** `id`, `title`, `description`, `content` (cut
  short unless on a paid plan with `expand=content`), `url`, `image`,
  `publishedAt` (UTC), `source.id`, `source.name`, `source.url`.

### NewsData.io

- **Site:** <https://newsdata.io>
- **Endpoint:** `GET https://newsdata.io/api/1/latest`
- **Auth:** API key.
- **Cost:** free plan with 200 credits/day; Basic $199.99/month (20,000
  credits), Professional $349.99/month, Corporate $1,299.99/month.
  Whether the free plan allows commercial use couldn't be confirmed.
- **Ghana filter:** `country=gh`. Confirm on their country list.
- **Fields:** not confirmed. Their docs page renders with JavaScript and
  couldn't be read when this was written. Third-party client libraries list
  title, description, content, link, image, video, publish date, countries,
  categories, author, `source_id` and language. Check
  <https://newsdata.io/documentation> for the exact names before coding
  against it.

### Mediastack

- **Site:** <https://mediastack.com>
- **Endpoint:** `GET http://api.mediastack.com/v1/news`
- **Auth:** `access_key` parameter.
- **Cost:** the free plan (100 requests/month) is not for production.
  Standard costs $24.99/month (10,000 calls) and includes commercial use;
  Business costs $249.99/month.
- **Ghana filter:** `countries=` parameter. It covers 50+ countries;
  **Ghana not confirmed**.
- **Fields (`data[]`):** `author`, `title`, `description`, `url`, `source`,
  `image`, `category`, `language`, `country`, `published_at`.

### NewsAPI.org

- **Site:** <https://newsapi.org>
- **Endpoint:** `GET https://newsapi.org/v2/everything`
- **Auth:** API key.
- **Cost:** the Developer plan is development and testing only, with a
  24-hour delay. Business costs $449/month.
- **Ghana filter:** none confirmed. Its source list is weak on Ghanaian
  outlets.
- **Fields (`articles[]`):** `source.id`, `source.name`, `author`, `title`,
  `description`, `url`, `urlToImage`, `publishedAt`, `content` (cut short).

### Google News RSS

- **Endpoint:**
  `https://news.google.com/rss/search?q=<query>&hl=en-GH&gl=GH&ceid=GH:en`
- **Result:** works well. A query for `("Lands Commission" OR "real estate"
OR housing) Ghana` returned 100 recent items.
- **Fields:** `title`, `link` (a Google redirect), `guid`, `pubDate`,
  `description`, `source` (publisher name and URL).
- **Why we don't use it:** Google restricts these feeds to personal,
  non-commercial use. Afram is a commercial site.

### Bing News Search

Microsoft **retired** all Bing Search APIs, including News, on
**11 August 2025**. Don't use it.

## Official land records (not news)

The Lands Commission runs online services through
<https://onlineservices.lc.gov.gh> and GELIS, the Ghana Enterprise Land
Information System. They offer the consolidated land search report,
application tracking, payments and a fee calculator. **There's no public
developer API.** Checking titles programmatically, for example for the
site's "Verify a title" feature, would need a formal data-sharing agreement
with the Commission.

## Re-checking a feed

Run this with the same headers the site uses. It prints the HTTP status,
item count and latest date:

```sh
curl -sL -A "AframBot/1.0 (+https://afram.co) news headlines" \
  -H "Accept: application/rss+xml, application/xml;q=0.9, */*;q=0.5" \
  -w "\nHTTP %{http_code}\n" "https://mlnr.gov.gh/feed/" \
  | grep -oE "<pubDate>[^<]*|HTTP [0-9]+" | head -3
```

Quote URLs that contain `?` in zsh, or the shell treats it as a wildcard.

## Sources

- GDELT DOC 2.0 API: <https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/>,
  field list via the `gdeltdoc` client: <https://pypi.org/project/gdeltdoc/>
- World News API: <https://worldnewsapi.com/docs/search-news/>,
  pricing via <https://www.saasworthy.com/product/world-news-api/pricing>
- GNews: <https://docs.gnews.io/json-response>,
  pricing via <https://geekflare.com/guides/global-news-api/>
- NewsData.io pricing: <https://www.capterra.com/p/266542/NewsDataio/pricing/>
- Mediastack: <https://mediastack.com/pricing>,
  <https://learn.microsoft.com/en-us/connectors/mediastack>
- NewsAPI.org: <https://newsapi.org/pricing>,
  <https://newsapi.org/docs/endpoints/everything>
- Google News RSS terms: <https://www.fullpress.it/?p=93938>
- Bing Search API retirement:
  <https://learn.microsoft.com/en-us/lifecycle/announcements/bing-search-api-retirement>
- Lands Commission online services:
  <https://citibusinessnews.com/2020/11/lands-commission-to-commence-online-services-on-november-9/>,
  <https://www.graphic.com.gh/news/general-news/lands-commission-to-commence-one-stop-verification-system.html>
