/**
 * Legal route content map. Keyed by URL slug.
 *
 * Most pages are honest "Coming soon" stubs — a title, an "updated" line, and a
 * short placeholder paragraph. The exceptions are rendered by the page and their
 * `body` here is left empty and ignored:
 * - `key-risks` carries real, plain-language disclosures in bespoke JSX (it is
 *   linked by every Capital-at-risk badge across the site);
 * - `privacy` and `cookie-policy` are Legal's published policies, word for word
 *   from lib/data/legal-documents.ts.
 */
export type LegalSlug =
  "terms" | "privacy" | "cookie-policy" | "key-risks" | "complaints" | "whistleblowing";

export type LegalDoc = {
  /** Human title, also used for the page <title>. */
  title: string;
  /** Short label for the sub-nav. */
  navLabel: string;
  /** "Last updated" value. Honest placeholder for now. */
  updated: string;
  /** One-line description for metadata. */
  description: string;
  /** Placeholder body paragraphs for the stub pages. Ignored for key-risks. */
  body: string[];
};

export const LEGAL_SLUGS: LegalSlug[] = [
  "terms",
  "privacy",
  "cookie-policy",
  "key-risks",
  "complaints",
  "whistleblowing",
];

export const LEGAL: Record<LegalSlug, LegalDoc> = {
  terms: {
    title: "Terms of service",
    navLabel: "Terms",
    updated: "Coming soon",
    description: "The terms that govern your use of Afram. Full document coming soon.",
    body: [
      "Our full terms of service are being prepared and reviewed by counsel. They will set out the rules for using Afram, the responsibilities of buyers, sellers, vendors and investors, and the limits of our role as a property exchange.",
      "Until this page is published, your use of Afram is governed by the agreements you accept at sign-up and the disclosures linked from each product page. If you have a question in the meantime, email hello@afram.co and a person will reply.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    navLabel: "Privacy",
    updated: "27 January 2025",
    description:
      "How Afram collects, uses, discloses and safeguards your personal information, and your rights under Ghana's Data Protection Act (Act 843).",
    body: [],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    navLabel: "Cookies",
    updated: "27 January 2025",
    description:
      "What cookies are, how Afram uses them, the types we use, and how you can manage your cookie preferences.",
    body: [],
  },
  "key-risks": {
    title: "Key risks & disclosures",
    navLabel: "Key risks",
    updated: "Coming soon",
    description:
      "Plain-language risks of investing through Afram — capital is at risk, returns are not guaranteed, and liquidity is limited.",
    body: [],
  },
  complaints: {
    title: "Complaints",
    navLabel: "Complaints",
    updated: "Coming soon",
    description:
      "How to raise a complaint with Afram and what to expect. Full process coming soon.",
    body: [
      "Our formal complaints procedure is being prepared. It will set out how to raise a concern, how quickly we aim to respond, and how to escalate if you are not satisfied with our answer.",
      "Until then, if something has gone wrong we want to hear it directly. Email hello@afram.co with the details and we will look into it and get back to you.",
    ],
  },
  whistleblowing: {
    title: "Whistleblowing",
    navLabel: "Whistleblowing",
    updated: "Coming soon",
    description: "How to report wrongdoing at Afram, in confidence. Full policy coming soon.",
    body: [
      "Our whistleblowing policy is being prepared. It will explain how anyone — staff, partners or customers — can report suspected fraud, misconduct or a breach of the law in confidence, and how we protect people who speak up.",
      "If you need to report something now, email hello@afram.co and mark it confidential. We take every report seriously and will handle it discreetly.",
    ],
  },
};
