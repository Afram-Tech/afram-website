import { Info } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function CapitalAtRiskBadge({
  className,
  variant = "inline",
  withLink = true,
  tone = "default",
}: {
  className?: string;
  variant?: "inline" | "block";
  withLink?: boolean;
  tone?: "default" | "light";
}) {
  const light = tone === "light";

  if (variant === "block") {
    return (
      <div
        className={cn(
          "bg-ink-50 ring-ink-100 flex items-start gap-3 rounded-2xl p-4 ring-1",
          className,
        )}
      >
        <Info className="text-ink-400 mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-ink-500 text-[13px] leading-relaxed">
          Investments can go down as well as up. Your capital is at risk.{" "}
          {withLink && (
            <Link
              href="/privacy-policy"
              className="text-ink-700 decoration-ink-300 hover:text-ink-900 font-medium underline underline-offset-2"
            >
              Read the key risks
            </Link>
          )}
        </p>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px] leading-snug",
        light ? "text-white/55" : "text-ink-500",
        className,
      )}
    >
      <Info className={cn("h-3.5 w-3.5 shrink-0", light ? "text-white/45" : "text-ink-400")} />
      Investments can go down as well as up. Your capital is at risk.
      {withLink && (
        <Link
          href="/privacy-policy"
          className={cn(
            "font-medium underline underline-offset-2",
            light
              ? "text-white/80 decoration-white/30 hover:text-white"
              : "text-ink-700 decoration-ink-300 hover:text-ink-900",
          )}
        >
          Key risks
        </Link>
      )}
    </span>
  );
}
