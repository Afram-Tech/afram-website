/**
 * THE INVITE-ONLY SWITCH
 *
 * Afram onboards by invitation for now, so the site must not advertise a way
 * in that does not exist: the nav shows one "Request Access" control instead
 * of "Create Account" and "Log In", and links to the app's own sign-up open
 * the request form (see components/access/RequestAccess).
 *
 * `NEXT_PUBLIC_INVITE_ONLY` is read as an explicit opt-OUT: "false" or "0"
 * restores the old pass-through to the app's sign-in and sign-up, which is
 * what you want locally when testing the funnel end to end. Anything else —
 * UNSET INCLUDED — keeps the site invite-only, so production is gated without
 * depending on anyone remembering to set a deploy variable.
 *
 * It is inlined at build time (NEXT_PUBLIC_*), so flipping it needs a rebuild.
 */
const flag = process.env.NEXT_PUBLIC_INVITE_ONLY?.trim().toLowerCase();

export const INVITE_ONLY = !(flag === "false" || flag === "0");

/** The one account control the nav shows while access is by invitation. */
export const REQUEST_ACCESS_LABEL = "Request Access";
