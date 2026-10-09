import { Building2, Home } from "lucide-react";

import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const DEALS = [
  {
    icon: Home,
    type: "Acquisition lending",
    body: "Finance a verified member’s purchase of a completed, title-verified home.",
    tenure: "1–10 years",
  },
  {
    icon: Building2,
    type: "Development lending",
    body: "Fund construction with vetted developers against the underlying parcel.",
    tenure: "12–36 months",
  },
];

export function YieldRanges() {
  return (
    <Section id="yield" className="bg-brand-50/50 scroll-mt-24">
      <SectionHeading
        title="Your pricing, your terms."
        intro="Two ways capital is put to work. You and the borrower agree the rate."
      />

      <div className="gap-card mt-8 grid grid-cols-1 sm:mt-10 md:grid-cols-2 lg:mt-12">
        {DEALS.map((deal, index) => (
          <Reveal key={deal.type} delay={index * 0.07}>
            <div className="border-ink-100 flex h-full flex-col rounded-[1.75rem] border bg-white p-7 shadow-sm">
              <span className="bg-accent-50 text-accent-600 flex h-11 w-11 items-center justify-center rounded-2xl">
                <deal.icon className="h-5 w-5" />
              </span>
              <h3 className="text-ink-900 mt-5 text-lg font-semibold tracking-[-0.01em]">
                {deal.type}
              </h3>
              <p className="text-ink-500 mt-2 text-[15px] leading-relaxed">{deal.body}</p>

              <dl className="border-ink-100 mt-6 grid grid-cols-2 gap-4 border-t pt-5">
                <div>
                  <dt className="text-ink-400 text-[11px] tracking-wider uppercase">Rate</dt>
                  <dd className="text-accent-700 mt-1 text-xl font-semibold">
                    Agreed with the borrower
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-400 text-[11px] tracking-wider uppercase">
                    Typical tenure
                  </dt>
                  <dd className="tnum text-ink-900 mt-1 text-xl font-semibold">{deal.tenure}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        ))}
      </div>

      {/*
        A caveat, so it is styled as one: a hairline rule, no box, no fill, no
        icon, no accent colour — those dress a disclaimer up as a feature. The
        operative clause leads, on its own line and with an explicit subject,
        because prominence and grammatical completeness are what get argued
        about. Never below text-sm: shrinking a caveat is how sites make one
        technically present and practically invisible.
      */}
      <div className="border-ink-900/10 mt-10 border-t pt-5 sm:mt-12 sm:pt-6">
        <p className="text-ink-700 max-w-[54ch] text-sm leading-relaxed text-pretty">
          <strong className="text-ink-900 block font-semibold">
            You and the borrower agree the rate.
          </strong>
          Afram does not set or publish lending rates. The final rate and terms are agreed between
          you and the borrower.
        </p>
      </div>

      <CapitalAtRiskBadge kind="lending" className="mt-6" />
    </Section>
  );
}
