import { useCallback, useSyncExternalStore } from "react";
import type { LocationPickerSelection } from "./types";

const STORAGE_KEY = "afram:recent-locations";
const MAX_RECENTS = 5;

function readStorage(): LocationPickerSelection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Private browsing, storage disabled, corrupted value — recent
    // locations are a convenience, not something worth surfacing an error
    // for. Empty list, same as a first-time visitor.
    return [];
  }
}

function writeStorage(entries: LocationPickerSelection[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Same as above — silently no-op rather than throw.
  }
}

/* useSyncExternalStore, not useState(readStorage) — this repo (unlike
   afram-web, a pure client-side SPA) is server-rendered, and the server can
   never see the client's localStorage. A lazy useState initializer would
   read real data on the client's first render while the server rendered
   with none, which React surfaces as a hydration mismatch; a useEffect that
   setStates the real value in afterward avoids the mismatch but trips this
   repo's react-hooks/set-state-in-effect lint rule and still costs an extra
   render. useSyncExternalStore is what it exists for: getServerSnapshot
   returns [] so SSR and the first client render agree exactly, and the real
   value + subsequent updates (add() below) flow through the same, single
   path via the module-level cache. */
const listeners = new Set<() => void>();
let cache: LocationPickerSelection[] | null = null;

function getSnapshot(): LocationPickerSelection[] {
  cache ??= readStorage();
  return cache;
}

// A stable reference, not a new [] literal per call — useSyncExternalStore
// treats a changed reference as a changed value, so a fresh array every
// call reads as "always different" and loops.
const EMPTY_SNAPSHOT: LocationPickerSelection[] = [];

function getServerSnapshot(): LocationPickerSelection[] {
  return EMPTY_SNAPSHOT;
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function setAndPersist(next: LocationPickerSelection[]): void {
  cache = next;
  writeStorage(next);
  listeners.forEach((listener) => listener());
}

/** Test-only escape hatch, same pattern as location-taxonomy's
 *  __setAreasForTest — the module-level cache exists so every instance of
 *  this hook agrees on one value without a context provider, but that same
 *  cache would otherwise leak a previous test's recent list past a
 *  localStorage.clear() in the next test, since clearing storage doesn't
 *  touch this in-memory copy. */
export function __resetRecentLocationsCacheForTest(): void {
  cache = null;
}

/** Local-only (per the brief: "Recent locations (local only)") — never
 *  synced, never read by the server. Most-recent-first, deduplicated by id,
 *  capped at MAX_RECENTS. */
export function useRecentLocations(): {
  recent: LocationPickerSelection[];
  add: (selection: LocationPickerSelection) => void;
} {
  const recent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((selection: LocationPickerSelection) => {
    const next = [selection, ...getSnapshot().filter((r) => r.id !== selection.id)].slice(
      0,
      MAX_RECENTS,
    );
    setAndPersist(next);
  }, []);

  return { recent, add };
}
