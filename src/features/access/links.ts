import { siteConfig } from "@/config/site";

import { INVITE_ONLY } from "./invite-only";
import { REQUEST_ACCESS_ATTR, ROLE_FOR_USER_TYPE, type AccessRole } from "./roles";

const SIGNUP_PATH = /^\/(signup|get-started)\/?$/;

function isAppSignupUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.origin === new URL(siteConfig.appUrl!).origin && SIGNUP_PATH.test(url.pathname);
  } catch {
    return false;
  }
}

export function isAccessLink(link: HTMLAnchorElement): boolean {
  if (!INVITE_ONLY) return false;
  return link.hasAttribute(REQUEST_ACCESS_ATTR) || isAppSignupUrl(link.href);
}

export function roleForUserType(userType: string | null): AccessRole | undefined {
  return ROLE_FOR_USER_TYPE[userType ?? ""];
}
