import { SecBadge } from "@/components/ui/SecBadge";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { ContactSplit } from "@/components/shell/ContactSplit";
import { PHOTOS } from "@/lib/data/photos";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Afram is building a safer way to own property in Ghana — verified titles, fair financing, real ownership.",
  path: "/about",
});

const VALUES = [
  {
    title: "Verified before listed",
    body: "No property reaches a buyer until its title is checked against Lands Commission records.",
  },
  {
    title: "Financing that fits",
    body: "Pay around 20% upfront and spread the balance over up to 10 years in Ghana Cedis.",
    featured: true,
  },
  {
    title: "Ownership you can prove",
    body: "Every step is documented, so what you own is yours on paper as well as in practice.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* 1 — Hero */}
      <section className="bg-white px-4 pt-4 lg:px-[34px]">
        <div className="relative mx-auto min-h-[460px] max-w-[1536px] overflow-hidden rounded-3xl lg:min-h-[560px]">
          <DuotonePhoto
            src={PHOTOS.cityTrees}
            alt="Accra skyline"
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/82 via-brand-900/45 to-transparent" />
          </DuotonePhoto>

          <div className="relative z-10 flex min-h-[460px] max-w-[660px] flex-col justify-center p-8 sm:p-12 lg:min-h-[560px] lg:p-16">
            <SecBadge />
            <h1 className="mt-5 t-h1 text-white">
              Built in Accra, for Ghana.
            </h1>
            <p className="mt-5 max-w-md t-lead text-white/85">
              A safer way to buy, finance, and prove ownership of property —
              grounded in real records and real incomes.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — Short story */}
      <Section className="bg-white">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <SectionHeading title="Owning a home should not depend on luck." />
          <div className="max-w-2xl space-y-5 text-[16px] leading-relaxed text-ink-600">
            <p>
              For too many people in Ghana, the path to owning a home is blocked
              at both ends. The title might not be clean, and paying in full
              cash is out of reach. So ownership has stayed with the few who can
              pay everything at once.
            </p>
            <p>
              Afram closes that gap. We verify every title before it is listed,
              and we make financing work the way people actually earn — so
              owning a real, recorded home is something you can plan for, not
              just wish for.
            </p>
          </div>
        </div>
      </Section>

      {/* 3 — What we stand for */}
      <Section className="bg-ink-50/40">
        <SectionHeading title="Three things we will not compromise on" />
        <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-3 lg:mt-12">
          {VALUES.map((v) => (
            <FeatureCard
              key={v.title}
              title={v.title}
              body={v.body}
              featured={v.featured}
            />
          ))}
        </div>
      </Section>

      {/* 4 — Get in touch */}
      <ContactSplit
        id="contact"
        title="Talk to a real person."
        subtitle="Press, partnerships, or a question that doesn’t fit a form — we read every message and reply within one business day."
        topics={["General enquiry", "Press", "Partnerships", "Careers"]}
        cta="Send a message"
      />

      {/* 5 — Closing CTA */}
      <section className="bg-white px-5 py-10 lg:px-[34px] lg:py-16">
        <div className="mx-auto max-w-[1536px]">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl lg:min-h-[440px]">
            <DuotonePhoto
              src={PHOTOS.glassTrees}
              alt="Own property the safe way"
              sizes="100vw"
              className="absolute inset-0 h-full w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/78 via-brand-950/35 to-brand-900/15" />
            </DuotonePhoto>

            <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-8 sm:p-12 lg:min-h-[440px] lg:p-14">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Own with confidence
              </span>
              <h2 className="mt-4 max-w-xl t-h1 text-white">
                Own property the safe way.
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/properties" size="lg" variant="inverse">
                  View properties
                </Button>
                <Button href="/how-it-works" size="lg" variant="outline">
                  How it works
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
