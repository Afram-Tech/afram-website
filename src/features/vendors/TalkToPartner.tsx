import { ContactSplit } from "@/components/shell/ContactSplit";

/** Generic on purpose: anyone landing here — buyer, vendor or financier —
 *  can use it, so the topics cover all three. */
export function TalkToPartner() {
  return (
    <ContactSplit
      id="talk"
      eyebrow={null}
      title="Talk to us."
      subtitle="For more enquiries, fill in this form."
      formTitle="Send us a message"
      formSubtitle="Leave your details. A partner will reply."
      topics={["Buy a property", "List a property", "Deploy capital"]}
      cta="Talk to a partner"
      className="pb-0 sm:pb-0 lg:pb-0"
      simpleForm
    />
  );
}
