import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DuotonePhoto({
  src,
  alt = "",
  className,
  scrim = 0,
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  scrim?: number;
  children?: ReactNode;
}) {
  return (
    <div className={cn("bg-brand-700 relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover grayscale" />
      <div className="duotone-teal absolute inset-0" aria-hidden />
      <div
        className="from-brand-900/35 to-brand-600/25 absolute inset-0 bg-gradient-to-br via-transparent"
        aria-hidden
      />
      {scrim > 0 && (
        <div
          className="bg-brand-950 absolute inset-0"
          style={{ opacity: scrim / 100 }}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
