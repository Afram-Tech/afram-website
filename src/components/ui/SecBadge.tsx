import Image from "next/image";

import { cn } from "@/lib/utils";

/** "Regulated and licensed by the SEC": the Ghana SEC seal in a white pill. */
export function SecBadge({
  label = "Regulated and licensed by the SEC",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-brand-500/15 text-deep-950 inline-flex h-8 w-fit items-center gap-2 rounded-full border bg-white py-1 pr-3 pl-1 text-[13px] leading-none font-semibold tracking-[-0.005em] shadow-xs",
        className,
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
        <Image
          src="/sec-ghana-seal.png"
          alt="Securities and Exchange Commission, Ghana"
          width={24}
          height={24}
          className="h-full w-full object-contain"
        />
      </span>
      {label}
    </span>
  );
}
