"use client";

import { useRef, useState } from "react";

import { Check, Download } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { WavePattern } from "@/components/ui/WavePattern";
import { cn } from "@/lib/utils";

/**
 * Where our job ends (marketing's afram-financiers-v9).
 *
 * The most useful thing this page can say to a credit officer: Afram verifies
 * the asset and never the borrower, and the lending decision is not shared.
 * Drawing the line explicitly is what makes the rest of the page credible.
 */
const AFRAM_DOES = [
  "Verify the title against Lands Commission records",
  "Check for pending litigation and caveats",
  "Hold the master deed and indenture",
  "Check the building permit",
  "Check the surveyor-signed site plan",
  "Arrange an independent valuation",
  "Structure the escrow and the charge",
  "Track repayments on the platform",
];

const YOU_DO = [
  "Receive the borrower's details direct",
  "Run your own KYC and AML checks",
  "Assess income, affordability and credit",
  "Set the rate, tenor and thresholds",
  "Approve or decline every file",
  "Hold the first legal charge",
];

/**
 * Afram-branded, one page. Its source is scripts/pdf/due-diligence-pack.html:
 * edit that, then run `bash scripts/pdf/build.sh`.
 */
const PACK_PDF = "/downloads/afram-due-diligence-pack.pdf";

const TABS = [
  { id: "afram", label: "Afram does", items: AFRAM_DOES },
  { id: "you", label: "You do", items: YOU_DO },
] as const;

export function WhereOurJobEnds() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /** WAI-ARIA tabs: arrows move between tabs, Home/End jump to the ends. */
  const onKey = (e: React.KeyboardEvent) => {
    const last = TABS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const panel = TABS[active];

  return (
    <Section id="verify" className="scroll-mt-24" container={false}>
      <div className="mx-auto max-w-[1536px] px-5 lg:px-[34px]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100/70 via-brand-50 to-brand-50/40 p-5 sm:p-8 lg:p-12 xl:p-14">
          <WavePattern />
          <div className="relative">
          <h2 className="max-w-[24ch] t-h2 text-deep-950">
            We verify the records. You make the credit decision.
          </h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_0.85fr] lg:items-center lg:gap-12">
            <div>
              <div
                role="tablist"
                aria-label="Who does what"
                onKeyDown={onKey}
                className="flex w-fit max-w-full flex-wrap gap-1 rounded-full bg-brand-500/10 p-1"
              >
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    type="button"
                    id={`job-tab-${t.id}`}
                    aria-selected={i === active}
                    aria-controls={`job-panel-${t.id}`}
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-200",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
                      i === active
                        ? "bg-white text-deep-950 shadow-xs"
                        : "text-ink-600 hover:text-deep-950",
                    )}
                  >
                    {t.label}
                    <span
                      className={cn(
                        "tnum rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                        i === active
                          ? "bg-ink-100 text-ink-500"
                          : "bg-brand-500/10 text-ink-500",
                      )}
                    >
                      {t.items.length}
                    </span>
                  </button>
                ))}
              </div>

              <div
                role="tabpanel"
                id={`job-panel-${panel.id}`}
                aria-labelledby={`job-tab-${panel.id}`}
                tabIndex={0}
                /* min-height fits the longer list (four rows), so switching
                   tabs doesn't make the section jump */
                className="mt-5 grid gap-x-8 gap-y-2.5 focus-visible:outline-none sm:grid-cols-2 lg:min-h-[132px] lg:content-start"
              >
                {panel.items.map((t) => (
                  <p
                    key={t}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-800"
                  >
                    <span
                      aria-hidden
                      className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-white text-brand-600"
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </p>
                ))}
              </div>
            </div>

            <div className="h-fit rounded-[20px] bg-white p-7">
              <h3 className="t-h4 text-deep-950">
                The due-diligence pack
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                What we verify, what stays with you, and how security works.
              </p>
              <a
                href={PACK_PDF}
                download
                className="btn-primary mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold"
              >
                <Download aria-hidden className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
