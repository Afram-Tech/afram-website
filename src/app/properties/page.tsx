import type { Metadata } from "next";
import { Suspense } from "react";

import { Section } from "@/components/ui/Section";
import { getAllProperties, type Property } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";
import { PropertiesBrowser } from "@/features/properties/PropertiesBrowser";
import { PropertyBrowseLinks } from "@/features/properties/PropertyCollection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Houses & Apartments for Sale in Ghana",
  description:
    "Browse title-verified houses, apartments, townhouses and villas for sale in Ghana, with flexible financing options for qualified buyers.",
  path: "/properties",
});

/** PropertiesBrowser reads the URL (region/city/area) via useSearchParams,
 *  which Next.js requires a Suspense boundary for on an otherwise statically
 *  rendered page — and everything inside that boundary is rendered in the
 *  browser only, so this fallback is all the prerendered HTML contains. It
 *  shows the real, unfiltered listings (not a skeleton) so a search engine
 *  reading that HTML finds a link to every property; visitors only see it
 *  for the instant before the browser takes over. Spacing mirrors
 *  PropertiesBrowser's grid view so the swap doesn't jump. */
function PropertiesBrowserFallback({ properties }: { properties: Property[] }) {
  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="text-ink-900 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          Browse verified properties
        </h1>
        <p className="text-ink-500 mt-3 text-[16px] leading-relaxed">
          Every listing below is title-verified against Ghana&apos;s Lands Commission records and
          recorded on-chain.
        </p>
      </div>
      <div className="bg-ink-50 mt-8 h-10 rounded-full" aria-hidden="true" />
      <div className="mt-3 h-5" aria-hidden="true" />
      <div className="gap-x-card mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
        {properties.map((property) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>
    </div>
  );
}

export default async function PropertiesPage() {
  const allProperties = await getAllProperties();

  return (
    <Section>
      <Suspense fallback={<PropertiesBrowserFallback properties={allProperties} />}>
        <PropertiesBrowser properties={allProperties} />
      </Suspense>
      {/* <PropertyBrowseLinks allProperties={allProperties} /> */}
    </Section>
  );
}
