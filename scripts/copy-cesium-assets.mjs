#!/usr/bin/env node
/**
 * Copies Cesium's static runtime assets (Workers, ThirdParty, Assets,
 * Widgets) from node_modules/cesium/Build/Cesium into public/cesium/, so
 * Next.js serves them as plain static files at /cesium/*.
 *
 * Cesium isn't a normal ESM/CJS-only package: at runtime it fetches its own
 * web workers, WASM binaries, and default imagery/terrain assets from a
 * base URL it's told about (window.CESIUM_BASE_URL, set in
 * PropertyGlobe.tsx before the Cesium module is touched) — bundling them
 * through webpack/Turbopack the normal way isn't supported. Copying into
 * public/ is the standard framework-agnostic fix: it works identically
 * whether the dev server is running Turbopack or a production build is
 * running webpack, since both just serve public/ as static files.
 *
 * Runs on `yarn install` (see package.json's postinstall) so a fresh clone
 * or a cesium version bump stays in sync automatically — nothing under
 * public/cesium/ is hand-edited, same convention as src/data/boundaries/.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(__dirname, "..", "node_modules", "cesium", "Build", "Cesium");
const DEST = join(__dirname, "..", "public", "cesium");
const SUBDIRS = ["Workers", "ThirdParty", "Assets", "Widgets"];

if (!existsSync(SOURCE)) {
  console.warn(`copy-cesium-assets: ${SOURCE} not found — skipping (cesium not installed yet?)`);
  process.exit(0);
}

rmSync(DEST, { recursive: true, force: true });
for (const subdir of SUBDIRS) {
  cpSync(join(SOURCE, subdir), join(DEST, subdir), { recursive: true });
}

console.log(`copy-cesium-assets: copied ${SUBDIRS.join(", ")} to ${DEST}`);
