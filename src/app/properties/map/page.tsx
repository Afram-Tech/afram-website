import type { Metadata } from "next";
import { Suspense } from "react";

import { Section } from "@/components/ui/Section";
import { getAllProperties } from "@/features/landing/data/properties";
import { PropertiesBrowser } from "@/features/properties/PropertiesBrowser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Browse Verified Properties — Map",
  description:
    "Explore blockchain-verified properties for sale in Ghana on an interactive map, complete with flexible financing options for qualified members.",
  path: "/properties/map",
});

/** Same fallback shape as /properties' — see that page for why this exists
 *  (useSearchParams needs a Suspense boundary here too). */
function PropertiesBrowserFallback() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="bg-ink-100 h-96 rounded-[22px]" />
    </div>
  );
}

/**
 * A sibling route to /properties, not a tab within it — PropertiesBrowser
 * reads which one it's rendering from the URL (usePathname), and the
 * Grid/Map toggle is a pair of <Link>s between the two, not local state.
 * Both routes fetch and render the same way and share one filter bar; only
 * the map one skips the page heading in favour of a much taller map, since a route switch (not a client-only toggle)
 * makes "Map" bookmarkable/shareable and back-button-able on its own.
 */
export default async function PropertiesMapPage() {
  const allProperties = await getAllProperties();

  return (
    <Section className="py-6 lg:py-8">
      <Suspense fallback={<PropertiesBrowserFallback />}>
        <PropertiesBrowser properties={allProperties} />
      </Suspense>
    </Section>
  );
}
