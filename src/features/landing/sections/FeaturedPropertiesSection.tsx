import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";
import { getFeaturedProperties } from "@/features/landing/data/properties";
import { PropertyMarquee } from "@/features/landing/PropertyMarquee";

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
  const featuredProperties = await getFeaturedProperties();

  return (
    <Section id="properties">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-ink-900 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
            {heading ?? "Featured properties"}
          </h2>
          <p className="text-ink-500 mt-3 text-[16px] leading-relaxed">
            {subheading ??
              "Browse verified properties listed on Afram's blockchain-powered marketplace."}
          </p>
        </div>
        <Link
          href={ctaLink ?? "/properties"}
          className={buttonVariants("primary", "sm", "shrink-0 rounded-full")}
        >
          {ctaLabel ?? "See more"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <PropertyMarquee properties={featuredProperties} />
    </Section>
  );
}
