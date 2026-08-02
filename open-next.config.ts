import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * No incremental cache is configured, so pages with `revalidate` re-render on
 * each request instead of persisting between them.
 *
 * To enable KV caching, create the namespace and add its binding to
 * wrangler.jsonc FIRST (see README) — `opennextjs-cloudflare deploy` populates
 * the cache at deploy time and fails hard if the binding is missing — then swap
 * the export for:
 *
 *   import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
 *   import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
 *
 *   export default defineCloudflareConfig({
 *     incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
 *     enableCacheInterception: true,
 *   });
 */
export default defineCloudflareConfig();
