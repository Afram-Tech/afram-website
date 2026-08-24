"use client";

import { Download } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * What a financier will ask you for. This is the highest-intent block on the
 * page: a vendor who reads it either has the pack or learns exactly what is
 * missing, and the last row invites the ones who don't rather than filtering
 * them out.
 */
const DOCS = [
  "Title document or indenture",
  "Site and cadastral plan",
  "Building permit",
  "Company registration",
  "Bills of quantities",
  "Unit schedule and pricing",
  "Independent valuation",
  "Financial statements",
  "Track record of delivery",
];

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
Most developers are. Talk to us before you assemble the whole pack.

WhatsApp  +233 24 545 2066
Email     support@afram.co
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
      <SectionHeading title="What a financier will ask you for." />

      <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <ol className="grid gap-x-10 sm:grid-cols-2">
          {DOCS.map((d, i) => (
            <li
              key={d}
              className="border-ink-100 text-ink-700 flex items-baseline gap-3.5 border-b py-4 text-[15.5px]"
            >
              <span className="tnum text-accent-400 w-5 shrink-0 text-[12px] font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              {d}
            </li>
          ))}
          <li className="border-ink-100 text-accent-700 flex items-baseline gap-3.5 border-b py-4 text-[15.5px] font-semibold">
            <span className="w-5 shrink-0" />
            Missing one? Talk to us.
          </li>
        </ol>

        <aside className="bg-brand-700 h-fit rounded-[1.5rem] p-8 text-white lg:sticky lg:top-28">
          <h3 className="text-[1.35rem] font-bold tracking-[-0.02em]">The full checklist</h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">
            Why each document matters, and what to do when one is missing.
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
