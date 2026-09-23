"use client";

import {
  Building2,
  ChevronDown,
  ChevronUp,
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
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  compactFilterTriggerClass,
  FilterDropdown,
  FilterField,
  filterTriggerClass,
  type FilterOption,
} from "@/features/properties/FilterDropdown";
import { LocationPicker, type LocationPickerSelection } from "@/features/properties/LocationPicker";
import { MobileFilterSheet } from "@/features/properties/MobileFilterSheet";
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
const GRID_PATH = "/properties";
const MAP_PATH = "/properties/map";

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

  /* Grid and Map are separate routes (/properties, /properties/map), not a
     client-side tab — a route switch is bookmarkable, shareable, and
     back-button-able on its own; a useState toggle was none of those. Both
     routes render this exact component (see each page.tsx), so which one
     is "current" is read from the URL, not held here. */
  const view: BrowseView = pathname === MAP_PATH ? "map" : "grid";
  const viewHref = (target: BrowseView) => {
    const base = target === "map" ? MAP_PATH : GRID_PATH;
    const query = searchParams.toString();
    return query ? `${base}?${query}` : base;
  };

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  // Hover previews a pin (transient); selecting a list row flies the map to
  // it and keeps it marked until another row is picked (sticky) — kept as
  // two separate pieces of state because they mean different things to
  // PropertyMap: hover is display-only, selection also drives the camera.
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const handleListSelect = (slug: string) => setSelectedSlug(slug);
  // Mobile pull-up sheet's own open/collapsed state — irrelevant on lg+,
  // where the list is a permanently visible sidebar instead.
  const [listExpanded, setListExpanded] = useState(false);

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

  const viewToggle = (
    <div className="border-ink-200 flex items-center gap-1 rounded-full border bg-white p-1">
      {(
        [
          { key: "grid", label: "Grid", icon: LayoutGrid },
          { key: "map", label: "Map", icon: MapIcon },
        ] as const
      ).map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          href={viewHref(key)}
          aria-current={view === key ? "page" : undefined}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
            view === key ? "bg-brand-600 text-white" : "text-ink-500 hover:bg-ink-50",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Link>
      ))}
    </div>
  );

  const statusFilter = (
    <FilterDropdown
      label="Status"
      icon={<Tag className="h-3.5 w-3.5" />}
      value={filters.status}
      options={STATUS_OPTIONS}
      onChange={(value) => setFilters((f) => ({ ...f, status: value }))}
    />
  );
  const locationFilter = (
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
  );
  const typeFilter = (
    <FilterDropdown
      label="Type"
      icon={<Home className="h-3.5 w-3.5" />}
      value={filters.type}
      options={typeOptions}
      onChange={(value) => setFilters((f) => ({ ...f, type: value }))}
    />
  );
  const priceFilter = (
    <FilterDropdown
      label="Price"
      icon={<DollarSign className="h-3.5 w-3.5" />}
      value={filters.price}
      options={priceOptions}
      onChange={(value) => setFilters((f) => ({ ...f, price: value }))}
    />
  );

  /* The map route's thin bar (tablet/desktop) — single-row pills, not the
     label-above-control shape the grid view's full panel uses above. See
     FilterField's own doc for why mixing the two shapes misaligns a row. */
  const statusFilterCompact = (
    <FilterDropdown
      compact
      label="Status"
      icon={<Tag className="h-3.5 w-3.5" />}
      value={filters.status}
      options={STATUS_OPTIONS}
      onChange={(value) => setFilters((f) => ({ ...f, status: value }))}
    />
  );
  const locationFilterCompact = (
    <FilterField compact label="Location" icon={<MapPin className="h-3.5 w-3.5" />}>
      <button
        type="button"
        onClick={() => setLocationPickerOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={locationPickerOpen}
        className={compactFilterTriggerClass}
      >
        <MapPin className="text-brand-500 h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{selectedLocationLabel ?? "All Locations"}</span>
        <ChevronDown className="text-ink-400 h-4 w-4 shrink-0" />
      </button>
    </FilterField>
  );
  const typeFilterCompact = (
    <FilterDropdown
      compact
      label="Type"
      icon={<Home className="h-3.5 w-3.5" />}
      value={filters.type}
      options={typeOptions}
      onChange={(value) => setFilters((f) => ({ ...f, type: value }))}
    />
  );
  const priceFilterCompact = (
    <FilterDropdown
      compact
      label="Price"
      icon={<DollarSign className="h-3.5 w-3.5" />}
      value={filters.price}
      options={priceOptions}
      onChange={(value) => setFilters((f) => ({ ...f, price: value }))}
    />
  );

  const locationPicker = (
    <LocationPicker
      open={locationPickerOpen}
      onOpenChange={setLocationPickerOpen}
      onSelect={handleLocationSelect}
      selectedId={selectedLocationNode?.id}
    />
  );

  if (view === "map") {
    return (
      <>
        {/* Thin in-map filter bar, replacing the full heading + Search
            Properties panel the grid view shows — the map is the point of
            this route, so the chrome around it stays minimal.

            Tablet/desktop (sm+): a single row of compact pills, all the
            same height as the search input beside them (see
            compactFilterTriggerClass's own doc for why the grid view's
            label-above-control shape can't just be reused here).

            Mobile (<sm): the pills collapse to one "Filters" button —
            there's no room for four dropdowns plus search on a phone
            width without wrapping into a mess — which opens
            MobileFilterSheet, an Apple Settings–style sheet: one row per
            filter, its options hidden until that row is tapped
            (progressive disclosure), so a visitor sees one decision at a
            time instead of every option for every filter competing for
            the same small screen at once. */}
        <div className="flex items-center gap-3">
          <div className="hidden flex-1 flex-wrap items-center gap-2 sm:flex">
            {statusFilterCompact}
            {locationFilterCompact}
            {typeFilterCompact}
            {priceFilterCompact}
            <div className="relative max-w-[220px] min-w-[160px] flex-1">
              <Search className="text-ink-400 absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-brand-400 h-10 w-full rounded-full border bg-white pr-3 pl-9 text-[13px] transition-colors outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="border-ink-200 text-ink-900 flex h-10 flex-1 items-center justify-center gap-2 rounded-full border bg-white px-4 text-[14px] font-semibold sm:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && <span className="bg-brand-600 h-2 w-2 rounded-full" />}
          </button>

          {viewToggle}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-ink-500 text-[13px]">
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
        </div>

        {/* One PropertyMap, always — it owns a real WebGL context, a
            geolocation request, and a MapLibre worker, so two instances
            (one per breakpoint, swapped via CSS visibility) would mean two
            of all of that running at once, and a display:none'd canvas
            that often never recovers its size once shown again. Only the
            list's presentation is responsive: a fixed sidebar on the left
            on desktop/tablet (lg+, the map's container shifts right to
            make room for it), or — on mobile — Apple Maps' own pattern, a
            pull-up sheet over a full-screen map, collapsed to a handle bar
            by default so the map (the actual reason to be on this route)
            gets the whole screen and the list stays one tap away instead
            of a permanently cramped strip above it. */}
        <div className="border-ink-100 relative mt-3 h-[calc(100vh-190px)] min-h-[420px] overflow-hidden rounded-[22px] border lg:h-[calc(100vh-230px)] lg:min-h-[520px]">
          <div className="absolute inset-0 lg:left-[380px]">
            <PropertyMap
              markers={mapMarkers}
              onMarkerClick={handleMarkerClick}
              highlightedSlug={selectedSlug ?? hoveredSlug}
              focusSlug={selectedSlug}
            />
          </div>

          {/* Desktop/tablet sidebar. z-10: MapLibre's own controls
              (attribution, zoom) are absolutely positioned inside the map
              layer too, with no explicit stacking order of their own —
              without this, the browser's default paint order can let the
              attribution control's (wider than it looks) hit area
              intercept clicks meant for whatever sits at the same
              coordinates on top of it. */}
          <div className="border-ink-100 absolute inset-y-0 left-0 z-10 hidden w-[380px] overflow-hidden border-r bg-white lg:block">
            <PropertyListPanel
              properties={filteredProperties}
              selectedSlug={selectedSlug}
              onSelect={handleListSelect}
              onHoverChange={setHoveredSlug}
            />
          </div>

          {/* Mobile pull-up sheet — same z-10 reasoning as the sidebar above. */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex flex-col rounded-t-2xl bg-white shadow-[0_-8px_30px_-12px_rgba(10,13,20,0.35)] transition-[height] duration-300 ease-out lg:hidden",
              listExpanded ? "h-[70%]" : "h-14",
            )}
          >
            <button
              type="button"
              onClick={() => setListExpanded((v) => !v)}
              aria-expanded={listExpanded}
              className="flex shrink-0 flex-col items-center gap-1.5 pt-2.5 pb-2"
            >
              <span className="bg-ink-200 h-1 w-10 rounded-full" />
              <span className="text-ink-900 flex items-center gap-1.5 text-[13px] font-semibold">
                {filteredProperties.length} propert{filteredProperties.length === 1 ? "y" : "ies"}
                <ChevronUp
                  className={cn(
                    "text-ink-400 h-3.5 w-3.5 transition-transform",
                    listExpanded && "rotate-180",
                  )}
                />
              </span>
            </button>
            <div className="min-h-0 flex-1 overflow-hidden">
              <PropertyListPanel
                properties={filteredProperties}
                selectedSlug={selectedSlug}
                onSelect={(slug) => {
                  handleListSelect(slug);
                  setListExpanded(false);
                }}
                onHoverChange={setHoveredSlug}
              />
            </div>
          </div>
        </div>

        {locationPicker}
        <MobileFilterSheet
          open={mobileFilterOpen}
          onOpenChange={setMobileFilterOpen}
          filters={filters}
          onFiltersChange={setFilters}
          statusOptions={STATUS_OPTIONS}
          typeOptions={typeOptions}
          priceOptions={priceOptions}
          locationLabel={selectedLocationLabel ?? "All Locations"}
          onLocationClick={() => setLocationPickerOpen(true)}
          resultCount={filteredProperties.length}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />
      </>
    );
  }

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
          {statusFilter}
          {locationFilter}
          {typeFilter}
          {priceFilter}
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

        {viewToggle}
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

      {locationPicker}
    </>
  );
}
