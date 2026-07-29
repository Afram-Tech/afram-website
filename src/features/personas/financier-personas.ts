import type { PersonaContent } from "@/features/personas/types";

const unsplash = (id: string, width = 1200, quality = 68) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const PERSONAS: Record<string, PersonaContent> = {
  bank: {
    id: "bank",
    tab: "Bank",
    eyebrow: "For regulated lenders",
    headline: "Deploy capital into verified Ghanaian real estate.",
    subhead:
      "Secured, compliant exposure to real-estate lending — with verified title, a first legal charge, and standardised credit documentation.",
    image: unsplash("photo-1605276374104-dee2a0ed3cd6"),
    imageBadge: "Verified collateral",
    stats: [
      { label: "Target yield", value: "22–30% p.a.", accent: true },
      { label: "Security", value: "first legal charge" },
      { label: "KYC", value: "Ghana Card · Act 1044" },
    ],
    faqs: [
      {
        q: "What is the legal standing of the verified record versus paper title?",
        a: "The verified record is a digital reconciliation of the underlying paper title against Lands Commission data — it sits alongside the deed, it does not replace it. Every loan is secured by a registered first legal charge over the same parcel, so your security rests on the statutory register, not on our record alone.",
      },
      {
        q: "How does the first legal charge work in practice?",
        a: "Each loan is documented with a charge registered against the title at the Lands Commission, ranking ahead of later interests. On default, the charge is enforceable through the courts under Ghanaian law in the ordinary way. We prepare the standardised security pack; your counsel reviews and you hold the charge.",
      },
      {
        q: "What does the KYC and AML stack look like?",
        a: "Borrower identity is verified against the Ghana Card through the National Identification Authority, with screening and record-keeping aligned to the Anti-Money Laundering Act 1044 and Bank of Ghana guidance. Source-of-funds and sanctions checks are documented per loan, and the audit trail is available for your own file.",
      },
      {
        q: "Can this integrate with our core banking and credit systems?",
        a: "Yes. Loan tapes, collateral records and the document pack are available by API or structured export, so positions can be booked and monitored in your existing systems. We work to your onboarding and reporting formats rather than asking you to adopt ours.",
      },
    ],
  },
  "private-credit": {
    id: "private-credit",
    tab: "Private credit",
    eyebrow: "For private credit",
    headline: "Yield above treasury — on your own terms.",
    subhead:
      "Set your own rate, term and ticket. Onboard in days, not months, against clean, verified collateral.",
    image: unsplash("photo-1600047509807-ba8f99d2cdde"),
    imageBadge: "Verified collateral",
    stats: [
      { label: "Target yield", value: "30–45% p.a.", accent: true },
      { label: "Onboard in", value: "≤5 business days" },
      { label: "Your rules", value: "rate · term · ticket" },
    ],
    faqs: [
      {
        q: "How do I configure my own rules?",
        a: "You set the rate, the term band, the minimum and maximum ticket, and which project stages you will lend against. We surface only the deals that match your mandate, so you review a curated pipeline rather than the whole market.",
      },
      {
        q: "How fast is onboarding, really?",
        a: "Once KYC and your mandate are agreed, most lenders are ready to review live deals within five business days. The slow part of private credit is usually documentation and collateral diligence — both are standardised here, which is where the time is saved.",
      },
      {
        q: "How am I protected against document fraud?",
        a: "Every parcel is reconciled against Lands Commission records before it reaches you, and the loan is secured by a registered first legal charge. You see the verified title result and the full paper trail, so you are not relying on a borrower's photocopy.",
      },
      {
        q: "Is there an exit or secondary market?",
        a: "Not yet. Positions are currently held to maturity, and on-selling a loan is on the roadmap rather than live today. We say so plainly, so you can size tickets to a hold-to-maturity assumption.",
      },
    ],
  },
  impact: {
    id: "impact",
    tab: "Impact / Diaspora",
    eyebrow: "For impact & diaspora capital",
    headline: "Returns with measurable impact.",
    subhead:
      "Fund affordable, first-time homeownership with the governance, ESG reporting and currency flexibility your mandate requires.",
    image: unsplash("photo-1564013799919-ab600027ffc6"),
    imageBadge: "Verified collateral",
    stats: [
      { label: "Diaspora to Ghana", value: "USD 6.65B" },
      { label: "Currency", value: "USD · EUR · GHS" },
      { label: "Reporting", value: "ESG + audit trail" },
    ],
    faqs: [
      {
        q: "What ESG and impact reporting do you provide?",
        a: "We report on the outcomes your mandate tracks — first-time buyers funded, locality, ticket size and affordability of the monthly payment — drawn from the underlying loan records. Reports are delivered on your cadence and reference recognised affordable-housing measures rather than headline figures.",
      },
      {
        q: "How is cross-border AML and FATF compliance handled?",
        a: "Borrowers are verified against the Ghana Card through the National Identification Authority, with screening aligned to the Anti-Money Laundering Act 1044 and FATF recommendations. For diaspora capital, source-of-funds and sanctions checks are documented at the fund level so your own compliance file is complete.",
      },
      {
        q: "How do FX and repatriation work?",
        a: "Capital can be committed in USD, EUR or GHS. Conversion and any repatriation run through licensed banking partners under Bank of Ghana foreign-exchange rules — we facilitate against that framework rather than operate outside it, and the FX terms are set out before you commit.",
      },
      {
        q: "What governance and audit do you offer?",
        a: "Each position carries a registered first legal charge, documented terms and a full audit trail, and reporting is structured for independent review. Your auditors and mandate trustees can inspect the loan-level records directly, so governance does not depend on our summaries.",
      },
    ],
  },
};

export const ORDER: string[] = ["bank", "private-credit", "impact"];
export const DEFAULT = "bank";
