import { useCallback, useState } from "react";
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

/** Local-only (per the brief: "Recent locations (local only)") — never
 *  synced, never read by the server. Most-recent-first, deduplicated by id,
 *  capped at MAX_RECENTS. */
export function useRecentLocations(): {
  recent: LocationPickerSelection[];
  add: (selection: LocationPickerSelection) => void;
} {
  const [recent, setRecent] = useState<LocationPickerSelection[]>(readStorage);

  const add = useCallback((selection: LocationPickerSelection) => {
    setRecent((prev) => {
      const next = [selection, ...prev.filter((r) => r.id !== selection.id)].slice(0, MAX_RECENTS);
      writeStorage(next);
      return next;
    });
  }, []);

  return { recent, add };
}
