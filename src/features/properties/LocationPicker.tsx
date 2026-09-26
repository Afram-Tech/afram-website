"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllNodes, getPathNodes } from "./location-picker/adapters";
import { groupLocationNodes } from "./location-picker/grouping";
import { searchLocationNodes } from "./location-picker/search";
import { useLocationPickerNavigation } from "./location-picker/useLocationPickerNavigation";
import { useRecentLocations } from "./location-picker/useRecentLocations";
import {
  LocationPickerBrowse,
  LocationPickerEmpty,
  LocationRowList,
  type RowContext,
} from "./location-picker/LocationPickerBody";
import type { LocationPickerNode, LocationPickerSelection } from "./location-picker/types";

export type { LocationPickerSelection } from "./location-picker/types";

/**
 * Pick a place at any level of the taxonomy — a region, a district, and an
 * area once those exist — as a filter. Mirrors afram-web's
 * src/components/filters/location-picker/LocationPicker.
 *
 * Every row selects its own place in one tap. Places with others inside also
 * offer "29 districts ›" to browse in, and browsing adds a breadcrumb plus an
 * "All of {place}" row, so narrowing down and widening back out are both a
 * single step. Search spans every level, and the picker opens where the
 * current selection lives.
 *
 * The shell is the native <dialog> (this repo has no @radix-ui) —
 * showModal() gives focus trapping and Escape-to-close. "Use my current
 * location" is not here: it depends on afram-web's point-in-polygon
 * resolver, which this app doesn't carry.
 */
export interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (selection: LocationPickerSelection) => void;
  /** "Anywhere in Ghana" — drop the location filter altogether. */
  onClear?: () => void;
  /** Listing counts by taxonomy id. Omit to hide counts and the Popular
   *  section — there is nothing honest to call popular without real numbers. */
  counts?: Record<string, number>;
  /** Taxonomy id of the active selection — region and district ids never
   *  collide (p-codes are namespaced by level). */
  selectedId?: string;
}

const LISTBOX_ID = "location-picker-listbox";
const TITLE_ID = "location-picker-title";

/** The top level's "whole of here" row. Not a taxonomy node — it clears. */
const ANYWHERE: LocationPickerNode = {
  id: "__anywhere__",
  slug: "",
  label: "Anywhere in Ghana",
  aliases: [],
  level: "region",
  hasChildren: false,
  childCount: 0,
};

function toSelection(node: LocationPickerNode): LocationPickerSelection {
  return { level: node.level, id: node.id, slug: node.slug, label: node.label };
}

export function LocationPicker({
  open,
  onOpenChange,
  onSelect,
  onClear,
  counts,
  selectedId,
}: LocationPickerProps) {
  const nav = useLocationPickerNavigation(counts);
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { recent, add: addRecent } = useRecentLocations();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectionPath = useMemo(
    () => (selectedId ? getPathNodes(selectedId, counts) : []),
    [selectedId, counts],
  );
  const selectionAncestorIds = useMemo(
    () => new Set(selectionPath.slice(0, -1).map((n) => n.id)),
    [selectionPath],
  );

  const allNodes = useMemo(() => getAllNodes(counts), [counts]);
  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? searchLocationNodes(allNodes, query) : []),
    [allNodes, query, isSearching],
  );
  const groups = useMemo(() => groupLocationNodes(nav.nodes), [nav.nodes]);

  const scopeNode: LocationPickerNode = nav.parent
    ? { ...nav.parent, label: `All of ${nav.parent.label}`, hasChildren: false, childCount: 0 }
    : ANYWHERE;

  /** The order ArrowUp/ArrowDown walk — must match what renders. */
  const flatOptions: LocationPickerNode[] = isSearching
    ? searchResults
    : [scopeNode, ...groups.popular, ...groups.alphabetical.flatMap((g) => g.nodes)];
  const focused = flatOptions[focusedIndex];

  const resetState = () => {
    nav.reset();
    setQuery("");
    setFocusedIndex(0);
  };

  const close = () => dialogRef.current?.close();

  const finalize = (selection: LocationPickerSelection) => {
    addRecent(selection);
    onSelect(selection);
    close();
  };

  const selectScope = () => {
    if (nav.parent) {
      finalize(toSelection(nav.parent));
    } else {
      onClear?.();
      close();
    }
  };

  const select = (node: LocationPickerNode) =>
    node.id === scopeNode.id && !isSearching ? selectScope() : finalize(toSelection(node));

  /** Browse inside a place. From search, the breadcrumb is rebuilt from the
   *  taxonomy so Back leads somewhere real. */
  const browse = (node: LocationPickerNode) => {
    if (!node.hasChildren) return;
    nav.setPath(getPathNodes(node.id, counts));
    setQuery("");
    setFocusedIndex(0);
  };

  const goTo = (depth: number) => {
    nav.goTo(depth);
    setQuery("");
    setFocusedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const back = (e.key === "Backspace" && query === "") || (e.key === "ArrowLeft" && !isSearching);
    if (back && nav.canGoBack) {
      e.preventDefault();
      goTo(nav.path.length - 1);
      return;
    }
    if (flatOptions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, flatOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "ArrowRight" && focused?.hasChildren && !isSearching) {
      e.preventDefault();
      browse(focused);
    } else if (e.key === "Enter" && focused) {
      e.preventDefault();
      select(focused);
    }
  };

  // Imperative showModal()/close() — the only way a <dialog> opens with a
  // backdrop and focus trapping. Opening also jumps to where the selection
  // lives: browsing its parent, so it's on screen among its siblings.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      nav.setPath(selectionPath.slice(0, -1));
      dialog.showModal();
      searchInputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    // Only on open/close — re-running as the selection changes would yank the view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const ctx: RowContext = {
    selectedId,
    selectionAncestorIds,
    isFocused: (node) => node.id === focused?.id,
    onSelect: select,
    onBrowse: browse,
  };

  const breadcrumb = [{ id: "__root__", label: "Ghana" }, ...nav.path];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      onClose={() => {
        onOpenChange(false);
        resetState();
      }}
      onClick={(e) => {
        // A click on the dialog element itself is the ::backdrop.
        if (e.target === dialogRef.current) close();
      }}
      className={cn(
        // Display is gated on the prop, not the [open] attribute: an
        // author-origin `flex` would otherwise beat the UA's
        // `dialog:not([open]) { display: none }` and keep it visible.
        open ? "flex" : "hidden",
        "m-0 max-h-none w-full max-w-none flex-col overflow-hidden bg-white p-0 shadow-xl backdrop:bg-black/50",
        "fixed inset-x-0 top-[8vh] bottom-0 rounded-t-2xl",
        "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-[min(640px,85vh)] sm:w-[min(900px,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
      )}
    >
      <h2 id={TITLE_ID} className="sr-only">
        {nav.parent ? `Locations in ${nav.parent.label}` : "Choose a location"}
      </h2>

      <div className="border-ink-100 flex shrink-0 items-center gap-3 border-b px-4 py-3 sm:px-5 sm:py-4">
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
            placeholder="Search a region, district or area…"
            aria-label="Search locations"
            role="combobox"
            aria-expanded
            aria-controls={LISTBOX_ID}
            aria-activedescendant={focused ? `location-option-${focused.id}` : undefined}
            autoComplete="off"
            className="bg-ink-50 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 h-10 w-full rounded-full border border-transparent pr-4 pl-9 text-[13px] transition-colors outline-none"
          />
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="text-ink-500 hover:bg-ink-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none bg-transparent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Breadcrumb once browsing inside a place. */}
      {nav.canGoBack && !isSearching && (
        <nav
          aria-label="Location breadcrumb"
          className="border-ink-100 flex min-h-12 shrink-0 items-center gap-0.5 overflow-x-auto border-b px-3 sm:px-4"
        >
          <button
            type="button"
            onClick={() => goTo(nav.path.length - 1)}
            aria-label="Back"
            className="text-ink-500 hover:bg-ink-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {breadcrumb.map((crumb, depth) => {
            const current = depth === breadcrumb.length - 1;
            return (
              <Fragment key={crumb.id}>
                {depth > 0 && <ChevronRight className="text-ink-300 h-3.5 w-3.5 shrink-0" />}
                <button
                  type="button"
                  onClick={() => goTo(depth)}
                  disabled={current}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "min-h-10 shrink-0 rounded-md border-none bg-transparent px-1.5 text-[13px] disabled:cursor-default",
                    current
                      ? "text-ink-900 font-semibold"
                      : "text-brand-600 font-medium hover:underline",
                  )}
                >
                  {crumb.label}
                </button>
              </Fragment>
            );
          })}
        </nav>
      )}

      <div
        role="listbox"
        id={LISTBOX_ID}
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex-1 overflow-y-auto px-4 py-3 sm:px-5"
      >
        {isSearching ? (
          searchResults.length === 0 ? (
            <LocationPickerEmpty message={`No matches for "${query}"`} />
          ) : (
            <LocationRowList nodes={searchResults} ctx={ctx} />
          )
        ) : (
          <LocationPickerBrowse
            {...groups}
            scopeNode={scopeNode}
            scopeHint={
              nav.parent ? `Every listing in ${nav.parent.label}` : "Don't filter by location"
            }
            scopeSelected={nav.parent ? selectedId === nav.parent.id : !selectedId}
            onSelectScope={selectScope}
            recent={nav.canGoBack ? [] : recent.filter((r) => r.id !== selectedId)}
            onSelectRecent={finalize}
            ctx={ctx}
          />
        )}
      </div>
    </dialog>
  );
}
