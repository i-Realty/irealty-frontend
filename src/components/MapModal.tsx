"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';
import dynamic from 'next/dynamic';

const StreetViewEmbed = dynamic(() => import('@/components/map/StreetViewEmbed'), { ssr: false });

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type Props = {
  lat?: number;
  lng?: number;
  onClose?: () => void;
};

export default function MapModal({ lat = 6.45, lng = 3.42, onClose }: Props) {
  const router = useRouter();
  useEscapeKey(() => (onClose ? onClose() : router.back()));

  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const [view, setView] = React.useState<'map' | 'streetview'>('map');

  React.useEffect(() => {
    if (view !== 'map') return;
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [lng, lat],
      zoom: 14,
      pitch: 60,
      minPitch: 45,
      bearing: 0,
      attributionControl: true,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");

    const el = document.createElement('div');
    el.className = 'w-5 h-5 bg-blue-600 rounded-full border-[3px] border-white shadow-md flex items-center justify-center';

    new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(map);

    const resizeTimer = setTimeout(() => { map.resize(); }, 100);
    const resizeObserver = new ResizeObserver(() => { map.resize(); });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      try { map.remove(); } catch { }
      mapRef.current = null;
    };
  }, [lat, lng, view]);

  const close = () => (onClose ? onClose() : router.back());

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Property location map">
      <div className="absolute inset-0 bg-black/40" aria-hidden onClick={close} />

      <div className="relative bg-white rounded-2xl w-full max-w-3xl mx-4 p-4 shadow-xl">
        <button aria-label="Close" onClick={close} className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Property Location</div>
            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setView('map')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  view === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setView('streetview')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  view === 'streetview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                Street View
              </button>
            </div>
          </div>

          <div className="w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden relative">
            {view === 'map' ? (
              <div ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
            ) : (
              <StreetViewEmbed lat={lat} lng={lng} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
