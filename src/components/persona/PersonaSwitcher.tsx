"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PersonaBlocks } from "@/components/persona/PersonaBlocks";
import type { PersonaContent } from "@/features/personas/types";
import { cn } from "@/lib/utils";

/**
 * One page, one audience at a time.
 *
 * The toggle leads — it is the first decision the visitor makes and every
 * word below depends on it, so it sits top-left rather than tucked in a
 * corner. The persona ids stay in the URL hash so links elsewhere on the
 * site can land directly on the right audience.
 */
export function PersonaSwitcher({ personas }: { personas: PersonaContent[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      const i = personas.findIndex((p) => p.id === id);
      if (i >= 0) setActive(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [personas]);

  const select = (i: number) => {
    setActive(i);
    window.history.replaceState(null, "", `#${personas[i].id}`);
  };

  const p = personas[active];
  const metrics = p.stats.slice(0, 3);

  return (
    <section id="audience" className="mx-auto max-w-[1536px] scroll-mt-24 px-6 sm:px-8 lg:px-16">
      <div className="from-accent-50 via-accent-50/40 ring-accent-100/70 overflow-hidden rounded-[2rem] bg-gradient-to-br to-white p-6 ring-1 sm:p-10 lg:p-12">
        <div className="flex flex-col gap-3">
          <p className="text-accent-700 text-[12px] font-semibold tracking-[0.18em] uppercase">
            I am a…
          </p>
          <div
            role="tablist"
            aria-label="Choose your audience"
            className="ring-accent-100 flex w-fit max-w-full flex-wrap gap-1.5 rounded-full bg-white/70 p-1.5 ring-1"
          >
            {personas.map((it, i) => (
              <button
                key={it.id}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls="audience-panel"
                onClick={() => select(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-200",
                  "focus-visible:outline-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2",
                  i === active
                    ? "bg-accent-600 text-white shadow-sm"
                    : "text-ink-500 hover:text-ink-900 hover:bg-white",
                )}
              >
                {it.tab}
              </button>
            ))}
          </div>
        </div>

        <div
          id="audience-panel"
          role="tabpanel"
          className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14"
        >
          <div className="flex flex-col justify-center">
            <h2 className="text-ink-900 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
              {p.headline}
            </h2>
            <p className="text-ink-500 mt-4 max-w-lg text-[16px] leading-relaxed">{p.subhead}</p>
            {p.blocksCta && (
              <Link
                href={p.blocksCta.href}
                className="bg-brand-500 hover:bg-brand-600 focus-visible:outline-brand-500 mt-7 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
              >
                {p.blocksCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {metrics.length > 0 && (
            <dl className="bg-brand-700 divide-y divide-white/10 self-center rounded-[1.5rem] p-7 text-white sm:p-8">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={cn("py-4", i === 0 && "pt-0", i === metrics.length - 1 && "pb-0")}
                >
                  <dd className="tnum text-[clamp(1.75rem,3vw,2.25rem)] leading-none font-bold tracking-[-0.02em]">
                    {m.value}
                  </dd>
                  <dt className="mt-2 text-[13px] tracking-[0.12em] text-white/60 uppercase">
                    {m.label}
                  </dt>
                </div>
              ))}
            </dl>
          )}
        </div>

        {p.blocks && p.blocks.length > 0 && (
          <div className="border-accent-100/80 mt-9 border-t pt-8 sm:mt-10 sm:pt-10">
            <PersonaBlocks key={p.id} blocks={p.blocks} cta={p.blocksCta} />
          </div>
        )}

        {p.callout && (
          <div className="bg-brand-700 mt-6 rounded-[1.5rem] p-6 text-white sm:p-8 lg:p-10">
            <h3 className="max-w-xl text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
              {p.callout.title}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
              {p.callout.body}
            </p>
            <a
              href={p.callout.cta.href}
              className="text-ink-900 hover:bg-brand-50 mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
            >
              {p.callout.cta.label}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
