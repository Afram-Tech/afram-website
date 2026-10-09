"use client";

import { LoaderCircle, LocateFixed, LocateOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  MAP_PREVIEW_CARET,
  MAP_PREVIEW_HEIGHT,
  MAP_PREVIEW_WIDTH,
  MapPreviewCard,
} from "./MapPreviewCard";
import { markerColorFor, type PropertyMapMarker } from "./markers";

/** Roughly centres Ghana at a zoom where the whole country is visible. */
const GHANA_CENTER: [number, number] = [-1.0232, 7.9465];
const GHANA_ZOOM = 6.3;
/** How far in the initial fly-to-you goes — neighbourhood level, where the
 *  3D building layer (zoom 14+) is already starting to kick in. */
const USER_LOCATION_ZOOM = 13.5;
/** How far in selecting a single property from the list panel goes — close
 *  enough to see its building/boundary clearly, past the point 3D
 *  extrusion kicks in. */
const PROPERTY_FOCUS_ZOOM = 16.5;
/** Same bounds afram-web's location-resolver uses (GHANA_BBOX) — a touch
 *  wider than Ghana's actual extent. A visitor's browser geolocation is
 *  only used to re-centre the map when it falls inside this box: someone
 *  Browse from outside Ghana gets the country-wide default view instead of
 *  a confusing fly-to-nowhere-relevant. */
const GHANA_BOUNDS = { west: -3.5, south: 4.5, east: 1.5, north: 11.5 };
/** How long the locate button's feedback message stays on the map. */
const LOCATE_NOTICE_MS = 6000;

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

/** Pin height above its coordinate (photo + ring + tail, hover-scaled) —
 *  the preview card sits this far above the point so it clears the pin. */
const PIN_HEIGHT = 64;
/** Gap between pin and card, and the card's minimum inset from map edges. */
const PREVIEW_GAP = 10;
/** Grace period for moving the pointer from a pin onto its card (or back)
 *  without the card vanishing in between. */
const PREVIEW_HIDE_DELAY_MS = 150;

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
      .filter(
        (m): m is PropertyMapMarker & { boundary: NonNullable<PropertyMapMarker["boundary"]> } =>
          Boolean(m.boundary),
      )
      .map((m) => ({
        type: "Feature",
        properties: { id: m.id },
        geometry: {
          type: "Polygon",
          coordinates: [
            [...m.boundary.map((p) => [p.lng, p.lat]), [m.boundary[0].lng, m.boundary[0].lat]],
          ],
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
   *  neighbours) — set from the property list panel's hover/selected state,
   *  so pointing at (or picking) a list row shows you where it sits on the
   *  map. */
  highlightedSlug?: string | null;
  /** The slug to fly the camera to — set when a list row is *clicked*
   *  (selection), not merely hovered, so browsing the list doesn't jerk the
   *  map around on every mouse move. A ref tracks the last slug actually
   *  flown to, so clicking the same already-selected row again is a no-op
   *  rather than re-triggering the same flight. */
  focusSlug?: string | null;
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
 * A locate control in the map's top-right stack re-centres the map on the
 * visitor when they ask for it (see runLocate) — never on mount, which is
 * what kept Safari re-prompting for location on every page load: unlike
 * Chrome, Safari scopes a geolocation grant to the current page session,
 * so an automatic request is a fresh permission prompt on every refresh.
 * The map does still locate automatically when (and only when) the
 * Permissions API confirms the grant is already in place, which is
 * precisely the case where no prompt can appear.
 *
 * MapLibre is dynamically imported inside the effect rather than at module
 * scope for the same reason CesiumJS was in this component's predecessor:
 * it touches `window`/WebGL, which SSR has neither of.
 */
export function PropertyMap({
  markers,
  onMarkerClick,
  highlightedSlug,
  focusSlug,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markerHandlesRef = useRef<import("maplibre-gl").Marker[]>([]);
  const hasAutoLocatedRef = useRef(false);
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

  // The hovered (or, on touch, tapped) pin's preview card, with the pin's
  // position in map-container pixels — re-projected on every camera move so
  // the card rides along with its pin while the map pans or zooms.
  const [preview, setPreview] = useState<{
    marker: PropertyMapMarker;
    x: number;
    y: number;
    /** The map's width then — for clamping the card inside it. */
    width: number;
  } | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The locate control's host element: MapLibre owns where it sits (the
  // top-right control stack, lined up with the zoom buttons, no pixel
  // offsets hard-coded here), while React renders the button into it via a
  // portal — which is what lets the button reflect `locateState` the way
  // any other component would.
  const [locateHost, setLocateHost] = useState<HTMLDivElement | null>(null);
  const [locateState, setLocateState] = useState<"idle" | "locating" | "blocked">("idle");
  const [locateNotice, setLocateNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = useCallback((message: string) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setLocateNotice(message);
    noticeTimerRef.current = setTimeout(() => setLocateNotice(null), LOCATE_NOTICE_MS);
  }, []);
  useEffect(
    () => () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    },
    [],
  );

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  }, []);
  const showPreview = useCallback(
    (marker: PropertyMapMarker) => {
      cancelHide();
      const map = mapRef.current;
      if (!map) return;
      const { x, y } = map.project([marker.lng, marker.lat]);
      setPreview({ marker, x, y, width: map.getContainer().clientWidth });
    },
    [cancelHide],
  );
  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimerRef.current = setTimeout(() => setPreview(null), PREVIEW_HIDE_DELAY_MS);
  }, [cancelHide]);
  useEffect(() => cancelHide, [cancelHide]);

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
      // Added before the NavigationControl so it stacks above the zoom
      // buttons in the same corner. Intentionally an empty, MapLibre-
      // classed shell: the portal below fills it with the real button.
      const locateContainer = document.createElement("div");
      locateContainer.className = "maplibregl-ctrl maplibregl-ctrl-group";
      created.addControl({
        onAdd: () => locateContainer,
        onRemove: () => locateContainer.remove(),
        getDefaultPosition: () => "top-right",
      });
      setLocateHost(locateContainer);

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
      hasAutoLocatedRef.current = false;
      setLocateHost(null);
      setMapReady(false);
    };
  }, []);

  /**
   * Fly to the visitor's own position, if they're in Ghana at all.
   * `silent` suppresses the on-map feedback below and is used only by the
   * automatic path: nobody asked for anything there, so nobody should be
   * told anything when it doesn't work out.
   */
  const runLocate = useCallback(
    ({ silent }: { silent: boolean }) => {
      if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
        if (!silent) showNotice("This browser can't share your location.");
        return;
      }
      setLocateState("locating");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocateState("idle");
          const { latitude, longitude } = position.coords;
          const withinGhana =
            latitude >= GHANA_BOUNDS.south &&
            latitude <= GHANA_BOUNDS.north &&
            longitude >= GHANA_BOUNDS.west &&
            longitude <= GHANA_BOUNDS.east;
          if (!withinGhana) {
            // Flying to, say, London would just show empty map: every
            // listing is in Ghana. Say so rather than silently doing
            // nothing to a button someone deliberately pressed.
            if (!silent) showNotice("You're outside Ghana — showing the whole country instead.");
            return;
          }
          mapRef.current?.flyTo({ center: [longitude, latitude], zoom: USER_LOCATION_ZOOM });
        },
        (error) => {
          const denied = error.code === error.PERMISSION_DENIED;
          setLocateState(denied ? "blocked" : "idle");
          if (silent) return;
          showNotice(
            denied
              ? "Location is blocked for this site — allow it in your browser settings to use this."
              : "Couldn't get your location. Try again in a moment.",
          );
        },
        { maximumAge: 5 * 60 * 1000, timeout: 8000 },
      );
    },
    [showNotice],
  );

  // Locate without being asked in the one case where that costs the
  // visitor nothing: the Permissions API reporting an existing grant, so
  // the position comes back with no prompt at all. Anything else —
  // "prompt", "denied", no Permissions API, or a browser that (like
  // Safari) won't report a session-scoped grant as granted — waits for the
  // button. A ref, not just the `mapReady` dep, keeps this to once per
  // mounted map.
  useEffect(() => {
    if (!mapReady || hasAutoLocatedRef.current) return;
    hasAutoLocatedRef.current = true;
    if (typeof navigator === "undefined" || !navigator.permissions?.query) return;

    let cancelled = false;
    void navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (!cancelled && status.state === "granted") runLocate({ silent: true });
      })
      .catch(() => {
        // Descriptor unsupported — treat as "unknown" and stay quiet.
      });
    return () => {
      cancelled = true;
    };
  }, [mapReady, runLocate]);

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
        import("maplibre-gl").GeoJSONSource | undefined;
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
        el.addEventListener("mouseenter", () => showPreview(marker));
        el.addEventListener("mouseleave", scheduleHide);
        el.addEventListener("focus", () => showPreview(marker));
        el.addEventListener("blur", scheduleHide);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          // No hover on touch screens: the first tap previews, and the
          // card itself is what opens the listing.
          if (window.matchMedia("(hover: none)").matches) {
            showPreview(marker);
            return;
          }
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
  }, [markers, mapReady, showPreview, scheduleHide]);

  // Keep the open card pinned to its marker while the camera moves, close it
  // and on a tap on bare map (touch has no mouseleave to close it otherwise).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const follow = () =>
      setPreview((current) => {
        if (!current) return current;
        const { x, y } = map.project([current.marker.lng, current.marker.lat]);
        return { ...current, x, y, width: map.getContainer().clientWidth };
      });
    const close = () => setPreview(null);
    map.on("move", follow);
    map.on("click", close);
    return () => {
      map.off("move", follow);
      map.off("click", close);
    };
  }, [mapReady]);

  // Toggles the highlight class on the matching marker's DOM element
  // directly, rather than rebuilding markers — this runs on every hover in
  // the list panel, and recreating 10s of MapLibre Markers per mouse move
  // would be wasteful and janky.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = container.querySelectorAll<HTMLElement>(".afram-map-marker");
    nodes.forEach((node) => {
      node.classList.toggle(
        "is-highlighted",
        Boolean(highlightedSlug) && node.dataset.slug === highlightedSlug,
      );
    });
  }, [highlightedSlug, markers]);

  // Flies to a specific property when it's selected in the list panel.
  // Keyed on the marker's own lat/lng (not just its slug) so this still
  // fires correctly if `markers` is swapped out for a same-slug entry with
  // different coordinates — shouldn't happen in practice, but the effect
  // should track what it's actually flying to, not just a name.
  const lastFocusedRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !focusSlug) return;
    const marker = markers.find((m) => m.slug === focusSlug);
    if (!marker) return;
    const key = `${focusSlug}:${marker.lat}:${marker.lng}`;
    if (lastFocusedRef.current === key) return;
    lastFocusedRef.current = key;
    map.flyTo({ center: [marker.lng, marker.lat], zoom: PROPERTY_FOCUS_ZOOM });
  }, [focusSlug, markers, mapReady]);

  // Above the pin by default; below it when there isn't room above. Clamped
  // horizontally so a pin near the edge doesn't push the card off the map.
  // A filter change can remove the previewed pin — then there's no card.
  const activePreview =
    preview && markers.some((m) => m.slug === preview.marker.slug) ? preview : null;
  let layout:
    { style: React.CSSProperties; placement: "above" | "below"; caretX: number } | undefined;
  if (activePreview) {
    const { x, y, width } = activePreview;
    const offsetAbove = PIN_HEIGHT + PREVIEW_GAP + MAP_PREVIEW_CARET;
    const placement =
      y - offsetAbove - MAP_PREVIEW_HEIGHT >= PREVIEW_GAP ? ("above" as const) : ("below" as const);
    const left = Math.min(
      Math.max(x - MAP_PREVIEW_WIDTH / 2, PREVIEW_GAP),
      width - MAP_PREVIEW_WIDTH - PREVIEW_GAP,
    );
    layout = {
      placement,
      // Keep the caret off the rounded corners even when the card is clamped.
      caretX: Math.min(Math.max(x - left, 24), MAP_PREVIEW_WIDTH - 24),
      style:
        placement === "above"
          ? { left, top: y - offsetAbove, transform: "translateY(-100%)" }
          : { left, top: y + PREVIEW_GAP + MAP_PREVIEW_CARET },
    };
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" data-testid="property-map" />

      {/* Inline layout styles, not Tailwind classes: maplibre-gl.css is
          imported unlayered and sets `display: block` (plus a fixed 29px
          box) on any button inside a .maplibregl-ctrl-group, and unlayered
          CSS beats Tailwind v4's layered utilities regardless of
          specificity. Colour is safe to leave to Tailwind — MapLibre sets
          none. */}
      {locateHost &&
        createPortal(
          <button
            type="button"
            onClick={() => runLocate({ silent: false })}
            disabled={locateState === "locating"}
            aria-label="Show my location"
            title={
              locateState === "blocked" ? "Location is blocked for this site" : "Show my location"
            }
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            data-testid="map-locate-button"
          >
            {locateState === "locating" ? (
              <LoaderCircle className="h-[17px] w-[17px] animate-spin text-[#007481]" aria-hidden />
            ) : locateState === "blocked" ? (
              <LocateOff className="text-ink-400 h-[17px] w-[17px]" aria-hidden />
            ) : (
              <LocateFixed className="text-ink-700 h-[17px] w-[17px]" aria-hidden />
            )}
          </button>,
          locateHost,
        )}

      {/* Top-centre so it clears both the control stack on the right and
          the mobile list sheet at the bottom. */}
      {locateNotice && (
        <div
          className="text-ink-700 pointer-events-none absolute top-3 left-1/2 z-20 max-w-[min(320px,calc(100%-96px))] -translate-x-1/2 rounded-full bg-white/95 px-3.5 py-2 text-center text-[12.5px] leading-snug font-medium shadow-[0_4px_16px_-4px_rgba(10,13,20,0.35)]"
          role="status"
          aria-live="polite"
        >
          {locateNotice}
        </div>
      )}
      {activePreview && layout && (
        <div
          className="absolute z-20"
          style={layout.style}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <MapPreviewCard
            key={activePreview.marker.slug}
            marker={activePreview.marker}
            placement={layout.placement}
            caretX={layout.caretX}
            onClose={() => setPreview(null)}
          />
        </div>
      )}
    </div>
  );
}
