import { siteConfig } from "@/config/site";

import { INVITE_ONLY } from "./invite-only";
import {
  REQUEST_ACCESS_ATTR,
  REQUEST_ACCESS_PARAM,
  ROLE_FOR_USER_TYPE,
  type AccessRole,
} from "./roles";

const SIGNUP_PATH = /^\/(signup|get-started)\/?$/;

function isAppSignupUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.origin === new URL(siteConfig.appUrl!).origin && SIGNUP_PATH.test(url.pathname);
  } catch {
    return false;
  }
}

/** A link on this site carrying `?request-access` (see accessCta). */
function isRequestAccessUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.origin === window.location.origin && url.searchParams.has(REQUEST_ACCESS_PARAM);
  } catch {
    return false;
  }
}

export function isAccessLink(link: HTMLAnchorElement): boolean {
  if (!INVITE_ONLY) return false;
  return (
    link.hasAttribute(REQUEST_ACCESS_ATTR) ||
    isRequestAccessUrl(link.href) ||
    isAppSignupUrl(link.href)
  );
}

export function roleForUserType(userType: string | null): AccessRole | undefined {
  return ROLE_FOR_USER_TYPE[userType ?? ""];
}
