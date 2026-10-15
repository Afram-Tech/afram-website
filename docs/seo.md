# SEO

How afram.co is set up for search engines: what every page sends, the
structured data, the sitemap, the programmatic listing pages, performance,
and how to check it all. It also records the October 2026 audit, what it
fixed, and what's still open.

The site is a Next.js App Router app. Almost everything below is generated
from code, so the rule is: **change the helper, not the page**. Most pages
get their tags from [`src/lib/seo.ts`](../src/lib/seo.ts), and everything
about listings comes from [`src/lib/property-seo.ts`](../src/lib/property-seo.ts).

## Contents

- [Audit summary (October 2026)](#audit-summary-october-2026)
- [What every page sends](#what-every-page-sends)
- [Page inventory](#page-inventory)
- [Listing pages and listing collections](#listing-pages-and-listing-collections)
- [Structured data](#structured-data)
- [Sitemap](#sitemap)
- [robots.txt and indexing rules](#robotstxt-and-indexing-rules)
- [Performance (Core Web Vitals)](#performance-core-web-vitals)
- [Adding a new page](#adding-a-new-page)
- [How to check it](#how-to-check-it)
- [Open items needing a decision](#open-items-needing-a-decision)

## Audit summary (October 2026)

Every URL in the sitemap was crawled on a production build
(`next build && next start`), plus the map page and two 404 URLs. Each
page's HTML was checked for title, description, canonical, share tags,
`<h1>`, image alt text and structured data.

| Check (44 indexable pages)                     | Before                   | After       |
| ---------------------------------------------- | ------------------------ | ----------- |
| Titles over 60 characters (cut off in results) | 12                       | 0           |
| Descriptions over 160 characters               | 26                       | 0           |
| Descriptions under 70 characters               | 1                        | 0           |
| Pages without exactly one `<h1>`               | 1 (`/properties/map`)    | 0           |
| Pages without a canonical URL                  | 0                        | 0           |
| Pages without a share image                    | 0                        | 0           |
| Duplicate titles                               | 0                        | 0           |
| Invalid JSON-LD                                | 0                        | 0           |
| Sitemap URLs with a real `<lastmod>`           | 0 of 43 (all were "now") | 38 of 43    |
| Hero image (the largest above-the-fold image)  | 1.1 MB PNG               | 118 KB WebP |

### What the audit changed

1. **Description length.** `buildMetadata` now trims every description to
   160 characters at a word boundary (`clampDescription`). The home page
   has its own 142-character description, written to fit, and the privacy
   policy's was lengthened from 62 characters. Collection descriptions were
   rewritten to stay under 160 characters.
2. **Listing titles.** These used to be
   `"<headline> | <name> — Afram"`, up to 92 characters. `propertyTitle()`
   now keeps the name and the brand only while they fit in 60 characters,
   and drops them in that order. The search phrase is never the part that
   gets cut.
3. **"Single Unit" wording.** The API's catch-all types (`single unit`,
   `property` …) produced titles like "4 Bedroom Single Unit for Sale".
   They now read "4 Bedroom Home" (with bedrooms) or "Property" (without).
4. **Listings without a price** are no longer marked as a `Product`.
   Google treats a Product with no offer as invalid, so they're described
   only as the accommodation type.
5. **Sitemap dates** come from the listings' `updatedAt` (newly fetched
   from the API) and the articles' publish dates. Pages whose change date
   we don't know have no `<lastmod>`.
6. **robots.txt** now disallows `/api/`.
7. **`/properties/map`** is `noindex, follow` and has a visually hidden
   `<h1>`.
8. **404 page.** A new `app/not-found.tsx` has a real heading and links
   back into the listings. Before this, 404s sent two conflicting robots
   tags, because the root layout forced `index, follow` onto every page.
   That forced tag is gone, and 404s now send only `noindex`.
9. **Language.** `<html lang="en-GH">` and `og:locale` `en_GH` (was `en`).
10. **`WebSite` structured data** on the home page, which Google uses for
    the site name shown in results. The Organization data now has a stable
    `@id`, so other blocks can reference it, and a raster logo.
11. **Articles** use a shared `buildArticleJsonLd` with the writer as a
    `Person`, `mainEntityOfPage`, `dateModified` and a share image, plus
    breadcrumb data. A missing article is `noindex`.
12. **JSON-LD is escaped.** A `</script>` inside a listing description can
    no longer break out of the structured-data tag.
13. **Images.** The hero fallback is now `town-house-image.webp` (118 KB,
    was a 1.1 MB PNG). The SEC logo is now a 96 px PNG (5 KB, was 224 KB
    for a 30 px badge).

Unit tests for all of the above are in
[`tests/unit/seo.test.tsx`](../tests/unit/seo.test.tsx).

## What every page sends

All of it comes from `buildMetadata()` in [`src/lib/seo.ts`](../src/lib/seo.ts):

| Tag                                                                            | Value                                                                                             |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `<title>`                                                                      | `"<title> — Afram"` via the root layout's template, or just `<title>` when `absoluteTitle` is set |
| `<meta name="description">`                                                    | The description, trimmed to 160 characters                                                        |
| `<link rel="canonical">`                                                       | `https://afram.co<path>`, so query strings (filters, UTM tags) never create duplicate pages       |
| `og:title`, `og:description`, `og:url`, `og:site_name`, `og:type`, `og:locale` | Same title and description; locale `en_GH`                                                        |
| `og:image`                                                                     | The page's own images (a listing's photos, an article's cover), else `/opengraph.png` (1200×630)  |
| `twitter:card`                                                                 | `summary_large_image`, with the same title, description and image                                 |
| `<meta name="robots">`                                                         | Only on pages that set `noindex: true`: `noindex, follow`                                         |

The root layout ([`src/app/layout.tsx`](../src/app/layout.tsx)) adds
`metadataBase`, the title template, keywords, author, icons, the web
manifest, `<html lang="en-GH">`, and the site-wide Organization JSON-LD.

`buildMetadata` options:

| Option                         | Use                                                               |
| ------------------------------ | ----------------------------------------------------------------- |
| `title`, `description`, `path` | Required for every page; `path` drives the canonical and `og:url` |
| `images`                       | Page-specific share images                                        |
| `absoluteTitle`                | Skip the " — Afram" suffix, for titles already near 60 characters |
| `noindex`                      | Keep the page out of results but let crawlers follow its links    |

## Page inventory

| Route                                   | Title pattern                                                       | Indexed                    | Structured data                         | In sitemap                                              |
| --------------------------------------- | ------------------------------------------------------------------- | -------------------------- | --------------------------------------- | ------------------------------------------------------- |
| `/`                                     | Blockchain-Verified Real Estate Marketplace in Ghana — Afram        | Yes                        | Organization, WebSite                   | Yes; lastmod = newest listing                           |
| `/properties`                           | Houses & Apartments for Sale in Ghana — Afram                       | Yes                        | Organization                            | Yes; lastmod = newest listing                           |
| `/properties/[slug]`                    | "2 Bedroom Apartment for Sale in Adenta, Greater Accra" (see below) | Yes                        | Product + accommodation, BreadcrumbList | Yes, with listing photos; lastmod = listing `updatedAt` |
| `/properties/type/[type]`               | Apartments for Sale in Ghana — Afram                                | Yes                        | ItemList, BreadcrumbList                | Yes, only when the type has listings                    |
| `/properties/in/[location]`             | Properties for Sale in Adenta, Greater Accra — Afram                | Yes                        | ItemList, BreadcrumbList                | Yes, only when the location has listings                |
| `/properties/type/[type]/in/[location]` | Apartments for Sale in Kumasi, Ashanti — Afram                      | Yes                        | ItemList, BreadcrumbList                | Yes, only when the pair has listings                    |
| `/properties/map`                       | Browse Verified Properties — Map — Afram                            | **No** (`noindex, follow`) | Organization                            | No                                                      |
| `/developers`, `/financiers`            | Persona titles                                                      | Yes                        | FAQPage                                 | Yes; no lastmod                                         |
| `/how-it-works`, `/privacy-policy`      | Page name                                                           | Yes                        | Organization                            | Yes; no lastmod                                         |
| `/insights`                             | Insights — Guides & Market Data — Afram                             | Yes                        | Organization                            | Yes; lastmod = newest article                           |
| `/insights/[slug]`                      | Article title                                                       | Yes                        | Article, BreadcrumbList                 | Yes; lastmod = publish date                             |
| Unknown URL / `notFound()`              | Page not found — Afram                                              | **No**, HTTP 404           | —                                       | No                                                      |

## Listing pages and listing collections

These pages bring in most of the search traffic, so they get the most care.

### Listing pages (`/properties/[slug]`)

- **Slug:** `<listing-name>-<last 6 of id>`, e.g. `berry-house-333e4e`.
  It's stable for the listing's lifetime and readable.
- **Title:** `propertyTitle()` leads with the phrase buyers search,
  `"<beds> Bedroom <type> for Sale in <city>, <region>"`. It appends
  `" | <name>"` and `" — Afram"` only while the total is 60 characters or
  fewer. A sold listing says "Sold" instead of "for Sale".
- **Description:** `propertyDescription()` gives the name, type, location,
  price, baths and size, then "Title-verified, with flexible financing on
  Afram." The result is trimmed to 160 characters.
- **Share images:** up to the first 4 listing photos.
- **Breadcrumbs:** Home › Properties › region › district › listing, both
  on the page and as BreadcrumbList data. They also give internal links to
  the location pages.
- Pages are prebuilt for every listing at build time
  (`generateStaticParams`); newer listings render on first request.

### Collection pages

These exist only for combinations that have listings, so there are never
empty pages:

- `/properties/type/<type>`: `apartments`, `houses`, `townhouses`,
  `villas`, `land` (`PROPERTY_TYPE_PAGES`)
- `/properties/in/<location>`: every region and district with a listing
- `/properties/type/<type>/in/<location>`: every type × location pair
  with a listing

The heading and title are the search phrase ("Townhouses for Sale in
Accra, Greater Accra"). The description gives the count and the lowest
price. Each page carries an `ItemList` of its listing URLs and a
`BreadcrumbList`. An empty combination returns 404 rather than a thin page.

## Structured data

Rendered with [`<JsonLd>`](../src/components/JsonLd.tsx), which escapes `<`.

| Type                                                                                                                                                          | Where                                 | Built by                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------- |
| `Organization` (`@id` `https://afram.co/#organization`)                                                                                                       | Every page (root layout)              | `buildOrganizationJsonLd()` |
| `WebSite`                                                                                                                                                     | Home page                             | `buildWebSiteJsonLd()`      |
| `Product` + `Apartment` / `SingleFamilyResidence` / `Accommodation` / `Place`, with `Offer`, `PostalAddress`, `GeoCoordinates`, `floorSize`, `amenityFeature` | Listing pages                         | `buildPropertyJsonLd()`     |
| The accommodation type only (no Product)                                                                                                                      | Listing pages with no price           | `buildPropertyJsonLd()`     |
| `ItemList`                                                                                                                                                    | Collection pages                      | `buildItemListJsonLd()`     |
| `BreadcrumbList`                                                                                                                                              | Listing, collection and article pages | `buildBreadcrumbJsonLd()`   |
| `FAQPage`                                                                                                                                                     | `/developers`, `/financiers`          | `buildFaqJsonLd()`          |
| `Article`                                                                                                                                                     | `/insights/[slug]`                    | `buildArticleJsonLd()`      |

Notes:

- **Listings** are a Product with an Offer, which makes them eligible for
  the price-and-image treatment marketplace listings get in Google. They
  are also the accommodation type, for every other consumer that
  understands real estate. Offer availability maps from listing status:
  `sold` → `SoldOut`, `under offer` → `LimitedAvailability`, otherwise
  `InStock`.
- **FAQ rich results:** since 2023 Google shows these only for government
  and health sites. The FAQPage data is still valid and still read by other
  engines and AI answers, so it stays.
- **Validate changes** with Google's
  [Rich Results Test](https://search.google.com/test/rich-results) and the
  [Schema Markup Validator](https://validator.schema.org/).

## Sitemap

[`src/app/sitemap.ts`](../src/app/sitemap.ts) → `https://afram.co/sitemap.xml`.

- **Contents:** the static pages, every collection page with listings,
  every listing page, and every Insights article.
- **Listing photos:** listing entries use Google's image-sitemap extension
  (`<image:loc>`), so listing photos can show up in Google Images.
- **`<lastmod>`:** set only where it's true:
  - each listing's `updatedAt` (falling back to `createdAt`), fetched in
    `GET_PUBLIC_PROPERTIES`;
  - for `/`, `/properties` and collection pages, the newest `updatedAt`
    among the listings they show;
  - for articles, the publish date; for `/insights`, the newest article's
    date;
  - nothing for static pages. Google ignores `<lastmod>` on sites where
    it's always "now", which is how it used to be here.
- **`changefreq` / `priority`:** still emitted, but Google ignores them.
  They're harmless hints for other engines.

## robots.txt and indexing rules

[`src/app/robots.ts`](../src/app/robots.ts):

```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://afram.co/sitemap.xml
```

Page-level rules:

- **`noindex, follow`:** `/properties/map`, which shows the same listings
  as `/properties` on a client-rendered map, and the "not found" metadata
  for missing listings and articles.
- **`noindex` + HTTP 404:** any unknown URL and any `notFound()` call.
- **Filter parameters** on `/properties` (`?region=…&type=…`) aren't
  blocked; their canonical points to `/properties`, so they don't count as
  duplicates.

## Performance (Core Web Vitals)

Page speed is a ranking signal, and on this site the biggest factor is
image weight.

- **Images aren't optimised at runtime.** `next.config.ts` sets
  `images.unoptimized: true`, because Next's optimiser can't run on
  Cloudflare Workers. Every image in `public/` is sent exactly as stored,
  so **commit images already compressed, at the size they're shown**:
  - Use WebP, or AVIF where supported. Keep PNG only for small graphics
    that need sharp edges.
  - Size images to at most 2–3× their displayed size.
  - Use `sharp` (already a dependency) to convert, e.g.
    `node -e 'require("sharp")("in.png").webp({quality:85}).toFile("out.webp")'`.
- **CMS images:** Sanity images go through `urlFor()`, which sets
  `auto("format")`, so its CDN serves WebP/AVIF automatically.
- **Hero image:** marked `priority`, so it's preloaded with the logo. It's
  now 118 KB instead of 1.1 MB.
- **Fonts:** Montserrat is self-hosted through `next/font`; the font file
  is preloaded and there's no layout shift.
- **Listing pages** are static HTML, built at build time or on first request.

## Adding a new page

1. Export metadata with `buildMetadata({ title, description, path })`.
   - Keep `title` under about 52 characters (" — Afram" adds 8), or pass
     `absoluteTitle`.
   - Write the description for people, ideally 120–160 characters. Longer
     text is trimmed, but trimmed sentences read worse.
2. Give the page exactly one `<h1>`. Use `className="sr-only"` if the
   design has no visible heading.
3. Add structured data with `<JsonLd data={…} />` if a type fits. Add
   breadcrumbs for anything below the top level.
4. Add the route to `STATIC_ROUTES` in `sitemap.ts`, or generate its
   entries there. Give it a `lastModified` only if you know the real date.
5. Link to it from somewhere crawlable: navigation, footer or related pages.
   A page reachable only through the sitemap ranks poorly.
6. For a page that shouldn't appear in results, pass `noindex: true`
   rather than leaving it out of the sitemap and hoping.

## How to check it

Unit tests:

```sh
npx vitest run tests/unit/seo.test.tsx
```

Production crawl, which is the same check as the audit above. Start a
production server on a free port (port 3000 is afram-web's dev server):

```sh
yarn build && npx next start -p 3123
```

Then check pages by hand:

```sh
curl -s localhost:3123/robots.txt
curl -s localhost:3123/sitemap.xml | grep -c '<url>'
curl -s localhost:3123/properties/berry-house-333e4e \
  | grep -oE '<title>[^<]*|<meta name="description" content="[^"]*|<link rel="canonical" href="[^"]*'
```

After deploying:

- Submit `https://afram.co/sitemap.xml` in
  [Google Search Console](https://search.google.com/search-console) and
  Bing Webmaster Tools, and watch the Pages and Enhancements reports.
- Run a few listing URLs through the
  [Rich Results Test](https://search.google.com/test/rich-results).
- Run [PageSpeed Insights](https://pagespeed.web.dev/) on `/` and a
  listing page.

## Open items needing a decision

These couldn't be fixed in code without information or a product decision.

1. **Social profiles are placeholders.** `siteConfig.social`
   (`facebook.com/afram`, `linkedin.com/company/afram`,
   `instagram.com/afram`, `tiktok.com/@afram`, Twitter `@afram`) feeds the
   Organization `sameAs` and `twitter:site`. The site doesn't link to any
   of them, and they couldn't be confirmed as Afram's. If they belong to
   someone else, Google may associate Afram with those accounts. Replace
   them with the real URLs, or remove the ones Afram doesn't own.
2. **The collection links on `/properties` are switched off.**
   `<PropertyBrowseLinks>` is commented out in
   [`src/app/properties/page.tsx`](../src/app/properties/page.tsx). Today
   the collection pages are reached only through listing breadcrumbs and
   each other: between 2 and 15 internal links each, with
   `/properties/type/villas/in/western` the lowest. Turning it back on, or
   adding equivalent links in the footer, would give these pages more
   internal links.
3. **`www.afram.co` → `afram.co`.** This couldn't be checked from the
   audit machine. Confirm in Cloudflare that `www`, and `http://`, redirect
   with a 301 to `https://afram.co`, so only one version gets indexed.
4. **Short listing descriptions.** Many listings' own text is a one-line
   stub, so their pages carry generated copy. Better descriptions entered
   in the Afram app would make these pages rank better than any tag change.
5. **No `land` collection page yet.** `/properties/type/land` appears once
   a listing's type is `land` or `plot`. Some plots are currently typed
   otherwise in the API (`Plot 45` is a "house").
6. **Google Business Profile.** If Afram has an office in Ghana, a Google
   Business Profile with the same name, address and phone number helps
   with "property company near me" searches. That's done outside the code.
