import { SecBadge } from "@/components/ui/SecBadge";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { PHOTOS } from "@/lib/data/photos";
import { FeeCard, type FeeLine } from "@/features/fees/FeeCard";
import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";

export const metadata: Metadata = buildMetadata({
  title: "Fees",
  description:
    "Simple, transparent fees on Afram. The key numbers for buyers, vendors, financiers, and investors — no hidden charges.",
  path: "/fees",
});

const BUYERS: FeeLine[] = [
  { label: "Title verification", value: "Free" },
  { label: "Platform fee", value: "2% on purchase" },
  { label: "Early settlement", value: "No penalty" },
];

const VENDORS: FeeLine[] = [
  { label: "List a verified project", value: "Free" },
  { label: "Success fee", value: "from 2% per unit" },
  { label: "Buyer financing", value: "GHS 0 to you" },
];

const FINANCIERS: FeeLine[] = [
  { label: "Set up your rules", value: "Free" },
  { label: "Origination", value: "from 1%" },
  { label: "Servicing", value: "from 0.5% / year" },
];

const INVESTORS: FeeLine[] = [
  { label: "Entry fee", value: "from 1.5%" },
  { label: "Annual management", value: "from 1% / year" },
  { label: "Performance fee", value: "10% above hurdle" },
];

export default function FeesPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-8 pb-8 sm:pt-10 lg:pt-14 lg:pb-12">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <SecBadge />
            <h1 className="t-h1 text-ink-900 mt-5">Simple, transparent fees.</h1>
          </div>
          <p className="t-lead text-ink-500 max-w-xl lg:pb-1.5">
            No hidden charges. No surprises. Verification and listing are free. You only pay when a
            deal completes.
          </p>
        </div>
      </Section>

      {/* One clean card per audience */}
      <Section className="pt-0 lg:pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0}>
            <FeeCard
              title="Members"
              intro="Find a verified home and pay over time. The platform fee applies only on a completed purchase."
              lines={BUYERS}
            />
          </Reveal>
          <Reveal delay={0.06}>
            <FeeCard
              title="Vendors"
              intro="List a verified project for free. You pay only when a unit sells, and buyer financing is on us."
              lines={VENDORS}
            />
          </Reveal>
          <Reveal delay={0.12}>
            <FeeCard
              title="Financiers"
              intro="Set your own terms and fund the buyers you choose. Rates below are confirmed before you commit."
              lines={FINANCIERS}
            />
          </Reveal>
          <Reveal delay={0.18}>
            <FeeCard
              title="Investors"
              intro="Start from GHS 1,500. The exact figures for any raise are shown in writing before you invest."
              lines={INVESTORS}
            />
          </Reveal>
        </div>

        {/* Investor returns sit next to a capital-at-risk note */}
        <div className="mt-8 max-w-2xl">
          <CapitalAtRiskBadge variant="block" />
        </div>
      </Section>

      {/* Closing CTA — matches the homepage banner */}
      <section className="bg-white px-5 py-10 lg:px-[34px] lg:py-16">
        <div className="mx-auto max-w-[1536px]">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl lg:min-h-[440px]">
            <DuotonePhoto
              src={PHOTOS.cityTrees}
              alt="Get started with Afram"
              sizes="100vw"
              className="absolute inset-0 h-full w-full"
            >
              <div className="from-brand-950/78 via-brand-950/35 to-brand-900/15 absolute inset-0 bg-gradient-to-t" />
            </DuotonePhoto>

            <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-8 sm:p-12 lg:min-h-[440px] lg:p-14">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                No fee you didn’t see here
              </span>
              <h2 className="t-h1 mt-4 max-w-xl text-white">
                Know exactly what you pay, before you start.
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/how-it-works" size="lg" variant="inverse">
                  How it works
                </Button>
                <Button href="/about#contact" size="lg" variant="outline">
                  Contact us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
