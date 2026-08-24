export interface NavItem {
  label: string;
  description: string;
  href: string;
}

export interface NavGroup {
  label: string;
  href: string;
  accentColor: string;
  exploreLabel: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "List Properties",
    href: "/developers",
    accentColor: "#7e22ce",
    exploreLabel: "vendor options",
    items: [
      {
        label: "Individual vendor",
        description: "Sell faster, recover capital sooner",
        href: "/developers#individual",
      },
      {
        label: "Corporate firm",
        description: "Scale sales without diluting your brand",
        href: "/developers#corporate",
      },
    ],
  },
  {
    label: "Financiers",
    href: "/financiers",
    accentColor: "#047857",
    exploreLabel: "financier options",
    items: [
      {
        label: "Bank / regulated lender",
        description: "Secured, compliant real-estate exposure",
        href: "/financiers#bank",
      },
      {
        label: "Private credit",
        description: "Yield above treasury, your own rules",
        href: "/financiers#private-credit",
      },
    ],
  },
];

export const FOOTER_COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse properties", href: "/properties" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/how-it-works" },
];

export const FOOTER_SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "TikTok", href: "#" },
];

export const FOOTER_LEGAL_LINKS = [
  { label: "Terms", href: "/privacy-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/privacy-policy" },
];
