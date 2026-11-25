import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { WavePattern } from "@/components/ui/WavePattern";
import { cn } from "@/lib/utils";

export type StoryPoint = { icon: LucideIcon; title: string; body: string };

/**
 * A mint band: a promise and one button on the left, three points in a white
 * card on the right. /developers sells with it ("Sell to buyers who already
 * have financing.") and /financiers lends with it, one band per kind of loan.
 * `reverse` mirrors the band (points card on the left from desktop up), so
 * two bands in a row don't read as one. On phones the text always leads.
 */
export function StoryBand({
  id,
  title,
  lead,
  cta,
  points,
  reverse = false,
}: {
  id: string;
  title: string;
  lead: string;
  cta: { label: string; href: string };
  points: StoryPoint[];
  reverse?: boolean;
}) {
  return (
    <Section id={id} className="scroll-mt-24">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl from-brand-100/70 via-brand-50 to-brand-50/40 p-5 ring-1 ring-brand-500/10 sm:p-8 lg:p-12 xl:p-14",
          reverse ? "bg-gradient-to-bl" : "bg-gradient-to-br",
        )}
      >
        <WavePattern side={reverse ? "left" : "right"} />
        <div
          className={cn(
            "relative grid gap-8 lg:items-center lg:gap-14 xl:gap-20",
            reverse
              ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]",
          )}
        >
          <div>
            <h2 className="t-h2 max-w-xl text-balance text-deep-950">{title}</h2>
            <p className="t-lead mt-4 max-w-lg text-ink-600">{lead}</p>
            <Button href={cta.href} size="lg" className="mt-7 w-fit">
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <ul
            className={cn(
              "divide-y divide-ink-100 rounded-[20px] bg-white px-5 sm:px-7 lg:px-8",
              reverse && "lg:order-first",
            )}
          >
            {points.map((p) => (
              <li key={p.title} className="flex items-start gap-4 py-5 sm:py-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <p.icon aria-hidden className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block text-[16px] font-semibold leading-snug text-ink-900">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-ink-500">
                    {p.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
