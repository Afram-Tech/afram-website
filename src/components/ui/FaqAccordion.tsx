"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  a: string;
  /** Optional anchor id placed on the item wrapper (with scroll-mt-24). */
  id?: string;
};

/**
 * Reusable FAQ accordion: +/rotate-45 icon, grid-rows [0fr]→[1fr] height
 * transition. First item is open by default. An item may carry an `id` so
 * it can be deep-linked to.
 */
export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("divide-ink-100 border-ink-100 divide-y border-y", className)}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} id={f.id} className={cn(f.id && "scroll-mt-24")}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-ink-900 text-[17px] font-semibold">{f.q}</span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                  isOpen ? "bg-brand-500 rotate-45 text-white" : "bg-ink-50 text-ink-500",
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
                <p className="text-ink-500 max-w-2xl text-[15px] leading-relaxed">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
