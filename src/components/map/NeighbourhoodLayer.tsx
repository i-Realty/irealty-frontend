"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { neighbourhoodBoundaries } from "@/lib/data/neighbourhoodBoundaries";
import type { PropertyWithCoords } from "@/lib/types";

const SOURCE_ID = "irealty-neighbourhoods";
const FILL_LAYER = "irealty-neighbourhood-fill";
const LINE_LAYER = "irealty-neighbourhood-line";
const LABEL_LAYER = "irealty-neighbourhood-label";

interface NeighbourhoodLayerProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  properties?: PropertyWithCoords[];
}

function computeNeighbourhoodStats(properties: PropertyWithCoords[]) {
  const stats: Record<string, { count: number; totalPrice: number }> = {};
  for (const p of properties) {
    const hood = p.neighbourhood?.toLowerCase();
    if (!hood || !p.priceValue) continue;
    if (!stats[hood]) stats[hood] = { count: 0, totalPrice: 0 };
    stats[hood].count++;
    stats[hood].totalPrice += p.priceValue;
  }
  return stats;
}

function formatNaira(n: number): string {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
}

export default function NeighbourhoodLayer({ mapRef, properties = [] }: NeighbourhoodLayerProps) {
  const addedRef = useRef(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const addLayers = () => {
      if (map.getSource(SOURCE_ID)) return;

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: neighbourhoodBoundaries,
      });

      // Semi-transparent fill
      map.addLayer({
        id: FILL_LAYER,
        type: "fill",
        source: SOURCE_ID,
        paint: {
          "fill-color": "#2563EB",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.2,
            0.08,
          ],
        },
      });

      // Border line
      map.addLayer({
        id: LINE_LAYER,
        type: "line",
        source: SOURCE_ID,
        paint: {
          "line-color": "#2563EB",
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2.5,
            1.5,
          ],
          "line-opacity": 0.6,
          "line-dasharray": [2, 1],
        },
      });

      // Neighbourhood name labels
      map.addLayer({
        id: LABEL_LAYER,
        type: "symbol",
        source: SOURCE_ID,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-anchor": "center",
        },
        paint: {
          "text-color": "#1D4ED8",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      // Hover effect
      let hoveredId: string | number | undefined;

      map.on("mousemove", FILL_LAYER, (e) => {
        if (e.features && e.features.length > 0) {
          if (hoveredId !== undefined) {
            map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
          }
          hoveredId = e.features[0].id;
          if (hoveredId !== undefined) {
            map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: true });
          }
          map.getCanvas().style.cursor = "pointer";
        }
      });

      map.on("mouseleave", FILL_LAYER, () => {
        if (hoveredId !== undefined) {
          map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
        }
        hoveredId = undefined;
        map.getCanvas().style.cursor = "";
      });

      // Click shows tooltip with neighbourhood info + stats
      const stats = computeNeighbourhoodStats(properties);

      map.on("click", FILL_LAYER, (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0];
        const fProps = feature.properties;
        if (!fProps) return;

        if (popupRef.current) {
          popupRef.current.remove();
        }

        const hoodKey = (fProps.name as string).toLowerCase();
        const hoodStats = stats[hoodKey];
        const avgPrice = hoodStats ? formatNaira(Math.round(hoodStats.totalPrice / hoodStats.count)) : null;
        const listingCount = hoodStats?.count ?? 0;

        popupRef.current = new mapboxgl.Popup({ closeOnClick: true, maxWidth: "240px" })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="padding:12px;font-family:'Lato',sans-serif">
              <div style="font-weight:700;font-size:14px;color:#111827;margin-bottom:4px">${fProps.name}</div>
              <div style="font-size:12px;color:#6b7280;margin-bottom:6px">${fProps.lga}, ${fProps.state}</div>
              ${listingCount > 0 ? `
                <div style="display:flex;gap:12px;font-size:12px;border-top:1px solid #f3f4f6;padding-top:6px">
                  <div><span style="font-weight:700;color:#2563EB">${listingCount}</span> <span style="color:#6b7280">listings</span></div>
                  <div><span style="font-weight:700;color:#111827">${avgPrice}</span> <span style="color:#6b7280">avg price</span></div>
                </div>
              ` : `<div style="font-size:11px;color:#9ca3af">No listings in this area</div>`}
            </div>
          `)
          .addTo(map);
      });

      addedRef.current = true;
    };

    if (map.isStyleLoaded()) {
      addLayers();
    } else {
      map.once("style.load", addLayers);
    }

    return () => {
      if (!map || !addedRef.current) return;
      try {
        if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
        if (map.getLayer(LABEL_LAYER)) map.removeLayer(LABEL_LAYER);
        if (map.getLayer(LINE_LAYER)) map.removeLayer(LINE_LAYER);
        if (map.getLayer(FILL_LAYER)) map.removeLayer(FILL_LAYER);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch { /* style may have been removed */ }
      addedRef.current = false;
    };
  }, [mapRef, properties]);

  return null;
}
