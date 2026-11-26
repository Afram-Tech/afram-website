import { BadgeCheck, Banknote, Building2 } from "lucide-react";
import { StoryBand, type StoryPoint } from "@/components/persona/StoryBand";
import { accessCta, signUpHref } from "@/features/access/cta";

/**
 * The first section under the vendors hero: selling. Raising capital follows
 * as its own section, so the two outcomes don't read as competing processes.
 *
 * Every line restates a claim already made on this page or in the vendor
 * personas; nothing here is new.
 */
const POINTS: StoryPoint[] = [
  {
    icon: BadgeCheck,
    title: "Buyers arrive approved",
    body: "Financing is arranged before they make an offer.",
  },
  {
    icon: Banknote,
    title: "You are paid in full",
    body: "Their financier pays the full price. No chasing defaulters.",
  },
  {
    icon: Building2,
    title: "One unit or a whole portfolio",
    body: "Your price, your terms.",
  },
];

export function SellSection() {
  return (
    <StoryBand
      id="sell"
      title="Sell to buyers who already have financing."
      lead="Sell your units faster with financiers on Afram financing potential buyers, so your units don’t sit on the market for long."
      cta={accessCta({ label: "Get Started", href: signUpHref("issuer") })}
      points={POINTS}
    />
  );
}
