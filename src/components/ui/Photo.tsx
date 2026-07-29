import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const TONES: Record<string, [string, string, string]> = {
  brand: ["#064a55", "#0b343b", "#5fc6d1"],
  ink: ["#1b2128", "#0f1419", "#5b6470"],
  gold: ["#7a4708", "#0f1419", "#fbbf24"],
  sky: ["#0b4f6c", "#0f1419", "#0ea5e9"],
};

function hash(value: string) {
  return [...value].reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) >>> 0, 5381);
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
}: {
  seed: string;
  tone?: keyof typeof TONES;
  label?: string;
  className?: string;
  children?: ReactNode;
  src?: string;
  alt?: string;
  overlay?: boolean;
}) {
  const [a, b, hi] = TONES[tone];
  const h = hash(seed);
  const angle = 120 + (h % 80);
  const x = 15 + (h % 60);
  const y = 10 + ((h >> 3) % 50);

  return (
    <div
      className={cn("bg-ink-900 relative overflow-hidden", className)}
      style={{
        backgroundImage: `radial-gradient(120% 120% at ${x}% ${y}%, ${hi}40 0%, transparent 45%), linear-gradient(${angle}deg, ${a} 0%, ${b} 70%)`,
      }}
    >
      {src && (
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          fill
          sizes="(min-width: 640px) 400px, 100vw"
          className="object-cover"
        />
      )}

      {overlay && (
        <div className="from-ink-950/75 via-ink-950/15 absolute inset-0 bg-gradient-to-t to-transparent" />
      )}

      {children}

      {label && (
        <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          <span className="bg-brand-400 h-1.5 w-1.5 rounded-full" />
          {label}
        </div>
      )}
    </div>
  );
}
