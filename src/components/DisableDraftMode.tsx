"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/**
 * Link to exit draft mode. Hidden while rendering inside the Presentation
 * Tool's iframe/window — that has its own way to leave preview.
 */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  if (isPresentationTool !== false) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="bg-ink-900 fixed right-4 bottom-4 z-50 rounded-full px-4 py-2 text-sm text-white shadow-lg"
    >
      Disable draft mode
    </a>
  );
}
