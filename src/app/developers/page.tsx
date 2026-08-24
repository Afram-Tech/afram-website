import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaFaq } from "@/components/persona/PersonaFaq";
import { PersonaFinalCta } from "@/components/persona/PersonaFinalCta";
import { PersonaPhotoHero } from "@/components/persona/PersonaPhotoHero";
import { PersonaProof } from "@/components/persona/PersonaProof";
import { PersonaQuickLinks } from "@/components/persona/PersonaQuickLinks";
import { PersonaSwitcher } from "@/components/persona/PersonaSwitcher";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { FinancierTypes } from "@/features/developers/FinancierTypes";
import { Requirements } from "@/features/developers/Requirements";
import { SellFlow } from "@/features/developers/SellFlow";
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
    "List an Afram-verified project and reach pre-financed, ready buyers. Recover capital faster without waiting on slow sales, whether you're an individual vendor or a development firm.",
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
        subhead="List an Afram-verified project and bring it financed buyers who are ready to sign — and recover capital without waiting on slow sales."
        ctaLabel="Get Started"
        ctaHref="https://app.staging.afram.co/signup?userType=issuer"
      />

      <PersonaSwitcher personas={ordered} />

      <TwoPaths />
      {/* <PartnerLogos /> */}
      <PersonaProof
        title="Projects already listed on Afram."
        intro="Every listing here cleared a title check before it went live. Browse what is on the platform today."
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

      <PersonaFaq title="Questions vendors ask…" groups={faqGroups} />

      <PersonaFinalCta
        title="Turn idle inventory into cash."
        subtitle="List a verified project and let financed buyers come to you."
        primary={{ label: "List a project", href: siteConfig.signUpUrl }}
        secondary={{ label: "Talk to a partner", href: "#talk" }}
      />

      <PersonaQuickLinks links={LINKS} />
    </>
  );
}
