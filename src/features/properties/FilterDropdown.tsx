"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * The label-over-control shell every filter in the search bar shares. Kept
 * here so a filter that is not a dropdown — the location picker, which opens
 * a dialog — still lines up with the ones that are.
 *
 * `compact` drops the label-above-control two-row shape for a single-row
 * pill instead (icon inline in the trigger, no separate uppercase caption)
 * — for a bar where every control needs to sit on one baseline next to
 * plain single-row elements like a search input. Mixing the two shapes in
 * one flex row with `items-center` is what misaligns: a two-row block's
 * actual control sits lower than a one-row neighbour's, however you centre
 * the blocks themselves.
 */
export function FilterField({
  label,
  icon,
  children,
  className,
  compact = false,
  ref,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  /** Set by FilterDropdown, which needs the wrapper to detect outside clicks. */
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className={cn("relative", className)}>
      {!compact && (
        <span className="text-ink-400 mb-1.5 flex items-center gap-1.5 text-[12px] font-medium tracking-wide uppercase">
          {icon}
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/** Trigger styling shared by the dropdowns and the location picker's button. */
export const filterTriggerClass =
  "border-ink-200 text-ink-900 hover:border-brand-300 flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-[14px] font-medium transition-colors";

/** The single-row pill version of filterTriggerClass — icon inline, rounded
 *  full, fixed height matching a plain input/button neighbour exactly. */
export const compactFilterTriggerClass =
  "border-ink-200 text-ink-900 hover:border-brand-300 flex h-10 items-center gap-2 rounded-full border bg-white px-3.5 text-[13px] font-medium transition-colors";

export function FilterDropdown({
  label,
  icon,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  /** Single-row pill instead of the label-above-control shape — see
   *  FilterField's own doc for why mixing the two shapes in one row
   *  misaligns. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const selected = options.find((option) => option.value === value);

  return (
    <FilterField ref={ref} label={label} icon={icon} compact={compact}>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        className={compact ? compactFilterTriggerClass : filterTriggerClass}
      >
        {compact && <span className="text-brand-500 shrink-0">{icon}</span>}
        <span className="truncate">{selected?.label ?? label}</span>
        <ChevronDown
          className={cn("text-ink-400 h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-ink-100 absolute z-20 mt-2 w-full max-w-full min-w-[200px] rounded-2xl border bg-white p-1.5 shadow-[0_16px_50px_-12px_rgba(0,86,94,0.18)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "block w-full truncate rounded-xl px-3 py-2 text-left text-[14px] font-medium transition-colors",
                option.value === value
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-700 hover:bg-ink-50",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </FilterField>
  );
}
