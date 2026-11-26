import { cn } from "@/lib/utils";

/**
 * The Afram brand logo: the mark and the AFRAM wordmark, without the
 * "Liberating Capital…" tagline. Same lockup as the Afram Exchange sign-in
 * and sign-up screens (its AframLogo component), so the site and the app
 * carry one logo. `light` = light wordmark for dark surfaces.
 */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const src =
    variant === "dark" ? "/afram-lockup-dark.svg" : "/afram-lockup-light.svg";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Afram" className={cn("h-6 w-auto", className)} />
  );
}
