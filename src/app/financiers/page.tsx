import { Hammer, Home } from "lucide-react";
import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaAnswers } from "@/components/persona/PersonaAnswers";
import { PersonaFaq } from "@/components/persona/PersonaFaq";
import { PersonaFinalCta } from "@/components/persona/PersonaFinalCta";
import { PersonaPhotoHero } from "@/components/persona/PersonaPhotoHero";
import { PersonaProof } from "@/components/persona/PersonaProof";
import { PersonaQuickLinks } from "@/components/persona/PersonaQuickLinks";
import { PersonaSwitcher } from "@/components/persona/PersonaSwitcher";
import { ProductPreview } from "@/components/persona/ProductPreview";
import { siteConfig } from "@/config/site";
import { BriefingForm } from "@/features/financiers/BriefingForm";
import { WhereOurJobEnds } from "@/features/financiers/WhereOurJobEnds";
import { YieldRanges } from "@/features/financiers/YieldRanges";
import { TwoPaths, type Path } from "@/features/developers/TwoPaths";
import { getAllProperties } from "@/features/landing/data/properties";
import { catalogueStats, sampleProperties } from "@/features/personas/catalogue";
import { ORDER, PERSONAS } from "@/features/personas/financier-personas";
import { buildFaqJsonLd, buildMetadata } from "@/lib/seo";
import { accessCta, signUpHref } from "@/features/access/cta";

/* Reads "Request Access" while the site is invite-only. The href also loses a
   stray double slash it carried while nothing navigated through it. */
const FINANCIER_CTA = accessCta({ label: "Get Started", href: signUpHref("financier") });

export const metadata: Metadata = buildMetadata({
  title: "Financiers — Deploy Capital into Verified Real Estate",
  description:
    "Secured, compliant exposure to Ghanaian real estate: verified title, documented security, full KYC, and terms you set.",
  path: "/financiers",
});

/** What you can finance — kept to a line each, like the vendors page. */
const FINANCE_PATHS: Path[] = [
  {
    badge: "Developers",
    icon: Hammer,
    title: "Lend to developers to build or finish a phase.",
    intro: "Verified projects, repaid from unit sales.",
    points: [],
    cta: { label: "Request a briefing", href: "#briefing" },
  },
  {
    badge: "Home members",
    icon: Home,
    title: "Lend to members of verified homes.",
    intro: "Often the same asset you funded during construction.",
    points: [],
    cta: { label: "Request a briefing", href: "#briefing" },
  },
];

const LINKS = [
  { label: "Pricing and tenure", href: "#yield" },
  // No dedicated key-risks page on this site yet — same destination as the
  // "Key risks" link on every capital-at-risk note.
  { label: "Key risks", href: "/privacy-policy" },
  { label: "Verify a title", href: siteConfig.registryUrl, external: true, on: "Afram Verify" },
  { label: "Request a briefing", href: "#briefing" },
];

export default async function FinanciersPage() {
  const ordered = ORDER.map((id) => PERSONAS[id]);
  const faqGroups = ordered.map((persona) => ({ label: persona.tab, faqs: persona.faqs }));
  const allFaqs = ordered.flatMap((persona) =>
    persona.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
  );

  const properties = await getAllProperties();
  const stats = catalogueStats(properties);
  const proofProperties = sampleProperties(properties);

  // The page's standing terms. Rates are agreed with the borrower, so no yield stat.
  const PROOF_STATS = [
    { value: "Secured", label: "Security pack prepared for every loan" },
    { value: "≤5 days", label: "From agreed mandate and completed KYC to live deals" },
    { value: `${stats.listings}`, label: "Title-verified assets on platform" },
  ];

  return (
    <>
      <JsonLd data={buildFaqJsonLd(allFaqs)} />
      <PersonaPhotoHero
        image="/for-financiers-hero.webp"
        imageAlt="Two financiers shaking hands over a deal"
        headline={["Deploy capital into verified Ghanaian real estate."]}
        subhead="Every loan is secured against title-verified Ghanaian real estate, with full KYC and terms you control."
        ctaLabel={FINANCIER_CTA.label}
        ctaHref={FINANCIER_CTA.href}
        overlay
      />

      {/* Each audience's question cards render further down, in
          <PersonaAnswers>, rather than inside the switcher panel. */}
      <PersonaSwitcher personas={ordered} blocksInPanel={false} />

      <TwoPaths
        tone="mint"
        title="Finance the build, or finance the member."
        paths={FINANCE_PATHS}
      />
      <PersonaProof
        title="Assets already verified on Afram."
        intro="Every asset is reconciled against Lands Commission records before it can receive a financing request. Look at the book yourself."
        stats={PROOF_STATS}
        properties={proofProperties}
        ctaLabel="Browse the catalogue"
        ctaHref="/properties"
      />
      <YieldRanges />
      <WhereOurJobEnds />
      <BriefingForm />
      <ProductPreview
        title="Your book, your rules, one dashboard."
        intro="Positions, collateral records and documentation in one place."
      />

      <PersonaAnswers personas={ordered} title="Before you lend." />
      <PersonaFaq title="Questions financiers ask." groups={faqGroups} riskKind="lending" />

      <PersonaFinalCta
        title="Put capital to work."
        subtitle="Verified collateral, your own rules, and a clear enforcement path."
        primary={{ label: "Request a briefing", href: "#briefing" }}
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />

      <PersonaQuickLinks links={LINKS} />
    </>
  );
}
