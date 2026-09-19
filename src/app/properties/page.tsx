import type { Metadata } from "next";
import { Suspense } from "react";

import { Section } from "@/components/ui/Section";
import { getAllProperties } from "@/features/landing/data/properties";
import { PropertiesBrowser } from "@/features/properties/PropertiesBrowser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Browse Verified Properties",
  description:
    "Browse blockchain-verified properties for sale in Ghana, complete with flexible financing options for qualified members.",
  path: "/properties",
});

/** PropertiesBrowser reads the URL (region/city/area) via useSearchParams,
 *  which Next.js requires a Suspense boundary for on an otherwise statically
 *  rendered page — the fallback below only ever shows for the instant it
 *  takes searchParams to resolve, not a real loading state, since
 *  `properties` is already fetched by the time this renders. */
function PropertiesBrowserFallback() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="bg-ink-100 h-10 w-2/3 max-w-md rounded-full" />
      <div className="bg-ink-100 mt-3 h-4 w-1/2 max-w-sm rounded-full" />
      <div className="bg-brand-50 mt-8 h-40 rounded-[22px]" />
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-ink-100 h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function PropertiesPage() {
  const allProperties = await getAllProperties();

  return (
    <Section>
      <Suspense fallback={<PropertiesBrowserFallback />}>
        <PropertiesBrowser properties={allProperties} />
      </Suspense>
    </Section>
  );
}
