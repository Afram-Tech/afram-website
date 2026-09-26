import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { childSummary } from "./adapters";
import type { LocationPickerNode } from "./types";

export function formatCount(count: number | undefined): string | null {
  if (typeof count !== "number") return null;
  if (count === 0) return "no listings";
  return `${count.toLocaleString()} ${count === 1 ? "listing" : "listings"}`;
}

interface LocationPickerRowProps {
  node: LocationPickerNode;
  /** This exact place is the active filter. */
  selected: boolean;
  /** The active filter is somewhere inside this place. */
  containsSelection?: boolean;
  /** Keyboard focus target — see LocationPicker's arrow-key handling. */
  focused: boolean;
  /** Filter to this place. */
  onSelect: () => void;
  /** Browse the places inside it. Omitted for a leaf, or the "All of X" row. */
  onBrowse?: () => void;
  /** Unique within the listbox. */
  optionId: string;
  /** Overrides the breadcrumb line, e.g. "Every listing in the region". */
  hint?: string;
}

/**
 * One place. The name always selects it — a region is as valid a filter as a
 * district — and, when it has places inside, a separate "29 districts ›"
 * control browses into them. Filtering to Greater Accra is one tap, and
 * narrowing further is one more.
 */
export function LocationPickerRow({
  node,
  selected,
  containsSelection = false,
  focused,
  onSelect,
  onBrowse,
  optionId,
  hint,
}: LocationPickerRowProps) {
  const browseLabel = onBrowse ? childSummary(node) : null;
  // Name alone on the first line so long names don't truncate; context and
  // count share the second.
  const subtitle = [hint ?? node.parentLabel, formatCount(node.count)].filter(Boolean).join(" · ");

  return (
    <div
      ref={(el) => {
        // Keeps the arrow-key target in view. Optional-called: jsdom has none.
        if (focused) el?.scrollIntoView?.({ block: "nearest" });
      }}
      className={cn(
        "mb-1 flex min-h-12 break-inside-avoid-column items-stretch overflow-hidden rounded-lg border transition-colors",
        selected
          ? "border-brand-500 bg-brand-50"
          : cn("border-transparent", focused ? "bg-ink-50" : "hover:bg-ink-50"),
      )}
    >
      <button
        type="button"
        id={optionId}
        role="option"
        aria-selected={selected}
        tabIndex={focused ? 0 : -1}
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2 border-none bg-transparent px-3 py-2.5 text-left"
      >
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "flex items-center gap-1.5 text-[13px] font-medium",
              selected ? "text-brand-700" : "text-ink-900",
            )}
          >
            <span className="truncate">{node.label}</span>
            {containsSelection && (
              <span
                aria-label="includes your selection"
                className="bg-brand-600 h-1.5 w-1.5 shrink-0 rounded-full"
              />
            )}
          </span>
          {subtitle && <span className="text-ink-400 block truncate text-[11px]">{subtitle}</span>}
        </span>
        {selected && <Check className="text-brand-600 h-4 w-4 shrink-0" />}
      </button>

      {browseLabel && (
        <button
          type="button"
          tabIndex={-1}
          onClick={onBrowse}
          aria-label={`Browse ${browseLabel} in ${node.label}`}
          data-testid={`location-browse-${node.id}`}
          className="border-ink-100 text-ink-500 hover:text-brand-600 flex min-w-11 shrink-0 items-center justify-center gap-0.5 border-0 border-l border-solid bg-transparent pr-2 pl-3 text-[11px] font-medium"
        >
          <span className="hidden sm:inline">{browseLabel}</span>
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
