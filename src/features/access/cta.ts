import { siteConfig } from "@/config/site";

import { INVITE_ONLY, REQUEST_ACCESS_LABEL } from "./invite-only";
import { REQUEST_ACCESS_PARAM, USER_TYPE_PARAM } from "./roles";

/** The app's wire values for a role, as the `?userType=` param carries them. */
export type UserType = "buyer" | "issuer" | "financier";

export type AccessCta = { label: string; href: string };

/** `/get-started` on the app, for a role when one is implied by the page. */
export function signUpHref(userType?: UserType): string {
  return userType ? `${siteConfig.signUpUrl}?userType=${userType}` : siteConfig.signUpUrl;
}

/**
 * A sign-up call to action, swapped for the Request Access control while the
 * site is invite-only.
 *
 * The CONTROL changes, not just where it goes: "Get Started", "Create Account"
 * and "List a project" all promised a sign-up that does not exist yet, and a
 * button whose label disagrees with what clicking it does is the kind of thing
 * people report as broken. With INVITE_ONLY off, every one of them keeps its
 * own wording and navigates to the app as before.
 *
 * While invite-only, the href becomes this page's own `?request-access=1`
 * link (keeping the original `?userType=`, so the form opens on the right
 * role), which the
 * click handler in components/access catches. It no longer depends on the
 * app's sign-up URL, which is built from NEXT_PUBLIC_CLIENT_APP: with that
 * unset the link was `undefined/get-started`, which nothing caught.
 */
export function accessCta(cta: AccessCta): AccessCta {
  if (!INVITE_ONLY) return cta;
  const userType = new URLSearchParams(cta.href.split("?")[1] ?? "").get(USER_TYPE_PARAM);
  const params = new URLSearchParams({ [REQUEST_ACCESS_PARAM]: "1" });
  if (userType) params.set(USER_TYPE_PARAM, userType);
  return { label: REQUEST_ACCESS_LABEL, href: `?${params}` };
}
