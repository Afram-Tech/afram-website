"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllNodes } from "./location-picker/adapters";
import { groupLocationNodes } from "./location-picker/grouping";
import { searchLocationNodes } from "./location-picker/search";
import {
  LEVEL_BY_DEPTH,
  useLocationPickerNavigation,
} from "./location-picker/useLocationPickerNavigation";
import { useRecentLocations } from "./location-picker/useRecentLocations";
import { LocationPickerRow } from "./location-picker/LocationPickerRow";
import type { LocationPickerNode, LocationPickerSelection } from "./location-picker/types";

export type { LocationPickerSelection } from "./location-picker/types";

/**
 * Ported from afram-web's src/components/filters/LocationPicker (see that
 * repo's docs/location-search/00-findings.md for the Jiji-reference brief
 * this was built against). Interaction logic — keyboard nav, search,
 * drill-down, recent locations, the "All {region}" row — is unchanged; the
 * shell is rebuilt on the native <dialog> element rather than Radix, since
 * this repo has no @radix-ui dependency and already uses <dialog> for its
 * one other modal (VerifyTitleDialog) — showModal() gives focus trapping
 * and Escape-to-close for free, so there's less to reimplement here than
 * there is to strip out.
 *
 * "Use my current location" is intentionally not ported: it depends on
 * afram-web's point-in-polygon resolver, which itself depends on a Vite
 * `?raw` import for the boundary GeoJSON (no Next.js equivalent without
 * new bundler config) and on a property-upload coordinate utility that has
 * no counterpart in this marketplace app. Drill-down + search + recents is
 * the complete feature without it; geolocation can follow as its own step.
 */
export interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (selection: LocationPickerSelection) => void;
  /** Listing counts by taxonomy id — omit entirely to hide counts and the
   *  Popular section (see grouping.ts). */
  counts?: Record<string, number>;
  /** Currently active selection, for the highlight — id only, since a
   *  region and a district never share an id (p-codes are namespaced by
   *  level: GH01-16 vs GH0101 etc). */
  selectedId?: string;
}

function toSelection(
  node: LocationPickerNode,
  level: "region" | "city" | "area",
): LocationPickerSelection {
  return { level, id: node.id, slug: node.slug, label: node.label };
}

export function LocationPicker({
  open,
  onOpenChange,
  onSelect,
  counts,
  selectedId,
}: LocationPickerProps) {
  const nav = useLocationPickerNavigation(counts);
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { recent, add: addRecent } = useRecentLocations();
  const listboxId = "location-picker-listbox";
  const titleId = "location-picker-title";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allNodes = useMemo(() => getAllNodes(counts), [counts]);
  const searchResults = useMemo(
    () => (query.trim() ? searchLocationNodes(allNodes, query) : []),
    [allNodes, query],
  );

  const isSearching = query.trim().length > 0;
  const { popular, alphabetical } = useMemo(() => groupLocationNodes(nav.nodes), [nav.nodes]);

  const allParentNode: LocationPickerNode | null = nav.parent
    ? {
        id: nav.parent.id,
        slug: nav.parent.slug,
        label: `All ${nav.parent.label}`,
        aliases: [],
        count: nav.parent.count,
        hasChildren: false,
      }
    : null;

  /** DOM/keyboard order — what ArrowUp/ArrowDown actually walk through. */
  const flatOptions: LocationPickerNode[] = isSearching
    ? searchResults
    : [
        ...(allParentNode ? [allParentNode] : []),
        ...popular,
        ...alphabetical.flatMap((g) => g.nodes),
      ];

  const resetState = () => {
    nav.reset();
    setQuery("");
    setFocusedIndex(0);
  };

  const finalize = (selection: LocationPickerSelection) => {
    addRecent(selection);
    onSelect(selection);
    onOpenChange(false);
  };

  const select = (node: LocationPickerNode) => {
    if (node.hasChildren) {
      // A *matched* region from search still drills in rather than
      // selecting outright — finding "Greater Accra" doesn't mean the
      // visitor wants every property in the region without the same
      // chance to narrow further that a manual drill-down offers.
      if (isSearching) {
        nav.reset();
        setQuery("");
      }
      nav.drillInto(node);
      setFocusedIndex(0);
      return;
    }
    // In browse mode nav.level is authoritative. In search mode there's no
    // drill path to read a level off, so it's inferred from the
    // breadcrumb's depth instead: no "/" separator means a district (one
    // ancestor, the region); one separator would mean an area (two
    // ancestors) — moot today since AREAS is empty, but the inference
    // already generalises to it.
    const level = isSearching ? (node.parentLabel?.includes(" / ") ? "area" : "city") : nav.level;
    finalize(toSelection(node, level));
  };

  /** The "All {region}" / "All {district}" row — selects nav.parent ITSELF
   *  at nav.parent's own level (one level shallower than whatever children
   *  at this depth would report), using the real node's real name, not the
   *  "All X" display label built for the row. */
  const selectAllParent = () => {
    if (!nav.parent) return;
    const level = LEVEL_BY_DEPTH[Math.max(nav.path.length - 1, 0)];
    finalize(toSelection(nav.parent, level));
  };

  const handleBack = () => {
    nav.back();
    setFocusedIndex(0);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flatOptions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, flatOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setFocusedIndex(flatOptions.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const node = flatOptions[focusedIndex];
      if (node) select(node);
    } else if (e.key === "Backspace" && query === "" && nav.canGoBack) {
      handleBack();
    }
  };

  // Imperative showModal()/close() — the only way a <dialog> opens with a
  // backdrop and focus trapping. Setting the `open` attribute directly
  // shows it non-modally, with neither.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      searchInputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={() => resetState()}
      onClose={() => {
        onOpenChange(false);
        resetState();
      }}
      onClick={(e) => {
        // A click that lands on the dialog element itself (not a child) is
        // either the ::backdrop or the box's own padding — both mean
        // "outside the content," so close, same as Radix's overlay click.
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className={cn(
        // The browser's own `dialog:not([open]) { display: none }` is a
        // user-agent–origin rule, which always loses to an author-origin
        // class — so an unconditional `flex` here would win the cascade
        // and keep the dialog visible even while closed. Gating display on
        // the `open` prop directly (not the dialog's own [open] attribute,
        // which showModal()/close() only toggle a render later) avoids
        // relying on that UA rule at all.
        open ? "flex" : "hidden",
        "m-0 max-h-none w-full max-w-none flex-col overflow-hidden bg-white p-0 shadow-xl backdrop:bg-black/50",
        "fixed inset-x-0 top-[8vh] bottom-0 rounded-t-2xl",
        "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-[min(640px,85vh)] sm:w-[min(900px,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
      )}
    >
      {/* Header
          The title always renders — aria-labelledby on the dialog, and this
          component's own on the listbox, both point at titleId, so it
          can't disappear once drilled in even though the Back button
          replaces it visually at that point. */}
      <div className="border-ink-100 flex shrink-0 items-center gap-3 border-b px-4 py-4 sm:px-5">
        <h2
          id={titleId}
          className={cn(
            "text-ink-900 truncate text-[15px] font-semibold",
            nav.canGoBack && !isSearching ? "sr-only" : "min-w-0",
          )}
        >
          {nav.parent ? nav.parent.label : "All Ghana"}
        </h2>
        {nav.canGoBack && !isSearching && (
          <button
            type="button"
            onClick={handleBack}
            className="text-ink-500 hover:text-brand-600 flex shrink-0 items-center gap-1 border-none bg-transparent text-[13px] font-semibold"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <div className="relative min-w-0 flex-1">
          <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocusedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Find region, city or area…"
            aria-label="Search locations"
            role="combobox"
            aria-expanded
            aria-controls={listboxId}
            autoComplete="off"
            className="bg-ink-50 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 h-9 w-full rounded-full border border-transparent pr-4 pl-9 text-[13px] transition-colors outline-none"
          />
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={() => dialogRef.current?.close()}
          className="text-ink-500 hover:bg-ink-50 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div
        role="listbox"
        id={listboxId}
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex-1 overflow-y-auto px-4 py-3 sm:px-5"
      >
        {isSearching ? (
          searchResults.length === 0 ? (
            <EmptyState message={`No matches for "${query}"`} />
          ) : (
            <div className="space-y-1">
              {searchResults.map((node, i) => (
                <LocationPickerRow
                  key={node.id}
                  node={node}
                  selected={node.id === selectedId}
                  focused={i === focusedIndex}
                  optionId={`location-option-${node.id}`}
                  onSelect={() => select(node)}
                />
              ))}
            </div>
          )
        ) : (
          <BrowseBody
            allParentNode={allParentNode}
            popular={popular}
            alphabetical={alphabetical}
            recent={!nav.canGoBack ? recent : []}
            selectedId={selectedId}
            flatOptions={flatOptions}
            focusedIndex={focusedIndex}
            onSelect={select}
            onSelectAllParent={selectAllParent}
            onSelectRecent={(r) => {
              onSelect(r);
              onOpenChange(false);
            }}
          />
        )}
      </div>
    </dialog>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-ink-400 text-[13px]">{message}</p>
    </div>
  );
}

function BrowseBody({
  allParentNode,
  popular,
  alphabetical,
  recent,
  selectedId,
  flatOptions,
  focusedIndex,
  onSelect,
  onSelectAllParent,
  onSelectRecent,
}: {
  allParentNode: LocationPickerNode | null;
  popular: LocationPickerNode[];
  alphabetical: { letter: string; nodes: LocationPickerNode[] }[];
  recent: LocationPickerSelection[];
  selectedId: string | undefined;
  flatOptions: LocationPickerNode[];
  focusedIndex: number;
  onSelect: (node: LocationPickerNode) => void;
  onSelectAllParent: () => void;
  onSelectRecent: (r: LocationPickerSelection) => void;
}) {
  const indexOf = (id: string) => flatOptions.findIndex((n) => n.id === id);

  return (
    <div>
      {recent.length > 0 && (
        <div className="mb-4">
          <p className="text-ink-400 mb-2 px-1 text-[11px] font-semibold tracking-wider uppercase">
            Recent
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRecent(r)}
                className="border-ink-100 text-ink-900 hover:border-brand-500 rounded-full border bg-transparent px-3 py-1.5 text-[12px] font-medium transition-colors"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {allParentNode && (
        <div className="mb-3">
          <LocationPickerRow
            node={allParentNode}
            selected={allParentNode.id === selectedId}
            focused={indexOf(allParentNode.id) === focusedIndex}
            optionId={`location-option-${allParentNode.id}`}
            onSelect={onSelectAllParent}
          />
        </div>
      )}

      {popular.length > 0 && (
        <div className="mb-4 flex gap-2">
          <span className="text-ink-400 shrink-0 rotate-180 py-1 text-[10px] font-semibold tracking-wider [writing-mode:vertical-rl]">
            POPULAR
          </span>
          <div className="flex-1 space-y-1">
            {popular.map((node) => (
              <LocationPickerRow
                key={node.id}
                node={node}
                selected={node.id === selectedId}
                focused={indexOf(node.id) === focusedIndex}
                optionId={`location-option-${node.id}`}
                onSelect={() => onSelect(node)}
              />
            ))}
          </div>
        </div>
      )}

      {alphabetical.length === 0 && popular.length === 0 && !allParentNode ? (
        <EmptyState message="Nothing here yet." />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {alphabetical.map((group) => (
            <div key={group.letter} className="mb-3 break-inside-avoid-column">
              <p className="text-ink-400 sticky top-0 mb-1 bg-white px-1 text-[11px] font-semibold">
                {group.letter}
              </p>
              {group.nodes.map((node) => (
                <LocationPickerRow
                  key={node.id}
                  node={node}
                  selected={node.id === selectedId}
                  focused={indexOf(node.id) === focusedIndex}
                  optionId={`location-option-${node.id}`}
                  onSelect={() => onSelect(node)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
