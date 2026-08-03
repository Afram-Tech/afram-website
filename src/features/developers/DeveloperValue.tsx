import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PILLARS = [
  {
    title: "Sell faster",
    body: "A verified, Afram-endorsed project gives cautious buyers the confidence to decide quickly.",
    featured: false,
  },
  {
    title: "Built-in financing for your buyers",
    body: "Buyers pay 20% upfront and spread the balance over up to 10 years, in Ghana Cedis. No bank queues.",
    featured: true,
  },
  {
    title: "Get paid sooner",
    body: "Recover your capital without waiting on slow sales, so you can put it into the next phase.",
    featured: false,
  },
];

export function DeveloperValue() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why list with Afram"
        title="Sell faster. Get paid sooner."
        intro="List a verified project and let financed buyers come to you."
      />
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PILLARS.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 0.08}>
            <FeatureCard
              title={pillar.title}
              body={pillar.body}
              featured={pillar.featured}
              compact
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
