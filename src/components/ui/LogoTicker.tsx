import Image from "next/image";
import { cn } from "@/lib/utils";

export type TickerLogo = {
  name: string;
  /** Logo file in /public. Without one the name shows as a wordmark. */
  src?: string;
};

/**
 * Partner logos moving in a slow loop, so the row keeps working as the list
 * grows. The set repeats until it is wide enough to fill the strip, and the
 * track slides by exactly half its width (`.marquee-track`), so the loop has
 * no seam. Hovering pauses it; reduced motion stops it (globals.css).
 *
 * Only the first copy is announced: the repeats are aria-hidden.
 */
export function LogoTicker({
  logos,
  tileClassName,
  className,
}: {
  logos: TickerLogo[];
  tileClassName?: string;
  className?: string;
}) {
  if (logos.length === 0) return null;

  // At least six tiles per half, so a wide strip never shows its end.
  const reps = Math.max(1, Math.ceil(6 / logos.length));
  const half = Array.from({ length: reps }, () => logos).flat();

  return (
    <div
      className={cn(
        "group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <ul
        className="marquee-track flex gap-3 group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${half.length * 4}s` }}
      >
        {[...half, ...half].map((l, i) => (
          <li
            key={`${l.name}-${i}`}
            aria-hidden={i >= logos.length || undefined}
            className={cn(
              "flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl bg-white px-5 sm:h-24 sm:w-44",
              tileClassName,
            )}
          >
            {l.src ? (
              <div className="relative h-10 w-full">
                <Image
                  src={l.src}
                  alt={i < logos.length ? l.name : ""}
                  fill
                  sizes="140px"
                  // Off-screen copies slide in; lazy loading would show them blank.
                  loading="eager"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-[18px] font-bold tracking-[calc(-0.01em*var(--tracking-scale,1))] text-brand-700">
                {l.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
