export enum UserRole {
  Buyer = "buyer",
  Vendor = "vendor",
  Financier = "financier",
  Agent = "agent",
}

export interface RoleMetadata {
  role: UserRole;
  label: string;
  href: string;
}

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  [UserRole.Buyer]: { role: UserRole.Buyer, label: "Buyer", href: "/properties" },
  [UserRole.Vendor]: { role: UserRole.Vendor, label: "Vendor", href: "/developers" },
  [UserRole.Financier]: { role: UserRole.Financier, label: "Financier", href: "/financiers" },
  [UserRole.Agent]: { role: UserRole.Agent, label: "Agent", href: "/properties" },
};
