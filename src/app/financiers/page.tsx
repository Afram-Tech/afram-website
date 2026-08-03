import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaFaq } from "@/components/persona/PersonaFaq";
import { PersonaFinalCta } from "@/components/persona/PersonaFinalCta";
import { PersonaPhotoHero } from "@/components/persona/PersonaPhotoHero";
import { PersonaScroller } from "@/components/persona/PersonaScroller";
import { BriefingForm } from "@/features/financiers/BriefingForm";
import { FinancierPillars } from "@/features/financiers/FinancierPillars";
import { YieldRanges } from "@/features/financiers/YieldRanges";
import { ORDER, PERSONAS } from "@/features/personas/financier-personas";
import { ACCENT_VARS } from "@/lib/accents";
import { buildFaqJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Financiers — Deploy Capital into Verified Real Estate",
  description:
    "Deploy capital into title-verified Ghanaian real estate — secured by a first legal charge, on your own terms, with full KYC. For banks, private credit, and impact/diaspora capital.",
  path: "/financiers",
});

export default function FinanciersPage() {
  const ordered = ORDER.map((id) => PERSONAS[id]);
  const faqGroups = ordered.map((persona) => ({ label: persona.tab, faqs: persona.faqs }));
  const allFaqs = ordered.flatMap((persona) =>
    persona.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
  );

  return (
    <>
      <JsonLd data={buildFaqJsonLd(allFaqs)} />
      <div style={ACCENT_VARS.emerald as React.CSSProperties}>
        <PersonaPhotoHero
          image="/for-financiers-hero.webp"
          imageAlt="Two financiers shaking hands over a deal"
          headline={["Deploy Capital into", "Verified Real Estate"]}
          subhead="Deploy capital into title-verified Ghanaian real estate — secured by a first legal charge, on your own terms, with full KYC."
          ctaLabel="Get Started"
          ctaHref="#briefing"
        />

        <PersonaScroller personas={ordered} />

        <FinancierPillars />
        <YieldRanges />
        <BriefingForm />

        <PersonaFaq title="Questions financiers ask…" groups={faqGroups} />

        <PersonaFinalCta
          title="Put capital to work, safely."
          subtitle="Verified collateral, your own rules, and a clear enforcement path."
          primary={{ label: "Request a briefing", href: "#briefing" }}
          secondary={{ label: "How it works", href: "/how-it-works" }}
        />
      </div>
    </>
  );
}
