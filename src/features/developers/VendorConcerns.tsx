import { BadgeCheck, Handshake, TrendingUp } from "lucide-react";
import { FeatureCards, type FeatureCard } from "@/components/persona/FeatureCards";

/**
 * The third section of the vendors page: once a firm sees what Afram does, the
 * next thought is what it costs them. These answer the three things
 * development firms raise first, so the FAQ below no longer repeats them.
 */
const CONCERNS: FeatureCard[] = [
  {
    icon: Handshake,
    title: "Complements your sales team",
    body: "Afram works with your sales team and agents from one shared account.",
  },
  {
    icon: BadgeCheck,
    title: "Buyer assurance",
    body: "Afram endorses your project through due diligence that gives buyers assurance.",
  },
  {
    icon: TrendingUp,
    title: "Market data to guide you",
    body: "See which areas, unit sizes and prices sell, from real buyer activity.",
  },
];

export function VendorConcerns() {
  return (
    <FeatureCards
      id="concerns"
      title="Your concerns, addressed."
      cards={CONCERNS}
    />
  );
}
