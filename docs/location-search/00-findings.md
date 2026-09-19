# Phase 0 Discovery — Location Intelligence, Search Filters & 3D Map

**Repo:** `afram-website` (Public Next.js marketplace)
**Scope:** Read-only investigation. No code changed by this pass.
**Companion doc:** `afram-web/docs/location-search/00-findings.md`
**Verified against:** `90de3216` (2026-09-19) — no working-tree modifications were ever made in this repo this session (`git status` was clean throughout), so the original findings already reflected committed code. Re-spot-checked anyway: the `properties.ts:115` location collapse, the `PropertiesBrowser.tsx:94` string-equality filter, and the hardcoded `offset:0, limit:200` fetch (`properties.ts:161`) all confirmed unchanged via `git show HEAD:<path>`.

---

## Repo/environment note (see companion doc for full detail)

No GraphQL API repo exists anywhere in `~/Desktop`. This repo talks to a **remote staging endpoint** (`https://afram-core-staging.fly.dev/graph`, default in `src/graphql/client.ts:5-6`, overridable via `GRAPHQL_API_URL`) — there is no local server to inspect beyond what the generated schema (`src/types/generated/graphql.ts`) exposes. §4.4's "backend not available" rule applies: Feature B's server-side facet/marker/filter endpoints must be written up as GraphQL SDL specs, not implemented, until that repo is accessible.

---

## A. Core property browsing surfaces

**A1 — `PropertiesBrowser`** (`src/features/properties/PropertiesBrowser.tsx:55-271`), a `"use client"` component. Rendered by a server component (`src/app/properties/page.tsx:15-23`) that fetches the **entire** property set server-side and hands it down as a prop — filtering happens after the fact.

Filters exposed: `status`, `location` (built from the *collapsed* string, see A2), `type`, `price` (fixed bands), plus free-text `search` matched against `name + location + type`. **No bedroom/bathroom filter exists.** State is plain `useState` (`filters`, `search`, `visibleCount`) — **nothing is synced to the URL**; `/properties/page.tsx` doesn't even declare a `searchParams` prop. "Pagination" is client-side infinite scroll (`IntersectionObserver`) revealing 12 more rows at a time from the in-memory array already on the page.

**A2 — `mapProperty` location-collapsing quirk: CONFIRMED, and it fully explains the string-equality problem.**

`src/features/landing/data/properties.ts:115`:
```ts
location: [property.city, property.region].filter(Boolean).join(", ") || "Ghana",
```
This is the **only** place city/region survive into the website's `Property` type — no separate `city`/`region`/`area` field exists downstream at all. The browser then filters on it by exact string match:

`src/features/properties/PropertiesBrowser.tsx:94-96`:
```ts
if (filters.location !== "all" && property.location.toLowerCase() !== filters.location) {
  return false;
}
```
and options are deduped on the *combined* string (`PropertiesBrowser.tsx:40-53`), so "Accra, Greater Accra" and "Tema, Greater Accra" become two unrelated dropdown entries — there is no way today to filter "all of Greater Accra region" independent of which city string it happens to be paired with. Exactly the defect the brief describes; §3.4's structured `region`/`city`/`area` fields on the extended `Property` type are a direct fix.

**A3 — `graphqlFetch` + `GET_PUBLIC_PROPERTIES`, read in full.**

`graphqlFetch` (`src/graphql/client.ts:8-24`) — plain POST wrapper, `next: { revalidate: 3600 }`, no filter-aware cache key.

Query document, quoted in full (`src/graphql/documents.ts:6-37`):
```graphql
query GetPublicProperties($pagination: Pagination) {
  getPublicProjects(pagination: $pagination) {
    id
    projectType
    property {
      id
      price
      currency
      propertyType
      status
      bedroom
      fullBathroom
      halfBathroom
      squareFeet
      city
      region
      propertyNameOrNumber
      propertyDescription
      propertyCardDesc
      propertyAmenities
      titleType
      landCertificateNumber
      projectImages
      thumbnail
      streetAddress
      gpsAddress
      metadata
    }
  }
}
```
- Requests `bedroom`, `fullBathroom`/`halfBathroom`, `city`, `region` — **does not** request `area` or `siteCoordinates`, though both exist on the server schema (`graphql.ts:4417` `area`, `:4488` `siteCoordinates: JSONObject`). §3.4's instruction to add `area`, `siteCoordinates`, and confirm `metadata` is already-fetched (it is) is directly actionable — only `area` and `siteCoordinates` need adding to this document.
- Only variable is `$pagination` — **no `$filter` is declared**, even though the server operation accepts one (`graphql.ts:5480-5483`, `QueryGetPublicProjectsArgs { filter?: ProjectFilter; pagination?: Pagination }`). The capability exists at the wire level and is simply unused.
- The `ProjectFilter` this operation actually accepts (`graphql.ts:4388-4397`): `id, isDivided, isTokenized, listingType, ownerId, projectId, projectType, status` — no location/price/bedroom capability, matching the companion doc's dashboard-side finding exactly (same generated schema, same gap). A second, unused `PropertyFilter` type also exists (`graphql.ts:4506-4513`) but isn't what this query accepts and is equally location/price-agnostic.

**A4 — 200-record client-side-everything claim: CONFIRMED.**

`src/features/landing/data/properties.ts:156-170`:
```ts
const fetchPublicProperties = cache(async function fetchPublicProperties(): Promise<Property[]> {
  try {
    const data = await graphqlFetch<
      GetPublicPropertiesResponse,
      { pagination: { offset: number; limit: number } }
    >(GET_PUBLIC_PROPERTIES, { pagination: { offset: 0, limit: 200 } });
    return data.getPublicProjects
      .filter((project) => (project.projectType ?? "").toLowerCase() !== "multiple units")
      .map(mapProperty)
      .filter((property): property is Property => Boolean(property));
  } catch (error) {
    console.warn("Failed to fetch public properties from Afram GraphQL API:", error);
    return [];
  }
});
```
Hardcoded `offset: 0, limit: 200`, no filter args. `getAllProperties`/`getFeaturedProperties`/`findPropertyBySlug` all call this one cached fetch and do further `.filter()`/`.find()` in JS. `PropertiesBrowser` filters and `.slice(0, visibleCount)`s the same 200-row batch; `MorePropertiesSection` does `properties.slice(0, 9)` on it too. **This is the scalability ceiling the brief flags — confirmed exactly as described.** Past 200 live listings, new properties simply never appear anywhere on the site regardless of filters.

## B. Type definitions

**B5 — Website's own `Property` type** (`src/features/landing/data/properties.ts:6-33`) — no `region`/`city`/`area`/coordinates field exists; only the collapsed `location: string`. `address` has `street`, `gps` (a raw GPS-address **string**, not lat/lng — sourced from `gpsAddress`), and `propertyId` — no numeric coordinates anywhere on this type today. `baths` is a single pre-summed number (`fullBathroom + halfBathroom`), not separate fields — worth deciding whether §3.4's "add `bathrooms`" means keep it combined or split, since the source data is already split server-side.

**B6 — Codegen: present and working.** `codegen.ts` (repo root) generates `src/types/generated/graphql.ts` from the same staging schema, scanning `/* GraphQL */`-tagged templates in `src/graphql/**` (documents are inlined, not `.graphql` files, per a comment explaining the Workers runtime has no `readFileSync`). The generated `ProjectFilter`/`Property` types match what's quoted in A3 — confirmed no drift between the schema and what's used.

## C. Routing & rendering

**C7 — App Router throughout.** `/properties` list page is an async **server component with no `searchParams`** — filtering is 100% client-state, not URL-driven, and has zero SEO benefit (static, generic `metadata` export only — no `generateMetadata` tied to filters). Detail route (`/properties/[slug]`) *does* have proper `generateMetadata` + `generateStaticParams`, but that's per-slug, unrelated to filter state. §3.3's URL-driven, server-rendered filtering is a genuine architecture change here, not a small tweak — currently there is no filter-to-URL wiring to extend, it has to be built from scratch on this route.

**C8 — No map code of substance exists.** No `leaflet`/`mapbox`/`@react-google-maps`/`cesium`/`three` dependency. Only "map" hits: the lucide-react `Map` icon used decoratively, and a **static Google Maps iframe embed** on the property detail page:
```tsx
// src/features/properties/PropertyDetail.tsx:244-252
<iframe
  title={`Map of ${property.location}`}
  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&z=13&output=embed`}
  ...
/>
```
This embed geocodes the **collapsed** `"city, region"` string via a public Maps query URL — confirming the location-collapse problem (A2) already leaks into the one existing map-adjacent feature. No interactive JS map, no coordinate-based anything. Feature C (Cesium) is fully greenfield here.

## D. Featured / detail pages

**D9** — `getFeaturedProperties` and `findPropertyBySlug` (`properties.ts:177-185`) both call the same `fetchPublicProperties()` cache and `.filter()`/`.find()` in JS — **fully share** the `mapProperty`/`Property` pipeline with `PropertiesBrowser`. No divergence. This is good news for Feature B: extending `mapProperty` and the `Property` type once fixes location data for the browser, the featured rail, and the detail page simultaneously.

## E. Existing conventions to respect

**E10** — Tailwind v4, CSS-native config (`src/app/globals.css:3-55` `@theme` block, no `tailwind.config.*` file). Confirmed tokens: `--color-brand-50..950` (teal), `--color-accent-50..700`, `--color-gold-*`, `--color-sky-*`, `--color-coral-*`, `--color-ink-50..950` (text/border grayscale) — used as `text-ink-900`, `bg-brand-50`, etc. throughout. Icons: `lucide-react`. Existing reusable filter primitive: **`FilterDropdown`** (`src/features/properties/FilterDropdown.tsx:13-84`) — generic single-select (`label`, `icon`, `value`, `options`, `onChange`), used 4× in `PropertiesBrowser.tsx`. Any new Location Picker (§3.1) or additional filter controls should extend this component's contract rather than introduce a second dropdown pattern.

**E11** — No `CLAUDE.md` at repo root. `.claude/UI_UX/SKILL.md` exists but is explicitly written for a **React Native mobile app** persona — not applicable to this Next.js site; appears to be a stray shared file, not authoritative project instructions. `README.md` documents the stack, `GRAPHQL_API_URL` env var, and scripts (`yarn lint/format/typecheck/test`, Vitest unit + Playwright e2e). No existing test currently covers `mapProperty`, `PropertiesBrowser`, or the properties data layer — Feature B's test suite (§6) will be the first coverage in this domain, not an extension of an existing pattern.

---

## Summary for you (decisions & scope calls)

1. **No API repo available** (same finding as the dashboard doc) — this repo talks to a remote staging server only. All server-side work in §4 becomes spec-writing + client fallback until that repo is reachable.
2. **The 200-record ceiling and string-collapsed location are both confirmed exactly as the brief suspected** — not hypothetical risks, live bugs today. `getFeaturedProperties`/`findPropertyBySlug` sharing the same pipeline means fixing `mapProperty` + the `Property` type once fixes all three surfaces.
3. **Filtering here is 100% client-side with zero URL state** — §3.3's URL-driven server-rendered filtering is new architecture for this route, not an incremental extension. Recommend treating the `/properties` page as the biggest single chunk of Feature B's UI work.
4. **`baths` is currently a single combined number** on the website's `Property` type even though the server splits `fullBathroom`/`halfBathroom` — flagging in case "add `bathrooms`" in §3.4 was meant to expose the split rather than just rename the existing combined field.
5. **`FilterDropdown` is the one reusable filter primitive** — the Location Picker and any new filter controls should be built as siblings/extensions of it to match existing conventions, per rule 0.6.

No code changes made in this pass. Awaiting go-ahead to proceed into Feature A/B implementation, or into further discovery if the API repo becomes accessible.
