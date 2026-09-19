import { describe, expect, it } from "vitest";
import {
  DEFAULT_SEARCH_FILTERS,
  filtersFromSearchParams,
  filtersToSearchParams,
  hasActiveSearchFilters,
  type PropertySearchFilters,
} from "@/lib/property-search-filters";

const parse = (query: string) => filtersFromSearchParams(new URLSearchParams(query));

describe("filtersFromSearchParams — unknown/invalid params never throw", () => {
  it("returns an empty object for an empty query string", () => {
    expect(parse("")).toEqual({});
  });

  it("silently drops params it doesn't recognise, keeping the ones it does", () => {
    const filters = parse("region=greater-accra&totally_unknown_param=xyz&another=123");
    expect(filters).toEqual({ region: "greater-accra" });
  });

  it("never throws on garbage input", () => {
    expect(() => parse("price_min=not-a-number&bedrooms=abc&bbox=1,2,3&page=-5")).not.toThrow();
    expect(parse("price_min=not-a-number&bedrooms=abc&bbox=1,2,3&page=-5")).toEqual({});
  });
});

describe("filtersFromSearchParams — region/city/area (slugs, taxonomy-validated)", () => {
  it("accepts a real region slug", () => {
    expect(parse("region=greater-accra")).toEqual({ region: "greater-accra" });
  });

  it("drops a region slug that doesn't exist in the taxonomy", () => {
    expect(parse("region=not-a-real-place")).toEqual({});
  });

  it("accepts a real district slug for city", () => {
    // ablekuma-central is GH0701's slug, confirmed in location-taxonomy.test.ts.
    expect(parse("city=ablekuma-central")).toEqual({ city: "ablekuma-central" });
  });

  it("drops an area slug — AREAS is empty until the candidate list is approved, so every area param is currently unresolvable, by design not by bug", () => {
    expect(parse("area=east-legon")).toEqual({});
  });

  it("rejects a p-code where a slug is expected — the two namespaces are not interchangeable", () => {
    expect(parse("region=GH07")).toEqual({});
  });
});

describe("filtersFromSearchParams — price", () => {
  it("accepts non-negative numbers, including zero and decimals", () => {
    expect(parse("price_min=0")).toEqual({ priceMin: 0 });
    expect(parse("price_max=1500000.5")).toEqual({ priceMax: 1500000.5 });
  });

  it("drops a negative price", () => {
    expect(parse("price_min=-100")).toEqual({});
  });

  it("drops a non-numeric price", () => {
    expect(parse("price_max=free")).toEqual({});
  });
});

describe("filtersFromSearchParams — bedrooms", () => {
  it("accepts a positive integer", () => {
    expect(parse("bedrooms=3")).toEqual({ bedrooms: 3 });
  });

  it("drops zero, negative, decimal, or non-numeric bedrooms", () => {
    expect(parse("bedrooms=0")).toEqual({});
    expect(parse("bedrooms=-1")).toEqual({});
    expect(parse("bedrooms=2.5")).toEqual({});
    expect(parse("bedrooms=studio")).toEqual({});
  });
});

describe("filtersFromSearchParams — status and sort (fixed enums)", () => {
  it("accepts a known status", () => {
    expect(parse("status=available")).toEqual({ status: "available" });
    expect(parse("status=under_offer")).toEqual({ status: "under_offer" });
  });

  it("drops an unknown status, including the old bucketed filter's 'all'", () => {
    expect(parse("status=all")).toEqual({});
    expect(parse("status=sold")).toEqual({});
  });

  it("accepts a known sort and drops an unknown one", () => {
    expect(parse("sort=price_asc")).toEqual({ sort: "price_asc" });
    expect(parse("sort=random")).toEqual({});
  });
});

describe("filtersFromSearchParams — free text (type, q)", () => {
  it("accepts and trims free text", () => {
    expect(parse("type=" + encodeURIComponent("  Apartment  "))).toEqual({ type: "Apartment" });
  });

  it("drops empty or whitespace-only text", () => {
    expect(parse("q=" + encodeURIComponent("   "))).toEqual({});
    expect(parse("q=")).toEqual({});
  });
});

describe("filtersFromSearchParams — page", () => {
  it("accepts a page greater than 1", () => {
    expect(parse("page=3")).toEqual({ page: 3 });
  });

  it("treats page=1 as the default — omitted from the parsed result", () => {
    expect(parse("page=1")).toEqual({});
  });

  it("drops zero, negative, or non-numeric page", () => {
    expect(parse("page=0")).toEqual({});
    expect(parse("page=-2")).toEqual({});
    expect(parse("page=one")).toEqual({});
  });
});

describe("filtersFromSearchParams — bbox", () => {
  it("accepts a valid west,south,east,north quad", () => {
    expect(parse("bbox=-0.3,5.5,-0.1,5.7")).toEqual({
      bbox: { west: -0.3, south: 5.5, east: -0.1, north: 5.7 },
    });
  });

  it("drops a bbox with the wrong number of parts", () => {
    expect(parse("bbox=1,2,3")).toEqual({});
    expect(parse("bbox=1,2,3,4,5")).toEqual({});
  });

  it("drops a bbox with a non-numeric part", () => {
    expect(parse("bbox=1,2,x,4")).toEqual({});
  });

  it("drops a bbox with out-of-range latitude or longitude", () => {
    expect(parse("bbox=-200,5,10,10")).toEqual({}); // west out of [-180,180]
    expect(parse("bbox=1,-95,10,10")).toEqual({}); // south out of [-90,90]
  });

  it("drops a bbox where south is not less than north", () => {
    expect(parse("bbox=1,10,10,5")).toEqual({});
    expect(parse("bbox=1,10,10,10")).toEqual({});
  });
});

describe("filtersToSearchParams", () => {
  it("writes only the fields that are set", () => {
    const params = filtersToSearchParams({ region: "greater-accra", priceMin: 500000 });
    expect(params.toString()).toBe("region=greater-accra&price_min=500000");
  });

  it("writes nothing for an empty filters object", () => {
    expect(filtersToSearchParams({}).toString()).toBe("");
  });

  it("omits page=1 (the default), but writes page=2", () => {
    expect(filtersToSearchParams({ page: 1 }).toString()).toBe("");
    expect(filtersToSearchParams({ page: 2 }).toString()).toBe("page=2");
  });

  it("serialises bbox as a single comma-joined param", () => {
    const params = filtersToSearchParams({
      bbox: { west: -0.3, south: 5.5, east: -0.1, north: 5.7 },
    });
    expect(params.get("bbox")).toBe("-0.3,5.5,-0.1,5.7");
  });
});

describe("round-trip: filters -> URLSearchParams -> filters", () => {
  const cases: PropertySearchFilters[] = [
    {},
    { region: "greater-accra" },
    { region: "greater-accra", city: "ablekuma-central" },
    { priceMin: 100000, priceMax: 2000000 },
    { type: "Apartment", bedrooms: 3 },
    { status: "available", sort: "price_desc" },
    { q: "East Legon" },
    { page: 4 },
    { bbox: { west: -0.3, south: 5.5, east: -0.1, north: 5.7 } },
    {
      region: "greater-accra",
      city: "ablekuma-central",
      priceMin: 50000,
      priceMax: 900000,
      type: "House",
      bedrooms: 2,
      status: "under_offer",
      sort: "newest",
      q: "pool",
      page: 3,
      bbox: { west: -0.4, south: 5.4, east: 0.0, north: 5.8 },
    },
  ];

  it.each(cases)("round-trips %j", (filters) => {
    const params = filtersToSearchParams(filters);
    const roundTripped = filtersFromSearchParams(params);
    expect(roundTripped).toEqual(filters);
  });
});

describe("DEFAULT_SEARCH_FILTERS / hasActiveSearchFilters", () => {
  it("the default filters object has nothing active", () => {
    expect(hasActiveSearchFilters(DEFAULT_SEARCH_FILTERS)).toBe(false);
  });

  it("any single field makes it active", () => {
    expect(hasActiveSearchFilters({ q: "pool" })).toBe(true);
  });
});
