import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PILLARS = [
  {
    title: "Access funding to start or complete projects.",
    body: "Connect with Afram's network of vetted financiers for development-stage capital, so you can break ground or finish a stalled phase without waiting on a single bank.",
    featured: false,
  },
  {
    title: "Sell units faster through verified project listings.",
    body: "A title-verified, Afram-endorsed listing gives cautious buyers the confidence to commit quickly, instead of stalling over doubts about ownership or paperwork.",
    featured: true,
  },
  {
    title: "Reach more qualified buyers through financing.",
    body: "Buyers arrive with 20% down and up to 10 years to pay already arranged, so more of them qualify to buy today instead of saving for years.",
    featured: false,
  },
];

export function DeveloperValue() {
  return (
    <Section>
      <SectionHeading
        title="Sell faster. Get paid sooner."
        intro="List a verified project and let financed buyers come to you."
      />
      <div className="gap-card mt-12 grid grid-cols-1 md:grid-cols-3">
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
