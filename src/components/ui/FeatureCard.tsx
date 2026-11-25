import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Paper card on the design system's edge and depth; `featured` sits on the
 * deep ground. Has an arrow affordance by default; pass `compact` for a shorter
 * informational card with no arrow.
 */
export function FeatureCard({
  eyebrow,
  title,
  body,
  href,
  featured = false,
  compact = false,
  className,
  style,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  href?: string;
  featured?: boolean;
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const cls = cn(
    "group relative flex flex-col overflow-hidden rounded-[20px] p-6 transition-[background-color,box-shadow,border-color,transform] duration-200 sm:p-7",
    compact
      ? "min-h-[200px]"
      : href
        ? "min-h-[280px] lg:min-h-[340px]"
        : "min-h-[200px]",
    href && "hover:-translate-y-px",
    featured
      ? "bg-deep-950 shadow-banner"
      : "border border-ink-100 bg-white shadow-card hover:border-brand-500/30 hover:shadow-raised",
    className,
  );

  const inner = (
    <>

      {eyebrow && (
        <span
          className={cn(
            "relative z-10 inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] font-semibold ",
            featured
              ? "bg-white/15 text-white"
              : "bg-brand-50 text-brand-500",
          )}
        >
          {eyebrow}
        </span>
      )}

      <div className={cn("relative z-10", eyebrow && "mt-5")}>
        <h3
          className={cn(
            "t-h4 ",
            featured ? "text-white" : "text-ink-900",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-[22rem] text-[14px] leading-relaxed ",
            featured
              ? "text-white/75"
              : "text-ink-500",
          )}
        >
          {body}
        </p>
      </div>

      {!compact && href && (
        <span
          className={cn(
            "relative z-10 mt-auto flex h-10 w-10 items-center justify-center rounded-full ",
            featured
              ? "bg-white text-accent-700"
              : "bg-brand-50 text-brand-500",
          )}
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={cls} style={style}>
      {inner}
    </div>
  );
}
