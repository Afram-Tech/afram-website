import { cn } from "@/lib/utils";

/* The Afram pill, from the design system's af-btn. Colour, border and shadow
   ease together; a press settles 1px rather than shrinking. */
const baseClasses =
  "relative inline-flex items-center justify-center gap-1.5 rounded-full border border-transparent font-semibold tracking-[calc(-0.01em*var(--tracking-scale,1))] whitespace-nowrap transition-[background-color,border-color,box-shadow,color,transform] duration-[160ms] ease-[var(--ease-standard)] active:translate-y-px focus-visible:outline-none disabled:pointer-events-none disabled:border-transparent disabled:bg-ink-100 disabled:bg-none disabled:text-ink-300 disabled:shadow-none [&_svg]:shrink-0";

const variantClasses = {
  primary:
    "bg-brand-500 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0)_60%)] text-white shadow-primary hover:bg-brand-600 active:bg-brand-800 focus-visible:shadow-[var(--shadow-primary),var(--shadow-focus)]",
  secondary:
    "border-ink-100 bg-white text-ink-900 shadow-secondary hover:border-ink-200 hover:bg-ink-50 focus-visible:shadow-focus",
  tinted: "bg-brand-50 text-brand-500 hover:bg-brand-200/70 focus-visible:shadow-focus",
  ghost: "text-ink-600 hover:bg-ink-50 hover:text-ink-900 focus-visible:shadow-focus",
  // On the deep ground or a photo.
  inverse:
    "bg-white text-deep-950 shadow-[0_1px_2px_0_rgba(0,0,0,0.25),inset_0_-1px_0_0_rgba(0,38,42,0.12)] hover:bg-[#e6fbfd] focus-visible:shadow-[0_0_0_2px_var(--color-deep-950),0_0_0_4px_rgba(255,255,255,0.85)]",
  outline:
    "border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 focus-visible:shadow-[0_0_0_2px_var(--color-deep-950),0_0_0_4px_rgba(255,255,255,0.85)]",
  gold: "bg-gold-500 text-ink-950 shadow-sm hover:bg-gold-400 focus-visible:shadow-focus",
} as const;

const sizeClasses = {
  sm: "h-8 px-3.5 text-[13px] leading-[18px]",
  md: "h-10 px-[18px] text-sm",
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

/** V2's name for the same helper. */
export const buttonClass = buttonVariants;
