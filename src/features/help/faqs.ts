import type { FaqItem } from "@/components/ui/FaqAccordion";

export interface HelpGroup {
  label: string;
  items: FaqItem[];
}

/** The visitor-facing subset of the Exchange's Help (its helpContent.ts). */
export const HELP_GROUPS: HelpGroup[] = [
  {
    label: "Getting access",
    items: [
      {
        q: "How do I get an Afram account?",
        a: "Afram is invite-only. Request access on this website with your role, name, email and phone number. Once the Afram team approves it, you get an email with a temporary password and a link to set up your account.",
      },
      {
        q: "My access link says it has expired or isn't valid",
        a: "Access links last 72 hours and only work when opened straight from the access email. If it has expired, request access again and we'll send a fresh link. If you've already set up your account, sign in instead.",
      },
      {
        q: "My temporary password isn't accepted",
        a: "It's the 8-character code in your access email, shown like 7KQ2-M9XD. Capital letters, spaces and the dash don't matter. Make sure you're using the most recent email; an older one has a different code.",
      },
      {
        q: "I forgot my password",
        a: "Password reset isn't available yet. Report an issue below under \"Signing in or my account\" and we'll help you get back in.",
      },
    ],
  },
  {
    label: "Identity verification",
    items: [
      {
        q: "Why do I need to verify my identity?",
        a: "Afram checks your Ghana Card with the NIA before you can transact. You can explore straight away, but expressing interest, requesting financing or adding a project unlock once you're verified.",
      },
      {
        q: 'My account says "Verification in progress"',
        a: "We're confirming your Ghana Card with the NIA. You'll get a notification saying \"You're verified\" as soon as it's done, and everything unlocks.",
      },
    ],
  },
  {
    label: "Buying, selling and financing",
    items: [
      {
        q: "What are the ways to pay for a property?",
        a: "Personal Funds means you pay from your own money. Seller Financing means you pay the seller in instalments under a plan they agree. Financier Offer means a bank or lender finances it and sends you terms to review.",
      },
      {
        q: "How does the deposit work?",
        a: "The deposit amount is shown on the property page, and payment instructions appear in your chat with the seller. Pay using the payment reference exactly as shown so your deposit can be matched to you.",
      },
      {
        q: "How do I list a property?",
        a: "In the Exchange, go to My Portfolio and choose Add Project, then work through basic details, contracts (optional), unit details, and pricing. Afram reviews new listings before they go live, usually within 1 to 2 business days.",
      },
    ],
  },
];
