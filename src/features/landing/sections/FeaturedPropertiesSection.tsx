import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";
import { getAllProperties } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";

export async function FeaturedPropertiesSection() {
  const featuredProperties = await getAllProperties();
  const track = [...featuredProperties, ...featuredProperties];

  return (
    <Section id="properties">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-ink-900 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
            Featured properties
          </h2>
          <p className="text-ink-500 mt-3 text-[16px] leading-relaxed">
            Browse verified properties listed on Afram&apos;s blockchain-powered marketplace.
          </p>
        </div>
        <Link
          href="/properties"
          className={buttonVariants("primary", "sm", "shrink-0 rounded-full")}
        >
          See more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="group/ticker relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" />

        <div className="marquee-track flex group-hover/ticker:[animation-play-state:paused]">
          {track.map((property, index) => (
            <div
              key={`${property.slug}-${index}`}
              className="mr-7 w-[290px] shrink-0 sm:w-[330px]"
              aria-hidden={index >= featuredProperties.length ? true : undefined}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
