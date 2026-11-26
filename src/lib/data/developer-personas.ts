import type { PersonaContent } from "./persona";
import { accessCta, signUpHref } from "@/features/access/cta";
import { PHOTOS } from "./photos";

export const PERSONAS: Record<string, PersonaContent> = {
  individual: {
    id: "individual",
    tab: "Individual",
    eyebrow: "For individual developers",
    headline: "Sell units faster.",
    subhead:
      "Unsold units lock up your capital. List your project or portfolio on Afram. Buyers arrive with financing in place. You recover your money, make profit, and start the next build.",
    image: PHOTOS.building,
    // The stat panel was cut (vendors page doc, Oct 2026).
    stats: [],
    floatLabel: "Endorsed by Afram",
    floatValue: "Verified project",
    imageBadge: "Verified project",
    // These fill the right half of the "I am a…" panel and follow its toggle.
    blocks: [
      {
        title: "You keep control",
        icon: "KeyRound",
        body: "Afram takes no equity. You set the price and the terms. The units and the brand stay yours.",
      },
      {
        title: "Your financials stay private",
        icon: "Lock",
        body: "Buyers see your title, permits, and unit prices. Your costs, margins, and funding sources stay private.",
      },
      {
        title: "Deposits protected",
        icon: "ShieldCheck",
        body: "Afram holds buyer deposits. Buyers arrive with financing arranged. You stop chasing defaulters.",
      },
      {
        title: "No formal title yet? Talk to us.",
        icon: "MessageCircle",
        body: "Finished a project without a formal title? That may not rule you out. We’ll tell you what is missing and what it takes to fix it.",
      },
    ],
    blocksCta: accessCta({ label: "Get Started", href: signUpHref("issuer") }),
    faqs: [
      {
        q: "Do I give up control or a share of my project?",
        a: "No. You keep full ownership and control. Afram takes no equity and makes no decisions for you.",
      },
      {
        q: "How does an Afram endorsement help me sell faster?",
        a: "Buyers in Ghana are careful, and for good reason. Land disputes and stalled projects are common. Since every asset on Afram is verified, it serves as an endorsement that your title has been checked.",
      },
      {
        q: "Are these real buyers or just leads?",
        a: "They are serious buyers. Financing is arranged through Afram. They are ready to buy.",
      },
      {
        q: "Will my project’s financials be exposed?",
        a: "No. Your costs, margins and funding sources stay private. We publish only what a buyer needs to decide.",
      },
    ],
  },
  corporate: {
    id: "corporate",
    tab: "Corporate",
    eyebrow: "For development firms",
    headline: "Build or sell more units faster.",
    subhead:
      "List your unit or portfolio to get access to financed buyers; list your projects to raise capital for completion.",
    image: PHOTOS.apartments2,
    stats: [],
    imageBadge: "Verified project",
    blocks: [
      {
        title: "No clash with your sales team",
        icon: "Handshake",
        body: "Your account on Afram works with your sales team. Afram’s user management lets multiple users review requests.",
      },
      {
        title: "An endorsement",
        icon: "BadgeCheck",
        body: "Listing a property on Afram tells buyers your title is verified.",
      },
      {
        title: "Financed buyers, plus market data",
        icon: "TrendingUp",
        body: "You get buyers with financing ready. You also see demand: which areas are heating up, and which unit sizes and prices sell.",
      },
    ],
    blocksCta: accessCta({ label: "Get Started", href: signUpHref("issuer") }),
    // The brand, sales-team and market-data questions are answered by the
    // "Built around how you already sell." cards above the FAQ, so they are
    // not repeated here.
    faqs: [
      {
        q: "Do we give up control or a share of the project?",
        a: "No. You keep full ownership and control. Afram takes no equity and makes no decisions for you. You set the price and the terms.",
      },
      {
        q: "Will our project’s financials be exposed?",
        a: "No. Buyers see your title, permits and unit prices. Your costs, margins and funding sources stay private.",
      },
      {
        q: "Are these real buyers or just leads?",
        a: "They are serious buyers. Financing is arranged through Afram. They are ready to buy.",
      },
      {
        q: "Our project has no formal title yet. Can we still list?",
        a: "That may not rule you out. Talk to us, and we’ll tell you what is missing and what it takes to fix it.",
      },
    ],
  },
};

// The page is for corporate firms only (Nov 2026); the individual persona is
// kept above in case it returns.
export const ORDER: string[] = ["corporate"];

export const DEFAULT = "corporate";
