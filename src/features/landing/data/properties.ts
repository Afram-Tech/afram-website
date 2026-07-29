import { usd } from "@/lib/format";

const unsplash = (id: string, width = 1200, quality = 68) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

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
}

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
