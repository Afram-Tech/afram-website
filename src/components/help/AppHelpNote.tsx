import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Requests raised while signed in to the app carry no reply email, so the
 * public tracker (reference + email) can never find them. They are tracked
 * in the app's Help instead; this says so and links there.
 */
export function AppHelpNote({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn("text-ink-500 text-[13px] leading-relaxed", className)}>
      {children}{" "}
      <a
        href={siteConfig.appHelpUrl}
        className="text-brand-500 hover:text-brand-700 font-semibold underline underline-offset-2"
      >
        Open Help in the app
      </a>
    </p>
  );
}
