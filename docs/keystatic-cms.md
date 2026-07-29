# Replacing the dashboard CMS prototype with Keystatic

## The short version

`afram-dashboard` already has a screen for editing the marketing site's copy — `/dashboard/cms`, defined in `src/pages/marketing/cms/`. It's a genuinely well-built visual editor: click-anywhere-to-edit canvas, a live preview frame, drag-to-reorder sections, undo/redo. But it's a prototype in the most literal sense. Its own "Publish all" button is disabled, with a tooltip that says the queries and mutations to actually save anything haven't been built yet. Every edit lives in a React `useState` and evaporates on refresh. There's no database table behind it, no API route, nothing durable.

That's the gap Keystatic fills — not by giving you a nicer editor (the one in `afram-dashboard` is already nice), but by giving you the missing half: a place for the content to actually _live_. Keystatic is a headless CMS that stores content as files in your git repository instead of rows in a database. The team writes a schema once, gets a real admin UI for free, and every edit becomes a commit. No backend to build, no migrations to write, no "publish" button to wire up — git already does versioning, review, and rollback better than anything we'd build in a sprint.

## Why "git as the database" is the right shape for this problem, and not for others

It's worth being precise about what kind of content this is, because that's exactly where the current CMS prototype and the rest of `afram-dashboard` diverge, and it's the reason Keystatic fits one and would be the wrong tool for the other.

Most of what lives in `afram-dashboard` — properties, developers, financiers, tickets, compliance records, transactions — is _operational_ data. It changes constantly, it's queried and filtered and joined against other records, dozens of different actors read and write it, and it has to be fast and transactional. That's what the existing GraphQL API and database are for, and nothing about this proposal touches that layer.

The stuff sitting in `src/pages/marketing/cms/content.ts`, on the other hand, is a different animal entirely: nav labels, hero headlines, trust-banner copy, a handful of featured-property fallback cards. It's edited by a small number of trusted internal staff, rarely more than once a day, and every change is really a _publishing_ decision — something you'd actually want a second pair of eyes on before it goes live on the public site. That's precisely the shape of problem a file-based, git-backed CMS was designed for. When Marketing changes the homepage headline, what you want isn't a database row silently overwritten — you want a diff, a reviewer, and a revert button if it goes wrong. Git already _is_ that system. Keystatic just puts a form in front of it so nobody has to hand-edit YAML.

This is also, not coincidentally, exactly what the hand-rolled `FieldDescriptor` system in `src/pages/marketing/cms/types.ts` is quietly reinventing — a typed schema describing text, richtext, image, boolean, and list fields, driving a form renderer. Keystatic is that same idea, already built, already maintained, with a schema API, a real admin UI, image handling, and — the part that was missing — somewhere for the data to actually go.

## What Keystatic actually is

Keystatic is an open-source, self-hosted CMS that you install as a package inside your own frontend project rather than pointing your app at someone else's hosted API. There's no separate service to stand up. You define a schema in a `keystatic.config.ts` file at the root of the project, and Keystatic generates an admin dashboard from it — available in dev at a local `/keystatic` route, and, if you choose to deploy it, at that same route in production, gated behind login.

Content is organized into two shapes:

- **Collections** are for anything you want _multiple_ instances of — blog posts, testimonials, FAQ entries. Each entry becomes its own file on disk, and the collection is the folder.
- **Singletons** are for things there's exactly one of — a homepage, a global site-settings object, a footer. This maps almost exactly onto what `content.ts`'s `PAGES: PageSchema[]` array is doing by hand right now: one schema, one instance, per page.

Fields are declared with a typed API — `fields.text()`, `fields.image()`, `fields.select()`, `fields.array()`, `fields.markdoc()` for rich text, `fields.relationship()` for linking one entry to another — and Keystatic's admin UI renders the right editor for each automatically. You're not building `FieldControl.tsx` and `FieldsGroup.tsx` by hand; you get them by declaring the schema.

The part that matters most operationally is _where the files go_, and Keystatic gives you three choices:

- **Local mode** writes straight to your working directory's filesystem the moment you save in the admin UI. It's the default for new projects and it's genuinely just "edit files, then `git add` and push them yourself like anything else." No server-side moving parts, but no remote collaboration either — it only makes sense for one person editing on their own machine.
- **GitHub mode** is the one that matches what `afram-dashboard`'s CMS screen is actually trying to be: several trusted staff editing the same site from the browser, without a laptop full of local branches. You register a small GitHub App once, and after that, anyone with **write access to the repo** can log into `/keystatic` with their GitHub account and start editing. Every save becomes a real commit. This needs a Node-capable server to run the app's API routes in production (which a Next.js or Astro deployment already is), but it needs no database and no custom backend code — GitHub _is_ the backend.
- **Keystatic Cloud** is the hosted, paid step up from GitHub mode: it adds hosted image storage and lets people without a GitHub account edit content, at the cost of a subscription and an external dependency. For an internal-staff-only tool like this one, GitHub mode covers the actual requirement without adding a vendor.

For Afram, GitHub mode is the obvious fit: the editors are internal staff who already have accounts and repo access, the volume of edits is low enough that PR-style review is a feature rather than friction, and it costs nothing beyond the one-time GitHub App setup.

## Where this plugs into what already exists

The content currently hand-typed into `content.ts` — nav items, hero copy, trust-banner text, featured-property fallback cards — is content-shape-for-content-shape the same as what's now living in `afram-website`'s `src/features/landing/data/` (`role-cards.ts`, `articles.ts`, `properties.ts`) and `src/config/` (`navigation.ts`, `site.ts`). Those are exactly the static TypeScript arrays Keystatic collections and singletons are built to replace: instead of a developer editing a `.ts` array and cutting a PR by hand every time marketing wants a headline changed, marketing edits it themselves through a form, and the commit (and the review, if you want one) happens automatically.

The clean home for this is inside `afram-website` itself, not `afram-dashboard`. Keystatic reads and writes content as files in whatever repo it's installed in, so the CMS needs to live in the same project the content is rendered from. That also means the `/dashboard/cms` prototype in `afram-dashboard` can eventually be retired rather than finished — its job gets done by `/keystatic` inside the website project instead, and nobody has to build the GraphQL mutations that prototype was blocked on.

## Setting it up, concretely

Because `afram-website` runs on Next.js (App Router), here's what actually installing Keystatic there looks like. If a future project of ours runs on Astro instead — the guide you linked — every concept below is identical; only the package name and the file layout of the integration change (`@keystatic/astro` instead of `@keystatic/next`, and Astro pages instead of App Router routes). The schema, the fields, the storage modes, the admin UI — all the same.

**1. Install the packages:**

```bash
pnpm add @keystatic/core @keystatic/next @markdoc/markdoc
```

**2. Describe the content as a schema**, in `keystatic.config.ts` at the project root. Here's what the Insights articles — currently the hardcoded `ARTICLES` array in `src/features/landing/data/articles.ts` — would look like as a real Keystatic collection:

```ts
import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: { owner: "afram-tech", name: "afram-website" },
  },
  collections: {
    insights: collection({
      label: "Insights articles",
      slugField: "title",
      path: "src/content/insights/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Buying Guide", value: "buying-guide" },
            { label: "Verification & Trust", value: "verification" },
            { label: "Financing", value: "financing" },
            { label: "Investing", value: "investing" },
          ],
          defaultValue: "buying-guide",
        }),
        cover: fields.image({ label: "Cover image", directory: "public/insights" }),
        date: fields.date({ label: "Published date" }),
        readMinutes: fields.integer({ label: "Read time (minutes)" }),
        body: fields.markdoc({ label: "Body" }),
      },
    }),
  },
  singletons: {
    homepage: singleton({
      label: "Homepage",
      path: "src/content/homepage",
      schema: {
        heroHeadline: fields.text({ label: "Hero headline" }),
        heroSubhead: fields.text({ label: "Hero subhead", multiline: true }),
      },
    }),
  },
});
```

Every article becomes a Markdoc file — `src/content/insights/understanding-the-20-percent-deposit-rule.mdoc` — with the fields above as frontmatter and the body as Markdoc content underneath. The homepage singleton becomes one file, since there's only ever one.

**3. Wire up the App Router routes.** Keystatic needs four small files: a client component that mounts the admin UI, a layout for it, a catch-all page under `/keystatic`, and an API route handler under `/api/keystatic` that Keystatic's own `makeRouteHandler` generates for you. None of this is business logic to maintain — it's boilerplate that stays as-is once it's in place.

**4. Read the content back out** wherever it's rendered — a page component, `generateStaticParams`, wherever. Keystatic ships a Node-only Reader API for exactly this:

```ts
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

// list all articles
const articles = await reader.collections.insights.all();

// read one, with the rendered body
const article = await reader.collections.insights.read("understanding-the-20-percent-deposit-rule");
const { node } = await article!.body();
```

That last piece is the only real code change the rest of the site needs: `src/features/landing/data/articles.ts` stops being a hand-maintained array and becomes a thin wrapper around `reader.collections.insights.all()`. Everything downstream — `ArticleCard`, the `/insights` and `/insights/[slug]` pages — keeps working exactly as it does today, because it never cared where the data came from in the first place.

**5. Register the GitHub App**, once, following Keystatic's guided flow (it creates the app, grants it access to the `afram-website` repo, and hands you three environment variables — `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`). After that, anyone on the team with write access to the repo can go to `/keystatic` on the deployed site, log in with GitHub, and start editing — no separate account, no separate password to manage.

## What this doesn't solve, on purpose

It's worth being clear-eyed about the boundary. Keystatic manages _marketing copy_ — the kind of content a person writes once and occasionally revises. It is not a replacement for the GraphQL-backed property, developer, financier, and transaction data that makes up the bulk of `afram-dashboard`. Those records are created by users, change constantly, and need to be queryable, joinable, and fast — a database is still the right tool for that, and nothing here suggests otherwise. The featured-property "fallback cards" currently hardcoded for the marketing site are a genuine edge case worth a judgment call: they could stay as Keystatic-managed entries (since they're really marketing copy dressed up as property data), or they could be left alone and just fetched live from the real properties API the way `usePublicFeatured` already does elsewhere in `afram-web`. Either is reasonable; the line to hold is that Keystatic owns _copy_, the API owns _data_.

## Recommendation

Retire the `/dashboard/cms` prototype rather than finish it. Install Keystatic directly in `afram-website`, model the homepage/nav/footer copy as singletons and the Insights articles as a collection, and run it in GitHub mode. That gets the team everything the prototype was reaching for — a real visual editor, a real publish step — without writing a single GraphQL mutation, and with a better publish story than "click a button and hope": every change is a commit, reviewable in a pull request, revertible with `git revert`, and attributable to whoever made it.
