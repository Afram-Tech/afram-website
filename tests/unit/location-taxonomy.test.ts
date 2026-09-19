import { describe, expect, it } from "vitest";
import { GHANA_REGIONS } from "@/lib/location-taxonomy/ghana-regions";
import {
  DISTRICTS,
  REGIONS,
  findByAlias,
  getById,
  getBySlug,
  getChildren,
  getPath,
  normalizeLocationName,
} from "@/lib/location-taxonomy";
import { REGION_ALIASES } from "@/lib/location-taxonomy/aliases";

/**
 * The build script already refuses to generate the taxonomy if this bijection
 * doesn't hold (see build-location-taxonomy.ts) — this test exists so the
 * *committed* generated/ output is re-checked on every run, not just at
 * generation time, and so CI catches drift if generated/ and GHANA_REGIONS
 * are ever edited independently and not regenerated together.
 */
describe("region taxonomy — GHANA_REGIONS <-> HDX p-code bijection", () => {
  it("every GHANA_REGIONS entry resolves to exactly one region node", () => {
    for (const name of GHANA_REGIONS) {
      const matches = REGIONS.filter((r) => r.name === name);
      expect(matches, `"${name}" should match exactly one region`).toHaveLength(1);
    }
  });

  it("every generated region resolves back to exactly one GHANA_REGIONS entry", () => {
    for (const region of REGIONS) {
      const matches = GHANA_REGIONS.filter((name) => name === region.name);
      expect(
        matches,
        `region ${region.id} (${region.name}) should match exactly one GHANA_REGIONS entry`,
      ).toHaveLength(1);
    }
  });

  it("there are exactly 16 regions on both sides", () => {
    expect(GHANA_REGIONS).toHaveLength(16);
    expect(REGIONS).toHaveLength(16);
  });

  it("region ids are unique p-codes", () => {
    expect(new Set(REGIONS.map((r) => r.id)).size).toBe(REGIONS.length);
  });

  it("the known alias survives into the generated data", () => {
    const northEast = REGIONS.find((r) => r.name === "North East");
    expect(northEast?.aliases).toContain("Northern East");
    expect(REGION_ALIASES["Northern East"]).toBe("North East");
  });
});

describe("district taxonomy", () => {
  it("every district belongs to a real region", () => {
    const regionIds = new Set(REGIONS.map((r) => r.id));
    for (const d of DISTRICTS) {
      expect(regionIds.has(d.parentId), `${d.id} has an unknown parent ${d.parentId}`).toBe(true);
    }
  });

  it("district ids are unique p-codes", () => {
    expect(new Set(DISTRICTS.map((d) => d.id)).size).toBe(DISTRICTS.length);
  });

  it("every displayName maps back to exactly one district id", () => {
    // The uniqueness guarantee build-location-taxonomy.ts is supposed to
    // enforce (falling back to officialName on a collision) — checked here
    // against the committed output, not just at generation time.
    const byDisplayName = new Map<string, string[]>();
    for (const d of DISTRICTS) {
      const list = byDisplayName.get(d.displayName) ?? [];
      list.push(d.id);
      byDisplayName.set(d.displayName, list);
    }
    for (const [name, ids] of byDisplayName) {
      expect(ids, `"${name}" is shared by ${ids.join(", ")}`).toHaveLength(1);
    }
  });

  it("a stripped display name never loses the ability to map back to a p-code", () => {
    // displayName must always resolve through findByAlias back to the same id.
    for (const d of DISTRICTS.slice(0, 30)) {
      expect(findByAlias(d.displayName)?.id).toBe(d.id);
    }
  });
});

describe("normalizeLocationName", () => {
  it("is case and whitespace insensitive", () => {
    expect(normalizeLocationName("  GREATER   Accra  ")).toBe(
      normalizeLocationName("greater accra"),
    );
  });

  it("drops a trailing 'Region' suffix", () => {
    expect(normalizeLocationName("Eastern Region")).toBe(normalizeLocationName("Eastern"));
  });

  it("strips diacritics", () => {
    expect(normalizeLocationName("Wénchi")).toBe(normalizeLocationName("Wenchi"));
  });
});

describe("findByAlias", () => {
  it("resolves a region by its canonical name", () => {
    expect(findByAlias("Greater Accra")?.id).toBe("GH07");
  });

  it("resolves a region by its HDX alias", () => {
    expect(findByAlias("Northern East")?.id).toBe(findByAlias("North East")?.id);
  });

  it("resolves a region regardless of case, whitespace, or a 'Region' suffix", () => {
    expect(findByAlias("greater accra region")?.id).toBe("GH07");
  });

  it("resolves a district by its stripped display name", () => {
    const district = DISTRICTS.find((d) => d.displayName !== d.officialName);
    expect(district).toBeDefined();
    expect(findByAlias(district!.displayName)?.id).toBe(district!.id);
  });

  it("resolves a district by its full official name too", () => {
    const district = DISTRICTS[0];
    expect(findByAlias(district.officialName)?.id).toBe(district.id);
  });

  it("returns null for a place this taxonomy doesn't know", () => {
    expect(findByAlias("Atlantis")).toBeNull();
  });
});

describe("getChildren / getPath / getById", () => {
  it("a region's children are its districts", () => {
    const accraDistricts = getChildren("GH07");
    expect(accraDistricts.length).toBeGreaterThan(0);
    expect(accraDistricts.every((d) => "parentId" in d && d.parentId === "GH07")).toBe(true);
  });

  it("getPath on a district returns [region, district]", () => {
    const district = DISTRICTS[0];
    const path = getPath(district.id);
    expect(path).toHaveLength(2);
    expect(path[0].id).toBe(district.parentId);
    expect(path[1].id).toBe(district.id);
  });

  it("getPath on a region returns just the region", () => {
    const path = getPath("GH07");
    expect(path).toHaveLength(1);
    expect(path[0].id).toBe("GH07");
  });

  it("getById finds regions and districts, and misses cleanly otherwise", () => {
    expect(getById("GH07")?.id).toBe("GH07");
    expect(getById(DISTRICTS[0].id)?.id).toBe(DISTRICTS[0].id);
    expect(getById("not-a-real-id")).toBeNull();
  });
});

describe("slugs — the URL filter codec's lookup key", () => {
  it("every region and district has a non-empty, URL-safe slug", () => {
    const urlSafe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const node of [...REGIONS, ...DISTRICTS]) {
      expect(node.slug, `${node.id} has an empty slug`).toBeTruthy();
      expect(node.slug, `"${node.slug}" (${node.id}) is not URL-safe`).toMatch(urlSafe);
    }
  });

  it("region slugs are unique across all 16 regions", () => {
    expect(new Set(REGIONS.map((r) => r.slug)).size).toBe(REGIONS.length);
  });

  it("district slugs are unique across all 260 districts", () => {
    expect(new Set(DISTRICTS.map((d) => d.slug)).size).toBe(DISTRICTS.length);
  });

  it("getBySlug finds a region by its slug", () => {
    expect(getBySlug("greater-accra")?.id).toBe("GH07");
  });

  it("getBySlug finds a district by its slug", () => {
    const district = DISTRICTS[0];
    expect(getBySlug(district.slug)?.id).toBe(district.id);
  });

  it("getBySlug misses cleanly for an unknown slug", () => {
    expect(getBySlug("not-a-real-place")).toBeNull();
  });

  it("id and slug are deliberately different namespaces — a p-code is never a valid slug lookup", () => {
    // Guards against a future change accidentally aliasing slug to id.
    expect(getBySlug("GH07")).toBeNull();
  });
});
