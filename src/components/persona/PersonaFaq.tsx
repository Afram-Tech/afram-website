"use client";

import { Info, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface FaqGroup {
  label: string;
  faqs: { q: string; a: string }[];
}

export function PersonaFaq({
  title,
  intro = "Straight answers to the questions people actually ask us.",
  groups,
}: {
  title: string;
  intro?: string;
  groups: FaqGroup[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="from-brand-50 via-ink-50/30 ring-brand-100/50 grid grid-cols-1 gap-10 rounded-[2rem] bg-gradient-to-br to-white p-8 ring-1 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:p-14">
      <div>
        <div className="max-w-2xl">
          <span className="text-brand-600 inline-flex items-center gap-2 text-[13px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
            FAQ
          </span>
          <h2 className="text-ink-900 mt-4 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.12] font-bold tracking-[-0.02em]">
            {title}
          </h2>
          <p className="text-ink-500 mt-3.5 text-[16px] leading-relaxed">{intro}</p>
        </div>
        <div className="bg-ink-50 ring-ink-100 mt-8 flex max-w-sm items-start gap-3 rounded-2xl p-4 ring-1">
          <Info className="text-ink-400 mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-ink-500 text-[13px] leading-relaxed">
            Investments can go down as well as up. Your capital is at risk.{" "}
            <Link
              href="/privacy-policy"
              className="text-ink-700 decoration-ink-300 hover:text-ink-900 font-medium underline underline-offset-2"
            >
              Read the key risks
            </Link>
          </p>
        </div>
      </div>

      <div className="space-y-9">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-brand-600 mb-1 text-[12px] font-bold tracking-[0.16em] uppercase">
              {group.label}
            </p>
            <div className="divide-ink-100 border-ink-100 divide-y border-y">
              {group.faqs.map((faq, index) => {
                const key = `${group.label}-${index}`;
                const isOpen = openKey === key;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-ink-900 text-[17px] font-semibold">{faq.q}</span>
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
                        <p className="text-ink-500 max-w-2xl text-[15px] leading-relaxed">
                          {faq.a}
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
  );
}
