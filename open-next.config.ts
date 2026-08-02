import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

/**
 * ISR/SSG pages are cached in KV (global) and fronted by the per-colo Cache API,
 * so a warm region serves them without a KV round trip.
 *
 * The KV binding is optional at runtime: without `NEXT_INC_CACHE_KV` the cache
 * reports a miss and rendering falls through to the server, so deploys keep
 * working before the namespace exists. See README for the one-time setup.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
  // Serves cached ISR/SSG responses from the routing layer, skipping the full
  // Next server. Must stay false if PPR is ever enabled.
  enableCacheInterception: true,
});
