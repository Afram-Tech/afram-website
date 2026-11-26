/**
 * Verified Unsplash photography (all IDs return 200).
 * These are tasteful stock stand-ins for the real casting brief
 * (Ghanaian + diaspora families, homes, professionals) — swap with
 * licensed assets in /public/photography before launch.
 */
const U = (id: string, w = 1200, q = 68) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const PHOTOS = {
  // Homes & architecture
  modernHome: U("photo-1568605114967-8130f3a36994"),
  houseExterior: U("photo-1570129477492-45c003edd2be"),
  modernHome2: U("photo-1600596542815-ffad4c1539a9"),
  house3: U("photo-1600585154340-be6161a56a0c"),
  house4: U("photo-1564013799919-ab600027ffc6"),
  building: U("photo-1605276374104-dee2a0ed3cd6"),
  house5: U("photo-1512917774080-9991f1c4c750"),
  apartments: U("photo-1580587771525-78b9dba3b914"),
  apartments2: U("photo-1576941089067-2de3c901e126"),
  // Interiors
  interior: U("photo-1600607687939-ce8a6c25118c"),
  interior2: U("photo-1600047509807-ba8f99d2cdde"),
  interior3: U("photo-1600566753086-00f18fb6b3ea"),
  // People & lifestyle
  manPortrait: U("photo-1507003211169-0a1dd7228f2d"),
  woman: U("photo-1573496359142-b8d87734a5a2"),
  man2: U("photo-1531123897727-8f129e1688ce"),
  woman2: U("photo-1521119989659-a83eee488004"),
  man3: U("photo-1488161628813-04466f872be2"),
  couple: U("photo-1556157382-97eda2d62296"),
  family: U("photo-1582750433449-648ed127bb54"),
  family2: U("photo-1583847268964-b28dc8f51f92"),

  // Hero candidates — families & happy moments at home (verified to load)
  familyA: U("photo-1511895426328-dc8714191300", 1400),
  familyB: U("photo-1600880292203-757bb62b4baf", 1400),
  familyC: U("photo-1531983412531-1f49a365ffed", 1400),
  familyD: U("photo-1609220136736-443140cffec6", 1400),
  keysDeal: U("photo-1521791136064-7986c2920216", 1400),

  // Figma redesign — duotone-treated cover imagery
  heroBuilding: U("photo-1486406146926-c627a92ad1ab", 1600),
  heroBuilding2: U("photo-1449157291145-7efd050a4d0e", 1600),
  leaves: U("photo-1463320726281-696a485928c7", 1400),
  palm: U("photo-1545241047-6083a3684587", 1400),
  cityTrees: U("photo-1518005020951-eccb494ad742", 1600),
  cityTrees2: U("photo-1480714378408-67cf0d13bc1b", 1600),
  glassTrees: U("photo-1486325212027-8081e485255e", 1600),
  ferrofluid: U("photo-1656169907289-b225ff3d7aa4", 1600),
  /** Transparent PNG cutout of the townhouse row (exact Figma asset). */
  heroHouses: "/hero-houses.png",
  /** Hi-res townhouse render for the revamped hero band (Figma 1198-3367). */
  heroTownhouses: "/hero-townhouses-v5.webp",
  /** Couple-with-keys cutout — Buyers role card. */
  roleCouple: "/role-couple.webp",
  /** Developer-with-blueprint cutout — Developers role card. */
  roleDeveloper: "/role-developer.webp",
  /** Two-men-handshake cutout — Financiers role card. */
  roleFinancier: "/role-financier.webp",
  /** Full-bleed sky photo — Developers/Vendor page hero (Figma 1343-12219). */
  heroVendorPhoto: "/hero-vendor.webp",
  /** Full-bleed handshake photo — Financiers page hero (Figma 1343-12301). */
  heroFinancierPhoto: "/hero-financier-v2.webp",
  floorPlan: U("photo-1542621334-a254cf47733d", 1400),
} as const;

export type PhotoKey = keyof typeof PHOTOS;
