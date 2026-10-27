"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef } from "react";

/** Cloudflare Turnstile's public site key. Unset (local dev) → no widget. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * The "you're not a robot" check public sends need (the API refuses
 * `submitSupportRequest` without a token). Reports a token when it passes,
 * and "" when it expires or fails, so the form knows to wait.
 */
export const TurnstileCheck = forwardRef<
  TurnstileInstance,
  { onToken: (token: string) => void; action?: string; className?: string }
>(function TurnstileCheck({ onToken, action, className }, ref) {
  if (!TURNSTILE_SITE_KEY) return null;
  return (
    <div className={className}>
      <Turnstile
        ref={ref}
        siteKey={TURNSTILE_SITE_KEY}
        options={{ action, theme: "light", size: "flexible" }}
        onSuccess={onToken}
        onExpire={() => onToken("")}
        onError={() => onToken("")}
      />
    </div>
  );
});
