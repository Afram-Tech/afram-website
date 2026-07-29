import type { Metadata } from "next";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { AffordabilityCalculatorSection } from "@/features/landing/sections/AffordabilityCalculatorSection";
import { FeaturedArticlesSection } from "@/features/landing/sections/FeaturedArticlesSection";
import { FeaturedPropertiesSection } from "@/features/landing/sections/FeaturedPropertiesSection";
import { HeroSection } from "@/features/landing/sections/HeroSection";
import { MorePropertiesSection } from "@/features/landing/sections/MorePropertiesSection";
import { PartnerLogosSection } from "@/features/landing/sections/PartnerLogosSection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blockchain-Verified Real Estate Marketplace in Ghana",
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PartnerLogosSection />
      <FeaturedPropertiesSection />
      <MorePropertiesSection />
      <Section id="calculator" className="bg-accent-50/60">
        <SectionHeading
          align="center"
          eyebrow="Affordability"
          title="What can you afford?"
          intro="Set your monthly take-home. We'll show a comfortable home price, the deposit, and the instalment over 10 years."
        />
        <AffordabilityCalculatorSection />
      </Section>
      <FeaturedArticlesSection />
    </>
  );
}
