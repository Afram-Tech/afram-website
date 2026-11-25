/**
 * Mock "open raises" for the investor card grid + homepage.
 * Editable by the team — replace with live data later.
 * Numbers are illustrative; yields always carry a Capital-at-risk note.
 */
import { PHOTOS } from "./photos";

export interface OpenRaise {
  id: string;
  name: string;
  location: string;
  type: string;
  /** photography seed — duotone fallback behind the photo */
  seed: string;
  image: string;
  targetRaise: number; // GHS
  raisedPct: number; // 0–100
  projectedYield: string; // e.g. "16–19%"
  minTicket: number; // GHS
  daysRemaining: number;
  tenure: string; // holding period
  status: "live" | "closing" | "funded";
}

export const OPEN_RAISES: OpenRaise[] = [
  {
    id: "oyarifa-grove",
    name: "Oyarifa Grove — 2-bed apartments",
    location: "Oyarifa, Greater Accra",
    type: "Residential · 24 units",
    seed: "oyarifa",
    image: PHOTOS.modernHome,
    targetRaise: 4_200_000,
    raisedPct: 68,
    projectedYield: "16–19%",
    minTicket: 1_500,
    daysRemaining: 11,
    tenure: "3–5 years",
    status: "live",
  },
  {
    id: "spintex-court",
    name: "Spintex Court — mixed-use",
    location: "Spintex, Greater Accra",
    type: "Retail + residential · 40 units",
    seed: "spintex",
    image: PHOTOS.apartments,
    targetRaise: 7_800_000,
    raisedPct: 84,
    projectedYield: "18–22%",
    minTicket: 1_500,
    daysRemaining: 4,
    tenure: "4–6 years",
    status: "closing",
  },
  {
    id: "east-legon-mews",
    name: "East Legon Mews — townhouses",
    location: "East Legon, Greater Accra",
    type: "Residential · 12 units",
    seed: "eastlegon",
    image: PHOTOS.building,
    targetRaise: 12_500_000,
    raisedPct: 41,
    projectedYield: "14–17%",
    minTicket: 5_000,
    daysRemaining: 26,
    tenure: "5 years",
    status: "live",
  },
  {
    id: "tema-harbour-view",
    name: "Tema Harbour View — 3-bed",
    location: "Tema, Greater Accra",
    type: "Residential · 30 units",
    seed: "tema",
    image: PHOTOS.house3,
    targetRaise: 5_600_000,
    raisedPct: 100,
    projectedYield: "15–18%",
    minTicket: 1_500,
    daysRemaining: 0,
    tenure: "3–5 years",
    status: "funded",
  },
];
