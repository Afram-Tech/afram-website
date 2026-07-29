const SQFT_TO_SQM = 0.092903;

/** Format a US Dollar amount, e.g. $32,400 */
export function usd(amount: number, decimals = 0): string {
  return `$${amount.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}`;
}

/** Format a Ghana Cedi amount. Never abstracts the number. */
export function ghs(amount: number, decimals = 0): string {
  return `GHS ${amount.toLocaleString("en-GH", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}`;
}

/** Compact GHS for large targets, e.g. GHS 1.2M */
export function ghsCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `GHS ${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (amount >= 1_000) return `GHS ${(amount / 1_000).toFixed(0)}k`;
  return ghs(amount);
}

/** Converts a property's floor area from sqft (as stored) to m² for display. */
export function sqftToSqm(squareFeet: number): number {
  return squareFeet * SQFT_TO_SQM;
}

/** Formats a property's floor area (stored in sqft) as a "123.4 m²" string. */
export function formatPropertySize(squareFeet: number): string {
  return `${sqftToSqm(squareFeet).toLocaleString(undefined, { maximumFractionDigits: 1 })} m²`;
}
