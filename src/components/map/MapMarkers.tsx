"use client";

import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import type { PropertyWithCoords, Landmark } from "@/lib/types";
import { useFavouritesStore } from "@/lib/store/useFavouritesStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useComparisonStore } from "@/lib/store/useComparisonStore";
import { fetchLandmarks, getCachedLandmarks } from "@/lib/services/landmarksProvider";

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
  return                         { bg: "#2563EB", border: "#1D4ED8", text: "#fff" };
}

// ── Interfaces ──────────────────────────────────────────────────────────────

interface MapMarkersProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  properties: PropertyWithCoords[];
  listingHrefPrefix?: string;
  onSearchArea?: () => void;
  onMobilePopup?: (property: PropertyWithCoords, landmarks: Landmark[]) => void;
}

const SOURCE_ID = "irealty-listings";

// ── Popup HTML builder ──────────────────────────────────────────────────────

function buildPopupHTML(
  p: PropertyWithCoords,
  liked: boolean,
  landmarks: Landmark[],
  hrefPrefix: string,
  landmarksLoading: boolean,
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

  const landmarksSkeleton = `
    <div style="margin-top:12px;padding-top:10px;border-top:1px solid #f3f4f6">
      <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Nearby</div>
      <div style="height:14px;background:#f3f4f6;border-radius:4px;margin-bottom:6px;animation:pulse 1.5s ease-in-out infinite"></div>
      <div style="height:14px;background:#f3f4f6;border-radius:4px;margin-bottom:6px;width:85%;animation:pulse 1.5s ease-in-out infinite"></div>
      <div style="height:14px;background:#f3f4f6;border-radius:4px;width:70%;animation:pulse 1.5s ease-in-out infinite"></div>
    </div>`;

  const landmarksHTML = landmarksLoading
    ? landmarksSkeleton
    : landmarks.length
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

  // Deep-link directions to Google Maps (no API cost)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

  return `
    <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>
    <div id="irealty-popup-${p.id}" style="width:290px;font-family:'Lato',sans-serif;border-radius:12px;overflow:hidden">
      <div style="position:relative">
        <img src="${p.thumbnail ?? p.image ?? ""}" alt="${p.title}"
          style="width:100%;height:150px;object-fit:cover;display:block"
          onerror="this.src='/images/property1.png'" />
        ${p.isVerified ? `<span style="position:absolute;top:8px;left:8px;background:rgba(37,99,235,.9);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px">✓ KYC Verified</span>` : ""}
        ${p.hasVirtualTour ? `<span style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.65);color:#fff;font-size:10px;padding:3px 8px;border-radius:20px">📹</span>` : ""}
        <button data-action="toggle-like" data-id="${p.id}"
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
        <div style="display:flex;gap:6px">
          <a href="${hrefPrefix}/${p.id}"
            style="flex:1;background:#2563EB;color:#fff;text-align:center;padding:8px 0;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none">
            View Details
          </a>
          <a data-action="book-tour" data-id="${p.id}"
            style="flex:1;background:#f3f4f6;color:#111827;text-align:center;cursor:pointer;padding:8px 0;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none">
            Book Tour
          </a>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer"
            style="display:flex;align-items:center;justify-content:center;width:36px;background:#f3f4f6;border-radius:8px;font-size:16px;text-decoration:none"
            title="Get directions">
            🧭
          </a>
          <a data-action="street-view" data-id="${p.id}" data-lat="${p.lat}" data-lng="${p.lng}"
            style="display:flex;align-items:center;justify-content:center;width:36px;background:#f3f4f6;border-radius:8px;font-size:14px;text-decoration:none;cursor:pointer"
            title="Street View">
            📷
          </a>
        </div>
        <div id="popup-landmarks-${p.id}">${landmarksHTML}</div>
      </div>
    </div>`;
}

// ── Main component ──────────────────────────────────────────────────────────

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

export default function MapMarkers({
  mapRef,
  properties,
  listingHrefPrefix = "/listings",
  onMobilePopup,
}: MapMarkersProps) {
  const markersRef = useRef<Map<number, { marker: mapboxgl.Marker; el: HTMLDivElement }>>(new Map());
  const popupRef  = useRef<mapboxgl.Popup | null>(null);
  const activeIdRef = useRef<number | null>(null);
  const styleLoadingRef = useRef(false);
  const clusterInitRef = useRef(false);

  const { likedIds, toggleLike } = useFavouritesStore();
  const { toggleItem: toggleCompare } = useComparisonStore();
  const {
    openClusterPanel,
    showSearchArea,
    setViewport,
    addRecentlyViewed,
    showHeatmap,
    recentlyViewed,
    openStreetView,
  } = useMapStore();

  // Persist recentlyViewed to sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("irealty-recently-viewed");
      if (stored) {
        const ids: number[] = JSON.parse(stored);
        ids.forEach((id) => addRecentlyViewed(id));
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("irealty-recently-viewed", JSON.stringify(recentlyViewed));
    } catch { /* ignore */ }
  }, [recentlyViewed]);

  // ── Marker creation ─────────────────────────────────────────────────────

  const buildMarkerEl = useCallback((p: PropertyWithCoords, isActive = false): HTMLDivElement => {
    const el = document.createElement("div");
    el.style.position = "relative";
    el.style.cursor = "pointer";

    const age = p.listedAt ? daysSince(p.listedAt) : null;
    const isNew    = age !== null && age <= 7;
    const isStale  = age !== null && age > 90;
    const liked    = likedIds.has(String(p.id));
    const isViewed = recentlyViewed.includes(p.id);
    const colors   = categoryColor(p.category);

    const bgColor     = isStale ? "#9ca3af" : colors.bg;
    const borderColor = isStale ? "#6b7280" : colors.border;
    const baseOpacity = isStale ? "0.75" : isViewed && !isActive ? "0.65" : "1";
    const scale = isActive ? "scale(1.15)" : "scale(1)";

    el.innerHTML = `
      <div style="
        position:relative;display:inline-flex;align-items:center;justify-content:center;
        padding:5px 12px;background:${bgColor};color:${colors.text};font-weight:700;
        border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,.2);
        transform:${scale};transition:transform .15s,box-shadow .15s;
        border:2px solid ${isActive ? "#fff" : borderColor};opacity:${baseOpacity};
        font-family:'Lato',sans-serif;font-size:12px;white-space:nowrap;
        ${isActive ? "background:#fff !important;color:" + colors.bg + " !important;" : ""}
      ">
        ${p.priceReduced ? "↓ " : ""}${p.priceLabel ?? p.price}
        ${isNew ? `<span style="position:absolute;top:-8px;left:-2px;background:#16A34A;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px;line-height:1.4">NEW</span>` : ""}
        ${p.hasVirtualTour ? `<span title="Virtual tour available" style="position:absolute;top:-8px;right:-2px;font-size:12px;line-height:1">📹</span>` : ""}
        ${p.isVerified ? `<span style="position:absolute;bottom:-8px;right:-2px;background:#2563EB;color:#fff;font-size:9px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">✓</span>` : ""}
        ${liked ? `<span style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);font-size:12px">❤️</span>` : ""}
        ${isViewed && !isActive ? `<span style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:10px;line-height:1" title="Viewed">👁</span>` : ""}
      </div>
    `;

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
  }, [likedIds, recentlyViewed]);

  // ── Attach popup DOM event listeners (replaces window globals) ─────────

  const attachPopupListeners = useCallback((popup: mapboxgl.Popup, _p: PropertyWithCoords) => {
    const el = popup.getElement();
    if (!el) return;

    // Use event delegation on the popup container
    el.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const actionEl = target.closest("[data-action]") as HTMLElement | null;
      if (!actionEl) return;

      const action = actionEl.dataset.action;
      const id = Number(actionEl.dataset.id);

      if (action === "toggle-like") {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(String(id));
        // Update heart icon immediately
        const btn = el.querySelector(`#popup-heart-${id}`);
        if (btn) {
          const nowLiked = !likedIds.has(String(id));
          btn.innerHTML = nowLiked ? "❤️" : "🤍";
          (btn as HTMLElement).style.background = nowLiked ? "#FEF2F2" : "#f9fafb";
          (btn as HTMLElement).style.color = nowLiked ? "#EF4444" : "#6b7280";
        }
      } else if (action === "book-tour") {
        e.preventDefault();
        window.location.href = `${listingHrefPrefix}/${id}?bookTour=1`;
      } else if (action === "street-view") {
        e.preventDefault();
        const lat = Number(actionEl.dataset.lat);
        const lng = Number(actionEl.dataset.lng);
        if (lat && lng) openStreetView(lat, lng);
      }
    });
  }, [toggleLike, likedIds, listingHrefPrefix, openStreetView]);

  // ── Open popup ────────────────────────────────────────────────────────

  const openPopup = useCallback(async (map: mapboxgl.Map, p: PropertyWithCoords) => {
    if (!p.lng || !p.lat) return;

    // Track recently viewed
    addRecentlyViewed(p.id);

    // On mobile, use bottom sheet instead of Mapbox popup
    if (isMobile() && onMobilePopup) {
      const cached = getCachedLandmarks(p.id);
      map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 13), duration: 400 });
      if (cached) {
        onMobilePopup(p, cached);
      } else {
        onMobilePopup(p, []);
        const landmarks = await fetchLandmarks(p.id, p.lng, p.lat);
        onMobilePopup(p, landmarks);
      }
      return;
    }

    // Close existing popup
    if (popupRef.current) {
      try { popupRef.current.remove(); } catch { }
      popupRef.current = null;
    }

    // Refresh previous active marker
    if (activeIdRef.current !== null) {
      const prev = markersRef.current.get(activeIdRef.current);
      if (prev) {
        const prevProp = properties.find(x => x.id === activeIdRef.current);
        if (prevProp) {
          const newEl = buildMarkerEl(prevProp, false);
          newEl.addEventListener("click", (e) => { e.stopPropagation(); openPopup(map, prevProp); });
          prev.marker.getElement().replaceWith(newEl);
          prev.el = newEl;
        }
      }
    }

    // Mark new active
    activeIdRef.current = p.id;
    const active = markersRef.current.get(p.id);
    if (active) {
      const newEl = buildMarkerEl(p, true);
      newEl.addEventListener("click", (e) => { e.stopPropagation(); openPopup(map, p); });
      active.marker.getElement().replaceWith(newEl);
      active.el = newEl;
    }

    // Check cache for landmarks first — show skeleton if not cached
    const cached = getCachedLandmarks(p.id);
    const initialHTML = buildPopupHTML(p, likedIds.has(String(p.id)), cached ?? [], listingHrefPrefix, !cached);

    const popup = new mapboxgl.Popup({ offset: 20, closeOnClick: true, maxWidth: "320px" })
      .setLngLat([p.lng, p.lat])
      .setHTML(initialHTML)
      .addTo(map);

    popupRef.current = popup;
    attachPopupListeners(popup, p);

    map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 13), duration: 400 });

    // If landmarks weren't cached, fetch and update the popup in-place
    if (!cached) {
      const landmarks = await fetchLandmarks(p.id, p.lng, p.lat);
      // Popup might have been closed while we were fetching
      if (popupRef.current === popup) {
        const landmarksContainer = popup.getElement()?.querySelector(`#popup-landmarks-${p.id}`);
        if (landmarksContainer && landmarks.length) {
          landmarksContainer.innerHTML = `
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid #f3f4f6">
              <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Nearby</div>
              ${landmarks.map((l) =>
                `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#374151;margin-bottom:4px">
                  <span>${l.icon}</span>
                  <span><b>${l.name}</b> · ${formatDistance(l.distance)} (${formatWalkTime(l.distance)})</span>
                </div>`
              ).join("")}
            </div>`;
        } else if (landmarksContainer) {
          landmarksContainer.innerHTML = "";
        }
      }
    }
  }, [buildMarkerEl, likedIds, listingHrefPrefix, properties, attachPopupListeners, addRecentlyViewed, onMobilePopup]);

  // ── Determine which property IDs are in clusters (hidden as markers) ───

  const getClusteredIds = useCallback((map: mapboxgl.Map): Set<number> => {
    const clustered = new Set<number>();
    if (!map.getSource(SOURCE_ID)) return clustered;

    try {
      const clusterFeatures = map.querySourceFeatures(SOURCE_ID, {
        filter: ["has", "point_count"],
      });
      // If there are cluster features, find which individual points are NOT rendered
      if (clusterFeatures.length > 0) {
        const unclusteredFeatures = map.querySourceFeatures(SOURCE_ID, {
          filter: ["!", ["has", "point_count"]],
        });
        const unclusteredIds = new Set(
          unclusteredFeatures
            .map((f) => f.properties?.id as number)
            .filter((id) => id !== undefined),
        );
        // All property IDs NOT in unclusteredIds are absorbed by clusters
        for (const p of properties) {
          if (typeof p.lat === "number" && typeof p.lng === "number" && !unclusteredIds.has(p.id)) {
            clustered.add(p.id);
          }
        }
      }
    } catch {
      // querySourceFeatures may fail if source not ready
    }
    return clustered;
  }, [properties]);

  // ── Add/update markers, hiding clustered ones ─────────────────────────

  const renderMarkers = useCallback((map: mapboxgl.Map) => {
    const currentIds = new Set(properties.map((p) => p.id));
    const clusteredIds = getClusteredIds(map);

    // Remove markers no longer in list
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
      const isClustered = clusteredIds.has(p.id);

      // Hide when clustered OR when heatmap is active
      const hidden = isClustered || showHeatmap;

      // Attach click + long-press handlers
      const attachHandlers = (el: HTMLDivElement) => {
        let longPressTimer: ReturnType<typeof setTimeout> | null = null;
        let isLongPress = false;

        // Ctrl+click = compare, normal click = popup
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isLongPress) { isLongPress = false; return; }
          if (e.ctrlKey || e.metaKey) {
            toggleCompare(p);
          } else {
            openPopup(map, p);
          }
        });

        // Long press (mobile) = compare
        el.addEventListener("touchstart", () => {
          isLongPress = false;
          longPressTimer = setTimeout(() => {
            isLongPress = true;
            toggleCompare(p);
          }, 500);
        }, { passive: true });
        el.addEventListener("touchend", () => {
          if (longPressTimer) clearTimeout(longPressTimer);
        });
        el.addEventListener("touchmove", () => {
          if (longPressTimer) clearTimeout(longPressTimer);
        }, { passive: true });
      };

      if (existing) {
        existing.el.style.display = hidden ? "none" : "";
        const newEl = buildMarkerEl(p, isActive);
        newEl.style.display = hidden ? "none" : "";
        attachHandlers(newEl);
        existing.marker.getElement().replaceWith(newEl);
        existing.el = newEl;
      } else {
        const el = buildMarkerEl(p, isActive);
        el.style.display = hidden ? "none" : "";
        attachHandlers(el);
        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
        markersRef.current.set(p.id, { marker, el });
      }
    });
  }, [properties, buildMarkerEl, openPopup, getClusteredIds, showHeatmap, toggleCompare]);

  // ── GeoJSON cluster source ────────────────────────────────────────────

  const addClusterLayer = useCallback((map: mapboxgl.Map) => {
    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: properties
        .filter((p) => typeof p.lng === "number" && typeof p.lat === "number")
        .map((p) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [p.lng!, p.lat!] },
          properties: { id: p.id },
        })),
    };

    // If source already exists, just update data
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
    map.on("click", "clusters", async (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!features.length) return;

      const feature = features[0];
      if (!feature.properties || !feature.geometry || feature.geometry.type !== "Point") return;

      const clusterId = feature.properties.cluster_id as number;
      if (!Number.isFinite(clusterId)) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const source = map.getSource(SOURCE_ID) as any;

      try {
        const zoom: number = await source.getClusterExpansionZoom(clusterId);

        if (zoom >= 14) {
          const leaves: GeoJSON.Feature[] = await source.getClusterLeaves(clusterId, 999, 0);
          const panelProps = leaves
            .map((f: GeoJSON.Feature) => properties.find((p) => p.id === f.properties?.id))
            .filter(Boolean) as PropertyWithCoords[];
          openClusterPanel(panelProps);
        } else {
          const coords = (feature.geometry as GeoJSON.Point).coordinates;
          const lng = coords[0];
          const lat = coords[1];
          if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
          map.easeTo({ center: [lng, lat], zoom });
        }
      } catch { /* ignore cluster errors */ }
    });

    map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });

    clusterInitRef.current = true;
  }, [properties, openClusterPanel]);

  // ── Sync marker visibility when clusters change ───────────────────────

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const syncMarkerVisibility = () => {
      if (!map.getSource(SOURCE_ID)) return;
      const clusteredIds = getClusteredIds(map);
      markersRef.current.forEach((entry, id) => {
        entry.el.style.display = (clusteredIds.has(id) || showHeatmap) ? "none" : "";
      });
      // Also hide/show cluster circle layers when heatmap is active
      try {
        if (map.getLayer("clusters")) {
          map.setLayoutProperty("clusters", "visibility", showHeatmap ? "none" : "visible");
        }
        if (map.getLayer("cluster-count")) {
          map.setLayoutProperty("cluster-count", "visibility", showHeatmap ? "none" : "visible");
        }
      } catch { /* layers may not exist yet */ }
    };

    // Re-sync after render/zoom/data changes
    map.on("render", syncMarkerVisibility);
    return () => { map.off("render", syncMarkerVisibility); };
  }, [mapRef, getClusteredIds, showHeatmap]);

  // ── Viewport tracking + search this area ──────────────────────────────

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let moveTimeout: ReturnType<typeof setTimeout> | null = null;

    const onMoveEnd = () => {
      if (moveTimeout) clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        const bounds = map.getBounds();
        if (!bounds) return;
        const zoom = map.getZoom();
        const center = map.getCenter();
        setViewport(
          [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
          zoom,
          [center.lng, center.lat],
        );
        showSearchArea();
      }, 300);
    };

    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
      if (moveTimeout) clearTimeout(moveTimeout);
    };
  }, [mapRef, showSearchArea, setViewport]);

  // ── Main effect: render markers + cluster when map/properties change ──

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const run = () => {
      if (map.isStyleLoaded()) {
        addClusterLayer(map);
      }
      renderMarkers(map);
    };

    if (map.isStyleLoaded()) run();
    else map.once("load", run);
  }, [mapRef, renderMarkers, addClusterLayer]);

  // ── Re-render after style change (fix: style switch destroys layers) ──

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onStyleLoad = () => {
      // Clear markers — they were removed when setStyle() stripped the old style
      markersRef.current.forEach(({ marker }) => { try { marker.remove(); } catch { } });
      markersRef.current.clear();
      activeIdRef.current = null;
      clusterInitRef.current = false;
      styleLoadingRef.current = false;

      // Re-add cluster source + layers and markers
      addClusterLayer(map);
      renderMarkers(map);
    };

    map.on("style.load", onStyleLoad);
    return () => { map.off("style.load", onStyleLoad); };
  }, [mapRef, renderMarkers, addClusterLayer]);

  // ── Re-render markers when liked state changes ────────────────────────

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    renderMarkers(map);
  }, [likedIds, renderMarkers, mapRef]);

  // ── Cleanup on unmount ────────────────────────────────────────────────

  useEffect(() => {
    const markers = markersRef.current;
    const popup = popupRef;
    return () => {
      markers.forEach(({ marker }) => { try { marker.remove(); } catch { } });
      markers.clear();
      if (popup.current) { try { popup.current.remove(); } catch { } popup.current = null; }
    };
  }, []);

  return null;
}
