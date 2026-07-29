import { Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { formatPropertyPrice, type Property } from "@/features/landing/data/properties";
import { formatPropertySize } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className={cn(
        "group flex flex-col transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.25rem]">
        <Photo
          seed={property.seed}
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
            {tag}
          </span>
        ))}
      </div>

      <h3 className="text-ink-900 group-hover:text-brand-700 mt-3 text-[18px] font-bold tracking-[-0.01em] transition-colors">
        {property.name}
      </h3>
      <p className="text-ink-500 mt-1 flex items-center gap-1 text-[13px]">
        <MapPin className="text-brand-500 h-3.5 w-3.5" />
        {property.location}
      </p>
      <p className="text-brand-500 mt-2 text-[18px] font-bold">{formatPropertyPrice(property)}</p>

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
    </Link>
  );
}
