import { Building2, Home } from "lucide-react";

import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const DEALS = [
  {
    icon: Home,
    type: "Acquisition lending",
    body: "Finance a verified member's purchase of a completed, title-verified home.",
    yield: "22–30% p.a.",
    tenure: "1–10 years",
  },
  {
    icon: Building2,
    type: "Development lending",
    body: "Fund construction with vetted developers against the underlying parcel.",
    yield: "30–45% p.a.",
    tenure: "12–36 months",
  },
];

export function YieldRanges() {
  return (
    <Section id="yield" className="wash-mint scroll-mt-24">
      <SectionHeading title="Transparent ranges." intro="Two ways capital is put to work." />

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  <dt className="text-ink-400 text-[11px] tracking-wider uppercase">
                    Target yield
                  </dt>
                  <dd className="tnum text-accent-700 mt-1 text-xl font-semibold">{deal.yield}</dd>
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
            These ranges are not an offer and not binding.
          </strong>
          They come from deals already completed on Afram. You and the other party agree the final
          rate and terms.
        </p>
      </div>

      <CapitalAtRiskBadge className="mt-6" />
    </Section>
  );
}
