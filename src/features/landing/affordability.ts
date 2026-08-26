import { ghs, ghsCompact, usd } from "@/lib/format";

/** Shared math for the affordability calculator, matched to Afram's mortgage amortisation model. */
export const ANNUAL_RATE = 0.14; // 14% annual interest
export const TENOR_MONTHS = 10 * 12; // 10-year loan — the comfortable term the home price is solved from
export const SHORT_TENOR_MONTHS = 5 * 12; // 5-year loan — same home, shown at a shorter term for comparison
export const LTV = 0.8; // financier covers 80% of the property value
export const PAYMENT_TO_INCOME = 0.35; // "comfortable" payment = 35% of take-home
export const EXCHANGE_RATE = 12; // GHS per USD, for comparing listings priced in different currencies

export const INCOME_MIN = 2000;
export const INCOME_MAX = 60000;
export const INCOME_STEP = 500;

export interface RecommendedProperty {
  slug: string;
  name: string;
  location: string;
  image: string;
  price: number;
  currency: string;
  /** Price normalised to GHS, used only for sorting/matching against the slider. */
  priceGhs: number;
}

/** Max loan a fixed monthly payment can sustain at `annualRate` over `months`. */
export function affordableLoan(monthly: number, annualRate: number, months: number): number {
  const i = annualRate / 12;
  if (i === 0) return monthly * months;
  return (monthly * (1 - Math.pow(1 + i, -months))) / i;
}

/** Monthly payment that fully amortises `loan` at `annualRate` over `months` — the inverse of affordableLoan. */
export function paymentForLoan(loan: number, annualRate: number, months: number): number {
  const i = annualRate / 12;
  if (i === 0) return loan / months;
  return (loan * i) / (1 - Math.pow(1 + i, -months));
}

/**
 * The price/deposit/monthly numbers the calculator shows for a given monthly
 * take-home. The price is solved from the 10-year plan, since that is the
 * comfortable one. The 5-year figure prices the SAME home over a shorter
 * term, so it is deliberately higher than the comfort threshold — that is
 * the trade being shown, not an error.
 */
export function incomeToSnapshot(income: number) {
  const comfortable = Math.round(income * PAYMENT_TO_INCOME);
  const loan = affordableLoan(comfortable, ANNUAL_RATE, TENOR_MONTHS);
  const price = Math.round(loan / LTV / 1000) * 1000;
  const financed = price * LTV;
  return {
    price,
    deposit: Math.round((price * (1 - LTV)) / 1000) * 1000,
    monthly10: Math.round(paymentForLoan(financed, ANNUAL_RATE, TENOR_MONTHS)),
    monthly5: Math.round(paymentForLoan(financed, ANNUAL_RATE, SHORT_TENOR_MONTHS)),
  };
}

/** The monthly take-home needed to afford a home at `price` — the inverse of incomeToSnapshot's price step. */
export function priceToIncome(price: number): number {
  const loan = price * LTV;
  const monthly = paymentForLoan(loan, ANNUAL_RATE, TENOR_MONTHS);
  return monthly / PAYMENT_TO_INCOME;
}

export function toGhs(amount: number, currency: string): number {
  return currency.toUpperCase() === "USD" ? amount * EXCHANGE_RATE : amount;
}

/** The currencies the calculator can display in — the two this catalogue actually prices in. */
export type CurrencyCode = "GHS" | "USD";

export const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: "GHS", label: "GHS" },
  { code: "USD", label: "USD" },
];

/** Convert a canonical GHS amount into `currency`'s units — the inverse of `toGhs`. */
export function fromGhs(amountGhs: number, currency: CurrencyCode): number {
  return currency === "USD" ? amountGhs / EXCHANGE_RATE : amountGhs;
}

/** Format a canonical GHS amount in the given display currency, e.g. formatCurrency(1200, "USD") -> "$100". */
export function formatCurrency(amountGhs: number, currency: CurrencyCode): string {
  const converted = fromGhs(amountGhs, currency);
  return currency === "USD" ? usd(converted) : ghs(converted);
}

/** Compact form of `formatCurrency`, e.g. formatCurrencyCompact(1_200_000, "USD") -> "$100k". */
export function formatCurrencyCompact(amountGhs: number, currency: CurrencyCode): string {
  const converted = fromGhs(amountGhs, currency);
  if (currency === "GHS") return ghsCompact(converted);
  if (converted >= 1_000_000) {
    return `$${(converted / 1_000_000).toFixed(converted % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (converted >= 1_000) return `$${(converted / 1_000).toFixed(0)}k`;
  return usd(converted);
}

export function clampToStep(value: number, min: number, max: number, step: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  return Math.round(clamped / step) * step;
}

/**
 * Closest matches to `target` out of a list pre-sorted ascending by `priceGhs`,
 * limited to prices within `band` of it (e.g. `band = 0.4` allows ±40%). Returns
 * an empty list rather than padding with far-off properties when nothing qualifies.
 *
 * Binary-searches for the affordable/over-budget boundary (O(log n)), then walks
 * outward from it so properties just under budget are preferred over ones just
 * over. Because the list is sorted, distance from `target` only grows as each
 * pointer moves further out, so the walk stops the moment either side leaves the
 * band — it never re-filters or re-sorts the whole list on a slider move.
 */
/**
 * Splits `sorted` (ascending by `priceGhs`) around `target` and picks the
 * `count` closest to it — in O(log n), not the O(n log n) a filter-then-sort
 * costs on every slider tick.
 *
 * One binary search finds `lo`, the boundary where everything before it is
 * affordable (`priceGhs <= target`). From there, no further sort is needed
 * in either branch, because the input is already price-sorted:
 *  - Within budget: the affordable prefix is ascending by price, so its
 *    closest entries to `target` are simply its last `count` — the ones
 *    priced just under budget.
 *  - Nothing affordable: every remaining entry is over budget, so
 *    `priceGhs - target` grows in the same order as `priceGhs` itself — the
 *    list is already sorted by distance too, and the first `count` are the
 *    nearest.
 */
export function matchByBudget(
  sorted: RecommendedProperty[],
  target: number,
  count: number,
): { matches: RecommendedProperty[]; all: RecommendedProperty[]; withinBudget: boolean } {
  if (sorted.length === 0) return { matches: [], all: [], withinBudget: false };

  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sorted[mid].priceGhs <= target) lo = mid + 1;
    else hi = mid;
  }

  if (lo > 0) {
    const affordable = sorted.slice(0, lo);
    return { matches: affordable.slice(-count), all: affordable, withinBudget: true };
  }

  return { matches: sorted.slice(0, count), all: sorted, withinBudget: false };
}

export function nearestByPrice(
  sorted: RecommendedProperty[],
  target: number,
  count: number,
  band: number,
): RecommendedProperty[] {
  if (target <= 0 || sorted.length === 0) return [];

  const minPrice = target * (1 - band);
  const maxPrice = target * (1 + band);

  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sorted[mid].priceGhs <= target) lo = mid + 1;
    else hi = mid;
  }

  const result: RecommendedProperty[] = [];
  let under = lo - 1;
  let over = lo;
  let underInBand = true;
  let overInBand = true;
  while (result.length < count && (underInBand || overInBand)) {
    if (underInBand) {
      if (under >= 0 && sorted[under].priceGhs >= minPrice) result.push(sorted[under--]);
      else underInBand = false;
    }
    if (result.length >= count) break;
    if (overInBand) {
      if (over < sorted.length && sorted[over].priceGhs <= maxPrice) result.push(sorted[over++]);
      else overInBand = false;
    }
  }
  return result.sort((a, b) => a.priceGhs - b.priceGhs);
}
