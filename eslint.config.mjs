import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  globalIgnores([
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    "coverage/**",
    "src/types/generated/**",
    // Vendored maplibre-gl worker bundle — copied verbatim out of
    // node_modules by scripts/copy-maplibre-worker.mjs (predev/prebuild),
    // not source anyone edits or should lint.
    "public/maplibre/**",
  ]),
]);

export default eslintConfig;
