import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function FeatureCard({
  eyebrow,
  title,
  body,
  href,
  featured = false,
  compact = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  href?: string;
  featured?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const cardClassName = cn(
    "group relative flex flex-col overflow-hidden rounded-[1.75rem] p-7 transition-all duration-300",
    compact ? "min-h-[230px]" : "min-h-[480px] lg:min-h-[520px]",
    href && "hover:-translate-y-1.5",
    featured
      ? "bg-accent-700 shadow-[0_28px_64px_-28px_color-mix(in_oklab,var(--color-accent-700)_55%,transparent)]"
      : "bg-accent-50 ring-1 ring-accent-100 hover:bg-accent-700 hover:shadow-[0_28px_64px_-28px_color-mix(in_oklab,var(--color-accent-700)_55%,transparent)]",
    className,
  );

  const inner = (
    <>
      <div
        className={cn(
          "dot-grid pointer-events-none absolute right-0 bottom-0 transition-colors duration-300",
          compact ? "h-36 w-40" : "h-52 w-56",
          featured ? "text-white/15" : "text-accent-300/50 group-hover:text-white/15",
        )}
        aria-hidden
      />

      {eyebrow && (
        <span
          className={cn(
            "relative z-10 inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] font-semibold transition-colors duration-300",
            featured
              ? "bg-white/15 text-white"
              : "text-accent-600 ring-accent-100 bg-white ring-1 group-hover:bg-white/15 group-hover:text-white group-hover:ring-transparent",
          )}
        >
          {eyebrow}
        </span>
      )}

      <div className={cn("relative z-10", eyebrow && "mt-5")}>
        <h3
          className={cn(
            "text-[1.4rem] leading-[1.2] font-bold tracking-[-0.01em] transition-colors duration-300",
            featured ? "text-white" : "text-ink-900 group-hover:text-white",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-[22rem] text-[14px] leading-relaxed transition-colors duration-300",
            featured ? "text-white/75" : "text-ink-500 group-hover:text-white/75",
          )}
        >
          {body}
        </p>
      </div>

      {!compact && (
        <span
          className={cn(
            "relative z-10 mt-auto flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300",
            featured
              ? "text-accent-700 bg-white"
              : "text-ink-700 ring-ink-200 group-hover:text-accent-700 bg-white ring-1 group-hover:ring-transparent",
          )}
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {inner}
      </Link>
    );
  }
  return <div className={cardClassName}>{inner}</div>;
}
