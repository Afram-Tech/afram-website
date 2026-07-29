import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  globalIgnores(["dist/**", ".astro/**", "playwright-report/**", "test-results/**", "coverage/**"]),
  tseslint.configs.recommended,
  eslintPluginAstro.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    ...reactHooks.configs.flat["recommended-latest"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  prettierConfig,
]);

export default eslintConfig;
