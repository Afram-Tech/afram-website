import { defineLive } from "next-sanity/live";

import { client } from "@/sanity/lib/client";

const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.warn(
    "SANITY_API_READ_TOKEN is not set — live content updates won't work until it is. Reads will still fall back to the CDN.",
  );
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
