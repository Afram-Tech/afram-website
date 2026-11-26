import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { EXTERNAL_LINK } from "@/lib/config";

export type QuickLink = {
  label: string;
  href: string;
  /** An Afram surface on its own domain — say so rather than just leaving. */
  external?: boolean;
  on?: string;
};

/**
 * Secondary destinations, kept deliberately small. These are for the visitor
 * who is already looking for something specific, so they sit at the very
 * bottom and take a single line rather than a card each.
 */
export function PersonaQuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <Section className="pt-0 sm:pt-0 lg:pt-0">
      <div className="flex flex-col gap-x-8 gap-y-3 border-t border-ink-100 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-[15px] font-semibold text-ink-900">
          More from Afram
        </span>
        {links.map((l) => {
          const inner = (
            <>
              {l.label}
              {l.on && (
                <span className="text-[13px] font-normal text-ink-400">
                  on {l.on}
                </span>
              )}
              <ArrowUpRight className="h-3.5 w-3.5 text-ink-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </>
          );
          const cls =
            "group inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-700 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
          return l.external ? (
            <a
              key={l.label}
              href={l.href}
              className={cls}
              title={l.on ? `Opens ${l.on} in a new tab` : undefined}
              {...EXTERNAL_LINK}
            >
              {inner}
            </a>
          ) : (
            <Link key={l.label} href={l.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
