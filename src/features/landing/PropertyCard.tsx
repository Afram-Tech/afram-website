import { Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { MonthlyEstimate } from "@/features/landing/MonthlyEstimate";
import type { Property } from "@/features/landing/data/properties";
import { bathsLabel, listingStatusLabel } from "@/features/properties/listing-display";
import { formatMoney, formatPropertySize } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Statuses worth flagging on the photo; a live listing needs no flag. */
const FLAGGED_STATUSES = new Set(["under_offer", "sold"]);

const flag =
  "inline-flex h-6 items-center gap-1 rounded-full bg-deep-950/55 px-2.5 text-[12px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] backdrop-blur-md";

/**
 * The property card, from the design system's property tile. Beds, baths and
 * area appear once, in the specs row, and the location once, under the
 * title, so the card says each thing a single time.
 *
 * The card is an <article>, not an <a>: the monthly breakdown's (i) trigger
 * and its "Full terms" link cannot sit inside an anchor. The title link is
 * stretched over the whole card with ::after instead. The card itself does
 * not clip, so the breakdown can open above it.
 */
export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  const status = property.status.toLowerCase();

  return (
    <article
      className={cn(
        "group border-ink-100 shadow-card hover:border-brand-500/30 hover:shadow-raised relative flex flex-col rounded-[20px] border bg-white transition-[box-shadow,border-color,transform] duration-200 focus-within:z-20 hover:z-20 hover:-translate-y-px",
        className,
      )}
    >
      <div className="relative mx-2 mt-2 aspect-[4/3] overflow-hidden rounded-2xl">
        <Photo
          seed={property.id}
          src={property.image}
          alt={property.name}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        {FLAGGED_STATUSES.has(status) && (
          <div className="absolute inset-x-2.5 top-2.5 flex flex-wrap gap-1.5">
            <span className={flag}>{listingStatusLabel(status)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-ink-900 text-[16px] leading-6 font-semibold tracking-[-0.005em]">
          <Link
            href={`/properties/${property.slug}`}
            className="after:absolute after:inset-0 after:rounded-[20px] after:content-[''] focus-visible:outline-none focus-visible:after:shadow-[var(--shadow-focus)]"
          >
            {property.name}
          </Link>
        </h3>
        <p className="text-ink-500 flex items-center gap-1 text-[13px] leading-[18px]">
          <MapPin className="text-ink-400 h-3.5 w-3.5 shrink-0" aria-hidden />
          {property.location}
        </p>
        <p className="text-ink-500 flex flex-wrap gap-3 text-[12px] leading-4 font-medium">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="text-ink-400 h-3.5 w-3.5" aria-hidden />
            <span className="tnum">{property.beds}</span>
            <span className="sr-only">bedrooms</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="text-ink-400 h-3.5 w-3.5" aria-hidden />
            <span className="tnum">{bathsLabel(property)}</span>
            <span className="sr-only">bathrooms</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Maximize className="text-ink-400 h-3.5 w-3.5" aria-hidden />
            <span className="tnum">{formatPropertySize(property.sqft)}</span>
          </span>
        </p>

        <div className="border-ink-100 mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <p className="tnum text-ink-900 text-[15px] leading-[22px] font-semibold tracking-[-0.01em]">
            <span className="text-ink-400 text-[12px] font-medium tracking-normal">From </span>
            {formatMoney(property.price, property.currency)}
          </p>
          <MonthlyEstimate price={property.price} currency={property.currency} />
        </div>
      </div>
    </article>
  );
}
