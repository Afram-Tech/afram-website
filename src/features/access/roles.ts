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

/** Opens the Request access dialog from anywhere (it's mounted once in the layout). */
export function openRequestAccess(role?: AccessRole) {
  window.dispatchEvent(new CustomEvent(OPEN_REQUEST_ACCESS, { detail: role }));
}
