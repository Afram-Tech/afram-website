import { Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { MonthlyEstimate } from "@/features/landing/MonthlyEstimate";
import type { Property } from "@/features/landing/data/properties";
import { formatMoney, formatPropertySize, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The card is an <article>, not a <a>: the monthly breakdown's (i) trigger
 * and its "Full terms" link cannot sit inside an anchor. The title link is
 * stretched over the whole card with a ::before overlay instead, so the card
 * still clicks through everywhere the tooltip does not cover.
 */
export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col transition-transform duration-300 focus-within:z-20 hover:z-20 hover:-translate-y-1",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.25rem]">
        <Photo
          seed={property.id}
          src={property.image}
          alt={property.name}
          className="h-52 w-full transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {property.tags.map((tag) => (
          <span
            key={tag}
            className="bg-brand-50 text-brand-700 rounded-full px-2.5 py-1 text-[11px] font-medium"
          >
            {titleCase(tag)}
          </span>
        ))}
      </div>

      <h3 className="text-ink-900 group-hover:text-brand-700 mt-3 text-[18px] font-bold tracking-[-0.01em] transition-colors">
        <Link
          href={`/properties/${property.slug}`}
          className="before:absolute before:inset-0 before:content-['']"
        >
          {property.name}
        </Link>
      </h3>
      <p className="text-ink-500 mt-1 flex items-center gap-1 text-[13px]">
        <MapPin className="text-brand-500 h-3.5 w-3.5" />
        {property.location}
      </p>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-ink-400 text-[11px] font-semibold tracking-[0.1em] uppercase">From</p>
          <p className="text-ink-900 mt-1 text-[18px] font-bold">
            {formatMoney(property.price, property.currency)}
          </p>
        </div>
        <MonthlyEstimate price={property.price} currency={property.currency} />
      </div>

      <div className="border-ink-100 text-ink-500 mt-4 flex items-center gap-5 border-t pt-3 text-[13px]">
        <span className="flex items-center gap-1.5">
          <BedDouble className="text-ink-400 h-4 w-4" />
          {property.beds}
        </span>
        <span className="flex items-center gap-1.5">
          <Bath className="text-ink-400 h-4 w-4" />
          {property.baths}
        </span>
        <span className="flex items-center gap-1.5">
          <Maximize className="text-ink-400 h-4 w-4" />
          {formatPropertySize(property.sqft)}
        </span>
      </div>
    </article>
  );
}
