import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";

export type QuickLink = {
  label: string;
  href: string;
};

/**
 * Secondary destinations, kept deliberately small. These are for the visitor
 * who is already looking for something specific, so they sit at the very
 * bottom and take a single line rather than a card each.
 */
export function PersonaQuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <Section className="pt-0">
      <div className="border-ink-100 flex flex-col gap-x-8 gap-y-3 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-ink-400 text-[12px] font-semibold tracking-[0.14em] uppercase">
          More
        </span>
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-ink-700 hover:text-brand-700 group focus-visible:outline-brand-500 inline-flex items-center gap-1.5 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {l.label}
            <ArrowUpRight className="text-ink-300 group-hover:text-brand-600 h-3.5 w-3.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ))}
      </div>
    </Section>
  );
}
