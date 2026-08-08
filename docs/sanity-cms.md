# Fully leveraging Sanity as the content platform

## The short version

The Keystatic write-up made the case that `afram-dashboard`'s unfinished `/dashboard/cms` screen — a nice editor with nowhere to save its work — is really missing a storage layer, and that git can be that storage layer for free. Sanity solves the same underlying problem (marketing copy with no durable home) from a completely different angle: instead of turning content into files in the repo, it turns content into rows in a purpose-built, hosted content database, and gives you a real-time, multiplayer editing surface on top of it. Nobody commits anything. Two editors can have the homepage hero open at the same time and watch each other type, the way two people share a Google Doc. Every field has structure, validation, and — where it matters — a reference to some other piece of content, not a copy-pasted string.

That's a meaningfully different value proposition than a git-based CMS, not just a different flavor of the same thing, and it's worth being precise about where it's actually stronger and where it's a heavier tool than the job needs.

## The theory: content as data, not content as files

Every approach to this problem eventually has to answer one question: where does a piece of content _live_, and what does "editing" it actually mean?

- In the current `afram-dashboard` prototype, content lives in a React component's memory. Editing means typing into a form that forgets everything on refresh. That's not really an answer — it's the absence of one.
- In a git-based CMS, content lives as files in the repository, and editing means producing a commit. That gets you version history and review essentially for free, because git already does both.
- In Sanity, content lives in the **Content Lake** — Sanity's phrase for it, and a genuinely apt one — a real-time, schema-validated database that exists entirely on Sanity's infrastructure, addressed by a `projectId` and a `dataset` name rather than a file path. Editing means writing directly into that database through **Sanity Studio**, an open-source, React-based admin application that you configure (and can fully customize) but that talks to Sanity's hosted backend rather than your own filesystem.

That distinction — files versus a real database — is what unlocks everything Sanity is actually good at. A database can be queried. Sanity's query language, **GROQ**, lets you ask for exactly the shape of data a component needs in one round trip: filter by type, project down to five fields, follow a reference to another document, sort, paginate, all in one expression. A database can also be written to by more than one person at once without merge conflicts, which is where Sanity's "multiplayer" framing comes from: Studio supports real-time collaborative editing, the same category of experience as Google Docs, not "each of us take a branch and merge later." And a database can enforce structure at write time — a schema with real validation rules, not just a TypeScript type that only helps at compile time in one codebase.

None of that is free, in either sense of the word. Sanity is a hosted product with its own pricing: the free plan gives you twenty seats, but only two roles — Administrator and Viewer — meaning anyone who needs to actually _write_ content beyond a solo admin needs a paid Editor/Contributor/Developer seat at $15/user/month on the Growth plan. Document history follows the same shape: drafts and revision history go back further the higher the plan (30 days on Team, 90 days plus a full audit log on Business, effectively indefinite on Enterprise). That's the honest trade against Keystatic's git-backed approach: git's version history and multi-editor story are already sitting there for free because you already pay for GitHub; Sanity's are a genuinely nicer, real-time experience, and they cost money past a small team.

The right way to think about it: Keystatic asks "can we get away with the version control system we already have?" Sanity asks "what if content had its own real database, with the tooling a database deserves?" Both are legitimate answers. Which one is worth it depends on how much collaborative, structured content Afram actually intends to manage, and by whom.

## Core concepts, and how Afram's content maps onto them

**Documents and schema types.** Everything in Sanity is a _document_ — the equivalent of a row — and every document has a _type_, defined once in code with `defineType` and `defineField`. This is where Afram's actual content slots in cleanly. The `ARTICLES` array in `src/features/landing/data/articles.ts` becomes an `insightArticle` document type. The developer/financier persona content — eyebrow, headline, subhead, stats, FAQs — becomes a `persona` document type. The homepage hero, nav labels, and footer copy each become their own document type too, typically with only one document ever created from them (Sanity's convention for this is a "singleton" document, enforced by hiding the create-new button and locking the ID, rather than a distinct schema concept the way Keystatic has one).

**Field types**, declared per-field, cover exactly the shapes this site already has: `string` for headlines, `text` for longer copy, `image` for covers (with built-in hotspot/crop, more on that below), `array` for the FAQ lists and stat rows, `object` for a stat's `{ label, value }` pair, and `block` — Sanity's rich-text type, known as **Portable Text** — for the Insights article bodies, which today are a hand-rolled array of `{ type: "p" | "h2" | "quote", text }` objects. Portable Text is that same idea, standardized, with a real editing toolbar in Studio instead of a developer typing `{ type: "h2", text: "..." }` by hand.

**References** are where Sanity earns its "structured content" name most visibly. A field can point at another document by ID — `type: "reference"` — and GROQ queries follow that pointer with a single arrow: `author->name`. If a "Featured properties" section on the homepage should point at three specific `insightArticle` documents rather than duplicating their titles, that's a reference field and a dereference in the query, not a slug string matched by convention.

## Two apps, one Content Lake

`afram-dashboard` and `afram-website` are separate codebases on separate stacks — Vite/React/`react-location` on one side, Next.js App Router on the other — and it's worth being explicit about how Sanity sits across that split, because it's not the same shape as the Keystatic proposal. Keystatic ties the CMS to _one_ repo, because the content is files inside that repo's git history. Sanity has no such constraint: Studio (the editing UI) and the Content Lake (where the data actually lives) are already two separate things talking over an API, so _which app embeds Studio_ and _which app renders the content_ are two independent decisions, not one.

That decoupling matters here specifically because the natural home for editing and the natural home for rendering aren't the same app:

- **Editing belongs in `afram-dashboard`.** That's where the original `/dashboard/cms` prototype already lives, where staff already go for everything else (properties, developers, financiers, tickets, compliance), and where the access-control gate this needs already exists — `ProtectedRoute` / `admin-only-route`, the same `canSeeAdminArea` check the prototype uses today. Sanity Studio ships as a plain React component, `<Studio config={config} />` from the `sanity` package — not the Next.js-flavored `next-sanity/studio` wrapper, just Sanity's own framework-agnostic one — so it mounts into a Vite app exactly the way it would mount into any other React app: give it a route in `react-location`, make sure that route catches all of Studio's own sub-paths, and render `<Studio>` there.
- **Rendering belongs in `afram-website`.** It never needs the schema, never needs Studio, and doesn't need to know `afram-dashboard` exists at all. It just needs a lightweight `@sanity/client` instance pointed at the same `projectId`/`dataset`, and a GROQ query string — which is just a string sent over HTTP, not something compiled against a local schema file.

The only thing genuinely shared between the two apps is that project ID and dataset name — the coordinates of the Content Lake both of them are pointed at. There's no shared package, no cross-repo import, no build-time dependency either way. That's the headless part of "headless CMS" actually paying off: the editing surface and the published site can live in, and even be built by, two completely unrelated codebases.

## Setting it up, concretely, across both apps

**1. Install and initialize — inside `afram-dashboard`.**

```bash
npx sanity@latest init
```

Run this from `afram-dashboard`, since that's where the schema and Studio config will live. It creates (or connects to) a Sanity project and dataset and scaffolds a `sanity.config.ts`. Skip the Next.js-specific `next-sanity` toolkit here — that package's value (the `NextStudio` wrapper, the Live Content API) is specifically for the app that _renders_ content, which in this split is `afram-website`, not `afram-dashboard`.

**2. Model the schema — also in `afram-dashboard`.** Here's the Insights collection as a Sanity document type, next to a `stat` object type for the developer and financier pages:

```ts
// sanity/schemaTypes/insightArticle.ts
import { defineField, defineType } from "sanity";

export const insightArticle = defineType({
  name: "insightArticle",
  title: "Insights article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Buying Guide", "Verification & Trust", "Financing", "Investing"],
      },
    }),
    defineField({
      name: "cover",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "readMinutes", type: "number" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
  ],
});
```

```ts
// sanity/schemaTypes/stat.ts
import { defineField, defineType } from "sanity";

export const stat = defineType({
  name: "stat",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "value", type: "string" }),
  ],
});
```

Both get registered in `sanity.config.ts`'s `schema.types` array, alongside a `structureTool()` plugin that drives the left-hand navigation in Studio.

**3. Mount Studio inside `afram-dashboard`, in place of the `/dashboard/cms` prototype.** Studio is just a React component, so it drops into the existing `react-location` router the same way any other dashboard page does — no Next.js involved:

```tsx
// src/pages/marketing/cms/index.tsx — replacing the prototype's canvas UI
import { defineConfig, Studio } from "sanity";

const config = defineConfig({
  projectId: "your_project_id",
  dataset: "production",
  basePath: "/dashboard/cms",
  // schema.types, plugins, etc. as configured in step 2
});

export function MarketingCmsPage() {
  return <Studio config={config} />;
}
```

Two things carry over from the existing route unchanged: the `route: "/dashboard/cms"` entry in `router/routes.tsx` stays exactly where it is, and so does whatever `ProtectedRoute`/`admin-only-route` guard already wraps it — Studio simply renders inside that same gated page. The one requirement Sanity adds is that `react-location` needs to forward every sub-path under `/dashboard/cms` (Studio's own internal routing for its document list, individual entries, and so on) to this same component, and the mount element needs full-height styling (`height: 100vh; max-height: 100dvh; overflow: auto;`) since Studio manages its own internal scrolling.

Editors then get a fully-featured, real-time collaborative admin UI at the same URL the old prototype used, inside the same dashboard they already log into — with no separate app, no separate login, and no GraphQL mutations to write, because Sanity's hosted API is the thing persisting every save.

**4. In `afram-website`, add just the read side** — `@sanity/client` and `next-sanity`'s Live Content helpers, nothing schema-related:

```bash
pnpm add @sanity/client next-sanity
```

```ts
// src/sanity/lib/client.ts
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "your_project_id", // same project as afram-dashboard's Studio
  dataset: "production",
  apiVersion: "2026-01-01",
  useCdn: true,
});
```

**5. Read the content back with GROQ.** A query to replace the current `ARTICLES.slice(0, 3)` call:

```ts
// sanity/lib/queries.ts
export const FEATURED_ARTICLES_QUERY = `
  *[_type == "insightArticle"] | order(publishedAt desc) [0...3] {
    _id, title, slug, excerpt, category, cover, publishedAt, readMinutes
  }
`;
```

**6. Wire up the Live Content API**, so the site reflects an edit the moment it's saved in Studio, without a manual webhook or a redeploy:

```ts
// src/sanity/lib/live.ts
import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/lib/client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN!,
  browserToken: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN!,
});
```

```tsx
// src/app/layout.tsx
import { SanityLive } from "@/sanity/lib/live";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  );
}
```

```ts
// used inside FeaturedArticlesSection, in place of the static ARTICLES import
const { data: articles } = await sanityFetch({ query: FEATURED_ARTICLES_QUERY });
```

That last step is the real payoff: no cache-invalidation logic to hand-write, no ISR revalidation webhook to configure. Marketing edits a headline in Studio, and the change is live on the deployed site within moments.

**7. Serve images properly.** Cover images aren't just a URL — the image field stores a hotspot and crop the editor sets in Studio, and `@sanity/image-url` turns that into correctly-cropped, CDN-served URLs on demand:

```ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";

const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);
```

```tsx
<Image
  src={urlFor(article.cover).width(800).height(450).url()}
  alt={article.title}
  width={800}
  height={450}
/>
```

Every size Sanity is asked for is generated once, cached at the edge, and served from the same URL forever after — the equivalent of running an image-optimization pipeline, without running one.

## What this actually buys, versus what it costs

Real-time multiplayer editing is the headline feature, and it's not a gimmick for a marketing team of more than one person: two editors working on the same launch don't have to coordinate who's touching the homepage file this week. GROQ makes it straightforward to model content that references other content — a persona page's FAQ list referencing a shared "compliance disclaimer" document once, rather than pasting the same paragraph into every page that needs it — in a way a plain TypeScript array never will without a lot of hand-written plumbing. The image pipeline, validation rules, and a real roles system (who can publish versus who can only draft) all come out of the box rather than being things a developer builds and maintains.

Against that: this is a hosted, metered product, not a free side effect of infrastructure Afram already has. Two free roles cover a solo editor comfortably; anything resembling an actual marketing team touching content will land on a paid seat count. Content lives outside the git repository entirely, on Sanity's infrastructure, which means the "diff and revert" mental model engineers already have from git doesn't directly apply — history and rollback exist, but they're a Sanity feature with its own retention window tied to the plan, not `git log`.

## Recommendation

Sanity is the stronger choice specifically where Afram wants more than one non-engineer collaborating on content at once, wants content that references other content instead of duplicating it, or wants a real roles/permissions boundary between who can edit a draft and who can publish it — all things the current `content.ts` array and the disabled "Publish all" button were never going to grow into. Model the Insights articles, the developer/financier persona content, and the homepage/nav/footer copy as Sanity document types, mount Studio at the existing `/dashboard/cms` route inside `afram-dashboard` in place of the prototype, and let `afram-website` read that same content over GROQ with the Live Content API so publishing a change in Studio is the entire deploy step. Editing and rendering stay in the two apps where they already naturally belong; the only thing tying them together is a project ID. The cost to weigh against that is real and ongoing — a per-seat subscription once more than one paid role is needed — which is the one place this genuinely trades off against a git-based approach rather than simply beating it.
