"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { getGoogleMaps } from "@/lib/services/google";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export interface AddressResult {
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId?: string;
  state?: string;
  lga?: string;
  neighbourhood?: string;
}

interface AddressAutocompleteProps {
  value?: string;
  placeholder?: string;
  onSelect: (result: AddressResult) => void;
  /** Show a small map preview with draggable pin below the input */
  showMapPreview?: boolean;
  className?: string;
}

export default function AddressAutocomplete({
  value = "",
  placeholder = "Enter property address...",
  onSelect,
  showMapPreview = true,
  className = "",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  // Pin-drop map preview
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapPreviewRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Fallback suggestions using Mapbox geocoding
  const [fallbackSuggestions, setFallbackSuggestions] = useState<AddressResult[]>([]);
  const [showFallback, setShowFallback] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle result selection (from Google or Mapbox) → update pin
  const handleResult = useCallback((result: AddressResult) => {
    setInputValue(result.formattedAddress);
    setSelectedCoords({ lat: result.lat, lng: result.lng });
    onSelect(result);
  }, [onSelect]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const google = await getGoogleMaps();
      if (cancelled || !inputRef.current || !google) {
        if (!google) setGoogleAvailable(false);
        return;
      }

      setGoogleAvailable(true);

      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "ng" },
        fields: ["formatted_address", "geometry", "place_id", "address_components"],
        types: ["geocode", "establishment"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place?.geometry?.location) return;

        const comps = place.address_components ?? [];
        const findComp = (type: string) =>
          comps.find((c) => c.types.includes(type))?.long_name;

        handleResult({
          formattedAddress: place.formatted_address ?? "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id,
          state: findComp("administrative_area_level_1"),
          lga: findComp("administrative_area_level_2"),
          neighbourhood:
            findComp("neighborhood") ??
            findComp("sublocality_level_1") ??
            findComp("sublocality"),
        });
      });
    }

    init();
    return () => { cancelled = true; };
  }, [handleResult]);

  // ── Map preview with draggable pin ────────────────────────────────────

  useEffect(() => {
    if (!showMapPreview || !selectedCoords || !mapContainerRef.current) return;

    // Init map if not created
    if (!mapPreviewRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/standard",
        center: [selectedCoords.lng, selectedCoords.lat],
        zoom: 15,
        attributionControl: false,
      });
      mapPreviewRef.current = map;

      const marker = new mapboxgl.Marker({ draggable: true, color: "#2563EB" })
        .setLngLat([selectedCoords.lng, selectedCoords.lat])
        .addTo(map);
      markerRef.current = marker;

      // When user drags the pin, update coordinates and call onSelect
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setSelectedCoords({ lat: lngLat.lat, lng: lngLat.lng });
        onSelect({
          formattedAddress: inputValue,
          lat: lngLat.lat,
          lng: lngLat.lng,
        });
      });
    } else {
      // Update existing map and marker position
      mapPreviewRef.current.flyTo({ center: [selectedCoords.lng, selectedCoords.lat], zoom: 15 });
      markerRef.current?.setLngLat([selectedCoords.lng, selectedCoords.lat]);
    }
  }, [selectedCoords, showMapPreview, onSelect, inputValue]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      try { mapPreviewRef.current?.remove(); } catch { }
      mapPreviewRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // ── Mapbox fallback ───────────────────────────────────────────────────

  const fetchMapboxSuggestions = async (query: string) => {
    if (query.length < 3) { setFallbackSuggestions([]); return; }
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=ng&limit=5&types=address,poi,place&access_token=${token}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const results: AddressResult[] = (data.features ?? []).map(
        (f: { place_name: string; center: [number, number]; context?: Array<{ id: string; text: string }> }) => {
          const stateCtx = f.context?.find((c: { id: string }) => c.id.startsWith("region"));
          return { formattedAddress: f.place_name, lat: f.center[1], lng: f.center[0], state: stateCtx?.text };
        },
      );
      setFallbackSuggestions(results);
      setShowFallback(results.length > 0);
    } catch { setFallbackSuggestions([]); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (!googleAvailable) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchMapboxSuggestions(val), 300);
    }
  };

  const handleFallbackSelect = (result: AddressResult) => {
    setShowFallback(false);
    handleResult(result);
  };

  return (
    <div>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!googleAvailable && fallbackSuggestions.length > 0) setShowFallback(true);
          }}
          onBlur={() => setTimeout(() => setShowFallback(false), 200)}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm ${className}`}
          autoComplete="off"
        />

        {/* Mapbox fallback dropdown */}
        {!googleAvailable && showFallback && fallbackSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden">
            {fallbackSuggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleFallbackSelect(s)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0"
              >
                <div className="font-medium text-gray-800 truncate">{s.formattedAddress.split(",")[0]}</div>
                <div className="text-xs text-gray-500 truncate">{s.formattedAddress}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map preview with draggable pin */}
      {showMapPreview && selectedCoords && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">
            Drag the pin to fine-tune the location
          </div>
          <div
            ref={mapContainerRef}
            className="w-full h-40 rounded-lg border border-gray-200 overflow-hidden"
          />
          <div className="text-xs text-gray-400 mt-1">
            {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
}
