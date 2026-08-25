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
import { getHomePageContent } from "@/features/landing/data/home";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blockchain-Verified Real Estate Marketplace in Ghana",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const content = await getHomePageContent();

  return (
    <>
      <HeroSection content={content ?? undefined} />
      {/* <PartnerLogosSection heading={content?.partnerLogosHeading} partners={content?.partners} /> */}
      <FeaturedPropertiesSection
        heading={content?.featuredPropertiesHeading}
        subheading={content?.featuredPropertiesSubheading}
        ctaLabel={content?.featuredPropertiesCtaLabel}
        ctaLink={content?.featuredPropertiesCtaLink}
      />
      <MorePropertiesSection
        heading={content?.morePropertiesHeading}
        ctaLabel={content?.morePropertiesCtaLabel}
        ctaLink={content?.morePropertiesCtaLink}
      />
      <Section id="calculator" className="bg-accent-50/60">
        <SectionHeading
          align="center"
          eyebrow={content?.affordabilityEyebrow ?? "Affordability"}
          title={content?.affordabilityTitle ?? "What can you afford?"}
          intro={
            content?.affordabilityIntro ??
            "Drag to set your monthly take-home. We'll show a comfortable home price, the deposit, and what the instalment looks like over five or ten years."
          }
        />
        <AffordabilityCalculatorSection />
      </Section>
      <FeaturedArticlesSection
        heading={content?.featuredArticlesHeading}
        subheading={content?.featuredArticlesSubheading}
        ctaLabel={content?.featuredArticlesCtaLabel}
        ctaLink={content?.featuredArticlesCtaLink}
      />
    </>
  );
}
