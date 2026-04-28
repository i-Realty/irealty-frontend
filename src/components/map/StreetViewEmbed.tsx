"use client";

import React, { useEffect, useRef, useState } from "react";
import { getGoogleMaps } from "@/lib/services/google";

interface StreetViewEmbedProps {
  lat: number;
  lng: number;
  heading?: number;
  pitch?: number;
}

export default function StreetViewEmbed({ lat, lng, heading = 0, pitch = 10 }: StreetViewEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "available" | "unavailable">("loading");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const google = await getGoogleMaps();
      if (cancelled || !containerRef.current) return;

      if (!google) {
        setStatus("unavailable");
        return;
      }

      const sv = new google.maps.StreetViewService();
      sv.getPanorama(
        { location: { lat, lng }, radius: 100 },
        (data, svStatus) => {
          if (cancelled || !containerRef.current) return;

          if (svStatus === google.maps.StreetViewStatus.OK && data?.location?.latLng) {
            setStatus("available");
            new google.maps.StreetViewPanorama(containerRef.current!, {
              position: data.location.latLng,
              pov: { heading, pitch },
              zoom: 1,
              addressControl: false,
              showRoadLabels: true,
              motionTracking: false,
              motionTrackingControl: false,
            });
          } else {
            setStatus("unavailable");
          }
        },
      );
    }

    init();
    return () => { cancelled = true; };
  }, [lat, lng, heading, pitch]);

  if (status === "unavailable") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-4xl mb-3">🗺️</div>
        <div className="text-gray-600 font-semibold text-sm">Street View Not Available</div>
        <div className="text-gray-400 text-xs mt-1">No street-level imagery exists for this location</div>
        <a
          href={`https://www.google.com/maps/@${lat},${lng},17z`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-blue-600 text-xs underline"
        >
          View on Google Maps
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="irealty-map-skeleton w-full h-full absolute inset-0 rounded-lg" />
          <span className="relative text-gray-400 text-sm">Loading Street View...</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full rounded-lg" />
    </div>
  );
}
