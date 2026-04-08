"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type Props = {
  lat?: number;
  lng?: number;
  onClose?: () => void;
};

export default function MapModal({ lat = 6.45, lng = 3.42, onClose }: Props) {
  const router = useRouter();
  const params = useParams();
  useEscapeKey(() => (onClose ? onClose() : router.back()));
  const id = params?.id ?? '';
  
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  React.useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [lng, lat],
      zoom: 14,
      pitch: 60,
      minPitch: 45,
      bearing: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");

    // Add a custom marker
    const el = document.createElement('div');
    el.className = 'w-5 h-5 bg-blue-600 rounded-full border-[3px] border-white shadow-md flex items-center justify-center';
    
    new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(map);

    // ensure map resizes correctly when the modal opens
    // mapbox can sometimes miscalculate container size if loaded before DOM paints
    const resizeTimer = setTimeout(() => {
      map.resize();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      try { map.remove(); } catch { }
      mapRef.current = null;
    };
  }, [lat, lng]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Property location map">
      <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => (onClose ? onClose() : router.back())} />

      <div className="relative bg-white rounded-2xl w-full max-w-3xl mx-4 p-4 shadow-xl">
        <button aria-label="Close" onClick={() => (onClose ? onClose() : router.back())} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex flex-col">
          <div className="mb-3 text-sm text-gray-500 font-semibold uppercase tracking-wider">Property Location</div>
          <div className="w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden relative">
            <div ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
