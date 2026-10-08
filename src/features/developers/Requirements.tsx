"use client";

import { Download } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * What a financier will ask you for. The on-page list of nine documents was
 * cut (vendors page doc, Oct 2026); the downloadable checklist still carries
 * every item and why it matters.
 */

const CHECKLIST = `AFRAM — FINANCING REQUIREMENTS CHECKLIST
For property developers in Ghana

1. TITLE DOCUMENT OR INDENTURE
   In the name of the borrowing entity. This is the collateral.
2. SITE AND CADASTRAL PLAN
   Signed by a licensed surveyor, matching the title.
3. BUILDING PERMIT
   From the district or municipal assembly, for the current scheme.
4. COMPANY REGISTRATION
   Incorporation, commencement, and current directors.
5. BILLS OF QUANTITIES AND BUILD PROGRAMME
   Costed works and the timeline to practical completion.
6. UNIT SCHEDULE AND PRICING
   Units, sizes, prices, and what is already sold or reserved.
7. INDEPENDENT VALUATION
   From a valuer the lender recognises. Ask us for names.
8. FINANCIAL STATEMENTS
   Two to three years. Some lenders accept management accounts.
9. TRACK RECORD
   Projects delivered, with dates, locations and photographs.

WHO WANTS WHAT
  Bank / regulated lender   Registered title, audited accounts, valuation
  Private credit fund       Title, unit schedule, build programme

MISSING A DOCUMENT?
Most developers are. Talk to us before you assemble the whole pack,
using the form on the Afram vendors page.
`;

export function Requirements() {
  const download = () => {
    const blob = new Blob([CHECKLIST], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Afram-Financing-Requirements.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Section id="requirements" className="scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading title="What a financier will ask you for." />
          <a
            href="#talk"
            className="text-accent-700 mt-4 inline-block text-[17px] font-semibold underline-offset-4 hover:underline"
          >
            Missing one? Talk to us.
          </a>
        </div>

        <aside className="bg-brand-700 h-fit rounded-[1.5rem] p-8 text-white">
          <h3 className="text-[1.35rem] font-bold tracking-[-0.02em]">The full checklist</h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">
            Why each document matters, and what to do if one is missing.
          </p>
          <button
            type="button"
            onClick={download}
            className="text-ink-900 hover:bg-brand-50 mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <p className="mt-3.5 text-center text-[12.5px] text-white/55">No email needed</p>
        </aside>
      </div>
    </Section>
  );
}
