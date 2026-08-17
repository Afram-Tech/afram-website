"use client";

import { useState } from "react";

import { PropertyCard } from "@/features/landing/PropertyCard";
import type { Property } from "@/features/landing/data/properties";

const MARQUEE_DURATION = "110s";

export function PropertyMarquee({ properties }: { properties: Property[] }) {
  const [paused, setPaused] = useState(false);
  // const track = [...properties, ...properties];

  return (
    <div
      className="relative mt-10 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-52 w-8 bg-gradient-to-r from-white to-transparent sm:w-16" />
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-52 w-8 bg-gradient-to-l from-white to-transparent sm:w-16" />

      <div
        className="marquee-track flex"
        style={{
          animationPlayState: paused ? "paused" : "running",
          animationDuration: MARQUEE_DURATION,
        }}
      >
        {properties.map((property, index) => (
          <div
            key={`${property.slug}-${index}`}
            className="mr-7 w-[290px] shrink-0 sm:w-[330px]"
            aria-hidden={index >= properties.length ? true : undefined}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
}
