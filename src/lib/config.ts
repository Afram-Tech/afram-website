import { siteConfig } from "@/config/site";

/**
 * Title verification. The site opens it in-place through VerifyTitleDialog;
 * this is the registry it searches, for anywhere that needs a plain link.
 */
export const VERIFY_URL = siteConfig.registryUrl;

/**
 * Sign up and sign in hand off to the Afram app, where a person picks a role
 * and completes the flow (or signs in with an existing account).
 */
export const AFRAM_EXCHANGE_URL = siteConfig.signUpUrl;
export const AFRAM_SIGN_IN_URL = siteConfig.signInUrl;

/** Attributes for links that leave the marketing site (open in a new tab). */
export const EXTERNAL_LINK = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
