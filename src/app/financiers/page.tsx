import { Hammer, Home } from "lucide-react";
import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaFaq } from "@/components/persona/PersonaFaq";
import { PersonaFinalCta } from "@/components/persona/PersonaFinalCta";
import { PersonaPhotoHero } from "@/components/persona/PersonaPhotoHero";
import { PersonaProof } from "@/components/persona/PersonaProof";
import { PersonaQuickLinks } from "@/components/persona/PersonaQuickLinks";
import { PersonaSwitcher } from "@/components/persona/PersonaSwitcher";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { BriefingForm } from "@/features/financiers/BriefingForm";
import { RecognisedBy } from "@/features/financiers/RecognisedBy";
import { WhereOurJobEnds } from "@/features/financiers/WhereOurJobEnds";
import { YieldRanges } from "@/features/financiers/YieldRanges";
import { TwoPaths, type Path } from "@/features/developers/TwoPaths";
import { getAllProperties } from "@/features/landing/data/properties";
import { catalogueStats, sampleProperties } from "@/features/personas/catalogue";
import { ORDER, PERSONAS } from "@/features/personas/financier-personas";
import { buildFaqJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Financiers — Deploy Capital into Verified Real Estate",
  description:
    "Deploy capital into title-verified Ghanaian real estate — secured by a first legal charge, on your own terms, with full KYC. For banks, private credit, and impact/diaspora capital.",
  path: "/financiers",
});

/** What you can finance. */
const FINANCE_PATHS: Path[] = [
  {
    badge: "Developers",
    icon: Hammer,
    title: "Fund the build.",
    intro: "A developer requests financing to construct, or to finish a phase that ran short.",
    points: [
      ["Verified asset.", "Title confirmed against Lands Commission records."],
      ["First legal charge.", "Registered in the ordinary way, in your name."],
      ["Repaid from unit sales.", "The same stock buyers are already searching for."],
    ],
    cta: { label: "Request a briefing", href: "#briefing" },
  },
  {
    badge: "Home buyers",
    icon: Home,
    title: "Fund the purchase.",
    intro:
      "A buyer requests financing for a completed unit whose title you have already seen verified.",
    points: [
      ["Collateral you know.", "Often the same asset you funded during construction."],
      ["Their details reach you direct.", "Your KYC, your affordability call."],
      ["Collections tracked.", "Arrears surfaced on the platform, not buried."],
    ],
    cta: { label: "Request a briefing", href: "#briefing" },
  },
];

const LINKS = [
  { label: "Yield and tenure", href: "#yield" },
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

  const PROOF_STATS = [
    { value: "22–45%", label: "Target yield per annum, by mandate" },
    { value: "1st", label: "Legal charge registered on every loan" },
    { value: "≤5 days", label: "From agreed mandate to live deals" },
    { value: `${stats.listings}`, label: "Title-verified assets on platform" },
  ];

  return (
    <>
      <JsonLd data={buildFaqJsonLd(allFaqs)} />
      <PersonaPhotoHero
        image="/for-financiers-hero.webp"
        imageAlt="Two financiers shaking hands over a deal"
        headline={["Deploy Capital into", "Verified Real Estate"]}
        subhead="Every loan sits behind a first legal charge on title-verified Ghanaian real estate, with full KYC and terms you control."
        ctaLabel="Get Started"
        ctaHref="https://app.staging.afram.co/signup?userType=financier"
        overlay
      />

      <PersonaSwitcher personas={ordered} />

      <TwoPaths
        tone="mint"
        title="Finance the build, or finance the buyer."
        paths={FINANCE_PATHS}
      />
      <RecognisedBy />
      <PartnerLogos />
      <PersonaProof
        title="Assets already verified on Afram."
        intro="Every asset is reconciled against Lands Commission records before a loan is written against it. Look at the book yourself."
        stats={PROOF_STATS}
        properties={proofProperties}
        ctaLabel="Browse the catalogue"
        ctaHref="/properties"
      />
      <YieldRanges />
      <WhereOurJobEnds />
      <BriefingForm />

      <PersonaFaq title="Questions financiers ask…" groups={faqGroups} />

      <PersonaFinalCta
        title="Put capital to work, safely."
        subtitle="Verified collateral, your own rules, and a clear enforcement path."
        primary={{ label: "Request a briefing", href: "#briefing" }}
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />

      <PersonaQuickLinks links={LINKS} />
    </>
  );
}
