import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Prerendered pages are served from the Workers static assets binding instead of
 * being re-rendered per request. OpenNext's default is `"dummy"` — no cache at
 * all — which meant every hit re-ran the GraphQL fetch and a full React render,
 * exhausting the Worker CPU limit (error 1102).
 *
 * This cache is read-only: revalidation does not persist, so content refreshes
 * on redeploy. Requires no binding, so `opennextjs-cloudflare deploy` populates
 * it without any extra setup.
 *
 * To also persist revalidation, create the KV namespace and add its binding to
 * wrangler.jsonc FIRST (see README) — the deploy-time populate step fails hard
 * if the config names a binding that does not exist — then swap to:
 *
 *   import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
 *   import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
 *
 *   incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // Serves cached pages from the routing layer, skipping the Next server
  // entirely. Must stay false if PPR is ever enabled.
  enableCacheInterception: true,
});
