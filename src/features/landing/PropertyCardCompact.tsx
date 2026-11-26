import { MapPin } from "lucide-react";
import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import type { RecommendedProperty } from "@/features/landing/affordability";
import { formatMoney } from "@/lib/format";

/**
 * Stripped-back card for tight contexts: the affordability calculator, where
 * three of these sit inside another card. Thumbnail, name, place and price.
 */
export function PropertyCardCompact({ property }: { property: RecommendedProperty }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block rounded-2xl focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Photo
          seed={property.slug}
          src={property.image}
          alt={property.name}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <h4 className="text-ink-900 mt-3 truncate text-[14px] leading-5 font-semibold">
        {property.name}
      </h4>
      <p className="text-ink-500 mt-0.5 flex items-center gap-1 truncate text-[13px] leading-[18px]">
        <MapPin className="text-ink-400 h-3.5 w-3.5 shrink-0" aria-hidden />
        {property.location}
      </p>
      <p className="tnum text-ink-900 mt-1.5 text-[14px] font-semibold">
        <span className="text-ink-400 text-[12px] font-medium">From </span>
        {formatMoney(property.price, property.currency)}
      </p>
    </Link>
  );
}
