import { ContactSplit } from "@/components/shell/ContactSplit";
import { Section } from "@/components/ui/Section";

export function TalkToPartner() {
  return (
    <Section id="talk" className="scroll-mt-24 bg-white">
      <ContactSplit
        title="List a project, or talk to a partner."
        subtitle="Tell us about your project and a partner will reach out, no obligation."
        formTitle="Tell us about your project"
        formSubtitle="Leave your details and a partner will get back to you."
        topics={["List a project", "Talk to a partner", "Project financing"]}
        cta="Talk to a partner"
      />
    </Section>
  );
}
