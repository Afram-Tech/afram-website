"use client";

import Image from "next/image";
import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * A photo that shimmers until it has loaded, then fades in. Goes inside a
 * positioned box; pass `skeleton={false}` when the box already paints its own
 * placeholder.
 */
export function FadeImage({
  className,
  skeleton = true,
  onLoad,
  alt,
  ...rest
}: ComponentProps<typeof Image> & { skeleton?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {skeleton && !loaded && (
        <span className="skel absolute inset-0" aria-hidden />
      )}
      <Image
        {...rest}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          "transition-[opacity,transform] duration-700 ease-out-soft",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
}
