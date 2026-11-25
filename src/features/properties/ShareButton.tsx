"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** The phone's share sheet where there is one, otherwise copy the link. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-500 transition-colors hover:text-ink-900"
    >
      {copied ? <Check className="h-4 w-4 text-brand-500" /> : <Share2 className="h-4 w-4" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
