export interface PersonaContent {
  id: string;
  tab: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  image: string;
  /** small stat row beneath the CTAs */
  stats: { label: string; value: string; accent?: boolean }[];
  /** floating card on the hero image */
  floatLabel?: string;
  floatValue?: string;
  imageBadge?: string;
  /**
   * Objection-handling sub-blocks rendered full-width beneath the persona
   * block and its stat row. Order is deliberate — the research puts the
   * fear that ends the visit first.
   */
  blocks?: { title: string; body: string; icon?: string }[];
  /** Full-width offer callout closing the persona block. */
  callout?: { title: string; body: string; cta: Cta };
  /** CTA offered inside the block dialog. */
  blocksCta?: Cta;
  faqs: { q: string; a: string }[];
}

export interface Cta {
  label: string;
  href: string;
}
