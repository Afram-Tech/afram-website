import type { LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";

export type FeatureCard = { icon: LucideIcon; title: string; body: string };

/**
 * Three filled cards in a row under one heading. /developers ("Built around
 * how you already sell.") and /financiers ("Built around how you already
 * lend.") share it, so the two pages keep the same rhythm.
 */
export function FeatureCards({
  id,
  title,
  cards,
}: {
  id: string;
  title: string;
  cards: FeatureCard[];
}) {
  return (
    <Section id={id} className="scroll-mt-24">
      <SectionHeading title={title} />
      <ul className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3 lg:gap-6">
        {cards.map((c) => (
          <li
            key={c.title}
            className="flex flex-col rounded-[20px] bg-brand-50 p-6 sm:p-8"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600">
              <c.icon aria-hidden className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-[18px] font-semibold leading-snug tracking-[calc(-0.01em*var(--tracking-scale,1))] text-ink-900">
              {c.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              {c.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
