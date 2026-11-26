import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/ui/FeatureCard";

const PILLARS = [
  {
    title: "Start from GHS 1,500",
    body: "Pick a building, choose your ticket, and pledge in cedis or dollars. No large sum to begin.",
    featured: false,
  },
  {
    title: "Earn rental income and growth",
    body: "Collect your share of the rent as it comes in, plus any rise in the building’s value over time.",
    featured: true,
  },
  {
    title: "Backed by real, verified buildings",
    body: "Your stake is recorded in your name, in a specific building checked against Lands Commission records.",
    featured: false,
  },
];

export function InvestFlow() {
  return (
    <Section className="bg-ink-50/40">
      <SectionHeading
        title="Three things to know."
        intro="You see the building, the projected yield, and the minimum before you put anything in."
      />
      <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-3 lg:mt-12">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <FeatureCard
              title={p.title}
              body={p.body}
              featured={p.featured}
              compact
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
