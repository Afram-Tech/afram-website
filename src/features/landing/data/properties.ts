import { usd } from "@/lib/format";

const unsplash = (id: string, width = 1200, quality = 68) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export type PropertyStatus = "Available" | "Reserved" | "Off-plan" | "Sold";
export type PropertyType = "Apartment" | "House" | "Townhouse" | "Villa";

export interface PriceHistoryRow {
  date: string;
  activity: string;
  price: string;
}

export interface Property {
  slug: string;
  name: string;
  location: string;
  tags: string[];
  priceUsd: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  seed: string;
  status: PropertyStatus;
  type: PropertyType;
  /** Detail page "Starting from GHS X" on the sticky purchase card. */
  startingGhs: number;
  /** Gallery — images[0] matches `image` for card/detail consistency. */
  images: string[];
  about: string;
  amenities: string[];
  legal: {
    titleType: string;
    landCertificate: string;
    listingStatus: string;
    verification: string;
  };
  floorPlan: string;
  address: { street: string; gps: string; propertyId: string };
  priceHistory: PriceHistoryRow[];
  developer: string;
}

const BASE_AMENITIES = [
  "Balcony / Terrace",
  "24/7 Security",
  "Garden / Outdoor Space",
  "CCTV Surveillance",
  "Gym / Fitness Centre",
  "Internet / Fibre Ready",
  "Backup Generator",
  "Smart Home Features",
  "Swimming Pool",
  "Storage Room",
];

const BASE_LEGAL = {
  titleType: "On file with Afram",
  landCertificate: "Available on request",
  listingStatus: "Live on Afram Marketplace",
  verification: "Afram-verified development",
};

const ABOUT =
  "Welcome to refined city living at its finest. This impeccably designed home blends modern architecture with luxurious finishes, creating a space that is as functional as it is breathtaking. Expansive floor-to-ceiling windows frame stunning views while bathing the open-plan living and dining area in warm, natural light.";

const FLOOR_PLAN = unsplash("photo-1542621334-a254cf47733d", 1400);

export const FEATURED_PROPERTIES: Property[] = [
  {
    slug: "goldenwood-park",
    name: "Goldenwood Park",
    location: "Cantonments, Accra",
    tags: ["2 Bed", "Floor 1", "Cantonments Heights"],
    priceUsd: 32400,
    beds: 3,
    baths: 2,
    sqft: 2000,
    image: unsplash("photo-1564013799919-ab600027ffc6"),
    seed: "gw-park",
    status: "Available",
    type: "House",
    startingGhs: 2374375,
    images: [
      unsplash("photo-1564013799919-ab600027ffc6"),
      unsplash("photo-1600607687939-ce8a6c25118c"),
      unsplash("photo-1600596542815-ffad4c1539a9"),
      unsplash("photo-1600047509807-ba8f99d2cdde"),
      unsplash("photo-1580587771525-78b9dba3b914"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "298 Friesen Skyway",
      gps: "GV-758-9732",
      propertyId: "01599248-2a0e-492d-8671-8cb47cf1849f",
    },
    priceHistory: [
      { date: "Mar 15, 2026", activity: "Listed for sale", price: usd(189950) },
      { date: "Jan 10, 2026", activity: "Valuation", price: usd(176654) },
      { date: "Sep 4, 2025", activity: "Listed on-chain", price: usd(165257) },
      { date: "Jun 20, 2025", activity: "Off-plan sale", price: usd(142463) },
    ],
    developer: "Afram Marketplace",
  },
  {
    slug: "baldway-ab01",
    name: "Baldway Apartment — AB01",
    location: "Cantonments, Accra",
    tags: ["2 Bed", "Floor 1", "Cantonments Heights"],
    priceUsd: 32400,
    beds: 3,
    baths: 2,
    sqft: 2000,
    image: unsplash("photo-1568605114967-8130f3a36994"),
    seed: "baldway-ab01",
    status: "Available",
    type: "Apartment",
    startingGhs: 1980000,
    images: [
      unsplash("photo-1568605114967-8130f3a36994"),
      unsplash("photo-1600047509807-ba8f99d2cdde"),
      unsplash("photo-1576941089067-2de3c901e126"),
      unsplash("photo-1600566753086-00f18fb6b3ea"),
      unsplash("photo-1600596542815-ffad4c1539a9"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "12 Baldway Close",
      gps: "GA-184-5521",
      propertyId: "0b21f7a4-91cd-4b80-9e02-7c44ab0931d2",
    },
    priceHistory: [
      { date: "Mar 15, 2026", activity: "Listed for sale", price: usd(162000) },
      { date: "Dec 2, 2025", activity: "Valuation", price: usd(151300) },
      { date: "Aug 18, 2025", activity: "Listed on-chain", price: usd(144900) },
    ],
    developer: "Baldway Developments",
  },
  {
    slug: "baldway-01",
    name: "Baldway Apartment — 01",
    location: "Cantonments, Accra",
    tags: ["2 Bed", "Floor 1", "Cantonments Heights"],
    priceUsd: 32400,
    beds: 3,
    baths: 2,
    sqft: 2000,
    image: unsplash("photo-1600585154340-be6161a56a0c"),
    seed: "baldway-01",
    status: "Reserved",
    type: "Apartment",
    startingGhs: 2010000,
    images: [
      unsplash("photo-1600585154340-be6161a56a0c"),
      unsplash("photo-1600566753086-00f18fb6b3ea"),
      unsplash("photo-1512917774080-9991f1c4c750"),
      unsplash("photo-1600607687939-ce8a6c25118c"),
      unsplash("photo-1580587771525-78b9dba3b914"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "14 Baldway Close",
      gps: "GA-184-5538",
      propertyId: "5e0c9f2a-3a17-4f64-bb91-2d8b6e4477aa",
    },
    priceHistory: [
      { date: "Feb 28, 2026", activity: "Listed for sale", price: usd(165500) },
      { date: "Nov 11, 2025", activity: "Valuation", price: usd(158200) },
    ],
    developer: "Baldway Developments",
  },
  {
    slug: "ridge-villas",
    name: "Ridge Garden Villas",
    location: "Airport Residential, Accra",
    tags: ["4 Bed", "Detached", "Gated"],
    priceUsd: 58900,
    beds: 4,
    baths: 4,
    sqft: 3200,
    image: unsplash("photo-1600596542815-ffad4c1539a9"),
    seed: "ridge-villas",
    status: "Available",
    type: "Villa",
    startingGhs: 3420000,
    images: [
      unsplash("photo-1600596542815-ffad4c1539a9"),
      unsplash("photo-1600607687939-ce8a6c25118c"),
      unsplash("photo-1600585154340-be6161a56a0c"),
      unsplash("photo-1600047509807-ba8f99d2cdde"),
      unsplash("photo-1512917774080-9991f1c4c750"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "6 Ridge Garden Close",
      gps: "GA-112-6647",
      propertyId: "b4f27e18-5d3a-4c60-9e71-3a8c5f0d2b91",
    },
    priceHistory: [
      { date: "Mar 8, 2026", activity: "Listed for sale", price: usd(342000) },
      { date: "Oct 22, 2025", activity: "Valuation", price: usd(325600) },
      { date: "Apr 14, 2025", activity: "Listed on-chain", price: usd(305000) },
    ],
    developer: "Ridge Property Co.",
  },
  {
    slug: "labone-heights",
    name: "Labone Heights",
    location: "Labone, Accra",
    tags: ["2 Bed", "Penthouse", "Sea View"],
    priceUsd: 41200,
    beds: 2,
    baths: 2,
    sqft: 1650,
    image: unsplash("photo-1605276374104-dee2a0ed3cd6"),
    seed: "labone-heights",
    status: "Off-plan",
    type: "Apartment",
    startingGhs: 1650000,
    images: [
      unsplash("photo-1605276374104-dee2a0ed3cd6"),
      unsplash("photo-1600566753086-00f18fb6b3ea"),
      unsplash("photo-1580587771525-78b9dba3b914"),
      unsplash("photo-1600047509807-ba8f99d2cdde"),
      unsplash("photo-1564013799919-ab600027ffc6"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "5 Labone Crescent",
      gps: "GA-145-7781",
      propertyId: "3f7b8e21-04ad-4c19-9b6f-6a2e1d5c8804",
    },
    priceHistory: [
      { date: "Mar 20, 2026", activity: "Off-plan sale", price: usd(144500) },
      { date: "Jan 2, 2026", activity: "Listed on-chain", price: usd(138000) },
    ],
    developer: "Labone Living",
  },
  {
    slug: "east-legon-court",
    name: "East Legon Court",
    location: "East Legon, Accra",
    tags: ["3 Bed", "Townhouse", "Pool"],
    priceUsd: 47500,
    beds: 3,
    baths: 3,
    sqft: 2400,
    image: unsplash("photo-1580587771525-78b9dba3b914"),
    seed: "east-legon-court",
    status: "Available",
    type: "Townhouse",
    startingGhs: 2750000,
    images: [
      unsplash("photo-1580587771525-78b9dba3b914"),
      unsplash("photo-1600607687939-ce8a6c25118c"),
      unsplash("photo-1605276374104-dee2a0ed3cd6"),
      unsplash("photo-1600566753086-00f18fb6b3ea"),
      unsplash("photo-1568605114967-8130f3a36994"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "15 Legon Court Avenue",
      gps: "GA-201-4432",
      propertyId: "9c4a1e73-6f28-4b5d-8a02-1d7e4f9c3b6a",
    },
    priceHistory: [
      { date: "Mar 2, 2026", activity: "Listed for sale", price: usd(275000) },
      { date: "Nov 5, 2025", activity: "Valuation", price: usd(261400) },
    ],
    developer: "Afram Marketplace",
  },
  {
    slug: "spintex-residences",
    name: "Spintex Residences",
    location: "Spintex, Accra",
    tags: ["1 Bed", "Floor 3", "Smart Home"],
    priceUsd: 24800,
    beds: 1,
    baths: 1,
    sqft: 980,
    image: unsplash("photo-1512917774080-9991f1c4c750"),
    seed: "spintex-residences",
    status: "Available",
    type: "Apartment",
    startingGhs: 1440000,
    images: [
      unsplash("photo-1512917774080-9991f1c4c750"),
      unsplash("photo-1600047509807-ba8f99d2cdde"),
      unsplash("photo-1576941089067-2de3c901e126"),
      unsplash("photo-1600566753086-00f18fb6b3ea"),
      unsplash("photo-1564013799919-ab600027ffc6"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "44 Spintex Road",
      gps: "GT-330-8814",
      propertyId: "2e8b7d15-4c93-4a71-9f6d-0b3a8e5c1d47",
    },
    priceHistory: [
      { date: "Apr 1, 2026", activity: "Listed for sale", price: usd(148000) },
      { date: "Jan 25, 2026", activity: "Valuation", price: usd(141200) },
    ],
    developer: "Afram Marketplace",
  },
  {
    slug: "tema-community-25",
    name: "Tema Community 25",
    location: "Tema, Greater Accra",
    tags: ["3 Bed", "Semi-detached", "New"],
    priceUsd: 36750,
    beds: 3,
    baths: 2,
    sqft: 2150,
    image: unsplash("photo-1564013799919-ab600027ffc6"),
    seed: "tema-community-25",
    status: "Off-plan",
    type: "House",
    startingGhs: 2130000,
    images: [
      unsplash("photo-1564013799919-ab600027ffc6"),
      unsplash("photo-1600566753086-00f18fb6b3ea"),
      unsplash("photo-1568605114967-8130f3a36994"),
      unsplash("photo-1600047509807-ba8f99d2cdde"),
      unsplash("photo-1512917774080-9991f1c4c750"),
    ],
    about: ABOUT,
    amenities: BASE_AMENITIES,
    legal: BASE_LEGAL,
    floorPlan: FLOOR_PLAN,
    address: {
      street: "Plot 25, Community 25",
      gps: "GT-410-2207",
      propertyId: "7a1c9e04-2b5d-4f83-8e91-6c0a3d7b5f28",
    },
    priceHistory: [
      { date: "Mar 30, 2026", activity: "Off-plan sale", price: usd(110250) },
      { date: "Dec 15, 2025", activity: "Listed on-chain", price: usd(104900) },
    ],
    developer: "Greenstone Homes",
  },
];

export function getAllProperties(): Property[] {
  return FEATURED_PROPERTIES;
}

export function findPropertyBySlug(slug: string): Property | undefined {
  return FEATURED_PROPERTIES.find((property) => property.slug === slug);
}

export function formatPropertyPrice(property: Property): string {
  return `From ${usd(property.priceUsd)}`;
}
