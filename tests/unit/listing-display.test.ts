import { describe, expect, it } from "vitest";

import {
  bathroomsLabel,
  bathsLabel,
  listingStatusLabel,
  listingStatusPill,
  titleTypeLabel,
  yesNoLabel,
} from "@/features/properties/listing-display";

/* DEF-097: No. 5 Roman Ridge Villa — fullBathroom 5, halfBathroom 1,
   titleType null, status under_offer. The member app shows the same. */
describe("listing facts, as both sites show them", () => {
  it("counts a half bathroom as half", () => {
    expect(bathroomsLabel(5, 1)).toBe("5 + 1 half");
    expect(bathsLabel({ baths: 6, halfBaths: 1 })).toBe("5 + 1 half");
    expect(bathsLabel({ baths: 3 })).toBe("3");
    expect(bathsLabel({ baths: 1, halfBaths: 1 })).toBe("1 half");
  });

  it("never implies a title is on file when there isn't one", () => {
    expect(titleTypeLabel(null)).toBe("Not yet on file");
    expect(titleTypeLabel("Leasehold")).toBe("Leasehold");
  });

  it("names the listing's real status", () => {
    expect(listingStatusLabel("under_offer")).toBe("Under offer");
    expect(listingStatusLabel("listed")).toBe("Live on Afram Marketplace");
    expect(listingStatusLabel("something_new")).toBe("Unavailable");
  });

  it("doesn't read an unanswered question as 'No'", () => {
    expect(yesNoLabel(null)).toBe("Not stated");
    expect(yesNoLabel(undefined)).toBe("Not stated");
    expect(yesNoLabel(false)).toBe("No");
    expect(yesNoLabel(true)).toBe("Yes");
  });

  it("falls back to whole numbers, and says nothing it doesn't know", () => {
    expect(bathroomsLabel(5, 0)).toBe("5");
    expect(bathroomsLabel(5, null)).toBe("5");
    expect(bathroomsLabel(null, null)).toBeNull();
    expect(titleTypeLabel("  ")).toBe("Not yet on file");
    expect(listingStatusLabel(null)).toBe("Unavailable");
  });

  it("names the status pill in the member app's words", () => {
    expect(listingStatusPill("under_offer")).toBe("Under Offer");
    expect(listingStatusPill("UNDER_OFFER")).toBe("Under Offer");
    expect(listingStatusPill("listed")).toBe("Available");
    expect(listingStatusPill("pending")).toBe("Under Review");
    expect(listingStatusPill("sold")).toBe("Sold");
    expect(listingStatusPill("delisted")).toBe("Delisted");
    expect(listingStatusPill("unlisted")).toBe("Not Listed");
    expect(listingStatusPill("divided")).toBe("Unlisted");
    expect(listingStatusPill(null)).toBe("Unlisted");
  });
});
