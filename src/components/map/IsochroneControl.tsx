"use client";

import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { useMapStore } from "@/lib/store/useMapStore";

const ISOCHRONE_SOURCE = "irealty-isochrone";
const ISOCHRONE_FILL = "irealty-isochrone-fill";
const ISOCHRONE_LINE = "irealty-isochrone-line";

interface IsochroneControlProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
}

export default function IsochroneControl({ mapRef }: IsochroneControlProps) {
  const {
    isochroneCenter,
    isochroneMinutes,
    isochroneProfile,
    setIsochroneCenter,
    setIsochroneMinutes,
    setIsochroneProfile,
    setIsochronePolygon,
  } = useMapStore();

  const addedRef = useRef(false);
  const [loading, setLoading] = React.useState(false);

  // ── Fetch isochrone polygon from Mapbox ────────────────────────────────

  const fetchIsochrone = useCallback(async () => {
    if (!isochroneCenter) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
    const [lng, lat] = isochroneCenter;
    const profile = isochroneProfile === "walking" ? "walking" : isochroneProfile === "cycling" ? "cycling" : "driving";
    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${lng},${lat}?contours_minutes=${isochroneMinutes}&polygons=true&access_token=${token}`;

    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      const feature = data.features?.[0] ?? null;
      setIsochronePolygon(feature);
      renderPolygon(feature);
    } catch {
      setIsochronePolygon(null);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isochroneCenter, isochroneMinutes, isochroneProfile, setIsochronePolygon]);

  // ── Render polygon on map ─────────────────────────────────────────────

  const renderPolygon = useCallback((feature: GeoJSON.Feature | null) => {
    const map = mapRef.current;
    if (!map) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: feature ? [feature] : [],
    };

    if (map.getSource(ISOCHRONE_SOURCE)) {
      (map.getSource(ISOCHRONE_SOURCE) as mapboxgl.GeoJSONSource).setData(geojson);
      return;
    }

    map.addSource(ISOCHRONE_SOURCE, {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: ISOCHRONE_FILL,
      type: "fill",
      source: ISOCHRONE_SOURCE,
      paint: {
        "fill-color": "#2563EB",
        "fill-opacity": 0.15,
      },
    });

    map.addLayer({
      id: ISOCHRONE_LINE,
      type: "line",
      source: ISOCHRONE_SOURCE,
      paint: {
        "line-color": "#2563EB",
        "line-width": 2,
        "line-opacity": 0.7,
      },
    });

    addedRef.current = true;
  }, [mapRef]);

  // ── Map click handler to set center ───────────────────────────────────

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onClick = (e: mapboxgl.MapMouseEvent) => {
      setIsochroneCenter([e.lngLat.lng, e.lngLat.lat]);
    };

    // Only capture clicks when isochrone mode is active and no center set
    if (!isochroneCenter) {
      map.getCanvas().style.cursor = "crosshair";
      map.on("click", onClick);
    }

    return () => {
      map.off("click", onClick);
      if (map.getCanvas()) {
        map.getCanvas().style.cursor = "";
      }
    };
  }, [mapRef, isochroneCenter, setIsochroneCenter]);

  // ── Fetch when center/params change ───────────────────────────────────

  useEffect(() => {
    if (isochroneCenter) {
      fetchIsochrone();
    }
  }, [isochroneCenter, isochroneMinutes, isochroneProfile, fetchIsochrone]);

  // ── Cleanup ───────────────────────────────────────────────────────────

  useEffect(() => {
    const mapInstance = mapRef.current;
    return () => {
      if (!mapInstance || !addedRef.current) return;
      try {
        if (mapInstance.getLayer(ISOCHRONE_LINE)) mapInstance.removeLayer(ISOCHRONE_LINE);
        if (mapInstance.getLayer(ISOCHRONE_FILL)) mapInstance.removeLayer(ISOCHRONE_FILL);
        if (mapInstance.getSource(ISOCHRONE_SOURCE)) mapInstance.removeSource(ISOCHRONE_SOURCE);
      } catch { /* ignore */ }
      addedRef.current = false;
      setIsochronePolygon(null);
      setIsochroneCenter(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute bottom-12 left-3 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3"
      style={{ width: 240, pointerEvents: "all" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-xs font-semibold text-gray-700 mb-2">Commute Time Search</div>

      {!isochroneCenter ? (
        <div className="text-xs text-gray-500">Click on the map to set an origin point</div>
      ) : (
        <>
          {/* Profile selector */}
          <div className="flex gap-1 mb-2">
            {(["driving", "walking", "cycling"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setIsochroneProfile(p)}
                className={`flex-1 px-2 py-1 text-xs rounded font-medium ${
                  isochroneProfile === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p === "driving" ? "🚗" : p === "walking" ? "🚶" : "🚲"} {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Time slider */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Time</span>
              <span className="font-semibold text-gray-700">{isochroneMinutes} min</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={isochroneMinutes}
              onChange={(e) => setIsochroneMinutes(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {loading && <div className="text-xs text-blue-600">Calculating area...</div>}

          {/* Reset button */}
          <button
            onClick={() => {
              setIsochroneCenter(null);
              setIsochronePolygon(null);
              const map = mapRef.current;
              if (map?.getSource(ISOCHRONE_SOURCE)) {
                (map.getSource(ISOCHRONE_SOURCE) as mapboxgl.GeoJSONSource).setData({
                  type: "FeatureCollection",
                  features: [],
                });
              }
            }}
            className="w-full mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
}
