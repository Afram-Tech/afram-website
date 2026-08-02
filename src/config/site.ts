export const siteConfig = {
  name: "Afram",
  legalName: "Afram Technologies",
  tagline: "Liberating Capital.",
  description:
    "Afram is a blockchain-verified real estate marketplace connecting buyers, vendors, and financiers in Ghana. Buy property with flexible financing, list verified projects to reach ready buyers, or deploy capital into title-verified real estate.",
  url: "https://afram.co",
  ogImage: "/opengraph.png",
  registryUrl: "https://registry.afram.co",
  /** Auth lives in the Afram app, not on this marketing site. */
  signInUrl: "https://app.staging.afram.co/signin",
  signUpUrl: "https://app.staging.afram.co/signup",
  social: {
    twitter: "@afram",
    facebook: "https://facebook.com/afram",
    linkedin: "https://linkedin.com/company/afram",
    instagram: "https://instagram.com/afram",
    tiktok: "https://tiktok.com/@afram",
  },
} as const;
