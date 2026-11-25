import Link from "next/link";

import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { DEPOSIT_PERCENT, TENOR_YEARS, indicativeMonthly } from "@/features/landing/affordability";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The "$372/mo (i)" half of a listing card's price row. The figure is
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
    <div className={cn("flex min-w-0 items-center justify-end gap-1", className)}>
      <p className="tnum text-brand-500 text-[13px] leading-[22px] font-semibold">
        <span>{formatMoney(indicativeMonthly(price), currency)}</span>
        <span className="text-ink-400 text-[12px] font-medium">/mo</span>
      </p>
      <InfoTooltip
        label="How this monthly is worked out"
        className="relative z-10 flex h-6 w-6 items-center justify-center"
      >
        <p className="text-brand-900 text-[16px] leading-snug font-bold">
          How this monthly is worked out
        </p>
        <dl className="divide-ink-100 mt-3 divide-y text-[14px]">
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-ink-500 shrink-0 whitespace-nowrap">Deposit</dt>
            <dd className="text-brand-900 text-right font-bold">{DEPOSIT_PERCENT}% of the price</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-ink-500 shrink-0 whitespace-nowrap">Pay balance over</dt>
            <dd className="text-brand-900 text-right font-bold">{TENOR_YEARS} years</dd>
          </div>
        </dl>
        <p className="text-ink-500 mt-2 text-[13px] leading-relaxed">
          Indicative only. Worked out using the average rate across all financiers on Afram. Subject
          to approval and to the lender&rsquo;s terms and conditions.{" "}
          <Link
            href="/privacy-policy"
            className="text-brand-500 hover:text-brand-700 font-semibold underline underline-offset-2"
          >
            Full terms
          </Link>
          .
        </p>
      </InfoTooltip>
    </div>
  );
}
