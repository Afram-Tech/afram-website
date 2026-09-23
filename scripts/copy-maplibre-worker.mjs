#!/usr/bin/env node
/**
 * Copies maplibre-gl's Web Worker (and its sibling shared chunk) from
 * node_modules into public/maplibre/, so Next.js serves them as plain
 * static files at /maplibre/*.
 *
 * maplibre-gl v6 ships its tile-processing worker as an ESM module
 * (maplibre-gl-worker.mjs) that maplibre-gl/dist/maplibre-gl.mjs expects to
 * `new Worker(...)` at a URL it's told about — bundling it through Next's
 * normal pipeline isn't supported, and Turbopack can't resolve the
 * relative worker URL maplibre-gl computes at import time on its own
 * (confirmed live: without this, PropertyMap.tsx's map renders with no
 * tiles at all and the console shows "Worker failed to load"). This is
 * MapLibre's own documented fix for Next.js/Turbopack specifically
 * (maplibre.org/maplibre-gl-js/docs/, "ESM" bundler section) — copy both
 * files (the worker imports its shared sibling by relative path, so it
 * fails on first import if that sibling isn't alongside it) and point
 * setWorkerUrl() at the copy (see PropertyMap.tsx).
 *
 * Runs on `yarn install` (see package.json's postinstall). MapLibre's own
 * docs example uses predev/prebuild instead, npm-CLI conventions for
 * "run this before any script named X" — Yarn (classic or Berry) has never
 * supported that for arbitrary script names, only for its own fixed
 * lifecycle hooks (preinstall/install/postinstall/prepare/…), confirmed the
 * hard way: prebuild silently never ran under `yarn build`, so
 * public/maplibre/ was missing and the build otherwise succeeded anyway
 * (Next only errors on a missing worker file at runtime, in the browser,
 * not at build time). postinstall is the one hook this package manager
 * actually fires reliably. Nothing under public/maplibre/ is hand-edited,
 * same convention as src/data/boundaries/.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const dist = join(dirname(require.resolve("maplibre-gl/package.json")), "dist");
const dest = join(__dirname, "..", "public", "maplibre");
const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

mkdirSync(dest, { recursive: true });
for (const file of FILES) {
  copyFileSync(join(dist, file), join(dest, file));
}

console.log(`copy-maplibre-worker: copied ${FILES.join(", ")} to ${dest}`);
