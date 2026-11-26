import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaHeroPhoto } from "@/components/persona/PersonaHeroPhoto";
import { PersonaProof } from "@/components/persona/PersonaProof";
import { PersonaQuickLinks } from "@/components/persona/PersonaQuickLinks";
import { PersonaShell } from "@/components/persona/PersonaShell";
import { Testimonials } from "@/components/persona/Testimonials";
import { accessCta, signUpHref } from "@/features/access/cta";
import { CapitalBand } from "@/features/vendors/CapitalBand";
import { SellSection } from "@/features/vendors/SellSection";
import { TalkToPartner } from "@/features/vendors/TalkToPartner";
import { VendorConcerns } from "@/features/vendors/VendorConcerns";
import { getAllProperties } from "@/features/landing/data/properties";
import { catalogueStats } from "@/features/personas/catalogue";
import { VERIFY_URL } from "@/lib/config";
import { DEFAULT, ORDER, PERSONAS } from "@/lib/data/vendor-personas";
import { PHOTOS } from "@/lib/data/photos";
import { buildFaqJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "List, sell, and get paid faster",
  description:
    "List a verified project on Afram, bring buyers built-in financing, and recover capital faster without diluting your brand.",
  path: "/vendors",
});

/** Reads "Request Access" while the site is invite-only. */
const GET_STARTED = accessCta({ label: "Get Started", href: signUpHref("issuer") });

/**
 * Listing and vendor counts come from the live catalogue, so they cannot
 * drift from /properties. The financier count is marketing-asserted — it is
 * not derivable from anything in this repo, so it lives here as a single
 * constant to update rather than being scattered through copy.
 */
const FINANCIERS_FUNDING = 3;

const LINKS = [
  { label: "How selling works", href: "/how-it-works" },
  { label: "What it costs", href: "/fees" },
  { label: "Verify a title", href: VERIFY_URL, external: true, on: "Afram Verify" },
  { label: "Insights", href: "/insights" },
];

export default async function VendorsPage() {
  const catalogue = catalogueStats(await getAllProperties());
  const stats = [
    { value: `${catalogue.listings}`, label: "Verified listings live" },
    { value: `${catalogue.vendors}`, label: "Vendors listing with us" },
    { value: `${FINANCIERS_FUNDING}`, label: "Financiers funding projects" },
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
            photo={PHOTOS.heroVendorPhoto}
            photoAlt="A property vendor reviewing plans on site"
            photoPosition="xl:object-[center_12%]"
            headline="List on Afram for the opportunity to raise capital for your project and also enable financing for your buyers so they can afford your property."
            ctaLabel={GET_STARTED.label}
            ctaHref={GET_STARTED.href}
          />
        }
        faqTitleSuffix="vendors ask."
        closingSlot={<TalkToPartner />}
        footerSlot={<PersonaQuickLinks links={LINKS} />}
      >
        {/* One story, in the order a development firm thinks it through:
            sell what you have (1), fund what you haven't built (2), what it
            means for the firm (3), proof that it works (4, 5), the questions
            left (FAQ), and a person to talk to (closingSlot). */}
        <SellSection />
        <CapitalBand />
        <VendorConcerns />
        <PersonaProof
          title="Already happening on Afram."
          stats={stats}
          ctaLabel="Browse all listings"
          ctaHref="/properties"
        />
        <Testimonials title="Vendors already selling on Afram." />
      </PersonaShell>
    </>
  );
}
