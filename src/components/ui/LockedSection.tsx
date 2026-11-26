"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useSignedIn } from "@/lib/use-signed-in";
import { AFRAM_EXCHANGE_URL } from "@/lib/config";

/**
 * Wraps content that's only visible to signed-in users. Logged-out visitors
 * see the content blurred behind a frosted overlay with a lock icon and a
 * sign-in CTA — a teaser, not a real security boundary (the data still sits
 * in the DOM, just visually obscured, same pattern sites like LinkedIn use
 * for gated data).
 */
export function LockedSection({
  children,
  label = "this",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const signedIn = useSignedIn();

  if (signedIn) return <>{children}</>;

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none blur-[6px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/55 px-6 text-center backdrop-blur-[2px]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white shadow-raised">
          <Lock className="h-[18px] w-[18px]" />
        </span>
        <p className="max-w-[240px] text-[14px] font-semibold leading-snug text-ink-900">
          Log in to view {label}
        </p>
        <Link
          href={AFRAM_EXCHANGE_URL}
          className="btn-primary inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-semibold"
        >
          Log in or create account
        </Link>
      </div>
    </div>
  );
}
