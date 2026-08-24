"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Handshake,
  IdCard,
  KeyRound,
  Landmark,
  LineChart,
  Lock,
  MessageCircle,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { createElement, useCallback, useEffect, useRef, useState } from "react";

import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import type { PersonaBlock } from "@/features/personas/types";
import { cn } from "@/lib/utils";

const DIALOG_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=68";

/**
 * Icons arrive as names, not components — these blocks are authored in data
 * that a server component hands across the boundary, and a component
 * reference will not serialise.
 */
const ICONS = {
  KeyRound,
  Lock,
  FileText,
  Building2,
  ShieldCheck,
  MessageCircle,
  LineChart,
  Handshake,
  BadgeCheck,
  Landmark,
  TrendingUp,
  Scale,
  FileCheck2,
  ClipboardCheck,
  IdCard,
  Search,
  SlidersHorizontal,
  Clock3,
} as const;

const iconFor = (name?: string) => (name && ICONS[name as keyof typeof ICONS]) || Plus;

/**
 * The objection register. Every block on these pages is one fear and its
 * answer. The tiles carry only the answer headline — the reading happens in
 * the dialog, which is where the space for it is.
 */
export function PersonaBlocks({
  blocks,
  cta,
}: {
  blocks: PersonaBlock[];
  cta?: { label: string; href: string };
}) {
  const [open, setOpen] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? i : (i + delta + blocks.length) % blocks.length)),
    [blocks.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const openAt = (i: number, el: HTMLElement) => {
    returnFocus.current = el;
    setOpen(i);
  };

  const handleClose = () => {
    close();
    returnFocus.current?.focus();
  };

  // The register should never end on a ragged row.
  const n = blocks.length;
  const lastSpan = cn(
    n % 2 === 1 && "sm:col-span-2",
    n % 3 === 1 && "lg:col-span-3",
    n % 3 === 2 && "lg:col-span-2",
  );

  const active = open === null ? null : blocks[open];

  return (
    <>
      <div className="border-ink-100 bg-ink-100 ring-ink-100 overflow-hidden rounded-[1.5rem] ring-1">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((b, i) => {
            const Icon = iconFor(b.icon);
            const lead = i === 0;
            return (
              <button
                key={b.title}
                type="button"
                onClick={(e) => openAt(i, e.currentTarget)}
                aria-haspopup="dialog"
                className={cn(
                  "group relative flex min-h-[148px] flex-col p-6 text-left transition-colors duration-200",
                  "focus-visible:outline-accent-600 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2",
                  lead ? "bg-accent-50/70 hover:bg-accent-50" : "hover:bg-accent-50/50 bg-white",
                  i === n - 1 && lastSpan,
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                    lead
                      ? "bg-accent-600 text-white"
                      : "bg-accent-50 text-accent-600 group-hover:bg-accent-600 group-hover:text-white",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                <span className="text-ink-900 mt-5 text-[16px] leading-snug font-bold tracking-[-0.01em]">
                  {b.title}
                </span>

                <span className="text-accent-600 mt-auto flex items-center gap-1.5 pt-4 text-[12px] font-semibold tracking-[0.14em] uppercase">
                  Read the answer
                  <ArrowRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The tiles no longer show the answers, so keep them in the HTML for
          crawlers and screen readers rather than only inside the dialog. */}
      <dl className="sr-only">
        {blocks.map((b) => (
          <div key={b.title}>
            <dt>{b.title}</dt>
            <dd>{b.body}</dd>
          </div>
        ))}
      </dl>

      {active &&
        createPortal(
          <div
            className="scrim-in bg-ink-950/70 fixed inset-0 z-[120] flex items-end justify-center backdrop-blur-sm sm:items-center sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="persona-block-title"
              className="panel-in max-h-[92vh] w-full overflow-y-auto rounded-t-[1.75rem] bg-white outline-none sm:max-w-2xl sm:rounded-[1.75rem]"
            >
              <div className="relative h-36 overflow-hidden sm:h-44">
                <DuotonePhoto
                  src={DIALOG_BANNER_IMAGE}
                  className="absolute inset-0 h-full w-full"
                />
                <div className="from-brand-950/45 absolute inset-0 bg-gradient-to-t to-transparent" />
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close"
                  className="text-ink-700 hover:text-ink-900 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
                <span className="text-accent-600 absolute bottom-5 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 shadow-sm backdrop-blur-sm">
                  {createElement(iconFor(active.icon), { className: "h-5 w-5" })}
                </span>
              </div>

              <div className="p-6 sm:p-9">
                <h3
                  id="persona-block-title"
                  className="text-ink-900 text-[clamp(1.5rem,2.8vw,2rem)] leading-[1.12] font-bold tracking-[-0.02em]"
                >
                  {active.title}
                </h3>
                <p className="text-ink-500 mt-4 text-[17px] leading-relaxed">{active.body}</p>

                <div className="border-ink-100 mt-8 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous answer"
                      className="text-ink-500 ring-ink-100 hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-accent-600 flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next answer"
                      className="text-ink-500 ring-ink-100 hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-accent-600 flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <span className="tnum text-ink-400 ml-1 text-[13px] font-medium">
                      {(open ?? 0) + 1} of {blocks.length}
                    </span>
                  </div>

                  {cta && (
                    <Link
                      href={cta.href}
                      onClick={handleClose}
                      className="bg-brand-500 hover:bg-brand-600 focus-visible:outline-brand-500 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
                    >
                      {cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
