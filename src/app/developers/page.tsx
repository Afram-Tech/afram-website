import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PersonaFaq } from "@/components/persona/PersonaFaq";
import { PersonaFinalCta } from "@/components/persona/PersonaFinalCta";
import { PersonaPhotoHero } from "@/components/persona/PersonaPhotoHero";
import { PersonaScroller } from "@/components/persona/PersonaScroller";
import { DeveloperValue } from "@/features/developers/DeveloperValue";
import { SellFlow } from "@/features/developers/SellFlow";
import { TalkToPartner } from "@/features/developers/TalkToPartner";
import { ORDER, PERSONAS } from "@/features/personas/developer-personas";
import { siteConfig } from "@/config/site";
import { ACCENT_VARS } from "@/lib/accents";
import { buildFaqJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "List Properties — Raise Capital and Accelerate Sales",
  description:
    "List an Afram-verified project and reach pre-financed, ready buyers. Recover capital faster without waiting on slow sales, whether you're an individual vendor or a development firm.",
  path: "/developers",
});

export default function DevelopersPage() {
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
          image="/for-vendors-hero.webp"
          imageAlt="A vendor reviewing project plans on-site"
          headline={["Raise Capital", "and accelerate sales"]}
          subhead="List an Afram-verified project and bring it financed buyers who are ready to sign — and recover capital without waiting on slow sales."
          ctaLabel="Get Started"
          ctaHref="https://app.staging.afram.co/signup?userType=issuer"
        />

        <PersonaScroller personas={ordered} />

        <DeveloperValue />
        <SellFlow />
        <TalkToPartner />

        <PersonaFaq title="Questions vendors ask…" groups={faqGroups} />

        <PersonaFinalCta
          title="Turn idle inventory into cash."
          subtitle="List a verified project and let financed buyers come to you."
          primary={{ label: "List a project", href: siteConfig.signUpUrl }}
          secondary={{ label: "Talk to a partner", href: "#talk" }}
        />
      </div>
    </>
  );
}
