export const appUrl = process.env.NEXT_PUBLIC_CLIENT_APP;

export const siteConfig = {
  name: "Afram",
  legalName: "Afram Technologies",
  tagline: "Liberating Capital.",
  description:
    "Afram is a blockchain-verified real estate marketplace connecting members, vendors, and financiers in Ghana. Buy property with flexible financing, list verified projects to reach ready members, or deploy capital into title-verified real estate.",
  url: "https://afram.co",
  ogImage: "/opengraph.png",
  registryUrl: "https://registry.afram.co",
  /** Auth and the buyer dashboard live in the Afram app, not on this marketing site.... */
  appUrl: appUrl,
  signInUrl: `${appUrl}/signin`,
  signUpUrl: `${appUrl}/get-started`,
  social: {
    twitter: "@afram",
    facebook: "https://facebook.com/afram",
    linkedin: "https://linkedin.com/company/afram",
    instagram: "https://instagram.com/afram",
    tiktok: "https://tiktok.com/@afram",
  },
} as const;
