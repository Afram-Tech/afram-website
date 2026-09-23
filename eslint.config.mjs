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
    // Vendored, minified Cesium runtime assets — copied verbatim out of
    // node_modules by scripts/copy-cesium-assets.mjs on every install
    // (see that script's own comment), not source anyone edits or should
    // lint.
    "public/cesium/**",
  ]),
]);

export default eslintConfig;
