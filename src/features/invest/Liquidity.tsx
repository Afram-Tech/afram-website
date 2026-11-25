import { Section } from "@/components/ui/Section";
import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";

export function Liquidity() {
  return (
    <Section className="wash-mint">
      <div className="mesh-emerald grain relative overflow-hidden rounded-3xl px-6 py-10 text-white sm:px-12 sm:py-12 lg:py-20">
        <div className="relative mx-auto max-w-2xl">
          <h2 className="mt-4 t-h2">
            A medium-term investment, not a savings account.
          </h2>
          <p className="mt-5 t-lead text-white/75">
            Plan to hold for 3–5 years. You can request to sell your stake in a
            scheduled quarterly window, but a buyer has to take it on — so it
            isn’t instant cash. Property values can fall, and returns are never
            guaranteed.
          </p>

          <div className="mt-8 rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/10">
            <CapitalAtRiskBadge tone="light" />
          </div>
        </div>
      </div>
    </Section>
  );
}
