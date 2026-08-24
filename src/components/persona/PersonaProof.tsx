import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Property } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";

export type ProofStat = { value: string; label: string };

export function PersonaProof({
  title,
  intro,
  stats,
  properties,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  intro: string;
  stats: ProofStat[];
  /** A small, already-deduped sample to show as proof — see `sampleProperties`. */
  properties: Property[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <Section id="proof" className="bg-ink-50/60 scroll-mt-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading title={title} intro={intro} />
        <Link
          href={ctaHref}
          className="text-ink-900 ring-ink-100 hover:ring-brand-300 hover:text-brand-700 group inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold ring-1 transition-all"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {stats.length > 0 && (
        <dl className="bg-ink-100 ring-ink-100 mt-8 grid gap-px overflow-hidden rounded-[1.5rem] ring-1 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-6 py-7">
              <dt className="sr-only">{s.label}</dt>
              <dd className="tnum text-brand-700 text-[clamp(1.75rem,3vw,2.25rem)] leading-none font-bold tracking-[-0.02em]">
                {s.value}
              </dd>
              <p className="text-ink-500 mt-2 text-[14px] leading-snug">{s.label}</p>
            </div>
          ))}
        </dl>
      )}

      {properties.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-7 lg:mt-10 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      )}
    </Section>
  );
}
