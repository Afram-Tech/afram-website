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
    headline: "Sell units faster.",
    subhead:
      "Unsold units lock up your capital. List your project or portfolio on Afram. Members arrive with financing in place. You recover your money, make profit, and start the next build.",
    image: unsplash("photo-1605276374104-dee2a0ed3cd6"),
    imageBadge: "Verified project",
    // The stat panel was cut (vendors page doc, Oct 2026).
    stats: [],
    // Shown in <PersonaAnswers> ("Before you list.") above the FAQ, not in
    // the tab panel — vendors page doc, Oct 2026.
    blocks: [
      {
        title: "You keep control",
        icon: "KeyRound",
        body: "Afram takes no equity. You set the price and the terms. The units and the brand stay yours.",
      },
      {
        title: "Your financials stay private",
        icon: "Lock",
        body: "Members see your title, permits, and unit prices. Your costs, margins, and funding sources stay private.",
      },
      {
        title: "Deposits protected",
        icon: "ShieldCheck",
        body: "Afram holds member deposits. Members arrive with financing arranged. You stop chasing defaulters.",
      },
      {
        title: "No formal title yet? Talk to us.",
        icon: "MessageCircle",
        body: "Finished a project without a formal title? That may not rule you out. We’ll tell you what is missing and what it takes to fix it.",
      },
    ],
    blocksCta: { label: "Get Started", href: SIGN_UP_AS_ISSUER },
    faqs: [
      {
        q: "Do I give up control or a share of my project?",
        a: "No. You keep full ownership and control. Afram takes no equity and makes no decisions for you.",
      },
      {
        q: "How does an Afram endorsement help me sell faster?",
        a: "Members in Ghana are careful, and for good reason. Land disputes and stalled projects are common. Since every asset on Afram is verified, it serves as an endorsement that your title has been checked.",
      },
      {
        q: "Are these real members or just leads?",
        a: "They are serious members. Financing is arranged through Afram. They are ready to buy.",
      },
      {
        q: "Will my project’s financials be exposed?",
        a: "No. Your pricing, costs and margins stay private. We publish only what a member needs to decide.",
      },
    ],
  },
  corporate: {
    id: "corporate",
    tab: "Corporate",
    eyebrow: "For vendor firms",
    headline: "Build or sell more units faster.",
    subhead:
      "List your unit or portfolio to get access to financed members; list your projects to raise capital for completion.",
    image: unsplash("photo-1576941089067-2de3c901e126"),
    imageBadge: "Verified project",
    stats: [],
    blocks: [
      {
        title: "No clash with your sales team",
        icon: "Handshake",
        body: "Your account on Afram works with your sales team. Afram’s user management lets multiple users review requests.",
      },
      {
        title: "An endorsement",
        icon: "BadgeCheck",
        body: "Listing a property on Afram tells members your title is verified.",
      },
      {
        title: "Financed members, plus market data",
        icon: "TrendingUp",
        body: "You get members with financing ready. You also see demand: which areas are heating up, and which unit sizes and prices sell.",
      },
    ],
    blocksCta: { label: "Get Started", href: SIGN_UP_AS_ISSUER },
    faqs: [
      {
        q: "Does an endorsement dilute our brand?",
        a: "No. We endorse your project. We never co-brand over you. Your name stays first.",
      },
      {
        q: "Does this turn into sales, or just interest?",
        a: "Sales are the point. The members we send already have financing arranged.",
      },
      {
        q: "Will this clash with our agents?",
        a: "No. Afram works with your sales team and agents, and user management lets your whole team work from one account.",
      },
      {
        q: "What market data do we get?",
        a: "You see demand from real member activity. Which areas are heating up. Which unit sizes and prices sell.",
      },
    ],
  },
};

export const ORDER: string[] = ["individual", "corporate"];
export const DEFAULT = "individual";
