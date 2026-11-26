import Link from "next/link";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * §8.2 — appears next to any yield or return number. Plain language.
 * Ink-500, not red: it's a fact, not a warning.
 */
export function CapitalAtRiskBadge({
  className,
  variant = "inline",
  withLink = true,
  tone = "default",
  kind = "investment",
}: {
  className?: string;
  variant?: "inline" | "block";
  withLink?: boolean;
  tone?: "default" | "light";
  /** "lending" for pages about lending, where the investment wording is wrong. */
  kind?: "investment" | "lending";
}) {
  const sentence =
    kind === "lending"
      ? "Lending carries risk, including borrower default and delays in enforcement. Your capital is at risk."
      : "Investments can go down as well as up. Your capital is at risk.";
  const light = tone === "light";
  if (variant === "block") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl bg-ink-50 p-4 ring-hairline",
          className,
        )}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
        <p className="text-[13px] leading-relaxed text-ink-500">
          {sentence}{" "}
          {withLink && (
            <Link
              href="/legal/key-risks"
              className="font-medium text-ink-700 underline decoration-ink-300 underline-offset-2 hover:text-ink-900"
            >
              Read the key risks
            </Link>
          )}
        </p>
      </div>
    );
  }

  // The icon hangs beside the first line and the sentence and link flow as
  // one run of text, so a narrow column wraps it like a sentence instead of
  // stacking icon, sentence and link on three separate lines.
  return (
    <span
      className={cn(
        "inline-flex items-start gap-1.5 text-[12px] leading-snug",
        light ? "text-white/55" : "text-ink-500",
        className,
      )}
    >
      <Info
        className={cn(
          "mt-px h-3.5 w-3.5 shrink-0",
          light ? "text-white/45" : "text-ink-400",
        )}
      />
      <span className="min-w-0">
        {sentence}
        {withLink && (
          <>
            {" "}
            <Link
              href="/legal/key-risks"
              className={cn(
                "whitespace-nowrap font-medium underline underline-offset-2",
                light
                  ? "text-white/80 decoration-white/30 hover:text-white"
                  : "text-ink-700 decoration-ink-300 hover:text-ink-900",
              )}
            >
              Key risks
            </Link>
          </>
        )}
      </span>
    </span>
  );
}
