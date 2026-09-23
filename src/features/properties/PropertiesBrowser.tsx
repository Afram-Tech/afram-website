"use client";

import {
  Building2,
  ChevronDown,
  DollarSign,
  Home,
  LayoutGrid,
  Loader2,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  FilterDropdown,
  FilterField,
  filterTriggerClass,
  type FilterOption,
} from "@/features/properties/FilterDropdown";
import { LocationPicker, type LocationPickerSelection } from "@/features/properties/LocationPicker";
import { PropertyMap } from "@/features/properties/map/PropertyMap";
import { PropertyListPanel } from "@/features/properties/map/PropertyListPanel";
import { deriveMapMarkers } from "@/features/properties/map/markers";
import type { Property } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";
import { titleCase } from "@/lib/format";
import { getBySlug, getPath } from "@/lib/location-taxonomy";
import { clientSearchProperties } from "@/lib/property-search";
import { cn } from "@/lib/utils";
import {
  filtersFromSearchParams,
  filtersToSearchParams,
  type PropertySearchFilters,
} from "@/lib/property-search-filters";

type BrowseView = "grid" | "map";

/**
 * Status/type/price stay local component state, never written to the URL —
 * same scope decision afram-web's BrowseProjects migration made when it
 * adopted this engine: only what already had a taxonomy-backed picker
 * (region/city/area) moves to the URL in this pass. See that repo's
 * BrowseProjects.tsx for the identical split.
 */
interface Filters {
  status: string;
  type: string;
  price: string;
}

const DEFAULT_FILTERS: Filters = { status: "all", type: "all", price: "all" };

/** How many cards a scroll into view reveals at a time. */
const PAGE_SIZE = 12;

const PRICE_BANDS = [
  { value: "0-100000", label: "Under $100,000", min: 0, max: 100_000 },
  { value: "100000-300000", label: "$100,000 – $300,000", min: 100_000, max: 300_000 },
  { value: "300000-600000", label: "$300,000 – $600,000", min: 300_000, max: 600_000 },
  { value: "600000-", label: "Over $600,000", min: 600_000, max: Infinity },
];

/** Fixed to what clientSearchProperties' status filter actually understands
 *  (getPropertyAvailability's available/under_offer split) — not every raw
 *  PropertyStatus value that happens to appear in the data. The dropdown
 *  used to list whatever statuses existed verbatim (Listed, Pending, Sold,
 *  Divided…), but nothing here filtered by "Sold" or "Divided" in a way
 *  that matched the engine's status semantics; this makes the two agree. */
const STATUS_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "under_offer", label: "Under Offer" },
];

/** Params the codec owns — cleared before re-applying a patch, so a patch
 *  that omits a field actually removes it rather than leaving a stale
 *  value from a previous selection sitting in the URL. */
const CODEC_PARAM_KEYS = ["region", "city", "area"];

function uniqueOptions(values: string[], allLabel: string): FilterOption[] {
  const seen = new Map<string, string>();
  for (const value of values) {
    if (!value) continue;
    const key = value.toLowerCase();
    if (!seen.has(key)) seen.set(key, titleCase(value));
  }
  return [
    { value: "all", label: allLabel },
    ...[...seen.entries()]
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([value, label]) => ({ value, label })),
  ];
}

export function PropertiesBrowser({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [view, setView] = useState<BrowseView>("grid");

  /* ─── Location (LocationPicker + URL) ───
     region/city/area are URL-driven, read through the shared codec — the
     same taxonomy-backed model afram-web's BrowseProjects.tsx uses. Status/
     type/price stay in local `filters` state (see the Filters comment
     above). */
  const urlFilters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams]);

  const selectedLocationNode = urlFilters.city
    ? getBySlug(urlFilters.city)
    : urlFilters.region
      ? getBySlug(urlFilters.region)
      : null;
  const selectedLocationLabel = selectedLocationNode
    ? "displayName" in selectedLocationNode
      ? selectedLocationNode.displayName
      : selectedLocationNode.name
    : null;

  /* Merges a codec-owned patch into the URL without disturbing params the
     codec doesn't model — filtersToSearchParams on its own builds a
     URLSearchParams from scratch, which would silently drop anything else
     a future feature adds to this URL if used directly as the next value. */
  const applyFilterParams = (patch: PropertySearchFilters) => {
    const merged = new URLSearchParams(searchParams.toString());
    for (const key of CODEC_PARAM_KEYS) merged.delete(key);
    for (const [key, value] of filtersToSearchParams(patch)) merged.set(key, value);
    const query = merged.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleLocationSelect = (selection: LocationPickerSelection) => {
    const next: PropertySearchFilters = { ...urlFilters };
    delete next.region;
    delete next.city;
    delete next.area;

    if (selection.level === "region") {
      next.region = selection.slug;
    } else if (selection.level === "city") {
      next.city = selection.slug;
      const region = getPath(selection.id)[0];
      if (region) next.region = region.slug;
    } else {
      next.area = selection.slug;
      const [region, city] = getPath(selection.id);
      if (region) next.region = region.slug;
      if (city) next.city = city.slug;
    }
    applyFilterParams(next);
  };

  const typeOptions = useMemo(
    () =>
      uniqueOptions(
        properties.map((p) => p.type),
        "All Types",
      ),
    [properties],
  );
  const priceOptions: FilterOption[] = [
    { value: "all", label: "Any Price" },
    ...PRICE_BANDS.map((band) => ({ value: band.value, label: band.label })),
  ];

  const searchFilters = useMemo<PropertySearchFilters>(() => {
    const band =
      filters.price !== "all" ? PRICE_BANDS.find((b) => b.value === filters.price) : undefined;
    return {
      region: urlFilters.region,
      city: urlFilters.city,
      area: urlFilters.area,
      status:
        filters.status !== "all" ? (filters.status as PropertySearchFilters["status"]) : undefined,
      type: filters.type !== "all" ? filters.type : undefined,
      priceMin: band ? band.min : undefined,
      priceMax: band && band.max !== Infinity ? band.max : undefined,
      q: search.trim() || undefined,
    };
  }, [
    urlFilters.region,
    urlFilters.city,
    urlFilters.area,
    filters.status,
    filters.type,
    filters.price,
    search,
  ]);

  const filteredProperties = useMemo(
    () =>
      clientSearchProperties(
        searchFilters,
        { offset: 0, limit: Number.MAX_SAFE_INTEGER },
        { candidateRows: properties },
      ).rows,
    [properties, searchFilters],
  );

  // Markers derive from the same filtered set the grid shows — switching
  // view is a presentation choice, not a second query, and a property with
  // no resolved coordinates (Property.coordinates' own doc explains why
  // that happens) simply has nothing to plot, same as it would for any map.
  const mapMarkers = useMemo(() => deriveMapMarkers(filteredProperties), [filteredProperties]);
  const handleMarkerClick = (slug: string) => router.push(`/properties/${slug}`);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.type !== "all" ||
    filters.price !== "all" ||
    Boolean(urlFilters.region || urlFilters.city || urlFilters.area) ||
    search.trim().length > 0;

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    applyFilterParams({});
  };

  // Infinite scroll: reveal PAGE_SIZE cards at a time, resetting to the first
  // page whenever the filtered result set itself changes (a new search or
  // filter) rather than every render — adjusted during render, not in an
  // effect, so a filter change never flashes the old page count first.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pagedFor, setPagedFor] = useState(filteredProperties);
  if (pagedFor !== filteredProperties) {
    setPagedFor(filteredProperties);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProperties.length;

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredProperties.length));
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, filteredProperties.length]);

  return (
    <>
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-ink-900 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
            Browse verified properties
          </h1>
          <p className="text-ink-500 mt-3 text-[16px] leading-relaxed">
            Every listing below is title-verified against Ghana&apos;s Lands Commission records and
            recorded on-chain.
          </p>
        </div>

        <div className="relative w-full shrink-0 sm:w-[280px]">
          <Search className="text-ink-400 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties, locations..."
            className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-brand-400 h-11 w-full rounded-full border bg-white pr-4 pl-10 text-[14px] transition-colors outline-none"
          />
        </div>
      </div>

      <div className="bg-brand-50 mt-8 rounded-[22px] px-6 py-5 sm:px-7">
        <h2 className="text-brand-700 text-[18px] font-semibold sm:text-[20px]">
          Search Properties
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterDropdown
            label="Status"
            icon={<Tag className="h-3.5 w-3.5" />}
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(value) => setFilters((f) => ({ ...f, status: value }))}
          />
          <FilterField label="Location" icon={<MapPin className="h-3.5 w-3.5" />}>
            <button
              type="button"
              onClick={() => setLocationPickerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={locationPickerOpen}
              className={filterTriggerClass}
            >
              <span className="truncate">{selectedLocationLabel ?? "All Locations"}</span>
              <ChevronDown className="text-ink-400 h-4 w-4 shrink-0" />
            </button>
          </FilterField>
          <FilterDropdown
            label="Type"
            icon={<Home className="h-3.5 w-3.5" />}
            value={filters.type}
            options={typeOptions}
            onChange={(value) => setFilters((f) => ({ ...f, type: value }))}
          />
          <FilterDropdown
            label="Price"
            icon={<DollarSign className="h-3.5 w-3.5" />}
            value={filters.price}
            options={priceOptions}
            onChange={(value) => setFilters((f) => ({ ...f, price: value }))}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-500 text-[14px]">
          {filteredProperties.length} propert{filteredProperties.length === 1 ? "y" : "ies"} found
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-brand-600 hover:text-brand-700 ml-3 font-semibold"
            >
              Clear filters
            </button>
          )}
        </p>

        <div className="border-ink-200 flex items-center gap-1 rounded-full border bg-white p-1">
          {(
            [
              { key: "grid", label: "Grid", icon: LayoutGrid },
              { key: "map", label: "Map", icon: MapIcon },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                view === key ? "bg-brand-600 text-white" : "text-ink-500 hover:bg-ink-50",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="py-16 text-center">
          <div className="border-ink-100 bg-ink-50 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border">
            <Building2 className="text-ink-300 h-12 w-12" />
          </div>
          <h3 className="text-ink-900 mb-2 text-2xl font-semibold">No properties available</h3>
          <p className="text-ink-500 mx-auto max-w-md">
            We don&rsquo;t have any properties listed at the moment. Please check back later.
          </p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SlidersHorizontal className="text-ink-200 mb-3 h-10 w-10" />
          <p className="text-ink-900 mb-2 text-[15px] font-semibold">
            No properties match your filters
          </p>
          <p className="text-ink-400 text-[13px]">
            Try adjusting or clearing your filters to see more results.
          </p>
          <button onClick={clearFilters} className={buttonVariants("primary", "sm", "mt-4")}>
            Clear All Filters
          </button>
        </div>
      ) : view === "map" ? (
        <div className="border-ink-100 mt-10 flex h-[640px] flex-col overflow-hidden rounded-[22px] border lg:flex-row">
          <div className="border-ink-100 h-56 shrink-0 overflow-hidden border-b lg:h-full lg:w-[360px] lg:border-r lg:border-b-0">
            <PropertyListPanel
              properties={filteredProperties}
              onSelect={handleMarkerClick}
              onHoverChange={setHoveredSlug}
            />
          </div>
          <div className="min-h-0 flex-1">
            <PropertyMap
              markers={mapMarkers}
              onMarkerClick={handleMarkerClick}
              highlightedSlug={hoveredSlug}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="mt-10 flex items-center justify-center gap-2 py-6">
              <Loader2 className="text-ink-300 h-5 w-5 animate-spin" />
              <span className="text-ink-400 text-[13px]">Loading more properties…</span>
            </div>
          )}
        </>
      )}

      <LocationPicker
        open={locationPickerOpen}
        onOpenChange={setLocationPickerOpen}
        onSelect={handleLocationSelect}
        selectedId={selectedLocationNode?.id}
      />
    </>
  );
}
