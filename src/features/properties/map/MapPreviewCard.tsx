"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { indicativeMonthly } from "@/features/landing/affordability";
import { formatMoney, formatPropertySize, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

import { isMarkerUnavailable, type PropertyMapMarker } from "./markers";

/** Card width in px — PropertyMap clamps the card inside the map with it. */
export const MAP_PREVIEW_WIDTH = 300;
/** Rough rendered height (caret included), only used to decide whether the
 *  card fits above its pin or has to flip below it. */
export const MAP_PREVIEW_HEIGHT = 310;
/** How far the caret sticks out of the card. */
export const MAP_PREVIEW_CARET = 9;

const PHOTO_BUTTON =
  "absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/10 text-white opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 hover:bg-black/25 focus-visible:opacity-100";

/**
 * The listing preview that floats over a hovered (or, on touch, tapped) map
 * pin: a large photo you can page through, then price, name and specs —
 * nothing else competing for a small card. The photo and text link through
 * to the listing; the arrows and close button sit beside that link, not
 * inside it, so they never navigate.
 */
export function MapPreviewCard({
  marker,
  placement,
  caretX,
  onClose,
}: {
  marker: PropertyMapMarker;
  /** Where the card sits relative to its pin — the caret points the other way. */
  placement: "above" | "below";
  /** The pin's x, in px from the card's left edge — the card is clamped
   *  inside the map, so it isn't always centred over its pin. */
  caretX: number;
  onClose: () => void;
}) {
  const images = marker.images.length > 0 ? marker.images : [marker.thumbnail ?? ""];
  const [index, setIndex] = useState(0);
  const step = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  const specs = [
    marker.beds > 0 && `${marker.beds} bed${marker.beds === 1 ? "" : "s"}`,
    marker.baths > 0 && `${marker.baths} bath${marker.baths === 1 ? "" : "s"}`,
    marker.sqft > 0 && formatPropertySize(marker.sqft),
  ].filter(Boolean);

  const unavailable = isMarkerUnavailable(marker.status);

  return (
    <div
      style={{ width: MAP_PREVIEW_WIDTH }}
      className="group relative rounded-[10px] bg-white shadow-[0_12px_40px_-8px_rgba(10,13,20,0.35),0_2px_6px_rgba(10,13,20,0.08)]"
    >
      {/* Caret — a rotated square pointing at the pin, first in the DOM so
          the photo/body paint over its inner half. */}
      <span
        aria-hidden="true"
        style={{ left: caretX }}
        className={cn(
          "absolute h-[18px] w-[18px] -translate-x-1/2 rotate-45 bg-white",
          placement === "above"
            ? "-bottom-[9px] shadow-[4px_4px_6px_-3px_rgba(10,13,20,0.18)]"
            : "-top-[9px]",
        )}
      />
      <Link href={`/properties/${marker.slug}`} className="relative block">
        <Photo
          seed={marker.id}
          src={images[index] || undefined}
          alt={`${marker.name} photo ${index + 1}`}
          className="h-[180px] w-full rounded-t-[10px]"
        />

        <div className="px-5 pt-4 pb-5">
          {marker.price > 0 && (
            <p className="flex items-baseline gap-1.5">
              <span className="tnum text-ink-900 text-[19px] font-bold tracking-[-0.01em]">
                {formatMoney(marker.price, marker.currency)}
              </span>
              {!unavailable && (
                <span className="text-ink-500 text-[13px]">
                  or ~{formatMoney(indicativeMonthly(marker.price), marker.currency)}/mo
                </span>
              )}
            </p>
          )}
          <p className="text-ink-900 group-hover:text-brand-700 mt-1.5 line-clamp-2 text-[15px] leading-snug font-bold transition-colors">
            {marker.name}
            <span className="text-ink-500 font-medium"> · {marker.location}</span>
          </p>
          {specs.length > 0 && (
            <p className="text-ink-500 mt-3 flex flex-wrap items-center gap-x-2 text-[13px]">
              {specs.map((spec, i) => (
                <span key={String(spec)} className="flex items-center gap-2">
                  {i > 0 && <span className="bg-ink-300 h-1 w-1 rounded-full" />}
                  {spec}
                </span>
              ))}
            </p>
          )}
        </div>
      </Link>

      {unavailable && (
        <span className="text-ink-700 pointer-events-none absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm">
          {titleCase(marker.status.replace(/_/g, " "))}
        </span>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className={cn(PHOTO_BUTTON, "top-[90px] left-3")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className={cn(PHOTO_BUTTON, "top-[90px] right-3")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="pointer-events-none absolute top-[164px] left-1/2 flex -translate-x-1/2 gap-1">
            {images.slice(0, 6).map((src, i) => (
              <span
                key={src + i}
                className={cn(
                  "h-1.5 rounded-full bg-white shadow-sm transition-all",
                  i === Math.min(index, 5) ? "w-3.5" : "w-1.5 opacity-60",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
