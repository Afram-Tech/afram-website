/* ═══════════════════════════════════════════════
   How a listing's facts read, in one place.

   The public site and the member app (afram-web) show the same API data,
   so they follow the same rules — DEF-097 found them disagreeing on the same
   listing. afram-web keeps these rules in src/utils/listing-display.ts;
   change both together.

   Nothing here may claim more than the data says: a missing title type is
   "Not yet on file", never "On file"; a missing answer is "Not stated".
   ═══════════════════════════════════════════════ */

/** "5 + 1 half", "5", "1 half" — or null when neither count is known. A half
 *  bathroom is never counted as a whole one. */
export function bathroomsLabel(
  full: number | null | undefined,
  half: number | null | undefined,
): string | null {
  if (full == null && half == null) return null;
  const f = full ?? 0;
  const h = half ?? 0;
  if (h > 0 && f > 0) return `${f} + ${h} half`;
  if (h > 0) return `${h} half`;
  return String(f);
}

/** A property's bathrooms as people read them. `baths` is the total (half
 *  bathrooms included, as search engines count them); `halfBaths` says how
 *  many of those are halves. */
export const bathsLabel = (p: { baths: number; halfBaths?: number }): string =>
  bathroomsLabel(p.baths - (p.halfBaths ?? 0), p.halfBaths ?? 0) ?? "0";

export const NO_TITLE_TYPE = "Not yet on file";

/** The title type as given, or "Not yet on file". */
export const titleTypeLabel = (titleType: string | null | undefined): string =>
  titleType?.trim() || NO_TITLE_TYPE;

/** What each PropertyStatus is called on a listing. */
export const LISTING_STATUS_LABEL: Record<string, string> = {
  listed: "Live on Afram Marketplace",
  under_offer: "Under offer",
  pending: "Pending review",
  sold: "Sold",
  delisted: "Delisted",
  unlisted: "Not listed",
  divided: "Subdivided listing",
  subdivision: "Subdivided listing",
};

/** A status the API adds later reads as "Unavailable" until it's named here. */
export const listingStatusLabel = (status: string | null | undefined): string =>
  (status && LISTING_STATUS_LABEL[status.toLowerCase()]) || "Unavailable";

/** The status pill at the top of a listing, in the member app's words
 *  (afram-web: the pill on /member/browse/property/:id, from
 *  propertyAvailability()). The raw status, title-cased, read "Under_offer"
 *  and "Pending". A status not named here reads "Unlisted", as it does in the app. */
export const LISTING_STATUS_PILL: Record<string, string> = {
  listed: "Available",
  under_offer: "Under Offer",
  pending: "Under Review",
  sold: "Sold",
  delisted: "Delisted",
  unlisted: "Not Listed",
};

export const listingStatusPill = (status: string | null | undefined): string =>
  (status && LISTING_STATUS_PILL[status.toLowerCase()]) || "Unlisted";

/** "Yes", "No", or "Not stated" when the vendor didn't say. */
export const yesNoLabel = (value: boolean | null | undefined): string =>
  value == null ? "Not stated" : value ? "Yes" : "No";
