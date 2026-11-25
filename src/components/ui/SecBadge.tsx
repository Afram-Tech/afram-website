import Image from "next/image";
import { cn } from "@/lib/utils";

/** "Regulated and licensed by the SEC": Ghana SEC seal in a pill. */
export function SecBadge({
  className,
  label = "Regulated and licensed by the SEC",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-fit items-center gap-2 rounded-full border border-brand-500/15 bg-white py-1 pl-1 pr-3 text-[13px] font-semibold leading-none tracking-[calc(-0.005em*var(--tracking-scale,1))] text-deep-950 shadow-xs",
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
