import { ClipboardCheck, FileText, SlidersHorizontal } from "lucide-react";
import { FeatureCards, type FeatureCard } from "@/components/persona/FeatureCards";

/**
 * The financiers page's counterpart to the vendors page's three cards. It
 * replaced the Bank / Private credit toggle: these three hold for every
 * lender. Each line restates a claim already made in the financier personas
 * (lib/data/financier-personas.ts); nothing here is new.
 */
const CONCERNS: FeatureCard[] = [
  {
    icon: SlidersHorizontal,
    title: "Lend inside your box",
    body: "Set the rate, term and ticket. Only deals that fit reach your desk.",
  },
  {
    icon: ClipboardCheck,
    title: "Your valuers",
    body: "Valuations run through your approved-valuer panel. We do not ask you to accept ours.",
  },
  {
    icon: FileText,
    title: "Your counsel reviews",
    body: "We prepare the standard security pack. Your counsel reviews it before you commit.",
  },
];

export function LenderConcerns() {
  return (
    <FeatureCards
      id="concerns"
      title="Built around how you already lend."
      cards={CONCERNS}
    />
  );
}
