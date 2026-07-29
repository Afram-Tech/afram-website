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
