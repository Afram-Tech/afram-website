# Afram Website

The public marketing site for [Afram](https://afram.co) — a blockchain-verified real estate
marketplace connecting buyers, vendors, and financiers in Ghana.

Built with [Next.js](https://nextjs.org) (App Router), [Tailwind CSS v4](https://tailwindcss.com),
and TypeScript.

## Getting started

```bash
pnpm install
pnpm dev
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

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Start the local dev server         |
| `pnpm build`     | Build the production app           |
| `pnpm start`     | Serve the production build locally |
| `pnpm lint`      | Lint with ESLint (Next.js config)  |
| `pnpm format`    | Format with Prettier               |
| `pnpm typecheck` | Type-check with `tsc --noEmit`     |
| `pnpm test`      | Run unit tests (Vitest)            |
| `pnpm test:e2e`  | Run end-to-end tests (Playwright)  |

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
