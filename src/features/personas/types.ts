export interface PersonaStat {
  label: string;
  value: string;
  accent?: boolean;
}

export interface PersonaFaq {
  q: string;
  a: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface PersonaBlock {
  title: string;
  body: string;
  icon?: string;
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
  /** Objection-handling tiles rendered on the switcher's persona panel. */
  blocks?: PersonaBlock[];
  /** CTA offered inside the block dialog and beneath the pitch copy. */
  blocksCta?: Cta;
  /** Full-width offer callout closing the persona panel. */
  callout?: { title: string; body: string; cta: Cta };
}
