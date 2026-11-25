import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { OpenRaiseCard } from "@/features/landing/home/OpenRaiseCard";
import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";
import { OPEN_RAISES } from "@/lib/data/open-raises";

const RAISES = OPEN_RAISES.slice(0, 3);

export function OpenRaisesGrid() {
  return (
    <Section id="raises" className="scroll-mt-24">
      <SectionHeading
        title="Open raises"
        intro="Real, title-verified buildings raising capital today. Pledge from GHS 1,500."
      />

      <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
        {RAISES.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.06}>
            <OpenRaiseCard raise={r} />
          </Reveal>
        ))}
      </div>

      <CapitalAtRiskBadge className="mt-8" />
    </Section>
  );
}
