import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PersonaBlocks } from "@/components/persona/PersonaBlocks";
import { cn } from "@/lib/utils";

export type ScrollItem = {
  id: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  image: string;
  seed: string;
  /** Browser-framed page screenshot for this audience (placeholder for now). */
  screenshot?: string;
  metrics?: { label: string; value: string }[];
  /** Objection-handling sub-blocks, full-width beneath the copy and stat row. */
  blocks?: { title: string; body: string; icon?: string }[];
  /** Offer callout closing the block. */
  callout?: {
    title: string;
    body: string;
    cta: { label: string; href: string };
  };
  /** CTA shown in the block dialog footer. */
  blocksCta?: { label: string; href: string };
};

/**
 * Persona sections, styled like the How-it-works flow: each audience is a
 * rounded, accent-tinted container with copy on one side and a browser-framed
 * screenshot on the other, alternating sides down the page.
 */
export function PersonaScroller({ items }: { items: ScrollItem[] }) {
  return (
    <section className="mx-auto max-w-[1536px] px-5 lg:px-[34px]">
      <div className="space-y-6 lg:space-y-8">
        {items.map((it, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={it.id}
              id={it.id}
              className="grid scroll-mt-24 items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 to-white p-6 ring-1 ring-brand-500/10 sm:gap-8 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12"
            >
              {/* Copy */}
              <Reveal className={cn(flip && "lg:order-2")}>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold tabular-nums text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-10 bg-accent-400/70" />
                  <span className="t-overline text-accent-700">
                    {it.eyebrow}
                  </span>
                </div>

                <h2 className="mt-5 max-w-xl t-h2 text-ink-900">
                  {it.headline}
                </h2>
                <p className="mt-4 max-w-md t-lead text-ink-500">
                  {it.subhead}
                </p>

                {it.metrics && it.metrics.length > 0 && (
                  <dl className="mt-7 flex flex-wrap gap-x-9 gap-y-4">
                    {it.metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="t-overline text-ink-400">
                          {m.label}
                        </dt>
                        <dd className="tnum mt-1 text-[20px] font-semibold tracking-[calc(-0.01em*var(--tracking-scale,1))] text-ink-900">
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </Reveal>

              {/* Browser-framed screenshot showcase */}
              <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
                <div className="overflow-hidden rounded-2xl bg-white shadow-raised ring-1 ring-black/5">
                  <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                  </div>
                  <Image
                    src={it.screenshot ?? "/dash-buyer.png"}
                    alt=""
                    width={1200}
                    height={838}
                    sizes="(max-width: 1024px) 90vw, 560px"
                    className="block w-full"
                  />
                </div>
              </Reveal>

              {/*
                Objection handling — full width beneath both columns.
                lg:order-3 / lg:order-4 keep these last on flipped items,
                whose copy and screenshot carry lg:order-2 / lg:order-1.
              */}
              {it.blocks && it.blocks.length > 0 && (
                <Reveal className="border-t border-accent-100/80 pt-8 sm:pt-10 lg:order-3 lg:col-span-2 lg:pt-12">
                  <PersonaBlocks blocks={it.blocks} cta={it.blocksCta} />
                </Reveal>
              )}

              {/* Offer callout */}
              {it.callout && (
                <Reveal className="lg:order-4 lg:col-span-2">
                  <div className="rounded-3xl bg-brand-700 p-6 text-white sm:p-8 lg:p-10">
                    <h3 className="max-w-xl t-h3">
                      {it.callout.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
                      {it.callout.body}
                    </p>
                    <Button
                      href={it.callout.cta.href}
                      size="lg"
                      variant="inverse"
                      className="mt-6"
                    >
                      {it.callout.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Reveal>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
