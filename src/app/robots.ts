import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Everything public is crawlable. `/api/` only holds the Sanity draft-mode
 * switches, which have nothing to index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
