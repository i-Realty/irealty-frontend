"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { PropertyWithCoords } from "@/lib/types";

const HEATMAP_SOURCE = "irealty-heatmap";
const HEATMAP_LAYER = "irealty-heatmap-layer";

interface HeatmapLayerProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  properties: PropertyWithCoords[];
}

export default function HeatmapLayer({ mapRef, properties }: HeatmapLayerProps) {
  const addedRef = useRef(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Normalize prices to 0-1 range for heatmap weight
    const prices = properties
      .filter((p) => typeof p.lat === "number" && typeof p.lng === "number" && p.priceValue > 0)
      .map((p) => p.priceValue);
    const maxPrice = Math.max(...prices, 1);

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: properties
        .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
        .map((p) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [p.lng!, p.lat!] },
          properties: {
            weight: p.priceValue > 0 ? p.priceValue / maxPrice : 0.1,
          },
        })),
    };

    const addLayer = () => {
      if (map.getSource(HEATMAP_SOURCE)) {
        (map.getSource(HEATMAP_SOURCE) as mapboxgl.GeoJSONSource).setData(geojson);
        return;
      }

      map.addSource(HEATMAP_SOURCE, {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: HEATMAP_LAYER,
        type: "heatmap",
        source: HEATMAP_SOURCE,
        paint: {
          // Weight by price
          "heatmap-weight": ["get", "weight"],
          // Intensity increases with zoom
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 8, 0.5, 15, 2],
          // Colour ramp: green → yellow → red
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,119)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)",
          ],
          // Radius increases with zoom
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 8, 15, 15, 30],
          // Fade out at high zoom so markers show through
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0.8, 16, 0.2],
        },
      });

      addedRef.current = true;
    };

    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.once("style.load", addLayer);
    }

    return () => {
      if (!map || !addedRef.current) return;
      try {
        if (map.getLayer(HEATMAP_LAYER)) map.removeLayer(HEATMAP_LAYER);
        if (map.getSource(HEATMAP_SOURCE)) map.removeSource(HEATMAP_SOURCE);
      } catch { /* style may have been removed */ }
      addedRef.current = false;
    };
  }, [mapRef, properties]);

  return null;
}
