"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";

export type FaqGroup = { label: string; faqs: { q: string; a: string }[] };

/**
 * Grouped-by-audience FAQ, styled to match the How-it-works FAQ: a faint
 * rounded container with the heading on the left and the accordion on the
 * right. One question open at a time across all groups.
 */
export function PersonaFaq({
  title,
  intro = "Straight answers to the questions people actually ask us.",
  groups,
  riskKind = "investment",
}: {
  title: string;
  riskKind?: "investment" | "lending";
  intro?: string;
  groups: FaqGroup[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section>
      <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-brand-50 via-ink-50/30 to-white p-6 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:p-14">
        {/* Heading */}
        <div>
          <div className="max-w-2xl">
            <h2 className="t-h2 text-ink-900">
              {title}
            </h2>
            <p className="mt-3.5 t-lead text-ink-500">
              {intro}
            </p>
          </div>
          <CapitalAtRiskBadge variant="block" kind={riskKind} className="mt-8 max-w-sm" />
        </div>

        {/* Grouped accordion */}
        <div className="space-y-9">
          {groups.map((g) => (
            <div key={g.label}>
              {/* A group heading only when there is more than one group to
                  tell apart; a lone group needs no label */}
              {groups.length > 1 && (
                <h3 className="mb-2 text-[15px] font-semibold text-brand-700">
                  {g.label}
                </h3>
              )}
              <div className="divide-y divide-ink-100 border-y border-ink-100">
                {g.faqs.map((f, i) => {
                  const key = `${g.label}-${i}`;
                  const isOpen = open === key;
                  return (
                    <div key={f.q}>
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
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
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
