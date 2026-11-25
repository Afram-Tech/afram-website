import { ContactSplit } from "@/components/shell/ContactSplit";

export function BriefingForm() {
  return (
    <ContactSplit
      id="briefing"
      eyebrow={null}
      title="Request a briefing."
      subtitle="We’ll walk you through the collateral and the documentation. No obligation."
      formTitle="Tell us about your mandate"
      formSubtitle="Leave your details and a person will get back to you."
      topics={["Request a briefing", "Discuss a mandate", "API & integration"]}
      cta="Get Started"
    />
  );
}
