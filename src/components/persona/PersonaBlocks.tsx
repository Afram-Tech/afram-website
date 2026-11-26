"use client";

import { useCallback, useEffect, useRef, useState, createElement } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PHOTOS } from "@/lib/data/photos";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";

export type PersonaBlock = { title: string; body: string; icon?: string };

/**
 * Icons arrive as names, not components: these blocks are authored in data
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

export const iconFor = (name?: string) =>
  (name && ICONS[name as keyof typeof ICONS]) || Plus;

/** A block's icon by name, drawn from the fixed set above. */
export function BlockIcon({ name, className }: { name?: string; className?: string }) {
  return createElement(iconFor(name), { className, "aria-hidden": true });
}

/**
 * The objection register.
 *
 * Every block on these pages is one fear and its answer. The tiles carry only
 * the answer headline — a wall of paragraphs is the thing this page was
 * losing people to — and the reading happens in the dialog, which is where
 * the space for it is.
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
      setOpen((i) =>
        i === null ? i : (i + delta + blocks.length) % blocks.length,
      ),
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
  // Four reads best as two by two.
  const n = blocks.length;
  const twoByTwo = n === 4;
  const lastSpan = cn(
    n % 2 === 1 && "sm:col-span-2",
    !twoByTwo && n % 3 === 1 && "lg:col-span-3",
    !twoByTwo && n % 3 === 2 && "lg:col-span-2",
  );

  const active = open === null ? null : blocks[open];

  return (
    <>
      <div>
        <div className={cn("grid gap-3 sm:grid-cols-2 lg:gap-4", !twoByTwo && "lg:grid-cols-3")}>
          {blocks.map((b, i) => {
            const lead = i === 0;
            return (
              <button
                key={b.title}
                type="button"
                onClick={(e) => openAt(i, e.currentTarget)}
                aria-haspopup="dialog"
                className={cn(
                  "group relative flex min-h-[148px] flex-col rounded-[20px] p-6 text-left transition-colors duration-200",
                  "focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-600",
                  lead
                    ? "bg-brand-100/70 hover:bg-brand-100"
                    : "bg-brand-50 hover:bg-brand-100/60",
                  i === n - 1 && lastSpan,
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                    lead
                      ? "bg-accent-600 text-white"
                      : "bg-white text-accent-600 group-hover:bg-accent-600 group-hover:text-white",
                  )}
                >
                  <BlockIcon name={b.icon} className="h-[18px] w-[18px]" />
                </span>

                <span className="mt-5 text-[16px] font-bold leading-snug tracking-[calc(-0.01em*var(--tracking-scale,1))] text-ink-900">
                  {b.title}
                </span>

                <span className="mt-auto flex items-center gap-1.5 pt-4 text-[14px] font-semibold text-accent-600">
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
            className="scrim-in fixed inset-0 z-[120] flex items-end justify-center bg-ink-950/70 backdrop-blur-sm sm:items-center sm:p-6"
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
              className="panel-in max-h-[92vh] w-full overflow-y-auto rounded-t-[1.75rem] bg-white outline-none sm:max-w-2xl sm:rounded-[20px]"
            >
              {/* Infographic band — the answer gets a face, not just a paragraph */}
              <div className="relative h-36 overflow-hidden sm:h-44">
                <DuotonePhoto
                  src={PHOTOS.ferrofluid}
                  sizes="(max-width: 640px) 100vw, 672px"
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/45 to-transparent" />
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
                <span className="absolute bottom-5 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-accent-600 shadow-sm backdrop-blur-sm">
                  <BlockIcon name={active?.icon} className="h-5 w-5" />
                </span>
              </div>

              <div className="p-6 sm:p-9">
                <h3
                  id="persona-block-title"
                  className="t-h3 text-ink-900"
                >
                  {active.title}
                </h3>
                <p className="mt-4 t-lead text-ink-500">
                  {active.body}
                </p>

                <div className="mt-8 flex flex-col gap-4 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous answer"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 ring-1 ring-ink-100 transition-colors hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next answer"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 ring-1 ring-ink-100 transition-colors hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <span className="tnum ml-1 text-[13px] font-medium text-ink-400">
                      {(open ?? 0) + 1} of {blocks.length}
                    </span>
                  </div>

                  {cta && (
                    <Link
                      href={cta.href}
                      onClick={handleClose}
                      className="btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold"
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
