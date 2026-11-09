import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PILLARS = [
  {
    eyebrow: "Collateral",
    title: "Deploy capital into verified real estate opportunities.",
    body: "Every loan sits behind a registered first legal charge over a parcel checked against Lands Commission records.",
    featured: true,
  },
  {
    eyebrow: "Transparency",
    title: "Access transparent property and ownership records.",
    body: "You see the verified title result and the full paper trail, so you are not relying on a borrower's photocopy.",
    featured: false,
  },
  {
    eyebrow: "Your mandate",
    title: "Configure financing terms and risk parameters.",
    body: "You choose the ticket, the term, and the rate. Only deals that fit your box reach your desk.",
    featured: false,
  },
];

export function FinancierPillars() {
  return (
    <Section>
      <SectionHeading
        title="Lend with confidence."
        intro="Clean collateral, your own rules, and the compliance work done for you."
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
