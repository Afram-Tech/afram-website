import { ContactSplit } from "@/components/shell/ContactSplit";
import { Section } from "@/components/ui/Section";

export function BriefingForm() {
  return (
    <Section id="briefing" className="scroll-mt-24 bg-white">
      <ContactSplit
        eyebrow="For financiers"
        title="Request a briefing."
        subtitle="Tell us about your mandate and a person will reach out — no obligation. We'll walk you through the collateral and the documentation."
        formTitle="Tell us about your mandate"
        formSubtitle="Leave your details and a person will get back to you."
        topics={["Request a briefing", "Discuss a mandate", "API & integration"]}
        cta="Request a briefing"
      />
    </Section>
  );
}
