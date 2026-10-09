import { siteConfig } from "@/config/site";

import { INVITE_ONLY, REQUEST_ACCESS_LABEL } from "./invite-only";

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
 * The href is left alone on purpose: it still carries `?userType=`, which is
 * what opens the request dialog on the right role (see RequestAccess), and a
 * visitor without JS lands on the app's own invite notice rather than nowhere.
 */
export function accessCta(cta: AccessCta): AccessCta {
  return INVITE_ONLY ? { label: REQUEST_ACCESS_LABEL, href: cta.href } : cta;
}
