import { FadeImage } from "@/components/ui/FadeImage";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Photography slot. Renders a real (next/image) photo when `src` is given,
 * layered over a deterministic duotone derived from `seed` — so if an image
 * is slow or fails, the gradient shows instead of a broken image.
 */
const TONES: Record<string, [string, string, string]> = {
  brand: ["#064a55", "#0b343b", "#5fc6d1"],
  ink: ["#1b2128", "#0f1419", "#5b6470"],
  gold: ["#7a4708", "#0f1419", "#fbbf24"],
  sky: ["#0b4f6c", "#0f1419", "#0ea5e9"],
};

function hash(s: string) {
  return [...s].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
}

export function Photo({
  seed,
  tone = "brand",
  label,
  className,
  children,
  src,
  alt,
  overlay = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 600px",
}: {
  seed: string;
  tone?: keyof typeof TONES;
  label?: string;
  className?: string;
  children?: ReactNode;
  src?: string;
  alt?: string;
  overlay?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const [a, b, hi] = TONES[tone];
  const h = hash(seed);
  const angle = 120 + (h % 80);
  const x = 15 + (h % 60);
  const y = 10 + ((h >> 3) % 50);

  return (
    <div
      className={cn("grain relative overflow-hidden bg-ink-900", className)}
      style={{
        backgroundImage: `radial-gradient(120% 120% at ${x}% ${y}%, ${hi}40 0%, transparent 45%), linear-gradient(${angle}deg, ${a} 0%, ${b} 70%)`,
      }}
    >
      {src && (
        <FadeImage
          skeleton={false}
          src={src}
          alt={alt ?? label ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}

      {!src && (
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-soft-light"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 70% 20%, #fff 0 1px, transparent 1px 22px)",
          }}
          aria-hidden
        />
      )}

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/15 to-transparent" />
      )}

      {children}

      {label && (
        <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          {label}
        </div>
      )}
    </div>
  );
}
