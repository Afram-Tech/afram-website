import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

/**
 * Cache setup for live Sanity updates.
 *
 * - incrementalCache (KV): writable, so a revalidated page persists between
 *   requests. The previous static-assets cache was read-only, which meant every
 *   request past the revalidate window re-rendered from scratch.
 * - tagCache (D1): makes `revalidateTag` actually take effect. Without it the
 *   default is "dummy", whose writeTags() is a no-op and isStale() always
 *   returns false — so SanityLive fired revalidations that did nothing. D1 is
 *   used rather than the KV tag cache because the latter is experimental and
 *   eventually consistent (up to 60s). The `revalidations` table is created
 *   automatically by `opennextjs-cloudflare deploy`.
 * - queue ("direct"): the default "dummy" queue throws FatalError the moment a
 *   page goes stale, which returned 500s from routingHandler.
 *
 * Both bindings must exist in wrangler.jsonc before deploying — the deploy-time
 * populate step fails hard if a configured binding is missing.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: "direct",
  // Serves cached pages from the routing layer, skipping the Next server.
  // Must stay false if PPR is ever enabled.
  enableCacheInterception: true,
});
