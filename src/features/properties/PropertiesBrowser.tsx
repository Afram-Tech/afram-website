"use client";

import {
  ArrowDownUp,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  Navigation,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";

import { LocationPicker, type LocationPickerSelection } from "@/features/properties/LocationPicker";
import { PropertyMap } from "@/features/properties/map/PropertyMap";
import { PropertyListPanel } from "@/features/properties/map/PropertyListPanel";
import { deriveMapMarkers } from "@/features/properties/map/markers";
import type { Property } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";
import { formatMoney, titleCase } from "@/lib/format";
import { getBySlug, getPath } from "@/lib/location-taxonomy";
import { countPropertiesByLocation } from "@/lib/location-match";
import { clientSearchProperties } from "@/lib/property-search";
import {
  filtersFromSearchParams,
  filtersToSearchParams,
  type PropertySearchFilters,
} from "@/lib/property-search-filters";
import { cn } from "@/lib/utils";

type BrowseView = "grid" | "map";
const GRID_PATH = "/properties";
const MAP_PATH = "/properties/map";

/**
 * Status/type/price/text stay local component state. Region/city/area live in
 * the URL (the location taxonomy's codec), so a place is bookmarkable and the
 * SEO collection pages can link straight into a filtered view.
 */
interface Filters {
  status: string;
  type: string;
  price: string;
}

const DEFAULT_FILTERS: Filters = { status: "", type: "", price: "" };

/** Three rows of three on desktop, as in the design. */
const PAGE_SIZE = 9;

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

/** In the listings' own currency: prices are compared as-is, with no
 *  conversion, so the labels must name that currency too (AFX-LST-059). */
const PRICE_BANDS = [
  { value: "0-100000", min: 0, max: 100_000 },
  { value: "100000-300000", min: 100_000, max: 300_000 },
  { value: "300000-600000", min: 300_000, max: 600_000 },
  { value: "600000-", min: 600_000, max: Infinity },
];

const DEFAULT_CURRENCY = "GHS";

/** The currency most listings are priced in. */
function listingCurrency(properties: Property[]) {
  const counts = new Map<string, number>();
  for (const { currency } of properties) {
    if (currency) counts.set(currency, (counts.get(currency) ?? 0) + 1);
  }
  return [...counts].sort(([, a], [, b]) => b - a)[0]?.[0] ?? DEFAULT_CURRENCY;
}

function priceBandLabel({ min, max }: (typeof PRICE_BANDS)[number], currency: string) {
  if (min === 0) return `Under ${formatMoney(max, currency)}`;
  if (max === Infinity) return `Over ${formatMoney(min, currency)}`;
  return `${formatMoney(min, currency)} – ${formatMoney(max, currency)}`;
}

/** What clientSearchProperties' status filter understands. */
const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "under_offer", label: "Under Offer" },
];

/** Params the codec owns, cleared before re-applying a patch. */
const CODEC_PARAM_KEYS = ["region", "city", "area"];

function uniqueTypes(values: string[]) {
  const seen = new Map<string, string>();
  for (const value of values) {
    if (!value) continue;
    const key = value.toLowerCase();
    if (!seen.has(key)) seen.set(key, titleCase(value));
  }
  return [...seen.entries()]
    .sort(([, a], [, b]) => a.localeCompare(b))
    .map(([value, label]) => ({ value, label }));
}

function listedAt(property: Property) {
  return Date.parse(property.priceHistory[0]?.date ?? property.updatedAt ?? "") || 0;
}

function Field({
  label,
  htmlFor,
  icon: Icon,
  chevron = true,
  children,
}: {
  label: string;
  htmlFor: string;
  icon: ComponentType<{ className?: string }>;
  chevron?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="text-ink-900 mb-1.5 block text-[13px] leading-[18px] font-semibold"
      >
        {label}
      </label>
      <div className="border-brand-500/10 bg-brand-50 hover:border-brand-500/30 focus-within:border-brand-500 focus-within:shadow-focus relative flex h-11 items-center rounded-xl border px-3.5 transition-[border-color,box-shadow] duration-[160ms]">
        <Icon className="text-ink-400 mr-2 h-4 w-4 shrink-0" />
        {children}
        {chevron && (
          <ChevronDown className="text-ink-400 pointer-events-none ml-1 h-4 w-4 shrink-0" />
        )}
      </div>
    </div>
  );
}

const selectCls =
  "w-full cursor-pointer appearance-none bg-transparent text-[14px] font-medium text-ink-900 focus:outline-none";

const pillCls =
  "inline-flex h-10 items-center gap-2 rounded-full border border-ink-100 bg-white px-4 shadow-secondary transition-colors hover:border-ink-200";

export function PropertiesBrowser({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* Grid and Map are sibling routes, so each is bookmarkable and
     back-button-able. Both render this component. */
  const view: BrowseView = pathname === MAP_PATH ? "map" : "grid";
  const viewHref = (target: BrowseView) => {
    const base = target === "map" ? MAP_PATH : GRID_PATH;
    const query = searchParams.toString();
    return query ? `${base}?${query}` : base;
  };

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortId>("featured");
  const [page, setPage] = useState(1);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const urlFilters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams]);
  const selectedLocationSlug = urlFilters.area ?? urlFilters.city ?? urlFilters.region;
  const selectedLocationNode = selectedLocationSlug ? getBySlug(selectedLocationSlug) : null;
  const selectedLocationLabel = selectedLocationNode
    ? "displayName" in selectedLocationNode
      ? selectedLocationNode.displayName
      : selectedLocationNode.name
    : null;

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

  const typeOptions = useMemo(() => uniqueTypes(properties.map((p) => p.type)), [properties]);
  const priceOptions = useMemo(() => {
    const currency = listingCurrency(properties);
    return PRICE_BANDS.map((band) => ({
      value: band.value,
      label: priceBandLabel(band, currency),
    }));
  }, [properties]);

  const searchFilters = useMemo<PropertySearchFilters>(() => {
    const band = filters.price ? PRICE_BANDS.find((b) => b.value === filters.price) : undefined;
    return {
      region: urlFilters.region,
      city: urlFilters.city,
      area: urlFilters.area,
      status: (filters.status || undefined) as PropertySearchFilters["status"],
      type: filters.type || undefined,
      priceMin: band ? band.min : undefined,
      priceMax: band && band.max !== Infinity ? band.max : undefined,
      q: search.trim() || undefined,
    };
  }, [urlFilters.region, urlFilters.city, urlFilters.area, filters, search]);

  const filteredProperties = useMemo(
    () =>
      clientSearchProperties(
        searchFilters,
        { offset: 0, limit: Number.MAX_SAFE_INTEGER },
        { candidateRows: properties },
      ).rows,
    [properties, searchFilters],
  );

  // Counts per place under the other active filters, location left out.
  const locationCounts = useMemo(
    () =>
      countPropertiesByLocation(
        clientSearchProperties(
          { ...searchFilters, region: undefined, city: undefined, area: undefined },
          { offset: 0, limit: Number.MAX_SAFE_INTEGER },
          { candidateRows: properties },
        ).rows,
      ),
    [properties, searchFilters],
  );

  const sorted = useMemo(() => {
    const rows = [...filteredProperties];
    if (sort === "price-asc") rows.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") rows.sort((a, b) => b.price - a.price);
    else if (sort === "newest") rows.sort((a, b) => listedAt(b) - listedAt(a));
    else rows.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    return rows;
  }, [filteredProperties, sort]);

  // Back to page 1 whenever the result set or its order changes — adjusted
  // during render so a filter change never flashes an out-of-range page.
  const [pagedFor, setPagedFor] = useState(sorted);
  if (pagedFor !== sorted) {
    setPagedFor(sorted);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageItems = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function goTo(n: number) {
    setPage(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasActiveFilters =
    Boolean(filters.status || filters.type || filters.price || search.trim()) ||
    Boolean(urlFilters.region || urlFilters.city || urlFilters.area);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    applyFilterParams({});
  };

  /* Map pins and the map's list come from the same filtered set as the grid. */
  const mapMarkers = useMemo(() => deriveMapMarkers(filteredProperties), [filteredProperties]);
  const handleMarkerClick = (slug: string) => router.push(`/properties/${slug}`);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [listExpanded, setListExpanded] = useState(false);

  const filterForm = (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="border-ink-100 shadow-card rounded-[20px] border bg-white p-4 sm:p-5"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Field label="Status" htmlFor="filter-status" icon={Tag}>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className={selectCls}
          >
            <option value="">Any status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Location" htmlFor="filter-location" icon={MapPin} chevron={false}>
          <input
            id="filter-location"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Area or property name"
            className="text-ink-900 placeholder:text-ink-400 w-full bg-transparent text-[14px] font-medium placeholder:font-normal focus:outline-none max-sm:text-base"
          />
        </Field>

        <Field label="Type" htmlFor="filter-type" icon={Home}>
          <select
            id="filter-type"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            className={selectCls}
          >
            <option value="">Any type</option>
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price" htmlFor="filter-price" icon={TrendingUp}>
          <select
            id="filter-price"
            value={filters.price}
            onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))}
            className={selectCls}
          >
            <option value="">Any price</option>
            {priceOptions.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </form>
  );

  /* Region picker and Grid/Map switch: the two live-catalogue tools the
     design's filter card has no slot for, kept beside the sort control. */
  const regionButton = (
    <button
      type="button"
      onClick={() => setLocationPickerOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={locationPickerOpen}
      className={cn(pillCls, "text-ink-800 max-w-[220px] text-[14px] font-medium")}
    >
      <Navigation className="text-ink-400 h-4 w-4 shrink-0" />
      <span className="truncate">{selectedLocationLabel ?? "All regions"}</span>
      <ChevronDown className="text-ink-400 h-4 w-4 shrink-0" />
    </button>
  );

  const viewToggle = (
    <div className="border-ink-100 shadow-secondary flex h-10 items-center gap-1 rounded-full border bg-white p-1">
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
            "flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors",
            view === key ? "btn-primary" : "text-ink-500 hover:bg-ink-50",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Link>
      ))}
    </div>
  );

  const toolbar = (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="tnum text-ink-500 text-[14px]">
        {sorted.length} {sorted.length === 1 ? "property" : "properties"} found
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-brand-600 hover:text-brand-700 ml-3 font-semibold"
          >
            Clear filters
          </button>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {regionButton}
        {view === "grid" && (
          <div className={pillCls}>
            <ArrowDownUp className="text-ink-400 h-4 w-4 shrink-0" />
            <label htmlFor="sort" className="text-ink-400 text-[13px]">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="text-ink-800 appearance-none bg-transparent text-[14px] font-medium focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="text-ink-400 pointer-events-none h-4 w-4 shrink-0" />
          </div>
        )}
        {viewToggle}
      </div>
    </div>
  );

  const locationPicker = (
    <LocationPicker
      open={locationPickerOpen}
      onOpenChange={setLocationPickerOpen}
      onSelect={handleLocationSelect}
      counts={locationCounts}
      selectedId={selectedLocationNode?.id}
    />
  );

  if (view === "map") {
    return (
      <div ref={topRef}>
        {filterForm}
        {toolbar}

        {/* One PropertyMap at every width (it owns a WebGL context). The list
            is a sidebar on lg+ and a pull-up sheet on phones. */}
        <div className="border-ink-100 relative mt-4 h-[calc(100vh-238px)] min-h-[420px] overflow-hidden rounded-[22px] border lg:h-[calc(100vh-230px)] lg:min-h-[520px]">
          <div className="absolute inset-0 lg:left-[380px]">
            <PropertyMap
              markers={mapMarkers}
              onMarkerClick={handleMarkerClick}
              highlightedSlug={selectedSlug ?? hoveredSlug}
              focusSlug={selectedSlug}
            />
          </div>

          {/* z-10 keeps MapLibre's own controls from catching clicks meant
              for the list. */}
          <div className="border-ink-100 absolute inset-y-0 left-0 z-10 hidden w-[380px] overflow-hidden border-r bg-white lg:block">
            <PropertyListPanel
              properties={filteredProperties}
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
              onHoverChange={setHoveredSlug}
            />
          </div>

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
                  setSelectedSlug(slug);
                  setListExpanded(false);
                }}
                onHoverChange={setHoveredSlug}
              />
            </div>
          </div>
        </div>

        {locationPicker}
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      {filterForm}
      {toolbar}

      {properties.length === 0 ? (
        <div className="border-ink-100 bg-ink-50 mt-8 rounded-[20px] border py-12 text-center sm:py-16">
          <Building2 className="text-ink-300 mx-auto mb-4 h-10 w-10" />
          <p className="text-ink-500 text-[15px]">
            We don&rsquo;t have any properties listed at the moment. Please check back later.
          </p>
        </div>
      ) : (
        <>
          {/* Keyed on the query, so a new set of results settles in together. */}
          <div
            key={`${filters.status}|${search}|${filters.type}|${filters.price}|${selectedLocationSlug}|${sort}|${current}`}
            className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {pageItems.map((property, i) => (
              <div
                key={property.slug}
                className="rise flex [&>article]:w-full"
                style={{ animationDelay: `${(i % 3) * 50 + Math.floor(i / 3) * 40}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {sorted.length === 0 && (
            <div className="border-ink-100 bg-ink-50 mt-8 rounded-[20px] border py-12 text-center sm:py-16">
              <p className="text-ink-500 text-[15px]">
                No properties match those filters. Try widening your search.
              </p>
            </div>
          )}

          {pageCount > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-9 flex items-center justify-center gap-2 sm:mt-14"
            >
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                disabled={current === 1}
                aria-label="Previous page"
                className="border-ink-100 text-ink-600 shadow-secondary hover:border-ink-200 hover:bg-ink-50 disabled:text-ink-300 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors disabled:pointer-events-none disabled:shadow-none"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goTo(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={
                    n === current
                      ? "btn-primary tnum shadow-primary flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[14px] font-semibold"
                      : "tnum text-ink-600 hover:bg-ink-50 hover:text-ink-900 flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[14px] font-medium transition-colors"
                  }
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goTo(current + 1)}
                disabled={current === pageCount}
                aria-label="Next page"
                className="border-ink-100 text-ink-600 shadow-secondary hover:border-ink-200 hover:bg-ink-50 disabled:text-ink-300 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors disabled:pointer-events-none disabled:shadow-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          )}
        </>
      )}

      {locationPicker}
    </div>
  );
}
