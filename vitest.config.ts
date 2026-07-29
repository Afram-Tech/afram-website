/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    globals: true,
  },
});
