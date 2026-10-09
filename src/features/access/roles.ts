/** Who's asking for access — "Member" is this site's word for a buyer. */
export const ACCESS_ROLES = ["Member", "Vendor", "Financier"] as const;
export type AccessRole = (typeof ACCESS_ROLES)[number];

/** Pages that imply a role, so the form opens on the likely answer. */
export const ROLE_FOR_PATH: Record<string, AccessRole> = {
  "/developers": "Vendor",
  "/financiers": "Financier",
};

/** The app's `?userType=` on a sign-up link → the role it was meant for. */
export const ROLE_FOR_USER_TYPE: Record<string, AccessRole> = {
  issuer: "Vendor",
  financier: "Financier",
  buyer: "Member",
};

/** Put on any link that should open Request access instead of navigating
 *  (sign-up links are caught without it — see RequestAccess). */
export const REQUEST_ACCESS_ATTR = "data-request-access";

export const OPEN_REQUEST_ACCESS = "afram:request-access";

/** Query param that opens the form on arrival: `…/?request-access=1`, with an
 *  optional `?userType=` for the role. The APP links here when someone asks
 *  for access from a gated signup screen (afram-web, config/signup-gate.ts),
 *  so this name is a contract with that repo — don't rename it alone. */
export const REQUEST_ACCESS_PARAM = "request-access";
export const USER_TYPE_PARAM = "userType";

/** Opens the Request access dialog from anywhere (it's mounted once in the layout). */
export function openRequestAccess(role?: AccessRole) {
  window.dispatchEvent(new CustomEvent(OPEN_REQUEST_ACCESS, { detail: role }));
}
