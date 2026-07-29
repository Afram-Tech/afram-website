const unsplash = (id: string, width = 1200, quality = 68) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export type ArticleBlock =
  { type: "p"; text: string } | { type: "h2"; text: string } | { type: "quote"; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  author: { name: string; role: string };
  date: string;
  readMinutes: number;
  body: ArticleBlock[];
}

export const ARTICLES: Article[] = [
  {
    slug: "understanding-the-20-percent-deposit-rule",
    title: "Understanding the 20% Deposit Rule",
    excerpt:
      "Why Afram's financed purchases start with a 20% deposit, how it's held, and what happens to it between reservation and handover.",
    category: "Buying Guide",
    cover: unsplash("photo-1521791136064-7986c2920216", 1400),
    author: { name: "Afram Editorial", role: "Buyer Resources" },
    date: "2026-06-02",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "Every financed purchase on Afram follows the same shape: 20% down, the balance spread monthly over 5, 7, or 10 years. It's a simple rule, but buyers often ask why 20%, and what actually happens to that money once it's paid.",
      },
      { type: "h2", text: "Why 20%, specifically" },
      {
        type: "p",
        text: "A larger deposit lowers the loan-to-value ratio, which is the main lever financiers use to price risk. Twenty percent is the point where most of the regulated lenders and private credit funds on Afram are comfortable extending financing without pushing the monthly instalment past what a middle-income household can reasonably absorb.",
      },
      {
        type: "p",
        text: "It's also a deliberate floor, not a target. Some buyers choose to put down more than 20% to shorten their term or lower their monthly payment — the rule guarantees a minimum, not a maximum.",
      },
      { type: "h2", text: "Where the deposit goes" },
      {
        type: "p",
        text: "Your deposit is held by Afram, not paid directly to the developer, and is verified within 1–2 business days of submission. It's refundable up to the point the title verification and financing checks are confirmed — the deposit reserves the unit; it doesn't commit you to a purchase that later fails verification.",
      },
      {
        type: "quote",
        text: "The deposit reserves the unit. It doesn't commit you to a purchase that later fails verification.",
      },
      {
        type: "p",
        text: "Once financing is confirmed and the sale proceeds, the deposit is applied as the first instalment against the purchase price, and the monthly repayment schedule begins from there.",
      },
    ],
  },
  {
    slug: "how-blockchain-title-verification-works",
    title: "How Blockchain Title Verification Actually Works",
    excerpt:
      "A plain-language walkthrough of what happens between listing a property and it carrying the Afram-verified badge — and why the record lives on Polygon.",
    category: "Verification & Trust",
    cover: unsplash("photo-1486406146926-c627a92ad1ab", 1600),
    author: { name: "Afram Editorial", role: "Verification Desk" },
    date: "2026-05-18",
    readMinutes: 6,
    body: [
      {
        type: "p",
        text: '"Blockchain-verified" gets used loosely across Ghanaian real estate marketing. On Afram it describes a specific, repeatable process — one that starts well before a listing ever reaches the marketplace.',
      },
      { type: "h2", text: "Step one: reconciliation against the Lands Commission" },
      {
        type: "p",
        text: "Every submitted title is checked against Lands Commission records before anything is published. This is a reconciliation, not a replacement — the paper deed remains the legal instrument. What we're confirming is that the deed matches what the statutory register actually shows: correct parcel, correct owner, no conflicting filings.",
      },
      { type: "h2", text: "Step two: the on-chain record" },
      {
        type: "p",
        text: "Once a title clears reconciliation, a hash of the verification result — not the underlying personal or ownership data — is written to Polygon. This creates a tamper-evident, timestamped record that the verification happened, and when. It's a receipt for the check, not a public ledger of who owns what.",
      },
      {
        type: "p",
        text: "Polygon was chosen for cost and settlement speed rather than any ideological commitment to crypto — the chain is infrastructure, invisible to the buyer, who never needs a wallet to purchase a verified property.",
      },
      { type: "h2", text: "What the badge does — and doesn't — promise" },
      {
        type: "p",
        text: "A verified badge means the title has been checked and the result is recorded immutably. It doesn't insure against every possible future dispute, and it isn't legal advice. It does mean a buyer starts from a materially stronger position than an unverified private sale, where the burden of checking the deed falls entirely on them.",
      },
    ],
  },
  {
    slug: "ghana-mortgage-rates-vs-afram-financing",
    title: "Ghana's Mortgage Rates vs. Afram Financing: A Side-by-Side Look",
    excerpt:
      "Bank mortgage rates in Ghana typically run 20–27%. Here's how Afram's financed purchase structure compares, and where each option actually fits.",
    category: "Financing",
    cover: unsplash("photo-1600047509807-ba8f99d2cdde"),
    author: { name: "Afram Editorial", role: "Financing Desk" },
    date: "2026-05-04",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "For most middle-income buyers in Ghana, a traditional bank mortgage means a rate in the 20–27% range, a lengthy approval process, and collateral requirements that can be as demanding as the property purchase itself. That's the gap Afram-arranged financing is built to close.",
      },
      { type: "h2", text: "Where the rate difference comes from" },
      {
        type: "p",
        text: "Bank mortgage pricing reflects general-purpose underwriting — the bank is assessing you, broadly, as a credit risk. Financing arranged through Afram is secured directly against a title-verified property with a registered first legal charge, which is a materially lower-risk position for the financier, and that's reflected in the terms buyers see.",
      },
      { type: "h2", text: "What this means monthly" },
      {
        type: "p",
        text: "On a comparable purchase, the difference between a 20%+ bank rate and Afram-arranged terms compounds significantly over a 10-year term — often the difference between a monthly instalment that's comfortable and one that isn't. Use the affordability calculator on the homepage to see what a specific income level supports under Afram's terms.",
      },
      {
        type: "p",
        text: "None of this is to say bank mortgages don't have a place — for buyers with existing banking relationships and strong documented income history, they remain a valid path. The financed route through Afram exists for the much larger group of buyers who are creditworthy in practice but locked out by a bank's paperwork threshold.",
      },
    ],
  },
  {
    slug: "diaspora-investing-buying-from-abroad",
    title: "Diaspora Investing: Buying Property in Ghana From Abroad",
    excerpt:
      "USD 6.65B moves from the diaspora to Ghana every year. Here's what changes — and what doesn't — when you're financing a purchase from outside the country.",
    category: "Investing",
    cover: unsplash("photo-1511895426328-dc8714191300", 1400),
    author: { name: "Afram Editorial", role: "Diaspora Desk" },
    date: "2026-04-20",
    readMinutes: 6,
    body: [
      {
        type: "p",
        text: "A large share of Afram's buyers never set foot in the country before reserving a unit. The process is built to work end-to-end without a site visit — verification happens on the property, not on your physical presence.",
      },
      { type: "h2", text: "Currency and remittance" },
      {
        type: "p",
        text: "Deposits and instalments can be committed in USD, EUR, or GHS. Conversion and any repatriation run through licensed banking partners under Bank of Ghana foreign-exchange rules, and the terms are set out before you commit — there's no ambiguity about what a payment made abroad converts to on the Ghana side.",
      },
      { type: "h2", text: "Verifying a title you can't visit" },
      {
        type: "p",
        text: "This is exactly the problem title verification is built to solve. The Lands Commission reconciliation and the on-chain record exist so that a buyer in London, Houston, or Dubai can trust the title without personally inspecting the registry in Accra.",
      },
      {
        type: "quote",
        text: "Verification exists so a buyer abroad can trust the title without personally inspecting the registry in Accra.",
      },
      {
        type: "p",
        text: "That said, a local point of contact — family, a trusted agent, or simply the developer's own after-sales team — is still worth having for the practical parts of ownership: utilities, maintenance, and eventually letting or resale.",
      },
    ],
  },
  {
    slug: "reac-greda-explained",
    title: "REAC and GREDA, Explained: What Buyers Should Check For",
    excerpt:
      "Two acronyms come up constantly in Ghanaian real estate. Here's what REAC and GREDA actually govern, and how to tell a compliant listing from one that isn't.",
    category: "Legal & Title",
    cover: unsplash("photo-1580587771525-78b9dba3b914"),
    author: { name: "Afram Editorial", role: "Legal & Compliance" },
    date: "2026-04-06",
    readMinutes: 4,
    body: [
      {
        type: "p",
        text: "REAC and GREDA get mentioned on almost every serious property listing in Ghana, but few buyers know precisely what each one covers. The short version: one licenses the people, the other represents the developers.",
      },
      { type: "h2", text: "REAC — the Real Estate Agency Council" },
      {
        type: "p",
        text: "REAC is the statutory body that licenses real estate agents and firms operating in Ghana. A REAC-registered agent has met a baseline of professional and ethical requirements. It doesn't verify any individual title, but it's a signal that the person or firm selling to you is accountable to a regulator.",
      },
      { type: "h2", text: "GREDA — the Ghana Real Estate Developers Association" },
      {
        type: "p",
        text: "GREDA is the industry association for real estate developers. Membership isn't a government license, but it does carry standards around delivery, marketing conduct, and dispute handling that member developers agree to be held to.",
      },
      {
        type: "p",
        text: "Afram's verification and endorsement criteria are built to sit comfortably alongside both — working with a developer through Afram doesn't ask them to work around REAC or GREDA expectations, it reinforces them.",
      },
    ],
  },
  {
    slug: "comparing-accras-top-neighbourhoods",
    title: "Cantonments, East Legon, or Airport Residential? Comparing Accra's Top Neighbourhoods",
    excerpt:
      "Three of Accra's most searched-for residential areas, compared on price band, typical unit type, and who each one tends to suit.",
    category: "Market Insights",
    cover: unsplash("photo-1518005020951-eccb494ad742", 1600),
    author: { name: "Afram Editorial", role: "Market Research" },
    date: "2026-03-22",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "Location drives price in Accra's residential market more than almost any other factor. These three neighbourhoods show up constantly in buyer searches, and each serves a slightly different kind of buyer.",
      },
      { type: "h2", text: "Cantonments" },
      {
        type: "p",
        text: "Established, embassy-adjacent, and consistently the highest price band of the three. Cantonments listings lean toward larger townhouses and gated apartment developments, and demand holds up well even when the broader market softens — it's a defensive choice as much as a lifestyle one.",
      },
      { type: "h2", text: "East Legon" },
      {
        type: "p",
        text: "Ghana's most-searched residential district by a wide margin. East Legon covers a broad price range — from mid-market apartments to large standalone houses — which makes it the most liquid of the three when it comes time to resell or let.",
      },
      { type: "h2", text: "Airport Residential" },
      {
        type: "p",
        text: "Central, walkable relative to Accra's norms, and popular with young professionals and shorter-term diaspora buyers. Units here trend smaller than Cantonments or East Legon, which keeps the entry price lower without sacrificing the central location.",
      },
      {
        type: "p",
        text: 'None of the three is a universally "better" choice — the right one depends on whether you\'re optimising for resale liquidity, unit size, or proximity to the city centre. Browse verified listings in each to compare current asking prices directly.',
      },
    ],
  },
];

export function findArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** Format an ISO date string, e.g. "Jun 2, 2026". */
export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
