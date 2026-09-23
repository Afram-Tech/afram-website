"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { markerColorFor, type PropertyMapMarker } from "./markers";

/** Roughly centres Ghana at a zoom where the whole country is visible. */
const GHANA_CENTER: [number, number] = [-1.0232, 7.9465];
const GHANA_ZOOM = 6.3;
/** How far in the initial fly-to-you goes — neighbourhood level, where the
 *  3D building layer (zoom 14+) is already starting to kick in. */
const USER_LOCATION_ZOOM = 13.5;
/** Same bounds afram-web's location-resolver uses (GHANA_BBOX) — a touch
 *  wider than Ghana's actual extent. A visitor's browser geolocation is
 *  only used to re-centre the map when it falls inside this box: someone
 *  Browse from outside Ghana gets the country-wide default view instead of
 *  a confusing fly-to-nowhere-relevant. */
const GHANA_BOUNDS = { west: -3.5, south: 4.5, east: 1.5, north: 11.5 };

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

const BOUNDARY_SOURCE_ID = "property-boundaries";
const BOUNDARY_FILL_LAYER_ID = "property-boundaries-fill";
const BOUNDARY_LINE_LAYER_ID = "property-boundaries-line";

/** Injected once: the hover/focus affordance on a marker's photo — plain
 *  CSS on a plain DOM element, no framework needed for it. */
const MARKER_STYLE_ID = "afram-property-marker-styles";
function ensureMarkerStylesInjected() {
  if (document.getElementById(MARKER_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = MARKER_STYLE_ID;
  style.textContent = `
    .afram-map-marker { display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 0; border: none; background: transparent; }
    .afram-map-marker-photo { width: 44px; height: 44px; border-radius: 9999px; overflow: hidden; background-size: cover; background-position: center; background-color: #007481; transition: transform 0.15s ease; display: flex; align-items: center; justify-content: center; }
    .afram-map-marker:hover .afram-map-marker-photo, .afram-map-marker:focus-visible .afram-map-marker-photo, .afram-map-marker.is-highlighted .afram-map-marker-photo { transform: scale(1.15); }
    .afram-map-marker.is-highlighted { z-index: 5; }
    .afram-map-marker-tail { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; margin-top: -1px; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.25)); }
  `;
  document.head.appendChild(style);
}

/** A property's photo pin: a circular thumbnail (its first image) with a
 *  status-coloured ring and a small tail pointing at the exact coordinate,
 *  or a plain teal house glyph when the listing has no image at all. This
 *  has no direct precedent in afram-web (confirmed: no photo-badge marker
 *  exists anywhere there) — the ring/tail colour and the teal fallback are
 *  the one piece of this that is anchored to something real, the brand
 *  colour every other map surface in both apps already uses. */
function createMarkerElement(marker: PropertyMapMarker): HTMLButtonElement {
  ensureMarkerStylesInjected();
  const color = markerColorFor(marker.status);

  const el = document.createElement("button");
  el.type = "button";
  el.className = "afram-map-marker";
  el.dataset.slug = marker.slug;
  el.setAttribute("aria-label", `View ${marker.name}`);

  const photo = document.createElement("div");
  photo.className = "afram-map-marker-photo";
  photo.style.boxShadow = `0 0 0 3px white, 0 0 0 5px ${color}, 0 2px 8px rgba(0,0,0,0.35)`;
  if (marker.thumbnail) {
    photo.style.backgroundImage = `url("${marker.thumbnail}")`;
  } else {
    photo.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 11.5L12 4l8 7.5M6 10v9a1 1 0 001 1h3v-6h4v6h3a1 1 0 001-1v-9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  const tail = document.createElement("div");
  tail.className = "afram-map-marker-tail";
  tail.style.borderTop = `8px solid ${color}`;

  el.appendChild(photo);
  el.appendChild(tail);
  return el;
}

/** One FeatureCollection covering every marker that has a real boundary
 *  (3+ points — see Property.boundary's own doc); markers.ts already
 *  drops the rest to null rather than a 1-2 point sliver. */
function buildBoundaryGeoJSON(markers: PropertyMapMarker[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: markers
      .filter((m): m is PropertyMapMarker & { boundary: NonNullable<PropertyMapMarker["boundary"]> } =>
        Boolean(m.boundary),
      )
      .map((m) => ({
        type: "Feature",
        properties: { id: m.id },
        geometry: {
          type: "Polygon",
          coordinates: [[...m.boundary.map((p) => [p.lng, p.lat]), [m.boundary[0].lng, m.boundary[0].lat]]],
        },
      })),
  };
}

export interface PropertyMapProps {
  markers: PropertyMapMarker[];
  /** Called with a marker's slug when its point is clicked — left to the
   *  caller (PropertiesBrowser) to decide what that means (navigate,
   *  select, etc.), so this component stays a plain rendering surface. */
  onMarkerClick: (slug: string) => void;
  /** The slug to visually emphasise (scaled up, raised above its
   *  neighbours) — set from the property list panel's hover state, so
   *  pointing at a list row shows you where it sits on the map. */
  highlightedSlug?: string | null;
}

/**
 * A MapLibre GL map on OpenFreeMap's free vector tiles, with automatic 3D
 * building extrusion once a viewer zooms into street level. No account,
 * API key, or billing of any kind — see STYLE_URL's own comment.
 *
 * Each property renders as a photo-badge pin (createMarkerElement) plus,
 * when it has a real site boundary, the same teal/cyan polygon fill
 * afram-web's LiveMapEdit/PropertyMap draw during listing (brand colour
 * `#007481`, confirmed against that codebase rather than invented here).
 * On mount, a one-time best-effort browser geolocation re-centres the map
 * on the visitor if they're within Ghana; declining the permission prompt
 * or being elsewhere in the world just leaves the country-wide default
 * view in place.
 *
 * MapLibre is dynamically imported inside the effect rather than at module
 * scope for the same reason CesiumJS was in this component's predecessor:
 * it touches `window`/WebGL, which SSR has neither of.
 */
export function PropertyMap({ markers, onMarkerClick, highlightedSlug }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markerHandlesRef = useRef<import("maplibre-gl").Marker[]>([]);
  const hasCenteredOnUserRef = useRef(false);
  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  // Flips once the map instance exists AND its style has finished loading.
  // Both the marker-sync and geolocation effects below depend on this, not
  // just on their own trigger — mapRef.current is set asynchronously (after
  // the dynamic import resolves), so on first mount every effect fires
  // before that happens; an effect keyed only on `markers` would find
  // mapRef.current still null, bail out, and — since `markers` never
  // changes again on its own — never get a second chance to run once the
  // map actually exists.
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
      hasCenteredOnUserRef.current = false;
      setMapReady(false);
    };
  }, []);

  // One-time best-effort re-centre on the visitor, once the map exists.
  // Never blocks or delays anything else here — a slow/declined/absent
  // geolocation just leaves the default Ghana-wide view standing.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || hasCenteredOnUserRef.current) return;
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;
    hasCenteredOnUserRef.current = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const withinGhana =
          latitude >= GHANA_BOUNDS.south &&
          latitude <= GHANA_BOUNDS.north &&
          longitude >= GHANA_BOUNDS.west &&
          longitude <= GHANA_BOUNDS.east;
        if (!withinGhana || !mapRef.current) return;
        mapRef.current.flyTo({ center: [longitude, latitude], zoom: USER_LOCATION_ZOOM });
      },
      () => {
        // Denied, unavailable, or timed out — no-op, default view stands.
      },
      { maximumAge: 5 * 60 * 1000, timeout: 8000 },
    );
  }, [mapReady]);

  // Re-sync markers and boundaries whenever the set changes (a filter
  // change, a new page of results) or the map becomes ready — independent
  // of the mount effect above, so filtering never tears down and recreates
  // the whole map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    let cancelled = false;
    async function sync() {
      const { Marker } = await import("maplibre-gl");
      if (cancelled || !map) return;
      const current = map;

      const boundaryGeoJSON = buildBoundaryGeoJSON(markers);
      const existingSource = current.getSource(BOUNDARY_SOURCE_ID) as
        | import("maplibre-gl").GeoJSONSource
        | undefined;
      if (existingSource) {
        existingSource.setData(boundaryGeoJSON);
      } else {
        current.addSource(BOUNDARY_SOURCE_ID, { type: "geojson", data: boundaryGeoJSON });
        // Same brand teal/cyan afram-web's LiveMapEdit and PropertyMap use
        // for a listing's boundary — see this file's own module doc.
        current.addLayer({
          id: BOUNDARY_FILL_LAYER_ID,
          type: "fill",
          source: BOUNDARY_SOURCE_ID,
          paint: { "fill-color": "#AFE5EE", "fill-opacity": 0.35 },
        });
        current.addLayer({
          id: BOUNDARY_LINE_LAYER_ID,
          type: "line",
          source: BOUNDARY_SOURCE_ID,
          paint: { "line-color": "#007481", "line-width": 2, "line-opacity": 0.8 },
        });
      }

      for (const marker of markerHandlesRef.current) marker.remove();
      markerHandlesRef.current = markers.map((marker) => {
        const el = createMarkerElement(marker);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onMarkerClickRef.current(marker.slug);
        });

        return new Marker({ element: el, anchor: "bottom" })
          .setLngLat([marker.lng, marker.lat])
          .addTo(current);
      });
    }

    void sync();
    return () => {
      cancelled = true;
    };
  }, [markers, mapReady]);

  // Toggles the highlight class on the matching marker's DOM element
  // directly, rather than rebuilding markers — this runs on every hover in
  // the list panel, and recreating 10s of MapLibre Markers per mouse move
  // would be wasteful and janky.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = container.querySelectorAll<HTMLElement>(".afram-map-marker");
    nodes.forEach((node) => {
      node.classList.toggle("is-highlighted", Boolean(highlightedSlug) && node.dataset.slug === highlightedSlug);
    });
  }, [highlightedSlug, markers]);

  return <div ref={containerRef} className="h-full w-full" data-testid="property-map" />;
}
