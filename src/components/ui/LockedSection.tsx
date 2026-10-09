import { Lock } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { siteConfig } from "@/config/site";
import { INVITE_ONLY, REQUEST_ACCESS_LABEL } from "@/features/access/invite-only";
import { REQUEST_ACCESS_ATTR } from "@/features/access/roles";

export function LockedSection({
  children,
  label = "this",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none blur-[6px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/55 px-6 text-center backdrop-blur-[2px]">
        <span className="bg-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_8px_20px_-6px_rgba(0,86,94,0.55)]">
          <Lock className="h-[18px] w-[18px]" />
        </span>
        <p className="text-ink-900 max-w-[240px] text-[14px] leading-snug font-semibold">
          {INVITE_ONLY ? `Request access to view ${label}` : `Log in to view ${label}`}
        </p>
        {/* Invitation-only: this sent people to a sign-in they have no account
            for. The request form is the honest destination. */}
        <Link
          href={INVITE_ONLY ? siteConfig.signUpUrl : siteConfig.signInUrl}
          {...(INVITE_ONLY
            ? { [REQUEST_ACCESS_ATTR]: "", "aria-haspopup": "dialog" as const }
            : {})}
          className={`${buttonVariants("primary", "sm")} py-4`}
        >
          {INVITE_ONLY ? REQUEST_ACCESS_LABEL : "Log in or create account"}
        </Link>
      </div>
    </div>
  );
}
