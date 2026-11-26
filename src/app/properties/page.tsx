import type { Metadata } from "next";
import { Suspense } from "react";

import { SecBadge } from "@/components/ui/SecBadge";
import { getAllProperties, type Property } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";
import { PropertiesBrowser } from "@/features/properties/PropertiesBrowser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Browse properties",
  description:
    "Browse verified properties on Afram — every listing checked against Lands Commission records. Filter by status, location, type, and price.",
  path: "/properties",
});

/** PropertiesBrowser reads the URL (region/city/area) via useSearchParams,
 *  which needs a Suspense boundary, and everything inside it renders in the
 *  browser only. So the fallback, which is all the prerendered HTML holds,
 *  lists the real listings: a search engine reading it finds a link to every
 *  property. Its spacing mirrors the browser's so the swap doesn't jump. */
function PropertiesBrowserFallback({ properties }: { properties: Property[] }) {
  return (
    <div>
      <div
        className="border-ink-100 shadow-card h-[316px] rounded-[20px] border bg-white md:h-[166px] lg:h-[106px]"
        aria-hidden="true"
      />
      <div className="mt-6 h-10" aria-hidden="true" />
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property.slug} className="flex [&>article]:w-full">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PropertiesPage() {
  const allProperties = await getAllProperties();

  return (
    <section className="bg-white px-5 py-10 lg:px-[34px] lg:py-14">
      <div className="mx-auto max-w-[1536px]">
        <div className="mb-8">
          <SecBadge />
          <h1 className="t-h1 text-ink-900 mt-5 max-w-4xl">Verified properties you can trust</h1>
          <p className="t-lead text-ink-600 mt-3.5 max-w-xl">
            Every home below is checked against Lands Commission records before it is listed.
            Filter to find the one that fits.
          </p>
        </div>

        <Suspense fallback={<PropertiesBrowserFallback properties={allProperties} />}>
          <PropertiesBrowser properties={allProperties} />
        </Suspense>
      </div>
    </section>
  );
}
