import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";
import { FEATURED_PROPERTIES } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";

export function MorePropertiesSection() {
  const list = FEATURED_PROPERTIES.slice(0, 9);

  return (
    <Section>
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-ink-900 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
            More Properties
          </h2>
        </div>
        <Link
          href="/properties"
          className={buttonVariants("primary", "sm", "shrink-0 rounded-full")}
        >
          See more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-y-12">
        {list.map((property) => (
          <div key={property.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </Section>
  );
}
