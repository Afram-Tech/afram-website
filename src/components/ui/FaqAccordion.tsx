"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  a: string;
  /** Optional anchor id placed on the item wrapper (with scroll-mt-24). */
  id?: string;
};

/**
 * Reusable FAQ accordion. Generalizes the home FAQ style:
 * +/rotate-45 icon, grid-rows [0fr]→[1fr] height transition.
 * First item is open by default. An item may carry an `id` so it can be
 * deep-linked to (e.g. /how-it-works#missed-payment).
 */
export function FaqAccordion({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div
      className={cn(
        "divide-y divide-ink-100 border-y border-ink-100",
        className,
      )}
    >
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} id={f.id} className={cn(f.id && "scroll-mt-24")}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-[17px] font-semibold text-ink-900">
                {f.q}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                  isOpen
                    ? "rotate-45 bg-brand-500 text-white"
                    : "bg-ink-50 text-ink-500",
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl text-[15px] leading-relaxed text-ink-500">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
