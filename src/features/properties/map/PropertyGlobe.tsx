"use client";

import { useEffect, useRef } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import type { PropertyMapMarker } from "./markers";

/** Same bounds as afram-web's location-resolver (src/lib/location-resolver/
 *  index.ts GHANA_BBOX) — a touch wider than Ghana's actual extent, reused
 *  here purely as a sensible default camera frame, not a resolver input. */
const GHANA_BOUNDS = { west: -3.5, south: 4.5, east: 1.5, north: 11.5 };

/** Point colour by availability — same "available vs not" split
 *  getPropertyAvailability filters on, so a marker's colour always agrees
 *  with what filtering by Status would keep or drop. */
function markerColorFor(status: string): string {
  const unavailable = new Set(["sold", "under_offer", "delisted", "unlisted"]);
  return unavailable.has(status.toLowerCase()) ? "#9296a0" : "#007481";
}

export interface PropertyGlobeProps {
  markers: PropertyMapMarker[];
  /** Called with a marker's slug when its point is clicked — left to the
   *  caller (PropertiesBrowser) to decide what that means (navigate,
   *  select, etc.), so this component stays a plain rendering surface. */
  onMarkerClick: (slug: string) => void;
}

/**
 * A CesiumJS globe, configured to need no Cesium Ion account or access
 * token: imagery is OpenStreetMap's free tile service, terrain is the
 * default flat ellipsoid (no World Terrain), and every Ion-backed widget
 * (Geocoder, BaseLayerPicker's alternate layers) is turned off. This is a
 * deliberate, zero-cost default — swap the imagery/terrain providers here
 * if the product later wants Cesium's photorealistic tiles, which does
 * require an Ion token and its usage-based billing.
 *
 * Cesium's static runtime assets (workers, WASM, default textures) are
 * served from /cesium/ — see scripts/copy-cesium-assets.mjs, which copies
 * them out of node_modules on every install, and window.CESIUM_BASE_URL
 * below, which must be set before the `cesium` module is first imported.
 *
 * Cesium is dynamically imported inside the effect rather than at module
 * scope: it touches `window`/WebGL on load, which SSR has neither of, and
 * it's a genuinely heavy module (the whole reason this is a separate,
 * lazily-mounted component rather than something PropertiesBrowser imports
 * directly).
 *
 * No clustering: at today's listing volume (single digits to low hundreds)
 * plain points are legible. getPropertyMapMarkers' `zoom` argument exists
 * for server-side clustering once volume justifies it — see
 * backend-requirements.md §3 — and this component would gain a client-side
 * fallback then, not before.
 */
export function PropertyGlobe({ markers, onMarkerClick }: PropertyGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  // Mount once: create the viewer and the click handler. The handler reads
  // onMarkerClickRef.current at click time, so it never closes over a
  // stale onMarkerClick from the render that created it.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializingRef.current) return;
    initializingRef.current = true;

    let viewer: import("cesium").Viewer | undefined;
    let handler: import("cesium").ScreenSpaceEventHandler | undefined;
    let cancelled = false;

    async function init() {
      (window as { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = "/cesium/";
      const Cesium = await import("cesium");
      if (cancelled || !container) return;

      viewer = new Cesium.Viewer(container, {
        baseLayerPicker: false,
        baseLayer: new Cesium.ImageryLayer(
          new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" }),
        ),
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
      });
      viewerRef.current = viewer;

      viewer.camera.flyTo({
        destination: Cesium.Rectangle.fromDegrees(
          GHANA_BOUNDS.west,
          GHANA_BOUNDS.south,
          GHANA_BOUNDS.east,
          GHANA_BOUNDS.north,
        ),
        duration: 0, // instant on first load — flyTo's animation is for user-triggered moves
      });

      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction((click: import("cesium").ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer?.scene.pick(click.position);
        const slug = picked?.id?.properties?.slug?.getValue?.();
        if (typeof slug === "string") onMarkerClickRef.current(slug);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    void init();

    return () => {
      cancelled = true;
      handler?.destroy();
      viewer?.destroy();
      viewerRef.current = null;
      initializingRef.current = false;
    };
  }, []);

  // Re-sync entities whenever the marker set changes (a filter change, a
  // new page of results) — independent of the mount effect above, so
  // filtering never tears down and recreates the whole viewer.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    let cancelled = false;
    async function sync() {
      const Cesium = await import("cesium");
      if (cancelled || !viewer || viewer.isDestroyed()) return;

      viewer.entities.removeAll();
      for (const marker of markers) {
        viewer.entities.add({
          id: marker.id,
          position: Cesium.Cartesian3.fromDegrees(marker.lng, marker.lat),
          point: {
            pixelSize: 10,
            color: Cesium.Color.fromCssColorString(markerColorFor(marker.status)),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          properties: { slug: marker.slug },
        });
      }
    }

    void sync();
    return () => {
      cancelled = true;
    };
  }, [markers]);

  return <div ref={containerRef} className="h-full w-full" data-testid="property-globe" />;
}
