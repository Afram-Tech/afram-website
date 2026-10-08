import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaAnswers } from "@/components/persona/PersonaAnswers";
import { PersonaFaq } from "@/components/persona/PersonaFaq";
import { PersonaFinalCta } from "@/components/persona/PersonaFinalCta";
import { PersonaPhotoHero } from "@/components/persona/PersonaPhotoHero";
import { PersonaProof } from "@/components/persona/PersonaProof";
import { PersonaQuickLinks } from "@/components/persona/PersonaQuickLinks";
import { PersonaSwitcher } from "@/components/persona/PersonaSwitcher";
import { FinancierTypes } from "@/features/developers/FinancierTypes";
import { Requirements } from "@/features/developers/Requirements";
import { CapitalFlow, SellFlow } from "@/features/developers/SellFlow";
import { TalkToPartner } from "@/features/developers/TalkToPartner";
import { Testimonials } from "@/features/developers/Testimonials";
import { TwoPaths } from "@/features/developers/TwoPaths";
import { getAllProperties } from "@/features/landing/data/properties";
import { catalogueStats, sampleProperties } from "@/features/personas/catalogue";
import { ORDER, PERSONAS } from "@/features/personas/developer-personas";
import { siteConfig } from "@/config/site";
import { buildFaqJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "List Properties — Raise Capital and Accelerate Sales",
  description:
    "List an Afram-verified project and reach pre-financed, ready members. Recover capital faster without waiting on slow sales, whether you're an individual vendor or a development firm.",
  path: "/developers",
});

/**
 * The financier count has no live source in this codebase — it is a
 * hand-maintained constant to update rather than being scattered through
 * copy.
 */
const FINANCIERS_FUNDING = 4;

const LINKS = [
  { label: "How selling works", href: "/how-it-works" },
  { label: "Insights", href: "/insights" },
];

export default async function DevelopersPage() {
  const ordered = ORDER.map((id) => PERSONAS[id]);
  const faqGroups = ordered.map((persona) => ({ label: persona.tab, faqs: persona.faqs }));
  const allFaqs = ordered.flatMap((persona) =>
    persona.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
  );

  const properties = await getAllProperties();
  const stats = catalogueStats(properties);
  const proofProperties = sampleProperties(properties);

  const PROOF_STATS = [
    { value: `${stats.listings}`, label: "Verified listings live" },
    { value: `${stats.vendors}`, label: "Developers listing with us" },
    { value: `${FINANCIERS_FUNDING}`, label: "Financiers funding projects" },
    { value: "0%", label: "Share of your project we take" },
  ];

  return (
    <>
      <JsonLd data={buildFaqJsonLd(allFaqs)} />
      <PersonaPhotoHero
        image="/for-vendors-hero.webp"
        imageAlt="A vendor reviewing project plans on-site"
        headline={["Raise Capital", "and accelerate sales"]}
        subhead="List a project on Afram. We verify and validate every project, so financiers fund it and you reach members with financing."
        ctaLabel="Get Started"
        ctaHref="https://app.staging.afram.co/signup?userType=issuer"
      />

      {/* Each audience's question cards render further down, in
          <PersonaAnswers>, rather than inside the switcher panel. */}
      <PersonaSwitcher personas={ordered} blocksInPanel={false} />

      {/* Order follows the vendors page doc (Oct 2026). */}
      <TwoPaths tone="mint" />
      <CapitalFlow />
      <PersonaProof
        title="Projects already listed on Afram."
        intro="Every listing passed a title check before going live. See what vendors have listed."
        stats={PROOF_STATS}
        properties={proofProperties}
        ctaLabel="Browse all listings"
        ctaHref="/properties"
      />
      <FinancierTypes />
      <Requirements />
      <SellFlow />
      <Testimonials title="Developers already selling on Afram." />
      <TalkToPartner />

      <PersonaAnswers personas={ordered} title="Before you list." />
      <PersonaFaq title="Questions vendors ask." groups={faqGroups} />

      <PersonaFinalCta
        title="Turn unsold units into capital."
        subtitle="List a verified project to access financed members or raise capital."
        primary={{ label: "List a project", href: siteConfig.signUpUrl }}
        secondary={{ label: "Talk to a partner", href: "#talk" }}
      />

      <PersonaQuickLinks links={LINKS} />
    </>
  );
}
