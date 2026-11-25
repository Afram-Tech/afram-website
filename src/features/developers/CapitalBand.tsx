import { Download } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { WavePattern } from "@/components/ui/WavePattern";
import { LogoTicker, type TickerLogo } from "@/components/ui/LogoTicker";

/**
 * The vendors page's second promise, raising capital: what a financier will
 * ask for, then who funds projects here.
 *
 * Lenders scroll in a ticker so the strip keeps working as more join. A
 * lender without a `src` shows as a wordmark until its logo lands in
 * /public/partners. Keep this list to lenders confirmed as onboarded.
 */
export const LENDERS: TickerLogo[] = [
  { name: "Affinity" },
  { name: "Ecobank", src: "/partners/ecobank.svg" },
  { name: "Origen", src: "/partners/origen.png" },
];

/**
 * Afram-branded, one page. Its source is scripts/pdf/financing-checklist.html:
 * edit that, then run `bash scripts/pdf/build.sh`.
 */
const CHECKLIST_PDF = "/downloads/afram-financing-checklist.pdf";

export function CapitalBand() {
  return (
    <Section id="raise" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-brand-100/70 via-brand-50 to-brand-50/40 p-5 sm:p-8 lg:p-12 xl:p-14">
        <WavePattern />
        <div className="relative">
          <h2 className="t-h2 max-w-xl text-balance text-deep-950">
            List your project to raise capital.
          </h2>

          <div className="mt-8 grid gap-3 sm:mt-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-4">
            {/* #requirements stays as an anchor for older links */}
            <div
              id="requirements"
              className="flex scroll-mt-24 flex-col rounded-[20px] bg-white p-6 sm:p-8"
            >
              {/* One line from desktop up; its panel widens to fit it */}
              <h3 className="t-h4 text-deep-950 lg:whitespace-nowrap">
                Want to know what financiers will ask for to deploy funds?
              </h3>

              <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href={CHECKLIST_PDF}
                  download
                  className="btn-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold sm:w-fit"
                >
                  <Download aria-hidden className="h-4 w-4" />
                  Download the checklist
                </a>
                <a
                  href="#talk"
                  className="text-center text-[15px] font-semibold text-brand-700 underline-offset-4 hover:underline sm:text-left"
                >
                  Missing one? Talk to us.
                </a>
              </div>
            </div>

            <div className="flex min-w-0 flex-col rounded-[20px] bg-white p-6 sm:p-8">
              <h3 className="t-h4 text-deep-950">
                Some financiers funding projects on Afram.
              </h3>
              <LogoTicker
                logos={LENDERS}
                tileClassName="bg-brand-50"
                className="mt-auto pt-7"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
