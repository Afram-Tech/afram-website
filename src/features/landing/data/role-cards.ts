export interface RoleCard {
  eyebrow: string;
  title: string;
  href: string;
  /** Card surface — a soft top-to-bottom gradient. */
  background: string;
  /** Eyebrow pill background. */
  pillColor: string;
  /**
   * Decorative cut-out, rendered with alt="" (the link is named by its text).
   * Geometry at full size, in px: rendered height, how far it hangs below the
   * card's bottom edge, and its inset from the right edge. The art is taller
   * than what shows, so only heads and shoulders peek up from the
   * bottom-right corner; the card's overflow-hidden clips the rest. Scaled by
   * --art-k on narrow cards.
   */
  art: { src: string; width: number; height: number; h: number; drop: number; right: number };
}

export const ROLE_CARDS: RoleCard[] = [
  {
    eyebrow: "For Members",
    title: "Own verified property with flexible financing",
    href: "/properties",
    background: "linear-gradient(180deg, #e5fbf8 0%, #f6fdfc 100%)",
    pillColor: "#caf0f3",
    art: { src: "/role-couple.webp", width: 756, height: 991, h: 180, drop: 86, right: 8 },
  },
  {
    eyebrow: "For Developers",
    title: "Raise capital and accelerate sales",
    href: "/developers",
    background: "linear-gradient(180deg, #ccf8f6 0%, #ebfdfb 100%)",
    pillColor: "rgba(255,255,255,0.5)",
    art: { src: "/role-developer.webp", width: 760, height: 855, h: 170, drop: 92, right: 0 },
  },
  {
    eyebrow: "For Financiers",
    title: "Deploy capital securely against verified assets",
    href: "/financiers",
    background: "linear-gradient(180deg, #b2f1ee 0%, #e0faf7 100%)",
    pillColor: "rgba(255,255,255,0.5)",
    art: { src: "/role-financier.webp", width: 760, height: 565, h: 145, drop: 73, right: 3 },
  },
];
