# Afram Website

The public marketing site for [Afram](https://afram.co) — a blockchain-verified real estate
marketplace connecting buyers, vendors, and financiers in Ghana.

Built with [Next.js](https://nextjs.org) (App Router), [Tailwind CSS v4](https://tailwindcss.com),
and TypeScript.

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Environment variables

Create a `.env.local` file in the project root. All variables are optional — the site builds and
runs without any of them — but Sanity-backed content (Insights articles) stays empty until the
Sanity variables are set.

| Variable                        | Required | Default                                    | Description                                                                                        |
| ------------------------------- | -------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | No       | `http://localhost:3000`                    | Canonical site URL, used for SEO metadata, sitemap, and robots. Set to `https://afram.co` in prod. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | No\*     | —                                          | Sanity project ID. Without it, article pages render empty (a placeholder keeps the build passing). |
| `NEXT_PUBLIC_SANITY_DATASET`    | No       | `production`                               | Sanity dataset name.                                                                               |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | No       | `http://localhost:5173/dashboard/cms`      | URL of the Sanity Studio (hosted in afram-dashboard), used by Visual Editing overlay links.        |
| `SANITY_API_READ_TOKEN`         | No\*     | —                                          | Server-only viewer token for draft mode / live preview. Never expose to the client.                |
| `GRAPHQL_API_URL`               | No       | `https://afram-core-staging.fly.dev/graph` | GraphQL endpoint for property listings (afram-core). Point at production when deploying.           |

\* Required for CMS-driven content and draft previews to work.

Example `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:5173/dashboard/cms
SANITY_API_READ_TOKEN=your-viewer-token
GRAPHQL_API_URL=https://afram-core-staging.fly.dev/graph
```

## Scripts

| Command          | Description                                     |
| ---------------- | ----------------------------------------------- |
| `yarn dev`       | Start the local dev server                      |
| `yarn build`     | Build the production app                        |
| `yarn start`     | Serve the production build locally              |
| `yarn lint`      | Lint with ESLint (Next.js config)               |
| `yarn format`    | Format with Prettier                            |
| `yarn typecheck` | Type-check with `tsc --noEmit`                  |
| `yarn test`      | Run unit tests (Vitest)                         |
| `yarn test:e2e`  | Run end-to-end tests (Playwright)               |
| `yarn preview`   | Build and preview the Cloudflare Worker locally |
| `yarn deploy`    | Build and deploy to Cloudflare Workers          |

## Deploying to Cloudflare

The site runs on Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare). Plain
`wrangler deploy` is not enough on its own — `opennextjs-cloudflare build` first transforms the
Next.js output into a Worker at `.open-next/worker.js`, which is what `wrangler.jsonc` points at.

In the Cloudflare dashboard (Workers &rarr; afram-website &rarr; Settings &rarr; Build):

| Setting        | Value                              |
| -------------- | ---------------------------------- |
| Build command  | `yarn opennextjs-cloudflare build` |
| Deploy command | `yarn wrangler deploy`             |

Locally:

```bash
yarn preview   # build and run the Worker locally in workerd
yarn deploy    # build and deploy to Cloudflare
```

Set the environment variables above as Worker vars/secrets too — `.env` and `.env.local` are not
read in production.

### Caching

Prerendered pages are served from the Workers static assets binding, so a request returns cached
HTML instead of re-running data fetches and a React render. OpenNext's default is no cache at all,
which exhausts the Worker CPU limit (error 1102) once traffic hits server-rendered pages.

This cache is **read-only**: revalidation does not persist, so published CMS changes appear on the
next deploy rather than after the `revalidate` window.

To also persist revalidation, move to KV. Order matters: `opennextjs-cloudflare deploy` populates
the cache at deploy time and **fails the deploy** if the config names a binding that does not
exist. Create the namespace first:

```bash
yarn wrangler kv namespace create NEXT_INC_CACHE_KV
```

Add the returned `id` to `wrangler.jsonc`:

```jsonc
"kv_namespaces": [{ "binding": "NEXT_INC_CACHE_KV", "id": "<paste-id-here>" }]
```

Then switch `open-next.config.ts` to the configuration in its comment block.

## Project structure

```
src/
  app/          File-based routes (App Router), root layout, sitemap/robots
  components/   Shared UI and layout components
  config/       Site metadata, navigation, env validation
  features/     Feature-scoped code (landing sections, persona content)
  lib/          Framework-agnostic helpers (formatting, SEO, cn)
  types/        Shared TypeScript types
```

Property listings and article content in `src/features/landing/data/` are static seed data —
swap in a real data source (e.g. a GraphQL API with generated types) when ready.
