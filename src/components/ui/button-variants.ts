import { cn } from "@/lib/utils";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variantClasses = {
  primary:
    "bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:shadow-md focus-visible:outline-brand-500",
  secondary:
    "bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-brand-300 hover:text-brand-700 focus-visible:outline-ink-900",
  outline:
    "bg-white/10 text-white ring-1 ring-white/45 backdrop-blur-sm hover:bg-white/20 focus-visible:outline-white",
  inverse: "bg-white text-ink-900 hover:bg-brand-50 shadow-sm focus-visible:outline-white",
  ghost: "text-ink-700 hover:text-brand-700 hover:bg-brand-50 focus-visible:outline-ink-900",
  gold: "bg-gold-500 text-ink-950 shadow-sm hover:bg-gold-400 focus-visible:outline-gold-500",
} as const;

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-[15px]",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export function buttonVariants(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}
