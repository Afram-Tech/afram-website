import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  brand: "text-accent-600",
  gold: "text-gold-600",
  sky: "text-sky-600",
  muted: "text-ink-500",
  light: "text-brand-300",
} as const;

export function Eyebrow({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[13px] font-semibold",
        tones[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}
