"use client";

import {
  Building2,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button-variants";
import { FilterDropdown, type FilterOption } from "@/features/properties/FilterDropdown";
import type { Property } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";
import { titleCase } from "@/lib/format";

interface Filters {
  status: string;
  location: string;
  type: string;
  price: string;
}

const DEFAULT_FILTERS: Filters = { status: "all", location: "all", type: "all", price: "all" };

/** How many cards a scroll into view reveals at a time. */
const PAGE_SIZE = 3;

const PRICE_BANDS = [
  { value: "0-100000", label: "Under $100,000", min: 0, max: 100_000 },
  { value: "100000-300000", label: "$100,000 – $300,000", min: 100_000, max: 300_000 },
  { value: "300000-600000", label: "$300,000 – $600,000", min: 300_000, max: 600_000 },
  { value: "600000-", label: "Over $600,000", min: 600_000, max: Infinity },
];

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
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const statusOptions = useMemo(
    () =>
      uniqueOptions(
        properties.map((p) => p.status),
        "All Status",
      ),
    [properties],
  );
  const locationOptions = useMemo(
    () =>
      uniqueOptions(
        properties.map((p) => p.location),
        "All Locations",
      ),
    [properties],
  );
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

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();
    return properties.filter((property) => {
      if (filters.status !== "all" && property.status.toLowerCase() !== filters.status) {
        return false;
      }
      if (filters.location !== "all" && property.location.toLowerCase() !== filters.location) {
        return false;
      }
      if (filters.type !== "all" && property.type.toLowerCase() !== filters.type) {
        return false;
      }
      if (filters.price !== "all") {
        const band = PRICE_BANDS.find((b) => b.value === filters.price);
        if (band && (property.price < band.min || property.price >= band.max)) {
          return false;
        }
      }
      if (query) {
        const haystack = `${property.name} ${property.location} ${property.type}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [properties, filters, search]);

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.location !== "all" ||
    filters.type !== "all" ||
    filters.price !== "all";

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
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
    console.log("[DEBUG] effect ran", { el, hasMore });
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("[DEBUG] observer fired", entry.isIntersecting, entry.boundingClientRect);
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
            options={statusOptions}
            onChange={(value) => setFilters((f) => ({ ...f, status: value }))}
          />
          <FilterDropdown
            label="Location"
            icon={<MapPin className="h-3.5 w-3.5" />}
            value={filters.location}
            options={locationOptions}
            onChange={(value) => setFilters((f) => ({ ...f, location: value }))}
          />
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

      <div className="mt-6">
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
    </>
  );
}
