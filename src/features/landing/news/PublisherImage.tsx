"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A publisher's image, loaded straight from their server (never copied or
 * re-served by Afram) with no referrer sent. Renders nothing if it fails —
 * no broken-image icon, and no empty frame or orphaned credit either.
 *
 * `credit` overlays "Photo: <source>" on the image, so the publisher is
 * credited wherever their photo appears. `fallback` renders instead when the
 * image fails, for layouts that need the space kept.
 */
export function PublisherImage({
  src,
  alt,
  className,
  eager = false,
  credit,
  fallback = null,
}: {
  src: string;
  alt: string;
  className: string;
  /** For an image that's on screen straight away (e.g. a story's lead). */
  eager?: boolean;
  /** The publisher to credit on the image. */
  credit?: string;
  /** Shown instead if the image fails to load. */
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- third-party image of unknown size, served as-is
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn(credit && "block", className)}
    />
  );
  if (!credit) return img;

  return (
    <span className="relative block">
      {img}
      <span className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-0.5 text-[10.5px] font-medium text-white/90 backdrop-blur-sm">
        Photo: {credit}
      </span>
    </span>
  );
}
