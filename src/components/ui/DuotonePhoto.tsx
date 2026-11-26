import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Teal-duotone cover image (Figma look): a grayscale photo colourised with the
 * Afram teal via a `mix-blend-mode: color` overlay, with optional dark scrim for
 * text legibility. Used on the hero, banners, and CTA covers.
 */
export function DuotonePhoto({
  src,
  alt = "",
  className,
  sizes = "100vw",
  priority = false,
  scrim = 0,
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** dark scrim opacity 0–100 for text overlay */
  scrim?: number;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-700", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover grayscale"
      />
      {/* colourise to teal duotone */}
      <div className="duotone-teal absolute inset-0" aria-hidden />
      {/* depth */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-900/35 via-transparent to-brand-600/25"
        aria-hidden
      />
      {scrim > 0 && (
        <div
          className="absolute inset-0 bg-brand-950"
          style={{ opacity: scrim / 100 }}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
