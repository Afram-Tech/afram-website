import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export type ProofStat = { value: string; label: string };

export function PersonaProof({
  title,
  intro,
  stats,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  intro?: string;
  stats: ProofStat[];
  ctaLabel: string;
  ctaHref: string;
}) {

  return (
    <Section id="proof" className="scroll-mt-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading title={title} intro={intro} />
        <Link
          href={ctaHref}
          className="btn-secondary group inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-full px-5 text-[15px] font-semibold"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <dl
        className={cn(
          "mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-ink-100 py-8 lg:mt-14 lg:py-10",
          // One column per stat, so three stats don't leave an empty cell.
          stats.length === 3 ? "sm:grid-cols-3" : "lg:grid-cols-4",
        )}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col-reverse gap-2.5",
              i > 0 && "lg:border-l lg:border-ink-100 lg:pl-8",
              stats.length === 3 && i === 2 && "col-span-2 sm:col-span-1",
            )}
          >
            <dt className="text-[14px] leading-5 text-ink-500">{s.label}</dt>
            <dd className="tnum t-stat text-deep-950">{s.value}</dd>
          </div>
        ))}
      </dl>

    </Section>
  );
}
