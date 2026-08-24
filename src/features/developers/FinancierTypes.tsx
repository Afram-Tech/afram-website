import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Who funds you. Ticket sizes and terms are indicative — the note below says
 * so, because each financier prices its own deal.
 */
const TYPES = [
  {
    name: "Bank & regulated lender",
    use: "Construction, completion, buyer mortgages",
    ticket: "GHS 2m – 20m",
    term: "18 mo – 10 yrs",
  },
  {
    name: "Private credit fund",
    use: "Bridge finance and phase completion",
    ticket: "GHS 500k – 8m",
    term: "6 – 36 months",
  },
];

export function FinancierTypes() {
  return (
    <Section id="financiers" className="bg-brand-50/50 scroll-mt-24">
      <SectionHeading title="Two kinds of capital. One listing." />

      <dl className="bg-ink-100 mt-10 overflow-hidden rounded-[1.5rem] lg:mt-12">
        <div className="grid gap-px">
          {TYPES.map((t) => (
            <div
              key={t.name}
              className="grid gap-4 bg-white p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-[1.4fr_1.6fr_1fr_1fr] lg:items-baseline"
            >
              <dt className="text-ink-900 text-[17px] font-bold tracking-[-0.01em]">{t.name}</dt>
              <dd className="text-ink-500 text-[15px] leading-relaxed">{t.use}</dd>
              <dd>
                <span className="text-ink-400 block text-[11px] font-semibold tracking-[0.13em] uppercase">
                  Ticket
                </span>
                <span className="tnum text-ink-900 mt-1 block text-[15px] font-semibold">
                  {t.ticket}
                </span>
              </dd>
              <dd>
                <span className="text-ink-400 block text-[11px] font-semibold tracking-[0.13em] uppercase">
                  Term
                </span>
                <span className="tnum text-ink-900 mt-1 block text-[15px] font-semibold">
                  {t.term}
                </span>
              </dd>
            </div>
          ))}
        </div>
      </dl>

      <div className="border-ink-900/10 mt-10 border-t pt-5 sm:mt-12 sm:pt-6">
        <p className="text-ink-700 max-w-[54ch] text-sm leading-relaxed text-pretty">
          <strong className="text-ink-900 block font-semibold">
            These ranges are not an offer and not binding.
          </strong>
          They come from deals already completed on Afram. Each financier sets its own terms, and
          the final terms are whatever you and they agree.
        </p>
      </div>
    </Section>
  );
}
