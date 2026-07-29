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
