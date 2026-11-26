import { Home, Building2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";

const DEALS = [
  {
    icon: Home,
    type: "Acquisition lending",
    body: "Finance a verified buyer’s purchase of a completed, title-verified home.",
    tenure: "1–10 years",
  },
  {
    icon: Building2,
    type: "Development lending",
    body: "Fund construction with vetted developers against the underlying parcel.",
    tenure: "12–36 months",
  },
];

/**
 * The two kinds of loan, read like a rate sheet: what you fund on the left,
 * the tenure on the right. The rate is the same answer for both, so it is
 * said once, in the caveat, rather than repeated on every row.
 */
export function YieldRanges() {
  return (
    <Section id="yield" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionHeading
            title="Your pricing, your terms."
            intro="Two ways capital is put to work."
          />

          {/*
            A caveat, so it is styled as one: a hairline rule, no box, no fill,
            no icon, no accent colour — those dress a disclaimer up as a
            feature. The operative clause leads, on its own line and with an
            explicit subject, because prominence and grammatical completeness
            are what get argued about. Never below text-sm: shrinking a caveat
            is how sites make one technically present and practically
            invisible.
          */}
          <div className="mt-8 border-t border-ink-900/10 pt-5 sm:mt-10 sm:pt-6">
            <p className="max-w-[54ch] text-pretty text-sm leading-relaxed text-ink-700">
              <strong className="block font-semibold text-ink-900">
                You and the borrower agree the rate.
              </strong>
              Afram does not set or publish lending rates. The final rate and
              terms are agreed between you and the borrower.
            </p>
          </div>
        </div>

        {/* The risk line sits with the loans it qualifies */}
        <div className="self-start rounded-[20px] bg-brand-50 px-6 sm:px-8">
        <ul className="divide-y divide-brand-500/10">
          {DEALS.map((d) => (
            <li
              key={d.type}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-4 py-7 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:py-8"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 sm:h-11 sm:w-11">
                <d.icon aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <h3 className="t-h4 text-deep-950">{d.type}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-500">
                  {d.body}
                </p>
              </div>
              {/* On phones the tenure sits under the description, in line
                  with the text rather than under the icon */}
              <dl className="col-start-2 sm:col-start-auto sm:text-right">
                <dt className="text-[14px] leading-5 text-ink-500">Typical tenure</dt>
                <dd className="tnum t-h3 mt-1 whitespace-nowrap text-deep-950">
                  {d.tenure}
                </dd>
              </dl>
            </li>
          ))}
        </ul>
        <div className="border-t border-brand-500/10 py-5">
          <CapitalAtRiskBadge kind="lending" />
        </div>
        </div>
      </div>
    </Section>
  );
}
