import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Blend a hex color toward white by `amount` (0-1) to derive a lighter shade. */
export function lighten(hex: string, amount: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) + Math.round((255 - (num >> 16)) * amount);
  const g = ((num >> 8) & 0xff) + Math.round((255 - ((num >> 8) & 0xff)) * amount);
  const b = (num & 0xff) + Math.round((255 - (num & 0xff)) * amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function ghs(n: number, decimals = 0) {
  return `GHS ${n.toLocaleString("en-GH", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}`;
}

/** Format a US Dollar amount, e.g. $32,400.00 */
export function usd(n: number, decimals = 2) {
  return `$${n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}`;
}

/** Compact GHS for large targets, e.g. GHS 1.2M */
export function ghsCompact(n: number) {
  if (n >= 1_000_000) return `GHS ${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `GHS ${(n / 1_000).toFixed(0)}k`;
  return ghs(n);
}

/** Reducing-balance monthly instalment for a loan. */
export function monthlyPayment(loan: number, annualRate: number, months: number) {
  const i = annualRate / 12;
  if (i === 0) return loan / months;
  return (loan * i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1);
}

/** Largest loan affordable for a given monthly budget (inverse of the above). */
export function affordableLoan(monthly: number, annualRate: number, months: number) {
  const i = annualRate / 12;
  if (i === 0) return monthly * months;
  return (monthly * (1 - Math.pow(1 + i, -months))) / i;
}

/** Format an ISO date string, e.g. "Jun 2, 2026". */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
