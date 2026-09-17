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
      <div className="text-ink-400 flex items-center justify-end gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase">
        Monthly
        <InfoTooltip label="How this monthly is worked out">
          <p className="text-brand-900 text-[16px] leading-snug font-bold tracking-[-0.01em]">
            How this monthly is worked out
          </p>
          <dl className="divide-ink-100 mt-4 divide-y text-[13px]">
            <div className="flex items-center justify-between gap-3 pb-3">
              <dt className="text-ink-500">Deposit</dt>
              <dd className="text-ink-900 font-bold">{DEPOSIT_PERCENT}% of the price</dd>
            </div>
            <div className="flex items-center justify-between gap-3 pt-3">
              <dt className="text-ink-500">Pay balance over</dt>
              <dd className="text-ink-900 font-bold">{TENOR_YEARS} years</dd>
            </div>
          </dl>
          <p className="text-ink-500 mt-4 text-[13px] leading-[1.55]">
            Indicative only. Worked out using the average rate across all financiers on Afram.
            Subject to approval and to the lender&rsquo;s terms and conditions.{" "}
            <Link
              href="/privacy-policy"
              className="text-brand-700 font-semibold underline underline-offset-2"
            >
              Full terms
            </Link>
            .
          </p>
        </InfoTooltip>
      </div>
      <p className="text-brand-500 mt-1.5 text-[20px] font-bold tracking-[-0.01em]">
        {formatMoney(indicativeMonthly(price), currency)}
      </p>
    </div>
  );
}
