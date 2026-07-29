import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  container = true,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  container?: boolean;
}) {
  return (
    <section id={id} className={cn("py-16 lg:py-24", className)}>
      {container ? (
        <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-16">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
