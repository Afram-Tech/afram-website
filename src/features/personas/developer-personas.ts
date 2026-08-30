import type { PersonaContent } from "@/features/personas/types";
import { siteConfig } from "@/config/site";

const unsplash = (id: string, width = 1200, quality = 68) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

const SIGN_UP_AS_ISSUER = `${siteConfig.signUpUrl}?userType=issuer`;

export const PERSONAS: Record<string, PersonaContent> = {
  individual: {
    id: "individual",
    tab: "Individual",
    eyebrow: "For individual vendors",
    headline: "Sell faster. Get paid sooner.",
    subhead:
      "Stop watching capital sit in unsold units. List a verified project, bring it financed members, and recover your cash without waiting on slow sales.",
    image: unsplash("photo-1605276374104-dee2a0ed3cd6"),
    imageBadge: "Verified project",
    stats: [
      { label: "Member defaults today", value: "38%" },
      { label: "Bank rates you skip", value: "20–27%" },
      { label: "Member financing", value: "up to 10 yrs", accent: true },
    ],
    blocks: [
      {
        title: "You keep control",
        icon: "KeyRound",
        body: "Afram takes no equity and makes no decisions for you. You set the price, you set the terms, and the units and the brand stay yours.",
      },
      {
        title: "Your financials stay private",
        icon: "Lock",
        body: "We publish only what a member needs to decide — verified title, permits, unit price. Your costs, margins and funding sources are never disclosed.",
      },
      {
        title: "Simple terms, no hidden cut",
        icon: "FileText",
        body: "One page. What we do, what it costs you, what you keep. Nothing buried in an appendix.",
      },
      {
        title: "Start with a few units",
        icon: "Building2",
        body: "You do not have to commit a whole project. List a handful of units and watch the financed members arrive before you scale.",
      },
      {
        title: "Deposits protected. No more chasing defaulters.",
        icon: "ShieldCheck",
        body: "Member deposits are held by Afram rather than paid straight to you, and members arrive with financing already arranged — so the 38% default problem stops being yours to manage.",
      },
      {
        title: "No formal title yet? Talk to us anyway.",
        icon: "MessageCircle",
        body: "Some completed projects were never formally titled. That does not automatically rule you out — we will tell you what is missing and what it takes to get the project listable, rather than turning you away at the door.",
      },
    ],
    blocksCta: { label: "Get Started", href: SIGN_UP_AS_ISSUER },
    faqs: [
      {
        q: "Do I lose control or hand over a share of my project?",
        a: "No. You keep full ownership and full control of your project. Afram takes no equity and makes no decisions for you — we verify the title, endorse the project, and bring you members who already have financing. The units and the brand stay yours.",
      },
      {
        q: "How does an Afram endorsement help me sell faster?",
        a: "Members in Ghana are cautious for good reason — land disputes and stalled projects are common. An endorsement tells them your title is clean and your project has passed our review, so they spend less time second-guessing and more time deciding. Less hesitation means quicker sales.",
      },
      {
        q: "Are these real members, or just more leads to chase?",
        a: "They are committed members, not cold enquiries. Because financing is arranged through Afram — 20% down and the rest paid monthly over up to 10 years — the people we send you can actually afford the unit and are ready to sign. You spend your time closing, not qualifying.",
      },
      {
        q: "Will my project's financials be exposed?",
        a: "No. Your pricing, costs, and margins stay private. We only publish what a member needs to make a confident decision — verified title, permits, and the unit price. Everything else is shared on your terms, under a partnership agreement.",
      },
    ],
  },
  corporate: {
    id: "corporate",
    tab: "Corporate",
    eyebrow: "For vendor firms",
    headline: "Accelerate sales without diluting your brand.",
    subhead:
      "Reach middle- and high-income members who are priced out by 20–27% mortgages — with Afram-backed financing, market intelligence, and an endorsement that protects your name.",
    image: unsplash("photo-1576941089067-2de3c901e126"),
    imageBadge: "Verified project",
    stats: [
      { label: "Units per project", value: "20–500+" },
      { label: "Your brand", value: "protected" },
      { label: "Member financing", value: "built in", accent: true },
    ],
    blocks: [
      {
        title: "Proof before scale",
        icon: "LineChart",
        body: "Run a pilot on one project. Measure the conversion against your own direct channel. Then decide whether it scales.",
      },
      {
        title: "No channel conflict",
        icon: "Handshake",
        body: "Afram works alongside your sales team and your agents, never around them. We bring financed members into your existing pipeline and your team closes on your terms. Commission structures are agreed up front.",
      },
      {
        title: "An endorsement, not a co-brand",
        icon: "BadgeCheck",
        body: "Your name stays front and centre. The Afram mark sits alongside it as a title-verification signal — and because we only endorse projects that clear our title and delivery checks, it adds credibility rather than competing for it.",
      },
      {
        title: "Built to sit with REAC and GREDA",
        icon: "Landmark",
        body: "Our verification and endorsement criteria are designed around REAC and GREDA expectations on title, permits and delivery. Working with Afram reinforces the standards your firm already holds.",
      },
      {
        title: "Financed members, plus the data to guide your pipeline",
        icon: "TrendingUp",
        body: "Demand signals drawn from real member activity — which corridors are heating up, what unit sizes and price bands are moving, where members are searching. It tells you what to build next instead of guessing.",
      },
    ],
    blocksCta: { label: "Talk to a partner", href: "#talk" },
    faqs: [
      {
        q: "How does an endorsement protect our brand rather than dilute it?",
        a: "We endorse your project, we never co-brand over you. Your name stays front and centre; the Afram mark sits alongside it as a quality signal — like a clean-title stamp. Because we only endorse projects that clear our title and delivery checks, the endorsement adds credibility to your name instead of competing with it.",
      },
      {
        q: "Does Afram financing actually convert to sales, or just interest?",
        a: "Conversion is the point. The members we introduce already have 20%-down, up-to-10-year financing arranged, so they clear the affordability wall that 20–27% mortgages put in front of middle- and high-income households. We measure outcomes by units sold and capital recovered, and we share those figures with partners — not vanity numbers.",
      },
      {
        q: "Will this create channel conflict with our existing agents?",
        a: "No. Afram works alongside your sales team and agents, not around them. We bring financed members to your existing pipeline and let your team close on your terms. Commission structures are agreed up front in the partnership so there are no surprises or competing incentives.",
      },
      {
        q: "What market intelligence and data do we get access to?",
        a: "Partners get demand signals from real member activity — which corridors are heating up, what unit sizes and price bands are selling, and where members are searching. It helps you decide what to build and where, so future phases match real demand instead of guesswork.",
      },
      {
        q: "Does this align with REAC and GREDA standards?",
        a: "Yes. Our verification and endorsement criteria are built to sit comfortably with REAC and GREDA expectations on title, permits, and delivery. Working with Afram reinforces the professional standards your firm already holds itself to — it does not ask you to work around them.",
      },
    ],
  },
};

export const ORDER: string[] = ["individual", "corporate"];
export const DEFAULT = "individual";
