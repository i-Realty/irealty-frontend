"use client";

import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import type { PropertyWithCoords } from "@/lib/types";
import { useFavouritesStore } from "@/lib/store/useFavouritesStore";
import { useMapStore } from "@/lib/store/useMapStore";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// ── Helpers ─────────────────────────────────────────────────────────────────

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function formatWalkTime(metres: number): string {
  const minutes = Math.round(metres / 1.4 / 60);
  return `~${minutes} min walk`;
}

function formatDistance(metres: number): string {
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1)}km`
    : `${Math.round(metres)}m`;
}

function categoryColor(cat?: string): { bg: string; border: string; text: string } {
  if (cat === "rent")     return { bg: "#16A34A", border: "#15803D", text: "#fff" };
  if (cat === "shortlet") return { bg: "#EA580C", border: "#C2410C", text: "#fff" };
  return                         { bg: "#2563EB", border: "#1D4ED8", text: "#fff" }; // sale default
}

// ── Interfaces ───────────────────────────────────────────────────────────────

interface MapMarkersProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  properties: PropertyWithCoords[];
  mapStyle?: "light" | "satellite"; // optional — no longer used by switcher
  /** href prefix for "View Details" button e.g. "/listings" or "/listings/developers" */
  listingHrefPrefix?: string;
}

interface Landmark {
  name: string;
  type: string;
  distance: number; // metres
  icon: string;
}

// ── Landmark fetcher ─────────────────────────────────────────────────────────

const POI_CATEGORIES = "school,hospital,marketplace,bank,gas_station";
const ICON_MAP: Record<string, string> = {
  school: "🏫",
  university: "🎓",
  hospital: "🏥",
  marketplace: "🛒",
  bank: "🏦",
  gas_station: "⛽",
};

async function fetchLandmarks(lng: number, lat: number): Promise<Landmark[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${POI_CATEGORIES}.json` +
    `?proximity=${lng},${lat}&limit=5&types=poi&access_token=${token}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const features: Array<{ place_name: string; geometry: { coordinates: [number, number] }; properties: { category?: string } }> = data.features ?? [];
    return features.slice(0, 3).map((f) => {
      const [fLng, fLat] = f.geometry.coordinates;
      const dx = (fLng - lng) * 111320 * Math.cos((lat * Math.PI) / 180);
      const dy = (fLat - lat) * 110540;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const rawCat = (f.properties?.category ?? "").toLowerCase();
      const icon = Object.entries(ICON_MAP).find(([k]) => rawCat.includes(k))?.[1] ?? "📍";
      return {
        name: f.place_name.split(",")[0],
        type: rawCat,
        distance: Math.round(dist),
        icon,
      };
    });
  } catch {
    return [];
  }
}

// ── Popup HTML builder ────────────────────────────────────────────────────────

function buildPopupHTML(
  p: PropertyWithCoords,
  liked: boolean,
  landmarks: Landmark[],
  hrefPrefix: string
): string {
  const days = p.listedAt ? daysSince(p.listedAt) : null;
  const listedText = days !== null
    ? days === 0 ? "Listed today" : `Listed ${days} day${days !== 1 ? "s" : ""} ago`
    : "";

  const priceHTML = p.priceReduced && p.originalPrice
    ? `<span style="text-decoration:line-through;color:#9ca3af;font-size:12px;margin-right:6px">${p.originalPrice}</span>
       <span style="color:#EF4444;font-weight:700;font-size:18px">${p.price}</span>`
    : `<span style="font-weight:700;font-size:18px;color:#111827">${p.price}</span>`;

  const verifiedBadge = p.isVerified
    ? `<span style="display:inline-flex;align-items:center;gap:4px;background:#EFF6FF;color:#2563EB;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;margin-right:6px">✓ Verified Agent</span>`
    : "";

  const vtBadge = p.hasVirtualTour
    ? `<span style="display:inline-flex;align-items:center;gap:4px;background:#F0FDF4;color:#16A34A;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px">📹 Virtual Tour</span>`
    : "";

  const landmarksHTML = landmarks.length
    ? `<div style="margin-top:12px;padding-top:10px;border-top:1px solid #f3f4f6">
        <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Nearby</div>
        ${landmarks.map((l) =>
          `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#374151;margin-bottom:4px">
            <span>${l.icon}</span>
            <span><b>${l.name}</b> · ${formatDistance(l.distance)} (${formatWalkTime(l.distance)})</span>
          </div>`
        ).join("")}
      </div>`
    : "";

  const heartStyle = liked
    ? "background:#FEF2F2;color:#EF4444"
    : "background:#f9fafb;color:#6b7280";

  return `
    <div id="irealty-popup-${p.id}" style="width:290px;font-family:'Lato',sans-serif;border-radius:12px;overflow:hidden">
      <div style="position:relative">
        <img src="${p.thumbnail ?? p.image ?? ""}" alt="${p.title}"
          style="width:100%;height:150px;object-fit:cover;display:block" />
        ${p.isVerified ? `<span style="position:absolute;top:8px;left:8px;background:rgba(37,99,235,.9);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px">✓ KYC Verified</span>` : ""}
        ${p.hasVirtualTour ? `<span style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.65);color:#fff;font-size:10px;padding:3px 8px;border-radius:20px">📹</span>` : ""}
        <button onclick="window.__irealty_toggleLike(${p.id})"
          style="position:absolute;bottom:8px;right:8px;width:32px;height:32px;border-radius:50%;border:none;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;${heartStyle}" 
          id="popup-heart-${p.id}">
          ${liked ? "❤️" : "🤍"}
        </button>
      </div>
      <div style="padding:14px 14px 12px">
        <div style="font-weight:700;font-size:14px;color:#111827;margin-bottom:2px">${p.title}</div>
        <div style="font-size:12px;color:#6b7280;margin-bottom:8px">${p.neighbourhood ?? p.location}</div>
        <div style="margin-bottom:8px">${priceHTML}</div>
        ${listedText ? `<div style="font-size:11px;color:#9ca3af;margin-bottom:8px">${listedText}</div>` : ""}
        <div style="font-size:12px;color:#374151;display:flex;gap:12px;margin-bottom:10px">
          <span>🛏 ${p.beds ?? "–"} beds</span>
          <span>🚿 ${p.baths ?? "–"} baths</span>
          ${p.sizeSqm ? `<span>📐 ${p.sizeSqm} sqm</span>` : ""}
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">
          ${verifiedBadge}${vtBadge}
        </div>
        <div style="display:flex;gap:8px">
          <a href="${hrefPrefix}/${p.id}"
            style="flex:1;background:#2563EB;color:#fff;text-align:center;padding:8px 0;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none">
            View Details
          </a>
          <button onclick="window.__irealty_bookTour?.(${p.id})"
            style="flex:1;background:#f3f4f6;color:#111827;border:none;cursor:pointer;padding:8px 0;border-radius:8px;font-size:12px;font-weight:600">
            Book Tour
          </button>
        </div>
        ${landmarksHTML}
      </div>
    </div>`;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MapMarkers({ mapRef, properties, listingHrefPrefix = "/listings" }: MapMarkersProps) {
  const markersRef = useRef<Map<number, { marker: mapboxgl.Marker; el: HTMLDivElement }>>(new Map());
  const popupRef  = useRef<mapboxgl.Popup | null>(null);
  const activeIdRef = useRef<number | null>(null);

  const { likedIds, toggleLike } = useFavouritesStore();
  const { openClusterPanel, showSearchArea, hideSearchArea } = useMapStore();

  // Expose heart-toggle to popup's inline onclick
  useEffect(() => {
    (window as Window & { __irealty_toggleLike?: (id: number) => void }).
      __irealty_toggleLike = (id: number) => {
        toggleLike(id);
        // Update popup heart icon immediately
        const btn = document.getElementById(`popup-heart-${id}`);
        if (btn) {
          const nowLiked = !likedIds.has(id); // optimistic
          btn.innerHTML = nowLiked ? "❤️" : "🤍";
          btn.style.background = nowLiked ? "#FEF2F2" : "#f9fafb";
          btn.style.color      = nowLiked ? "#EF4444" : "#6b7280";
        }
      };
    return () => {
      delete (window as Window & { __irealty_toggleLike?: (id: number) => void }).__irealty_toggleLike;
    };
  }, [toggleLike, likedIds]);

  // ── Marker creation ───────────────────────────────────────────────────────

  const buildMarkerEl = useCallback((p: PropertyWithCoords, isActive = false): HTMLDivElement => {
    const el = document.createElement("div");
    el.style.position = "relative";
    el.style.cursor = "pointer";

    const age = p.listedAt ? daysSince(p.listedAt) : null;
    const isNew    = age !== null && age <= 7;
    const isStale  = age !== null && age > 90;
    const liked    = likedIds.has(p.id);
    const colors   = categoryColor(p.category);

    // Stale marker = lower opacity grey
    const bgColor     = isStale ? "#9ca3af" : colors.bg;
    const borderColor = isStale ? "#6b7280" : colors.border;
    const opacity     = isStale ? "0.75" : "1";

    const scale = isActive ? "scale(1.15)" : "scale(1)";

    el.innerHTML = `
      <div style="
        position:relative;display:inline-flex;align-items:center;justify-content:center;
        padding:5px 12px;background:${bgColor};color:${colors.text};font-weight:700;
        border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,.2);
        transform:${scale};transition:transform .15s,box-shadow .15s;
        border:2px solid ${isActive ? "#fff" : borderColor};opacity:${opacity};
        font-family:'Lato',sans-serif;font-size:12px;white-space:nowrap;
        ${isActive ? "background:#fff !important;color:" + colors.bg + " !important;" : ""}
      ">
        ${p.priceReduced ? "↓ " : ""}${p.priceLabel ?? p.price}
        ${isNew ? `<span style="position:absolute;top:-8px;left:-2px;background:#16A34A;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px;line-height:1.4">NEW</span>` : ""}
        ${p.hasVirtualTour ? `<span title="Virtual tour available" style="position:absolute;top:-8px;right:-2px;font-size:12px;line-height:1">📹</span>` : ""}
        ${p.isVerified ? `<span style="position:absolute;bottom:-8px;right:-2px;background:#2563EB;color:#fff;font-size:9px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">✓</span>` : ""}
        ${liked ? `<span style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);font-size:12px">❤️</span>` : ""}
      </div>
    `;

    // Hover effects
    const pill = el.firstElementChild as HTMLDivElement;
    el.addEventListener("mouseenter", () => {
      pill.style.transform = isActive ? "scale(1.2)" : "scale(1.05)";
      pill.style.boxShadow = "0 4px 16px rgba(0,0,0,.3)";
    });
    el.addEventListener("mouseleave", () => {
      pill.style.transform = isActive ? "scale(1.15)" : "scale(1)";
      pill.style.boxShadow = "0 2px 8px rgba(0,0,0,.2)";
    });

    return el;
  }, [likedIds]);

  // ── Open popup ────────────────────────────────────────────────────────────

  const openPopup = useCallback(async (map: mapboxgl.Map, p: PropertyWithCoords) => {
    if (!p.lng || !p.lat) return;

    // Close existing popup
    if (popupRef.current) { try { popupRef.current.remove(); } catch { } popupRef.current = null; }

    // Refresh active marker style
    if (activeIdRef.current !== null) {
      const prev = markersRef.current.get(activeIdRef.current);
      if (prev) {
        const newEl = buildMarkerEl({ ...properties.find(x => x.id === activeIdRef.current)! }, false);
        prev.marker.getElement().replaceWith(newEl);
        // Re-attach click
        prev.el.replaceWith(newEl);
        prev.el = newEl;
      }
    }

    // Mark new active
    activeIdRef.current = p.id;
    const active = markersRef.current.get(p.id);
    if (active) {
      const newEl = buildMarkerEl(p, true);
      active.marker.getElement().replaceWith(newEl);
      active.el = newEl;
    }

    // Fetch landmarks
    const landmarks = await fetchLandmarks(p.lng, p.lat);

    const popup = new mapboxgl.Popup({ offset: 20, closeOnClick: true, maxWidth: "310px" })
      .setLngLat([p.lng, p.lat])
      .setHTML(buildPopupHTML(p, likedIds.has(p.id), landmarks, listingHrefPrefix))
      .addTo(map);

    popupRef.current = popup;
    map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 13), duration: 400 });
  }, [buildMarkerEl, likedIds, listingHrefPrefix, properties]);

  // ── Add/update markers for current property list ──────────────────────────

  const renderMarkers = useCallback((map: mapboxgl.Map) => {
    // Remove old markers that are no longer in the list
    const currentIds = new Set(properties.map((p) => p.id));
    markersRef.current.forEach((entry, id) => {
      if (!currentIds.has(id)) {
        try { entry.marker.remove(); } catch { }
        markersRef.current.delete(id);
      }
    });

    properties.forEach((p) => {
      if (typeof p.lng !== "number" || typeof p.lat !== "number") return;
      const existing = markersRef.current.get(p.id);
      const isActive = p.id === activeIdRef.current;

      if (existing) {
        // Refresh element (liked state may have changed)
        const newEl = buildMarkerEl(p, isActive);
        existing.marker.getElement().replaceWith(newEl);
        newEl.addEventListener("click", (e) => { e.stopPropagation(); openPopup(map, p); });
        existing.el = newEl;
      } else {
        const el = buildMarkerEl(p, isActive);
        el.addEventListener("click", (e) => { e.stopPropagation(); openPopup(map, p); });
        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
        markersRef.current.set(p.id, { marker, el });
      }
    });
  }, [properties, buildMarkerEl, openPopup]);

  // ── GeoJSON cluster source ────────────────────────────────────────────────

  const addClusterLayer = useCallback((map: mapboxgl.Map) => {
    const SOURCE_ID = "irealty-listings";
    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: properties
        .filter((p) => typeof p.lng === "number" && typeof p.lat === "number")
        .map((p) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [p.lng!, p.lat!] },
          properties: { id: p.id },
        })),
    };

    if (map.getSource(SOURCE_ID)) {
      (map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource).setData(geojson);
      return;
    }

    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 60,
    });

    // Cluster circle
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#2563EB", 10, "#1D4ED8", 30, "#1e40af"],
        "circle-radius": ["step", ["get", "point_count"], 22, 10, 30, 30, 40],
        "circle-opacity": 0.85,
      },
    });

    // Cluster count label
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 14,
      },
      paint: { "text-color": "#ffffff" },
    });

    // Cluster click → zoom in or open panel
    // Note: mapbox-gl v3 cluster methods are Promise-based; cast avoids stale @types mismatch
    map.on("click", "clusters", async (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!features.length) return;

      const feature = features[0];
      // Guard: geometry or properties can be null from queryRenderedFeatures
      if (!feature.properties || !feature.geometry || feature.geometry.type !== "Point") return;

      const clusterId = feature.properties.cluster_id as number;
      if (!Number.isFinite(clusterId)) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const source = map.getSource(SOURCE_ID) as any;

      try {
        const zoom: number = await source.getClusterExpansionZoom(clusterId);

        if (zoom >= 14) {
          // Already at max zoom — show side panel instead
          // Use a large finite number instead of Infinity (some Mapbox versions reject Infinity)
          const leaves: GeoJSON.Feature[] = await source.getClusterLeaves(clusterId, 999, 0);
          const panelProps = leaves
            .map((f: GeoJSON.Feature) => properties.find((p) => p.id === f.properties?.id))
            .filter(Boolean) as PropertyWithCoords[];
          openClusterPanel(panelProps);
        } else {
          const coords = (feature.geometry as GeoJSON.Point).coordinates;
          const lng = coords[0];
          const lat = coords[1];
          // Guard: prevent Invalid LngLat (NaN, NaN) error
          if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
          map.easeTo({ center: [lng, lat], zoom });
        }
      } catch { /* ignore cluster errors */ }
    });

    map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });
  }, [properties, openClusterPanel]);

  // ── Search this area ─────────────────────────────────────────────────────

  const searchAreaFiredRef = useRef(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onMoveEnd = () => {
      if (!searchAreaFiredRef.current) showSearchArea();
    };
    map.on("moveend", onMoveEnd);
    return () => { map.off("moveend", onMoveEnd); };
  }, [mapRef, showSearchArea]);

  // ── Main effect: render markers + cluster when map/properties/liked change ─

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const run = () => {
      renderMarkers(map);
      if (map.isStyleLoaded()) addClusterLayer(map);
    };

    if (map.isStyleLoaded()) run();
    else map.once("load", run);
  }, [mapRef, renderMarkers, addClusterLayer]);

  // Re-render markers when liked state changes (heart icons update)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    renderMarkers(map);
  }, [likedIds, renderMarkers, mapRef]);

  // ── Close popup on background click (handled in parent via onClick) ───────
  useEffect(() => {
    return () => {
      markersRef.current.forEach(({ marker }) => { try { marker.remove(); } catch { } });
      markersRef.current.clear();
      if (popupRef.current) { try { popupRef.current.remove(); } catch { } popupRef.current = null; }
    };
  }, []);

  return null; // All rendering is imperative via Mapbox GL JS
}
