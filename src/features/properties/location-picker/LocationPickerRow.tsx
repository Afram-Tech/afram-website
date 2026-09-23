import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocationPickerNode } from "./types";

export function formatCount(count: number | undefined): string | null {
  if (typeof count !== "number") return null;
  return `${count.toLocaleString()} ${count === 1 ? "listing" : "listings"}`;
}

export function LocationPickerRow({
  node,
  selected,
  focused,
  onSelect,
  optionId,
}: {
  node: LocationPickerNode;
  selected: boolean;
  /** Roving-tabindex focus target — see LocationPicker's keyboard handling. */
  focused: boolean;
  onSelect: () => void;
  /** id for aria-activedescendant, unique within the listbox. */
  optionId: string;
}) {
  const countLabel = formatCount(node.count);

  return (
    <button
      type="button"
      id={optionId}
      role="option"
      aria-selected={selected}
      tabIndex={focused ? 0 : -1}
      onClick={onSelect}
      className={cn(
        "mb-1 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left break-inside-avoid-column transition-colors",
        selected
          ? "border-brand-500 bg-brand-50"
          : "border-transparent hover:bg-ink-50",
        focused && !selected && "bg-ink-50",
      )}
    >
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate text-[13px] font-medium",
            selected ? "text-brand-700" : "text-ink-900",
          )}
        >
          {node.label}
          {countLabel && <span className="text-ink-400 font-normal"> · {countLabel}</span>}
        </span>
        {node.parentLabel && (
          <span className="text-ink-400 block truncate text-[11px]">{node.parentLabel}</span>
        )}
      </span>
      {node.hasChildren && (
        <ChevronRight className="text-ink-400 h-4 w-4 shrink-0" strokeWidth={2} />
      )}
    </button>
  );
}
