"use client";

import { ChevronDown, ChevronRight, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { FilterOption } from "@/features/properties/FilterDropdown";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface Filters {
  status: string;
  type: string;
  price: string;
}

/** One expandable row: label + current value collapsed, its options list
 *  revealed beneath it when tapped. Only the caller decides which row (if
 *  any) is open, so opening one can close the others — the progressive-
 *  disclosure point: a visitor sees one clear decision at a time, not four
 *  option lists competing for the same screen the way the desktop bar's
 *  pills can get away with. */
function FilterAccordionRow({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value);
  return (
    <div className="border-ink-100 border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-ink-900 text-[15px] font-medium">{label}</span>
        <span className="flex items-center gap-1.5">
          <span className="text-ink-400 text-[14px]">{selected?.label ?? label}</span>
          <ChevronDown
            className={cn("text-ink-300 h-4 w-4 transition-transform", isOpen && "rotate-180")}
          />
        </span>
      </button>
      {isOpen && (
        <div className="grid grid-cols-2 gap-2 pb-4">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                option.value === value
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-100 text-ink-700",
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

export interface MobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onFiltersChange: (next: Filters) => void;
  statusOptions: FilterOption[];
  typeOptions: FilterOption[];
  priceOptions: FilterOption[];
  locationLabel: string;
  onLocationClick: () => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onClear: () => void;
}

type AccordionKey = "status" | "type" | "price" | null;

/**
 * The mobile equivalent of the desktop pill bar — everything the same
 * filters do, laid out the way iOS Settings groups options: a sheet you
 * pull up on demand (not chrome permanently competing with the map for
 * screen space), one row per filter showing its current value collapsed,
 * and tapping a row is the only way its options appear at all. Nothing
 * about afram-web informs this shape — no comparable filter panel exists
 * there to port — this is a fresh application of a well-known pattern
 * (progressive disclosure), not a copy of anything specific.
 *
 * Built on the native <dialog> element, the same convention as
 * LocationPicker and VerifyTitleDialog elsewhere in this codebase — see
 * LocationPicker's own comment for why the `open ? "flex" : "hidden"`
 * class below is load-bearing, not decoration: an unconditional `flex`
 * here would keep the sheet visible even while "closed", since Tailwind's
 * generated CSS (author-origin) always beats the browser's own
 * `dialog:not([open]) { display: none }` (user-agent origin).
 */
export function MobileFilterSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  statusOptions,
  typeOptions,
  priceOptions,
  locationLabel,
  onLocationClick,
  resultCount,
  hasActiveFilters,
  onClear,
}: MobileFilterSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openRow, setOpenRow] = useState<AccordionKey>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const toggleRow = (key: AccordionKey) => setOpenRow((current) => (current === key ? null : key));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="mobile-filter-sheet-title"
      onClose={() => {
        onOpenChange(false);
        setOpenRow(null);
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className={cn(
        open ? "flex" : "hidden",
        "m-0 max-h-[85vh] w-full max-w-none flex-col overflow-hidden rounded-t-2xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/50",
        "fixed inset-x-0 bottom-0",
      )}
    >
      <div className="border-ink-100 flex shrink-0 items-center justify-between border-b px-5 py-4">
        <h2 id="mobile-filter-sheet-title" className="text-ink-900 text-[16px] font-semibold">
          Filters
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={() => dialogRef.current?.close()}
          className="text-ink-500 hover:bg-ink-50 flex h-8 w-8 items-center justify-center rounded-full border-none bg-transparent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
            onLocationClick();
          }}
          className="border-ink-100 flex w-full items-center justify-between border-b py-4 text-left"
        >
          <span className="flex items-center gap-2">
            <MapPin className="text-brand-500 h-4 w-4" />
            <span className="text-ink-900 text-[15px] font-medium">Location</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-ink-400 max-w-[140px] truncate text-[14px]">{locationLabel}</span>
            <ChevronRight className="text-ink-300 h-4 w-4" />
          </span>
        </button>

        <FilterAccordionRow
          label="Status"
          value={filters.status}
          options={statusOptions}
          isOpen={openRow === "status"}
          onToggle={() => toggleRow("status")}
          onChange={(value) => onFiltersChange({ ...filters, status: value })}
        />
        <FilterAccordionRow
          label="Type"
          value={filters.type}
          options={typeOptions}
          isOpen={openRow === "type"}
          onToggle={() => toggleRow("type")}
          onChange={(value) => onFiltersChange({ ...filters, type: value })}
        />
        <FilterAccordionRow
          label="Price"
          value={filters.price}
          options={priceOptions}
          isOpen={openRow === "price"}
          onToggle={() => toggleRow("price")}
          onChange={(value) => onFiltersChange({ ...filters, price: value })}
        />
      </div>

      <div className="border-ink-100 flex shrink-0 items-center justify-between gap-3 border-t px-5 py-4">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="text-brand-600 text-[14px] font-semibold"
          >
            Clear all
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className={buttonVariants("primary", "md")}
        >
          Show {resultCount} {resultCount === 1 ? "property" : "properties"}
        </button>
      </div>
    </dialog>
  );
}
