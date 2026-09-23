"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { PropertyMapMarker } from "./markers";

/** Roughly centres Ghana at a zoom where the whole country is visible. */
const GHANA_CENTER: [number, number] = [-1.0232, 7.9465];
const GHANA_ZOOM = 6.3;

/**
 * OpenFreeMap's hosted "Liberty" style — free, no API key or account,
 * self-hostable if that ever matters. Its building source-layer already
 * carries real `render_height`/`render_min_height` values (OpenMapTiles
 * schema), and the style's own `building-3d` fill-extrusion layer (active
 * from zoom 14) uses them — buildings extrude in 3D automatically as a
 * viewer zooms into a neighbourhood, no custom layer authoring needed here.
 * See https://openfreemap.org.
 */
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

/** Marker colour by availability — same "available vs not" split
 *  getPropertyAvailability filters on, so a marker's colour always agrees
 *  with what filtering by Status would keep or drop. */
function markerColorFor(status: string): string {
  const unavailable = new Set(["sold", "under_offer", "delisted", "unlisted"]);
  return unavailable.has(status.toLowerCase()) ? "#9296a0" : "#007481";
}

export interface PropertyMapProps {
  markers: PropertyMapMarker[];
  /** Called with a marker's slug when its point is clicked — left to the
   *  caller (PropertiesBrowser) to decide what that means (navigate,
   *  select, etc.), so this component stays a plain rendering surface. */
  onMarkerClick: (slug: string) => void;
}

/**
 * A MapLibre GL map on OpenFreeMap's free vector tiles, with automatic 3D
 * building extrusion once a viewer zooms into street level. No account,
 * API key, or billing of any kind — see STYLE_URL's own comment.
 *
 * MapLibre is dynamically imported inside the effect rather than at module
 * scope for the same reason CesiumJS was in this component's predecessor:
 * it touches `window`/WebGL, which SSR has neither of.
 */
export function PropertyMap({ markers, onMarkerClick }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markerHandlesRef = useRef<import("maplibre-gl").Marker[]>([]);
  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  // Flips once the map instance exists AND its style has finished loading.
  // The marker-sync effect below depends on this, not just on `markers` —
  // `mapRef.current` is set asynchronously (after the dynamic import
  // resolves), so on first mount both effects fire before that happens; a
  // marker-sync effect keyed on `markers` alone would find mapRef.current
  // still null, bail out, and — since `markers` never changes again on its
  // own — never get a second chance to run once the map actually exists.
  const [mapReady, setMapReady] = useState(false);

  // Mount once: create the map.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializingRef.current) return;
    initializingRef.current = true;

    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    async function init() {
      const { Map, NavigationControl, setWorkerUrl } = await import("maplibre-gl");
      if (cancelled || !container) return;

      // Must be set before the first Map is constructed — see
      // scripts/copy-maplibre-worker.mjs for why this file has to be
      // pointed at explicitly under Next.js/Turbopack.
      setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

      const created = new Map({
        container,
        style: STYLE_URL,
        center: GHANA_CENTER,
        zoom: GHANA_ZOOM,
      });
      created.addControl(new NavigationControl({ visualizePitch: true }), "top-right");
      created.once("load", () => {
        if (!cancelled) setMapReady(true);
      });
      map = created;
      mapRef.current = created;
    }

    void init();

    return () => {
      cancelled = true;
      for (const marker of markerHandlesRef.current) marker.remove();
      markerHandlesRef.current = [];
      map?.remove();
      mapRef.current = null;
      initializingRef.current = false;
      setMapReady(false);
    };
  }, []);

  // Re-sync markers whenever the set changes (a filter change, a new page
  // of results) or the map becomes ready — independent of the mount effect
  // above, so filtering never tears down and recreates the whole map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    let cancelled = false;
    async function sync() {
      const { Marker } = await import("maplibre-gl");
      if (cancelled || !map) return;
      const current = map;

      for (const marker of markerHandlesRef.current) marker.remove();
      markerHandlesRef.current = markers.map((marker) => {
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", `View property at ${marker.city ?? marker.region ?? "this location"}`);
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
        el.style.backgroundColor = markerColorFor(marker.status);
        el.style.cursor = "pointer";
        el.style.padding = "0";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onMarkerClickRef.current(marker.slug);
        });

        return new Marker({ element: el }).setLngLat([marker.lng, marker.lat]).addTo(current);
      });
    }

    void sync();
    return () => {
      cancelled = true;
    };
  }, [markers, mapReady]);

  return <div ref={containerRef} className="h-full w-full" data-testid="property-map" />;
}
