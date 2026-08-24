import { MapPin } from "lucide-react";
import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import type { RecommendedProperty } from "@/features/landing/affordability";
import { formatMoney } from "@/lib/format";

/** A smaller PropertyCard for tight spaces — e.g. the affordability calculator's recommendation strip. */
export function PropertyCardCompact({ property }: { property: RecommendedProperty }) {
  return (
    <Link href={`/properties/${property.slug}`} className="group block max-w-[200px]">
      <div className="overflow-hidden rounded-xl">
        <Photo
          seed={property.slug}
          src={property.image}
          alt={property.name}
          className="h-28 w-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <p className="text-ink-900 group-hover:text-brand-700 mt-2 truncate text-[13px] font-semibold transition-colors">
        {property.name}
      </p>
      <p className="text-ink-400 mt-0.5 flex items-center gap-1 truncate text-[11px]">
        <MapPin className="h-3 w-3 shrink-0" />
        {property.location}
      </p>
      <p className="text-brand-600 mt-1 text-[13px] font-bold">
        {formatMoney(property.price, property.currency)}
      </p>
    </Link>
  );
}
