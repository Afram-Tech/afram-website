import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";
import { getFeaturedProperties } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";

interface FeaturedPropertiesSectionProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export async function FeaturedPropertiesSection({
  heading,
  subheading,
  ctaLabel,
  ctaLink,
}: FeaturedPropertiesSectionProps = {}) {
  const properties = await getFeaturedProperties(6);
  if (properties.length === 0) return null;

  return (
    <Section id="properties">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 className="t-h2 text-ink-900">{heading ?? "Featured properties"}</h2>
          <p className="t-lead text-ink-500 mt-3">
            {subheading ??
              "Browse verified properties listed on Afram's blockchain-powered marketplace."}
          </p>
        </div>
        <Link
          href={ctaLink ?? "/properties"}
          className={buttonVariants(
            "secondary",
            "md",
            "h-10 w-fit shrink-0 gap-1.5 px-[18px] text-sm",
          )}
        >
          {ctaLabel ?? "See all properties"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <Reveal key={property.slug} delay={(index % 3) * 0.06} className="flex">
            <PropertyCard property={property} className="w-full" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
