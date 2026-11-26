import { PHOTOS } from "./photos";
import type { PersonaContent } from "./persona";

/**
 * Investor personas for /invest. Three audiences, one verified-property product.
 * Numbers are illustrative; every projected yield carries a capital-at-risk note.
 */
export const PERSONAS: Record<string, PersonaContent> = {
  micro: {
    id: "micro",
    tab: "Micro",
    eyebrow: "For first-time investors",
    headline: "Own a slice of real Ghana. From GHS 1,500.",
    subhead:
      "Buy a fractional stake in a real, title-verified building and earn a share of the rent and any growth — starting from GHS 1,500.",
    image: PHOTOS.apartments,
    stats: [
      { label: "Min ticket", value: "GHS 1,500" },
      { label: "Proj. yield", value: "14–22%", accent: true },
      { label: "Holding", value: "3–5 years" },
    ],
    floatLabel: "Min ticket",
    floatValue: "GHS 1,500",
    imageBadge: "Title-verified",
    faqs: [
      {
        q: "What does owning a slice actually mean?",
        a: "You hold a fractional, recorded stake in a specific building — not a vague promise. Your share is documented in your name, and you earn that same share of the rent it collects and any growth in its value.",
      },
      {
        q: "Where do my returns come from?",
        a: "Two places: the rent tenants pay each period, paid out to you as income, and any increase in the building’s value over time. Both are illustrative, never guaranteed — property values can fall as well as rise, so your capital is at risk.",
      },
      {
        q: "How and when can I exit?",
        a: "These are medium-term holdings of roughly 3–5 years. You can request to sell your stake during scheduled quarterly liquidity windows — it isn’t instant cash, and a buyer needs to take it on, but the exit is documented and orderly.",
      },
      {
        q: "What’s the minimum to start?",
        a: "GHS 1,500 for most open raises. You can start with one building and add more over time as you get comfortable — there’s no need to commit a large sum up front.",
      },
    ],
  },
  diaspora: {
    id: "diaspora",
    tab: "Diaspora",
    eyebrow: "For the diaspora",
    headline: "Invest back home — in cedis or dollars.",
    subhead:
      "Put your remittances to work in verified property from abroad, with documented ownership and reporting you can trust.",
    image: PHOTOS.house4,
    stats: [
      { label: "Min ticket", value: "USD 100" },
      { label: "Proj. yield", value: "14–22%", accent: true },
      { label: "Settle in", value: "USD · GHS" },
    ],
    floatLabel: "Min ticket",
    floatValue: "USD 100",
    imageBadge: "Title-verified",
    faqs: [
      {
        q: "Can I invest entirely from abroad?",
        a: "Yes. The whole process — choosing a raise, funding it, and receiving reporting — works online from wherever you are. You never need to be in Ghana to take part.",
      },
      {
        q: "Which currency do I use, and what about FX?",
        a: "You can fund and settle in US dollars or Ghana Cedis. The exchange rate used is shown before you commit, so you can see exactly what your dollars convert to. Currency movements can affect your returns either way.",
      },
      {
        q: "How can I trust this without being on the ground?",
        a: "Every building is title-verified against Lands Commission records before a raise opens, your stake is documented in your name, and you receive regular reporting on rent and value. You don’t take anyone’s word for it — you get the paper trail.",
      },
      {
        q: "Can I repatriate my returns?",
        a: "Yes. Rental payouts and proceeds when you exit can be settled back to you in dollars or cedis. As with any cross-border investment, your capital is at risk and returns are not guaranteed.",
      },
    ],
  },
  hnw: {
    id: "hnw",
    tab: "HNW",
    eyebrow: "For private clients",
    headline: "Curated raises. Larger tickets.",
    subhead:
      "Access a curated pipeline of verified developments with larger allocations and dedicated support.",
    image: PHOTOS.building,
    stats: [
      { label: "From", value: "USD 25,000" },
      { label: "Access", value: "curated deals" },
      { label: "Proj. yield", value: "14–22%", accent: true },
    ],
    floatLabel: "Allocations from",
    floatValue: "USD 25,000",
    imageBadge: "Title-verified",
    faqs: [
      {
        q: "What does curated deal access include?",
        a: "A shortlisted pipeline of verified developments — including raises offered to private clients before they open more widely. Each comes with the title checks, vendor track record, and terms laid out for review.",
      },
      {
        q: "How large can my allocation be?",
        a: "Allocations start from USD 25,000, with room for considerably larger positions in a single development or spread across several. We work with you to size each holding sensibly.",
      },
      {
        q: "What diligence and governance sits behind a raise?",
        a: "Title is verified against Lands Commission records, the vendor’s delivery record is documented, funds are held in segregated client accounts, and the structure is set out in writing before you commit. Even with this, property values can fall and your capital is at risk.",
      },
      {
        q: "What does dedicated support look like?",
        a: "A named point of contact who walks you through each opportunity, handles documentation, and gives you direct reporting on your portfolio. You deal with a person, not a queue.",
      },
    ],
  },
};

export const ORDER = ["micro", "diaspora", "hnw"];
export const DEFAULT = "micro";
