import Link from "next/link";

import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { DEPOSIT_PERCENT, TENOR_YEARS, indicativeMonthly } from "@/features/landing/affordability";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The "MONTHLY (i) $372" half of a listing card's price row. The figure is
 * indicative — worked out on the shared marketplace plan in `affordability`,
 * not returned per listing by the backend — so the (i) opens the breakdown
 * that says so.
 */
export function MonthlyEstimate({
  price,
  currency,
  className,
}: {
  price: number;
  currency: string;
  className?: string;
}) {
  return (
    <div className={cn("text-right", className)}>
      <div className="text-ink-400 flex items-center justify-end gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase">
        Monthly
        <InfoTooltip
          label="How this monthly is worked out"
          panelClassName="left-auto right-0 translate-x-0"
        >
          <p className="text-brand-900 text-[15px] font-bold tracking-[-0.01em] normal-case">
            How this monthly is worked out
          </p>
          <dl className="divide-ink-100 mt-3 divide-y text-[13px] normal-case">
            <div className="flex items-center justify-between gap-3 pb-2.5">
              <dt className="text-ink-500 font-normal tracking-normal">Deposit</dt>
              <dd className="text-ink-900 font-bold">{DEPOSIT_PERCENT}% of the price</dd>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2.5">
              <dt className="text-ink-500 font-normal tracking-normal">Pay balance over</dt>
              <dd className="text-ink-900 font-bold">{TENOR_YEARS} years</dd>
            </div>
          </dl>
          <p className="text-ink-400 mt-3 text-[12px] leading-relaxed font-normal tracking-normal normal-case">
            Indicative only. Worked out using the average rate across all financiers on Afram.
            Subject to approval and to the lender&rsquo;s terms and conditions.{" "}
            <Link
              href="/privacy-policy"
              className="text-ink-700 font-medium underline underline-offset-2"
            >
              Full terms
            </Link>
            .
          </p>
        </InfoTooltip>
      </div>
      <p className="text-brand-500 mt-1 text-[18px] font-bold">
        {formatMoney(indicativeMonthly(price), currency)}
      </p>
    </div>
  );
}
