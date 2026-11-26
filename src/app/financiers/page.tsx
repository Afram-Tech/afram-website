import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaHeroPhoto } from "@/components/persona/PersonaHeroPhoto";
import { PersonaProof } from "@/components/persona/PersonaProof";
import { PersonaQuickLinks } from "@/components/persona/PersonaQuickLinks";
import { PersonaShell } from "@/components/persona/PersonaShell";
import { accessCta, signUpHref } from "@/features/access/cta";
import { BriefingForm } from "@/features/financiers/BriefingForm";
import { LenderConcerns } from "@/features/financiers/LenderConcerns";
import { LendingBands } from "@/features/financiers/LendingBands";
import { WhereOurJobEnds } from "@/features/financiers/WhereOurJobEnds";
import { YieldRanges } from "@/features/financiers/YieldRanges";
import { getAllProperties } from "@/features/landing/data/properties";
import { catalogueStats } from "@/features/personas/catalogue";
import { VERIFY_URL } from "@/lib/config";
import { DEFAULT, ORDER, PERSONAS } from "@/lib/data/financier-personas";
import { PHOTOS } from "@/lib/data/photos";
import { buildFaqJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Lend against verified collateral",
  description:
    "Secured, compliant exposure to Ghanaian real estate: verified title, documented security, full KYC, and terms you set.",
  path: "/financiers",
});

/** Reads "Request Access" while the site is invite-only. */
const GET_STARTED = accessCta({ label: "Get Started", href: signUpHref("financier") });

const LINKS = [
  { label: "Pricing and tenure", href: "#yield" },
  { label: "Key risks", href: "/legal/key-risks" },
  { label: "Verify a title", href: VERIFY_URL, external: true, on: "Afram Verify" },
  { label: "Request a briefing", href: "#briefing" },
];

export default async function FinanciersPage() {
  const catalogue = catalogueStats(await getAllProperties());
  /** The page's standing terms. Rates are agreed with the borrower, so no yield stat. */
  const stats = [
    { value: "Secured", label: "Security pack prepared for every loan" },
    { value: "≤5 business days", label: "From agreed mandate and completed KYC to live deals" },
    { value: `${catalogue.listings}`, label: "Title-verified assets on platform" },
  ];
  const faqs = ORDER.flatMap((id) =>
    PERSONAS[id].faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
  );

  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <PersonaShell
        personas={PERSONAS}
        order={ORDER}
        defaultId={DEFAULT}
        accent="teal"
        layout="none"
        compact
        heroSlot={
          <PersonaHeroPhoto
            photo={PHOTOS.heroFinancierPhoto}
            photoAlt="Two financiers shaking hands on a rooftop"
            headline="Deploy capital into verified Ghanaian real estate."
            subhead="Every loan is secured against title-verified Ghanaian real estate, with full KYC and terms you control."
            ctaLabel={GET_STARTED.label}
            ctaHref={GET_STARTED.href}
            overlay
          />
        }
        faqTitleSuffix="financiers ask."
        riskKind="lending"
        closingSlot={<BriefingForm />}
        footerSlot={<PersonaQuickLinks links={LINKS} />}
      >
        {/* The same shape as /vendors: what you can finance, one band per
            kind of loan (1, 2), on what terms (3), who does what (4), how it
            fits the way you lend (5), proof: the verified book (6), then the
            questions left (FAQ) and the briefing. */}
        <LendingBands />
        <YieldRanges />
        <WhereOurJobEnds />
        <LenderConcerns />
        <PersonaProof
          title="Assets already verified on Afram."
          stats={stats}
          ctaLabel="Browse the catalogue"
          ctaHref="/properties"
        />
      </PersonaShell>
    </>
  );
}
