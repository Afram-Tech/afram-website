export interface RoleCard {
  eyebrow: string;
  title: string;
  href: string;
  backgroundColor: string;
  pillColor: string;
  art: { src: string; alt: string; class: string };
}

export const ROLE_CARDS: RoleCard[] = [
  {
    eyebrow: "For Members",
    title: "Buy property with confidence and flexible financing",
    href: "/properties",
    backgroundColor: "#e6faf9",
    pillColor: "rgba(178,233,240,0.55)",
    art: {
      src: "/role-couple.webp",
      alt: "A couple holding the keys to their new home",
      class:
        "absolute bottom-[-40px] right-1 h-[70%] w-auto max-w-none sm:bottom-[-80px] sm:right-2 sm:h-[92%]",
    },
  },
  {
    eyebrow: "For Vendors",
    title: "Raise Capital and accelerate sales",
    href: "/developers",
    backgroundColor: "#ccf8f6",
    pillColor: "rgba(255,255,255,0.5)",
    art: {
      src: "/role-developer.webp",
      alt: "A property vendor reviewing plans",
      class:
        "absolute bottom-[-40px] right-0 h-[64%] w-auto max-w-none sm:bottom-[-80px] sm:h-[86%]",
    },
  },
  {
    eyebrow: "For Financiers",
    title: "Deploy capital securely against verified assets",
    href: "/financiers",
    backgroundColor: "#b1f0ed",
    pillColor: "rgba(255,255,255,0.5)",
    art: {
      src: "/role-financier.webp",
      alt: "Two professionals shaking hands on a deal",
      class:
        "absolute bottom-[-35px] right-0 h-[58%] w-auto max-w-none sm:bottom-[-70px] sm:h-[78%]",
    },
  },
];
