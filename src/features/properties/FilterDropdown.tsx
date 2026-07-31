"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterDropdown({
  label,
  icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
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
    <div ref={ref} className="relative">
      <span className="text-ink-400 mb-1.5 flex items-center gap-1.5 text-[12px] font-medium tracking-wide uppercase">
        {icon}
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        className="border-ink-200 text-ink-900 hover:border-brand-300 flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-[14px] font-medium transition-colors"
      >
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
    </div>
  );
}
