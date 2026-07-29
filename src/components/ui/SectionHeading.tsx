import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  eyebrowTone = "brand",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  eyebrowTone?: "brand" | "gold" | "sky" | "muted" | "light";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "mt-4 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]",
          tone === "dark" ? "text-ink-900" : "text-white",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-3.5 text-[16px] leading-relaxed",
            tone === "dark" ? "text-ink-500" : "text-white/75",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
