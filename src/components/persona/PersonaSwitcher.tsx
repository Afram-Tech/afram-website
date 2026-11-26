"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WavePattern } from "@/components/ui/WavePattern";
import { BlockIcon, type PersonaBlock } from "@/components/persona/PersonaBlocks";

export type SwitchItem = {
  id: string;
  tab: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  metrics?: { label: string; value: string }[];
  blocks?: PersonaBlock[];
  blocksCta?: { label: string; href: string };
  callout?: {
    title: string;
    body: string;
    cta: { label: string; href: string };
  };
};

/**
 * One page, one audience at a time.
 *
 * The toggle leads: it is the first decision the visitor makes and every word
 * below depends on it. The pitch sits under it on the left, and the right half
 * carries what this audience weighs up, either its numbers or its reasons.
 * The persona ids stay in the URL hash so the header's dropdown links still
 * land on the right audience.
 */
/** Fired when the audience changes, so sections further down the page
 *  (see PersonaAnswers) can follow the toggle. */
export const PERSONA_EVENT = "afram:persona";

export function PersonaSwitcher({
  items,
  blocksInPanel = true,
}: {
  items: SwitchItem[];
  /** false when the page shows the blocks further down instead. */
  blocksInPanel?: boolean;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      const i = items.findIndex((p) => p.id === id);
      if (i >= 0) setActive(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [items]);

  const select = (i: number) => {
    setActive(i);
    window.history.replaceState(null, "", `#${items[i].id}`);
    window.dispatchEvent(new CustomEvent(PERSONA_EVENT, { detail: items[i].id }));
  };

  const p = items[active];
  const metrics = p.metrics ?? [];
  const reasons = blocksInPanel && metrics.length === 0 ? (p.blocks ?? []) : [];

  return (
    <section
      id="audience"
      className="mx-auto mb-[var(--section-y,3rem)] mt-[var(--switcher-top,0px)] max-w-[1536px] scroll-mt-24 px-5 sm:mb-[var(--section-y-sm,4rem)] sm:mt-[var(--switcher-top-sm,0px)] lg:mb-[var(--section-y-lg,6rem)] lg:mt-[var(--switcher-top-lg,0px)] lg:px-[34px]"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100/70 via-brand-50 to-brand-50/40 p-5 ring-1 ring-brand-500/10 sm:p-8 lg:p-12 xl:p-14">
        <WavePattern />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-20">
          <div className="flex flex-col justify-center">
            {/* The choice comes first, when there is one to make */}
            {items.length > 1 && (
            <div>
              <div
                role="tablist"
                aria-label="Choose your audience"
                className="flex w-fit max-w-full flex-wrap gap-1 rounded-full bg-brand-500/10 p-1"
              >
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    role="tab"
                    type="button"
                    aria-selected={i === active}
                    aria-controls="audience-panel"
                    onClick={() => select(i)}
                    className={cn(
                      "h-9 rounded-full px-4 text-[14px] font-semibold transition-[background-color,color,box-shadow] duration-200 ease-out-soft",
                      "focus-visible:outline-none focus-visible:shadow-focus",
                      i === active
                        ? "bg-white text-deep-950 shadow-xs"
                        : "text-ink-600 hover:text-deep-950",
                    )}
                  >
                    {it.tab}
                  </button>
                ))}
              </div>
            </div>
            )}

            <div
              key={p.id}
              id="audience-panel"
              role="tabpanel"
              className={cn("page-in", items.length > 1 && "mt-8 sm:mt-10")}
            >
              <h2 className="t-h2 text-deep-950">{p.headline}</h2>
              <p className="t-lead mt-4 max-w-xl text-ink-600">{p.subhead}</p>
              {p.blocksCta && (
                <Link
                  href={p.blocksCta.href}
                  className="btn-primary mt-7 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold"
                >
                  {p.blocksCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* What this audience weighs up: its numbers, or its reasons as
              headlines only (the FAQ below carries the detail) */}
          {metrics.length > 0 ? (
            <dl
              key={p.id}
              className="page-in divide-y divide-ink-100 self-center rounded-[20px] bg-white px-6 py-2 sm:px-8 lg:px-10"
            >
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col-reverse gap-1.5 py-5 sm:py-6"
                >
                  <dt className="text-[14px] leading-5 text-ink-500">{m.label}</dt>
                  <dd className="tnum t-h3 text-deep-950">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            reasons.length > 0 && (
              <ul
                key={p.id}
                className="page-in divide-y divide-ink-100 self-center rounded-[20px] bg-white px-5 sm:px-7 lg:px-8"
              >
                {reasons.map((b) => {
                  return (
                    <li key={b.title} className="flex items-center gap-4 py-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <BlockIcon name={b.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <h3 className="t-h4 min-w-0 text-deep-950">{b.title}</h3>
                    </li>
                  );
                })}
              </ul>
            )
          )}
        </div>

        {p.callout && (
          <div className="relative mt-8 rounded-[20px] bg-white/70 p-6 ring-1 ring-ink-100 sm:p-8">
            <h3 className="t-h4 text-deep-950">{p.callout.title}</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-500">
              {p.callout.body}
            </p>
            {p.callout.cta.href !== p.blocksCta?.href && (
              <a
                href={p.callout.cta.href}
                className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-600 underline-offset-4 hover:underline"
              >
                {p.callout.cta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
