import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  container = true,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  container?: boolean;
}) {
  return (
    // Vertical padding reads --section-y* so a page can tighten its rhythm
    // (PersonaShell's `compact`); unset, it is the site default.
    <section
      id={id}
      className={cn(
        "py-[var(--section-y,2.5rem)] sm:py-[var(--section-y-sm,3.5rem)] lg:py-[var(--section-y-lg,6rem)]",
        className,
      )}
    >
      {container ? (
        <div className="mx-auto max-w-[1536px] px-5 lg:px-[34px]">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function SectionHeading({
  title,
  intro,
  align = "left",
  tone = "dark",
  className,
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2
        className={cn(
          "t-h2",
          tone === "dark" ? "text-ink-900" : "text-white",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 t-lead",
            tone === "dark" ? "text-ink-500" : "text-white/75",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
