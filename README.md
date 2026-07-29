# Afram Website

The public marketing site for [Afram](https://afram.co) — a blockchain-verified real estate
marketplace connecting buyers, vendors, and financiers in Ghana.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and
TypeScript. Interactive widgets (persona tabs, the affordability calculator, the newsletter form)
are React islands via [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/);
everything else ships as zero-JS static HTML.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) to see the result.

## Scripts

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Start the local dev server             |
| `pnpm build`     | Build the static site to `dist/`       |
| `pnpm preview`   | Preview the production build locally   |
| `pnpm lint`      | Lint with ESLint (TS + Astro)          |
| `pnpm format`    | Format with Prettier                   |
| `pnpm typecheck` | Type-check `.ts`/`.tsx`/`.astro` files |
| `pnpm test`      | Run unit tests (Vitest)                |
| `pnpm test:e2e`  | Run end-to-end tests (Playwright)      |

## Project structure

```
src/
  components/   Shared UI (Astro components + React islands)
  config/       Site metadata, navigation, env validation
  features/     Feature-scoped code (landing sections, persona content)
  layouts/      Page layouts (BaseLayout with SEO head + nav/footer)
  lib/          Framework-agnostic helpers (formatting, SEO, cn)
  pages/        File-based routes
  types/        Shared TypeScript types
```

Property listings and article content in `src/features/landing/data/` are static seed data —
swap in a real data source (e.g. a GraphQL API with generated types) when ready.
