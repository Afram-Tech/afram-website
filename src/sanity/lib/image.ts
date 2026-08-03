import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";

const builder = createImageUrlBuilder(client);

/**
 * `auto("format")` makes Sanity's CDN negotiate WebP/AVIF from the request's
 * Accept header. Next's own optimizer is a no-op on Workers — it cannot run
 * sharp in workerd and passes bytes through unchanged — so format conversion
 * has to happen at the origin CDN.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
