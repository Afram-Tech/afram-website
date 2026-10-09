import { ContactSplit } from "@/components/shell/ContactSplit";
import { Section } from "@/components/ui/Section";

/** Generic on purpose: anyone landing here — member, vendor or financier —
 *  can use it, so the topics cover all three. */
export function TalkToPartner() {
  return (
    <Section id="talk" className="scroll-mt-24 bg-white pb-0 sm:pb-0 lg:pb-0">
      <ContactSplit
        title="Talk to us."
        subtitle="For more enquiries, fill in this form."
        formTitle="Send us a message"
        formSubtitle="Leave your details. A partner will reply."
        topics={["Buy a property", "List a property", "Deploy capital"]}
        cta="Talk to a partner"
        showContacts={false}
        simpleForm
      />
    </Section>
  );
}
