export interface PersonaStat {
  label: string;
  value: string;
  accent?: boolean;
}

export interface PersonaFaq {
  q: string;
  a: string;
}

export interface PersonaContent {
  id: string;
  tab: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  image: string;
  stats: PersonaStat[];
  imageBadge?: string;
  faqs: PersonaFaq[];
}

export interface Cta {
  label: string;
  href: string;
}
