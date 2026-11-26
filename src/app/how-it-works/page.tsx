import { SecBadge } from "@/components/ui/SecBadge";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";
import {
  BrowserFrame,
  VerifyMock,
  PayMock,
  FinanceMock,
  TrackMock,
} from "@/components/how/platform-mockups";
import { cn } from "@/lib/utils";
import { PHOTOS } from "@/lib/data/photos";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How it works",
  description:
    "Four simple steps: verify the title, choose how you pay, finance or invest, then own and track it — shown on the real Afram platform.",
  path: "/how-it-works",
});

const STEPS: {
  step: string;
  title: string;
  body: string;
  points: string[];
  url: string;
  mock: ReactNode;
}[] = [
  {
    step: "Step 1",
    title: "Verify the title",
    body: "Every property is cross-checked against Lands Commission records before it’s listed, and the result is recorded on-chain. No clean title, no listing.",
    points: ["Lands Commission cross-check", "Disputes flagged before you ever see it"],
    url: "app.afram.co/verify",
    mock: <VerifyMock />,
  },
  {
    step: "Step 2",
    title: "Choose how you pay",
    body: "Pay in full, or put about 20% down and spread the balance over up to 10 years in Ghana Cedis. You see the exact monthly figure before you commit.",
    points: ["~20% upfront", "Balance over up to 10 years, in cedis"],
    url: "app.afram.co/checkout",
    mock: <PayMock />,
  },
  {
    step: "Step 3",
    title: "Finance or invest",
    body: "Get a financing decision in days, secured by a first legal charge — or own a fractional slice of a verified building from GHS 1,500 and earn a share of the yield.",
    points: ["Decision in days", "Fractional ownership from GHS 1,500"],
    url: "app.afram.co/financing",
    mock: <FinanceMock />,
  },
  {
    step: "Step 4",
    title: "Own and track",
    body: "Your money sits in escrow and is released as work is delivered, milestone by milestone. Your ownership record stays yours — on paper and on-chain.",
    points: ["Funds released against milestones", "Ownership recorded on-chain"],
    url: "app.afram.co/escrow",
    mock: <TrackMock />,
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Is the title really verified?",
    a: "Yes. We check every property against Lands Commission records before it’s listed, and we show you the result plainly. You can also verify any title yourself, free, before you commit a cedi.",
  },
  {
    q: "How does the financing work?",
    a: "You pay about 20% upfront, then spread the balance over up to 10 years in Ghana Cedis. You see the exact monthly figure before you sign, and a decision usually takes a few business days.",
  },
  {
    q: "Where does my deposit sit?",
    a: "In a segregated client account held with a partner bank, kept apart from Afram’s own funds. It’s held in escrow and released against delivery milestones, not paid out all at once.",
  },
  {
    q: "What if a vendor doesn’t deliver?",
    a: "Because your money is released against milestones rather than up front, the funds still held are protected. There’s a defined recovery process, so your deposit isn’t lost to a vendor who disappears.",
  },
  {
    q: "Can I really start investing from GHS 1,500?",
    a: "Yes. You can own a fractional slice of a real, title-verified building from GHS 1,500 and earn a share of the rental income and any capital growth. Investments can go down as well as up — your capital is at risk.",
  },
  {
    q: "Is Afram regulated?",
    a: "Afram is a property exchange — not a bank or a licensed investment adviser. We operate under Ghanaian company law, run Ghana Card identity checks (NIA), follow the Data Protection Act (Act 843), and hold listings to REAC and GREDA standards.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* 1 · Hero */}
      <section className="bg-white px-4 pt-4 lg:px-[34px]">
        <div className="relative mx-auto min-h-[460px] max-w-[1536px] overflow-hidden rounded-3xl lg:min-h-[560px]">
          <DuotonePhoto
            src={PHOTOS.heroBuilding2}
            alt="A verified building"
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full"
          >
            <div className="from-brand-950/85 via-brand-900/50 absolute inset-0 bg-gradient-to-r to-transparent" />
          </DuotonePhoto>

          <div className="relative z-10 flex min-h-[460px] max-w-[720px] flex-col justify-center p-8 sm:p-12 lg:min-h-[560px] lg:p-16">
            <SecBadge />

            <h1 className="t-h1 mt-5 text-white">From listing to keys, in four clear steps.</h1>

            <p className="t-lead mt-6 max-w-lg text-white/85">
              Afram is a blockchain-based title registry and property-financing platform. Here’s
              exactly how we verify a title, hold your money safely, and protect you before you
              commit.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/properties" size="lg" variant="inverse">
                Find a property
              </Button>
              <Button href="/fees" size="lg" variant="outline">
                See the fees
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Steps — copy paired with real platform screens */}
      <Section className="pb-10">
        <SectionHeading
          title="See it on the platform."
          intro="Each step removes a real risk — opaque titles, financing out of reach, and vendors who can disappear with a deposit. This is what it looks like inside Afram."
        />

        <div className="mt-8 space-y-6 sm:mt-10 lg:mt-14 lg:space-y-8">
          {STEPS.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={s.step}
                className="from-brand-50 via-brand-50/30 ring-brand-100/60 grid items-center gap-10 overflow-hidden rounded-3xl bg-gradient-to-br to-white p-7 ring-1 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-12"
              >
                {/* Copy */}
                <Reveal className={cn(flip && "lg:order-2")}>
                  <div className="flex items-center gap-3">
                    <span className="text-brand-600 text-[13px] font-bold tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="bg-brand-300 h-px w-10" />
                    <span className="t-overline text-brand-600">{s.step}</span>
                  </div>

                  <h3 className="t-h3 text-ink-900 mt-5">{s.title}</h3>
                  <p className="t-lead text-ink-500 mt-4 max-w-lg">{s.body}</p>

                  <ul className="mt-6 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5">
                        <span className="bg-brand-50 text-brand-600 ring-brand-100 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-ink-700 text-[15px] font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* Platform mock */}
                <Reveal delay={0.1} className={cn("relative", flip && "lg:order-1")}>
                  <div
                    className={cn(
                      "bg-brand-200/30 pointer-events-none absolute -top-10 h-64 w-64 rounded-full blur-3xl",
                      flip ? "-left-10" : "-right-10",
                    )}
                    aria-hidden
                  />
                  <BrowserFrame url={s.url} className="relative mx-auto max-w-[440px]">
                    {s.mock}
                  </BrowserFrame>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 3 · Dashboard showcase */}
      <Section>
        <div className="bg-brand-950 grid items-center gap-8 overflow-hidden rounded-3xl p-6 sm:gap-10 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-14">
          <Reveal>
            <span className="t-overline text-brand-200 inline-flex items-center gap-2">
              <span className="bg-brand-300 h-1.5 w-1.5 rounded-full" />
              Your dashboard
            </span>
            <h2 className="t-h2 mt-5 text-white">Everything in one place.</h2>
            <p className="t-lead mt-5 max-w-md text-white/70">
              Payments, escrow milestones, documents, and your verified ownership record — all
              tracked in a single view, on any device.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Live payment & escrow status",
                "Every document in one folder",
                "Title and ownership records on-chain",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="text-brand-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] font-medium text-white/85">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="shadow-modal overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src="/dash-buyer.png"
                alt="The Afram dashboard showing payments, escrow status and documents"
                width={1200}
                height={838}
                sizes="(max-width: 1024px) 100vw, 720px"
                className="block w-full"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 4 · FAQ */}
      <Section>
        <div className="from-brand-50 via-ink-50/30 ring-brand-100/50 grid gap-6 rounded-3xl bg-gradient-to-br to-white p-6 ring-1 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:p-14">
          <div>
            <SectionHeading
              title="Questions, answered plainly"
              intro="The questions buyers and investors actually ask us — with straight answers."
            />
            <CapitalAtRiskBadge variant="block" className="mt-8 max-w-sm" />
          </div>
          <FaqAccordion items={FAQS} />
        </div>
      </Section>

      {/* 5 · Closing CTA */}
      <section className="bg-white px-5 py-10 lg:px-[34px] lg:py-16">
        <div className="mx-auto max-w-[1536px]">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl lg:min-h-[440px]">
            <DuotonePhoto
              src={PHOTOS.cityTrees}
              alt="Make your next move"
              sizes="100vw"
              className="absolute inset-0 h-full w-full"
            >
              <div className="from-brand-950/80 via-brand-950/38 to-brand-900/15 absolute inset-0 bg-gradient-to-t" />
            </DuotonePhoto>

            <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-8 sm:p-12 lg:min-h-[440px] lg:p-14">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Still have questions?
              </span>
              <h2 className="t-h1 mt-4 max-w-xl text-white">
                Start with a verified home, or talk to a real person.
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/buyers" size="lg" variant="inverse">
                  Find a property
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
