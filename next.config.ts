import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next's optimizer cannot run sharp in workerd, so `/_next/image` on
     * Cloudflare returns the source bytes unchanged — it only adds a Worker
     * invocation per image. Skipping it lets static images be served straight
     * from the assets CDN, and remote images already carry their own sizing
     * and format params (Sanity via `urlFor`, Unsplash via `auto=format`).
     */
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
