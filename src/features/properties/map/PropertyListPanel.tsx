import { Bath, BedDouble, MapPin } from "lucide-react";

import { Photo } from "@/components/ui/Photo";
import type { Property } from "@/features/landing/data/properties";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { isMarkerUnavailable } from "./markers";

/** Mirrors the pin/boundary colour split (markers.ts's markerColorFor) so
 *  the badge on a list row always agrees with how that property's pin
 *  looks on the map next to it. */
function StatusBadge({ status }: { status: string }) {
  const unavailable = isMarkerUnavailable(status);
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap uppercase",
        unavailable ? "bg-ink-100 text-ink-500" : "bg-brand-50 text-brand-700",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export interface PropertyListPanelProps {
  properties: Property[];
  /** The currently-selected row (a click, not a hover) — kept separate from
   *  hover so a row stays visually picked out after the pointer moves away,
   *  matching the map staying focused on it too (see PropertyMap's
   *  focusSlug). */
  selectedSlug?: string | null;
  /** A row was clicked — the caller flies the map to it and marks it
   *  selected; this component doesn't navigate anywhere on its own. */
  onSelect: (slug: string) => void;
  onHoverChange: (slug: string | null) => void;
}

/**
 * The map view's companion list — every filtered property as a compact,
 * clickable row (photo, name, price, status), so map browsing doesn't
 * strand a visitor with only pins and no way to scan results as text.
 * Hovering a row highlights its pin on the map (via onHoverChange, wired to
 * PropertyMap's highlightedSlug prop); clicking one flies the map to it and
 * keeps it visually selected (selectedSlug) until another row is picked. No
 * existing afram-web component pairs a list with a map this way, so this
 * layout is new design work, not a port — see the PropertyMap module doc
 * for what is/isn't a port here.
 */
export function PropertyListPanel({
  properties,
  selectedSlug,
  onSelect,
  onHoverChange,
}: PropertyListPanelProps) {
  if (properties.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <p className="text-ink-400 text-[13px]">No properties match your filters.</p>
      </div>
    );
  }

  return (
    <ul className="h-full space-y-1.5 overflow-y-auto p-2">
      {properties.map((property) => {
        const isSelected = property.slug === selectedSlug;
        return (
          <li key={property.slug}>
            <button
              type="button"
              onClick={() => onSelect(property.slug)}
              onMouseEnter={() => onHoverChange(property.slug)}
              onMouseLeave={() => onHoverChange(null)}
              onFocus={() => onHoverChange(property.slug)}
              onBlur={() => onHoverChange(null)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors",
                isSelected
                  ? "bg-brand-50 ring-brand-200 ring-1"
                  : "hover:bg-ink-50 focus-visible:bg-ink-50",
              )}
            >
              <Photo
                seed={property.id}
                src={property.image}
                alt={property.name}
                className="h-16 w-16 shrink-0 rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-ink-900 truncate text-[14px] font-semibold">{property.name}</p>
                  <StatusBadge status={property.status} />
                </div>
                <p className="text-ink-400 mt-0.5 flex items-center gap-1 truncate text-[12px]">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {property.location}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="text-brand-700 text-[13px] font-bold">
                    {formatMoney(property.price, property.currency)}
                  </p>
                  <div className="text-ink-400 flex items-center gap-2.5 text-[11px]">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3 w-3" />
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.baths}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
