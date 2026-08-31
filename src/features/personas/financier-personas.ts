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
    blocks: [
      {
        title: "The instrument behind the record",
        icon: "Landmark",
        body: "Every verified record reconciles to a Lands Commission instrument. The digital record sits alongside the deed, it does not replace it — your security rests on the statutory register, not on our record alone.",
      },
      {
        title: "Enforceability, proven before you scale",
        icon: "Scale",
        body: "Start with a controlled pilot at limited exposure. Test the charge, test the recall process, and see the enforcement path in practice before it goes to credit committee at size.",
      },
      {
        title: "Title work done before it reaches you",
        icon: "FileCheck2",
        body: "Title search and security documentation are standardised and completed up front, so the paper cycle that normally runs 4–12 weeks collapses into a review of a prepared file.",
      },
      {
        title: "Your panel, your standards",
        icon: "ClipboardCheck",
        body: "Valuations run through your approved-valuer panel. We do not ask you to accept ours.",
      },
      {
        title: "Documented for your file",
        icon: "FileText",
        body: "Source-of-funds and sanctions checks are documented per loan, with a full audit trail available to your compliance team and your auditors.",
      },
    ],
    blocksCta: { label: "Request a briefing", href: "#briefing" },
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
    blocks: [
      {
        title: "Borrowers verified against the national register",
        icon: "IdCard",
        body: "Every borrower is verified against the Ghana Card through the National Identification Authority before a deal reaches you, with source-of-funds and sanctions checks documented per loan.",
      },
      {
        title: "Title you can verify yourself",
        icon: "Search",
        body: "Run your own solicitor's search against the public registry before you commit. We expect you to, and nothing here depends on you taking our word for it.",
      },
      {
        title: "Your terms, your box",
        icon: "SlidersHorizontal",
        body: "Set the rate, the term band, the minimum and maximum ticket, and which project stages you will lend against. Only deals inside your box reach your desk.",
      },
      {
        title: "Security registered, not promised",
        icon: "ShieldCheck",
        body: "A first legal charge is registered at the Lands Commission before disbursement, ranking ahead of later interests. Documentation stays with your lawyer.",
      },
      {
        title: "Exit — the honest answer",
        icon: "Clock3",
        body: "Positions are currently held to maturity. On-selling a loan is on the roadmap, not live today. We say so plainly so you can size tickets to a hold-to-maturity assumption.",
      },
    ],
    callout: {
      title: "Do one deal first",
      body: "Start with a single deal and test the process end to end — verification, documentation, disbursement, the charge — before you concentrate capital here.",
      cta: { label: "Request a briefing", href: "#briefing" },
    },
    blocksCta: { label: "Request a briefing", href: "#briefing" },
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
        a: "We report on the outcomes your mandate tracks — first-time members funded, locality, ticket size and affordability of the monthly payment — drawn from the underlying loan records. Reports are delivered on your cadence and reference recognised affordable-housing measures rather than headline figures.",
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

/**
 * Impact / Diaspora is intentionally not rendered for now. The persona
 * content is kept above so it can be restored by adding "impact" back here.
 */
export const ORDER: string[] = ["bank", "private-credit"];
export const DEFAULT = "bank";
