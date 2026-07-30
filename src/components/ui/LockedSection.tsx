import { Lock } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";

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
        <span className="bg-brand-700 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_8px_20px_-6px_rgba(0,86,94,0.55)]">
          <Lock className="h-[18px] w-[18px]" />
        </span>
        <p className="text-ink-900 max-w-[240px] text-[14px] leading-snug font-semibold">
          Log in to view {label}
        </p>
        <Link href="/signin" className={buttonVariants("primary", "sm")}>
          Log in or create account
        </Link>
      </div>
    </div>
  );
}
