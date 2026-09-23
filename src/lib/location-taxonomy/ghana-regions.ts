/**
 * Ghana's 16 regions, canonical spelling (post-2019 reorganisation). Used
 * only as the input list for scripts/build-location-taxonomy.ts — afram-web
 * has this same list at src/containers/add-project-drawer/components/
 * bare-land/constants.ts (GHANA_REGIONS), but that file is dashboard-upload
 * specific and doesn't exist in this repo, so it's kept here instead. Keep
 * both lists in sync if a region is ever added or renamed.
 */
export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Savannah",
  "Oti",
  "Bono",
  "Bono East",
  "Ahafo",
  "Western North",
  "North East",
];
