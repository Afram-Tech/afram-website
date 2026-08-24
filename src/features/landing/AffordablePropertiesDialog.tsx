"use client";

import { ArrowRight, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Photo } from "@/components/ui/Photo";
import { paymentForLoan, type RecommendedProperty } from "@/features/landing/affordability";
import { ghs, ghsCompact } from "@/lib/format";

/**
 * The full result set behind the calculator's three cards.
 *
 * Deliberately a list, not the card grid on the page: the job here is
 * scanning ten or more listings against one budget, and a row can carry the
 * price and the instalment side by side where a card cannot.
 */
export function AffordablePropertiesDialog({
  open,
  onClose,
  properties,
  budget,
  withinBudget,
  deposit,
  rate,
  months,
}: {
  open: boolean;
  onClose: () => void;
  properties: RecommendedProperty[];
  /** The home price the slider currently supports, in GHS. */
  budget: number;
  withinBudget: boolean;
  /** Deposit share, e.g. 0.2 — kept identical to the calculator's. */
  deposit: number;
  rate: number;
  months: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const n = properties.length;

  return createPortal(
    <div
      className="scrim-in bg-ink-950/70 fixed inset-0 z-[120] flex items-end justify-center backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="afford-dialog-title"
        className="panel-in flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-white outline-none sm:max-w-3xl sm:rounded-[1.75rem]"
      >
        <header className="border-ink-100 flex items-start gap-4 border-b p-6 sm:px-8 sm:py-7">
          <div className="min-w-0 flex-1">
            <h2
              id="afford-dialog-title"
              className="text-ink-900 text-[clamp(1.35rem,2.6vw,1.75rem)] leading-[1.15] font-bold tracking-[-0.02em]"
            >
              {withinBudget
                ? `${n} ${n === 1 ? "home" : "homes"} within ${ghsCompact(budget)}`
                : `Nothing within ${ghsCompact(budget)} yet`}
            </h2>
            <p className="text-ink-500 mt-2 max-w-[52ch] text-[14.5px] leading-relaxed">
              {withinBudget
                ? "Every listing here cleared a title check before it went live."
                : "The closest listings on Afram — all of them above your budget. Drag the slider higher to bring more into reach."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-500 ring-ink-100 hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-accent-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
          <ul className="space-y-1">
            {properties.map((p) => {
              const price = ghsCompact(p.priceGhs);
              const perMonth = `${ghs(Math.round(paymentForLoan(p.priceGhs * (1 - deposit), rate, months)))}/mo`;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/properties/${p.slug}`}
                    onClick={onClose}
                    className="group hover:bg-accent-50/60 focus-visible:outline-accent-600 flex items-center gap-4 rounded-2xl p-3 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl sm:h-[72px] sm:w-24">
                      <Photo seed={p.slug} src={p.image} alt="" className="h-full w-full" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-ink-900 group-hover:text-brand-700 text-[15px] leading-snug font-bold tracking-[-0.01em] transition-colors">
                        {p.name}
                      </p>
                      <p className="text-ink-500 mt-1 flex items-center gap-1.5 text-[13px]">
                        <MapPin className="text-ink-400 h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </p>
                      {/* Narrow screens have no room for a right rail — a rail
                        there truncates every name. Price drops under the
                        listing instead and the rail returns at sm. */}
                      <p className="tnum mt-1.5 flex items-baseline gap-2 sm:hidden">
                        <span className="text-brand-600 text-[15px] font-bold">{price}</span>
                        <span className="text-ink-400 text-[12.5px]">{perMonth}</span>
                      </p>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="tnum text-brand-600 text-[15px] font-bold">{price}</p>
                      <p className="tnum text-ink-400 mt-1 text-[12.5px]">{perMonth}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="border-ink-100 flex flex-wrap items-center justify-between gap-3 border-t px-6 py-5 sm:px-8">
          {/* The assumptions sit here, not in the intro, so they are shown in
              both states — the monthly column is meaningless without them. */}
          <p className="text-ink-400 max-w-[46ch] text-[12.5px] leading-relaxed">
            Monthly figures assume a {Math.round(deposit * 100)}% deposit over {months / 12} years.
            Illustrative — final terms are confirmed on application.
          </p>
          <Link
            href="/properties"
            onClick={onClose}
            className="text-brand-700 hover:text-brand-800 group inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors"
          >
            Open the full catalogue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
