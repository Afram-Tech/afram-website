import { describe, expect, it } from "vitest";
import { centroidOf, extractPointsFromSiteCoordinates } from "@/lib/siteCoordinates";

/**
 * Characterization tests: these pin the exact behaviour of the function this
 * was extracted from (BulkUnitUploadDrawer.tsx's old inline
 * extractPointsFromCoordinates), not a redesign. Every shape here is one
 * actually seen in the codebase per docs/location-search/00-findings.md §A3.
 */
describe("extractPointsFromSiteCoordinates — the dominant single-unit shape", () => {
  it("reads { coordinates: [{lat,lng,X,Y,Bearing,Distance}] } as-is", () => {
    const input = {
      coordinates: [
        { lat: 5.6, lng: -0.2, X: -0.2, Y: 5.6, Bearing: 90, Distance: 10 },
        { lat: 5.61, lng: -0.21, X: -0.21, Y: 5.61, Bearing: 90, Distance: 10 },
      ],
    };
    expect(extractPointsFromSiteCoordinates(input)).toEqual([
      { lat: 5.6, lng: -0.2 },
      { lat: 5.61, lng: -0.21 },
    ]);
  });
});

describe("extractPointsFromSiteCoordinates — the OCR/bulk-demarcation variant", () => {
  it("reads { origin, coordinates: [{lat,lng}] } without X/Y/Bearing", () => {
    const input = {
      origin: { lat: 5.5, lng: -0.3 },
      coordinates: [
        { lat: 5.55, lng: -0.31 },
        { lat: 5.56, lng: -0.32 },
      ],
    };
    expect(extractPointsFromSiteCoordinates(input)).toEqual([
      { lat: 5.55, lng: -0.31 },
      { lat: 5.56, lng: -0.32 },
    ]);
  });

  it("reads the nested { siteCoordinates: { coordinates } } wrapper", () => {
    const input = { siteCoordinates: { coordinates: [{ lat: 6.1, lng: -1.6 }] } };
    expect(extractPointsFromSiteCoordinates(input)).toEqual([{ lat: 6.1, lng: -1.6 }]);
  });

  it("reads a bare { siteCoordinates: [...] } array wrapper", () => {
    const input = { siteCoordinates: [{ lat: 6.1, lng: -1.6 }] };
    expect(extractPointsFromSiteCoordinates(input)).toEqual([{ lat: 6.1, lng: -1.6 }]);
  });
});

describe("extractPointsFromSiteCoordinates — GeoJSON-style and bare-array shapes", () => {
  it("unwraps [[[lng, lat], ...]] deep nesting to [lng,lat] pairs", () => {
    const input = [
      [
        [-0.2, 5.6],
        [-0.21, 5.61],
      ],
    ];
    expect(extractPointsFromSiteCoordinates(input)).toEqual([
      { lat: 5.6, lng: -0.2 },
      { lat: 5.61, lng: -0.21 },
    ]);
  });

  it("reads a bare array of [lng,lat] pairs with no wrapper at all", () => {
    const input = [
      [-0.2, 5.6],
      [-0.21, 5.61],
    ];
    expect(extractPointsFromSiteCoordinates(input)).toEqual([
      { lat: 5.6, lng: -0.2 },
      { lat: 5.61, lng: -0.21 },
    ]);
  });

  it("reads a bare array of {lat,lng} objects", () => {
    const input = [{ lat: 5.6, lng: -0.2 }];
    expect(extractPointsFromSiteCoordinates(input)).toEqual([{ lat: 5.6, lng: -0.2 }]);
  });
});

describe("extractPointsFromSiteCoordinates — Ghana National Grid input", () => {
  it("detects out-of-WGS84-range X/Y and transforms via proj4", () => {
    // A real Ghana Grid pair from transformCoordinate.ts's own example data.
    const input = { coordinates: [{ X: 340930.05, Y: 1192598.06 }] };
    const result = extractPointsFromSiteCoordinates(input);
    expect(result).toHaveLength(1);
    // Ghana's real bounds — proves the projection actually ran, not just
    // passed the raw grid numbers through as if they were already lat/lng.
    expect(result[0].lat).toBeGreaterThan(4);
    expect(result[0].lat).toBeLessThan(12);
    expect(result[0].lng).toBeGreaterThan(-4);
    expect(result[0].lng).toBeLessThan(2);
  });
});

describe("extractPointsFromSiteCoordinates — degenerate input", () => {
  it("returns [] for null/undefined/empty", () => {
    expect(extractPointsFromSiteCoordinates(null)).toEqual([]);
    expect(extractPointsFromSiteCoordinates(undefined)).toEqual([]);
    expect(extractPointsFromSiteCoordinates({})).toEqual([]);
    expect(extractPointsFromSiteCoordinates({ coordinates: [] })).toEqual([]);
  });

  it("drops zero/NaN points once neither the WGS84 nor Ghana Grid heuristic claims them", () => {
    const input = { coordinates: [{ lat: 0, lng: 0 }, { foo: "bar" }] };
    expect(extractPointsFromSiteCoordinates(input)).toEqual([]);
  });
});

describe("centroidOf", () => {
  it("is the arithmetic mean of the points", () => {
    expect(
      centroidOf([
        { lat: 5.0, lng: 0.0 },
        { lat: 7.0, lng: 2.0 },
      ]),
    ).toEqual({ lat: 6.0, lng: 1.0 });
  });

  it("is null for an empty list", () => {
    expect(centroidOf([])).toBeNull();
  });
});
