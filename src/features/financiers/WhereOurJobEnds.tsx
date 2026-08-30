"use client";

import { Check, Download } from "lucide-react";
import { useRef, useState } from "react";

import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * The most useful thing this page can say to a credit officer: Afram
 * verifies the asset and never the borrower, and the lending decision is not
 * shared. Drawing the line explicitly is what makes the rest of the page
 * credible.
 */
const AFRAM_DOES = [
  "Verify the title against Lands Commission records",
  "Check for pending litigation and caveats",
  "Hold the master deed and indenture",
  "Check the building permit",
  "Check the surveyor-signed site plan",
  "Commission an independent valuation",
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

const PACK = `AFRAM - DUE-DILIGENCE PACK (SUMMARY)
For banks, regulated lenders and private credit funds

WHERE OUR JOB ENDS
 Afram verifies the asset. Afram does not verify or assess the borrower.
 The borrower submits their details directly to you. KYC, AML, affordability
 and the credit decision are entirely yours.

WHAT AFRAM VERIFIES ON EVERY ASSET
 1. Lands Commission title verification
 2. Litigation and caveat check
 3. Master deed and indenture on file
 4. Building permit from the assembly
 5. Surveyor-signed site and cadastral plan
 6. Independent valuation by a recognised valuer
 7. Escrow and charge structure confirmed before funding

SECURITY
 First legal charge over the registered title, taken in the ordinary way.
 The Afram record sits alongside the paper title as an audit trail.

WHAT YOU CONTROL
 Rate, tenor, ticket size and project status are set by you.
 Nothing outside your rules reaches your desk.

WHO BORROWS
 Developers request construction and completion facilities.
 Home members request purchase facilities on completed units.
 Afram sets no terms. Rate, tenor and structure are yours.

Email     capital@afram.co
Phone     +233 24 545 2066
`;

const TABS = [
  { id: "afram", label: "Afram does", items: AFRAM_DOES },
  { id: "you", label: "You do", items: YOU_DO },
] as const;

export function WhereOurJobEnds() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const download = () => {
    const blob = new Blob([PACK], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Afram-Due-Diligence-Pack.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

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
      <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-16">
        <div className="bg-brand-900 rounded-[2rem] p-8 text-white sm:p-12 lg:p-14">
          <h2 className="max-w-[22ch] text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.12] font-bold tracking-[-0.02em]">
            We verify the records. You make the credit decision.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-white/70">
            Afram never takes a view on credit. Verified records reach you with the request, and the
            lending decision stays entirely yours.
          </p>

          <div className="mt-9 grid gap-8 lg:mt-10 lg:grid-cols-[1.55fr_0.85fr] lg:gap-12">
            <div>
              <div
                role="tablist"
                aria-label="Who does what"
                onKeyDown={onKey}
                className="flex w-fit max-w-full flex-wrap gap-1.5 rounded-full bg-white/[0.08] p-1.5"
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
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      i === active
                        ? "text-ink-900 bg-white shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {t.label}
                    <span
                      className={cn(
                        "tnum rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                        i === active ? "bg-ink-100 text-ink-500" : "bg-white/10 text-white/60",
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
                /* min-height holds the frame steady so switching tabs does not
                   shunt the pack card up and down */
                className="mt-7 grid gap-x-8 gap-y-3.5 focus-visible:outline-none sm:grid-cols-2 lg:min-h-[230px]"
              >
                {panel.items.map((t) => (
                  <p
                    key={t}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-white/85"
                  >
                    <span
                      aria-hidden
                      className="border-brand-300/70 bg-brand-300/20 text-brand-200 mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border"
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </p>
                ))}
              </div>
            </div>

            <div className="h-fit rounded-[1.25rem] bg-white/[0.07] p-7">
              <h3 className="text-[1.25rem] font-bold tracking-[-0.02em] text-white">
                The due-diligence pack
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">
                Verification methodology, legal structure and a sample deal file.
              </p>
              <button
                type="button"
                onClick={download}
                className="text-ink-900 hover:bg-brand-50 mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <p className="mt-3.5 text-center text-[12.5px] text-white/50">No email needed</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
