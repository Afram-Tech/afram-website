"use client";

import { Info } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A small (i) trigger that reveals a panel of explanatory copy. Opens on
 * hover for pointers, on focus for keyboards, and on tap for touch — where
 * there is no hover, so the click toggle is the only way in. The panel is a
 * descendant of the trigger's wrapper and bridges the gap above the icon
 * with padding rather than a margin, so moving the cursor onto it does not
 * count as leaving.
 *
 * The panel only exists while open — a hidden-but-rendered panel still takes
 * up layout, and one centred over a trigger near the right edge of the page
 * widened the whole document on every page with a listing card. While open,
 * it's nudged sideways to stay on screen.
 *
 * Stops click events from reaching an enclosing card link.
 */

/** Minimum gap between the panel and either edge of the viewport. */
const VIEWPORT_MARGIN = 12;
export function InfoTooltip({
  label,
  children,
  className,
  panelClassName,
}: {
  /** Accessible name for the trigger, e.g. "How this monthly is worked out". */
  label: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Measured before paint, from the panel's centred position, so it never
  // flashes off-screen first.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    const { left, right } = panel.getBoundingClientRect();
    const viewport = document.documentElement.clientWidth;
    if (right > viewport - VIEWPORT_MARGIN) setShift(viewport - VIEWPORT_MARGIN - right);
    else if (left < VIEWPORT_MARGIN) setShift(VIEWPORT_MARGIN - left);
    return () => setShift(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative inline-flex", className)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? panelId : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          "text-brand-500 hover:text-brand-700 focus-visible:ring-brand-300 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          open && "text-brand-700",
        )}
      >
        <Info className="h-4 w-4" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="tooltip"
          style={{ marginLeft: shift }}
          className={cn(
            "absolute bottom-full left-1/2 z-30 w-[280px] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 pb-2 transition-opacity duration-150 starting:opacity-0",
            panelClassName,
          )}
        >
          <div className="ring-ink-100/80 rounded-2xl bg-white p-5 text-left font-normal tracking-normal normal-case shadow-[0_22px_55px_-14px_rgba(2,46,51,0.3)] ring-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
