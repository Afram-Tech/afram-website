"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * There's no shared backend/cookie domain between this marketing site and
 * the Afram Exchange app, so "signed in" state is handed off via a one-time
 * query param when the user arrives from — or returns to — the Exchange,
 * then persisted client-side:
 *   ?signedIn=1  → user just came from signing in on the Exchange
 *   ?signedIn=0  → user just signed out there
 * The param is stripped from the URL immediately after being read.
 */
const STORAGE_KEY = "afram_signed_in";
const CHANGE_EVENT = "afram:signed-in";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const readSignedIn = () => localStorage.getItem(STORAGE_KEY) === "1";

export function useSignedIn() {
  const signedIn = useSyncExternalStore(subscribe, readSignedIn, () => false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("signedIn");
    if (flag === null) return;

    if (flag === "1") localStorage.setItem(STORAGE_KEY, "1");
    if (flag === "0") localStorage.removeItem(STORAGE_KEY);

    params.delete("signedIn");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return signedIn;
}
