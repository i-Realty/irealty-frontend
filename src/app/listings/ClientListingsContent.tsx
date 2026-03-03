"use client";

import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { getFavorites, toggleFavorite as toggleFavLocal } from '@/lib/favorites';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from "@/components/Footer";

type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  tag?: "For Rent" | "For Sale";
  image?: string;
  agent?: string;
};

type PropertyWithCoords = Property & { lat?: number; lng?: number };

const sampleProperties: PropertyWithCoords[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: "Residential Plot - GRA Enugu",
  location: "Independence Layout, Enugu",
  price: "₦ 20,000,000.00",
  beds: 3,
  baths: 2,
  area: "120 sqm",
  tag: i % 2 === 0 ? "For Rent" : "For Sale",
  image: i % 2 === 0 ?  "/images/property1.png" : "/images/property2.png",
  agent: "Sarah Homes",
  // sample coords (spread around a center)
  lat: 6.500 + i * 0.02,
  lng: 7.400 + (i % 3) * 0.03,
}));

export default function ClientListingsContent() {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  // allow multiple open sections
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all");
  const [page, setPage] = useState(1);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<Set<string>>(new Set());
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());

  // on mount, check query param to prepopulate property type filter
  useEffect(() => {
    try {
      const param = searchParams?.get?.('propertyType');
      if (param) {
        setSelectedPropertyTypes(new Set([param]));
        setOpenSections((s) => {
          const next = new Set(s);
          next.add('type');
          return next;
        });
      }
    } catch (e) {
      // ignore if searchParams not available in this environment
    }
  }, [searchParams]);

  // also read 'purpose' and 'q' (query) to set activeTab and search query
  useEffect(() => {
    try {
      const purpose = searchParams?.get?.('purpose');
      if (purpose) {
        if (purpose === 'sale') setActiveTab('sale');
        else if (purpose === 'rent') setActiveTab('rent');
        else setActiveTab('all');
      }
      const q = searchParams?.get?.('q');
      if (q) setQuery(q);
    } catch (e) {
      // ignore
    }
  }, [searchParams]);

  // price range state
  const PRICE_MIN = 0;
  const PRICE_MAX = 100_000_000; // 100 million
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX);

  const formatCurrency = (v: number) => {
    try {
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(v);
    } catch (e) {
      return `₦${v.toLocaleString()}`;
    }
  };

  // default amenities (when no property type is selected)
  const defaultAmenities = [
    'Parking Space',
    'Security / Gated Estate',
    '24/7 Electricity',
    'Water Supply',
    'Internet / WiFi Ready',
    'CCTV Surveillance',
    'Gym / Fitness Center',
    'Swimming Pool',
    'Lift / Elevator',
    'Backup Generator / Solar Power',
  ];

  // amenities mapping per property type
  const amenitiesByType: Record<string, string[]> = {
    Residential: [
      'Furnished',
      'Air Conditioning',
      'Balcony / Terrace',
      'Garden / Green Area',
      'Pet-Friendly',
      'laundary Area',
      'Storage Room',
      'Ensuite Bathroom',
      'Walk-in Closet',
      'Smart Home Features',
    ],
    Commercial: [
      'Conference / Meeting Rooms',
      'Reception Area',
      'High-Speed Internet Infrastructure',
      'Parking Lot (Commercial Scale)',
      'Fire Safety System',
      'Wheelchair Accessibility',
      'Warehouse / Storage Facilities',
    ],
    'Plots/Land': [
      'Good Road Access',
      'C of O',
      'Fenced & Gated',
      'Water Access (Borehole / River)',
      'Electricity Access (Poles Nearby)',
      'Government Approved Survey',
      'Dry Land (Non-Swampy)',
      'Secure Neighborhood',
    ],
    'Service Apartments & Short Lets': [
      'Housekeeping Service',
      'Fully Equipped Kitchen',
      'Concierge Service',
      'In-house Restaurant / Dining',
      'Entertainment System',
      'Workspace / Study Desk',
      'Daily Cleaning Service',
      '24hr Front Desk / Reception',
    ],
    'PG/Hostel': [
      'WiFi / Internet Access',
      'Shared Kitchen Access',
      'Laundry Facilities',
      'Furnished Rooms',
      '24/7 Electricity / Generator',
      'Water Supply',
      'Study/Reading Area',
      'Security / Gated Compound',
      'Parking (if available)',
    ],
  };

  // compute displayed amenities: default if no type selected, otherwise union of selected types
  const displayedAmenities = React.useMemo(() => {
    if (selectedPropertyTypes.size === 0) return defaultAmenities;
    const union = new Set<string>();
    selectedPropertyTypes.forEach((type) => {
      const list = amenitiesByType[type];
      if (list) list.forEach((a) => union.add(a));
    });
    return Array.from(union);
  }, [selectedPropertyTypes]);

  // prune selected amenities when displayed amenities change
  useEffect(() => {
    setSelectedAmenities((prev) => {
      const next = new Set<string>();
      displayedAmenities.forEach((a) => {
        if (prev.has(a)) next.add(a);
      });
      return next;
    });
  }, [displayedAmenities]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key);
      else s.add(key);
      return s;
    });
  };

  return (
    <>
      <div className="flex gap-6">
        {/* Sidebar Filters (hidden on small screens) */}
        <aside className={`hidden lg:block w-72 shrink-0`}>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Filters</h3>
              <button className="text-sm text-blue-600">Reset Filters</button>
            </div>

            {/* Price Range (mock) */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium">Price Range</span>
                <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("price") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-4">
            <div className="relative">
              <img src="/icons/locationIcon.svg" alt="loc" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search By Location"
                className="w-full border rounded-xl pl-14 pr-4 py-3 text-sm"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                <div className="flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <button onClick={() => setActiveTab('all')} className={`w-full sm:w-auto px-4 py-2 rounded text-center ${activeTab==='all' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>All</button>
                  <button onClick={() => setActiveTab('sale')} className={`w-full sm:w-auto px-4 py-2 rounded text-center ${activeTab==='sale' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>For Sale</button>
                  <button onClick={() => setActiveTab('rent')} className={`w-full sm:w-auto px-4 py-2 rounded text-center ${activeTab==='rent' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>For Rent</button>
                </div>
              </div>

              <div className="hidden lg:block flex items-center gap-2 text-sm text-gray-700">
                <button className="flex items-center gap-2">
                  <span>View On Map</span>
                  <img src={'/icons/maptoggle-off.svg'} alt="map" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Showing 247 properties in Enugu</div>
            <div className="text-sm text-gray-500">Page {page} of 30</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProperties.map((p) => (
              <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#F1F1F1] relative">
                <div className="relative" style={{ height: 200 }}>
                  <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute left-4 top-4 text-xs font-bold px-3 py-1 rounded-full ${p.tag && p.tag.toLowerCase().includes('sale') ? 'bg-[#2563EB] text-white' : 'bg-white text-[#2563EB]'}`}>{p.tag}</div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-sm">{p.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{p.location}</div>
                  <div className="font-bold text-lg">{p.price}</div>
                  <div className="text-xs text-gray-500 mt-2">{p.beds} beds • {p.baths} baths • {p.area}</div>
                </div>
                <Link href={`/listings/${p.id}`} className="absolute inset-0 z-10" aria-label={`View property ${p.id}`} />
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  );
}
"use client";

import Navbar from "@/components/Navbar";
import React, { useState, useEffect, useRef } from "react";
import { getFavorites, toggleFavorite as toggleFavLocal } from '@/lib/favorites';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from "@/components/Footer";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  tag?: "For Rent" | "For Sale";
  image?: string;
  agent?: string;
};

type PropertyWithCoords = Property & { lat?: number; lng?: number };

const sampleProperties: PropertyWithCoords[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: "Residential Plot - GRA Enugu",
  location: "Independence Layout, Enugu",
  price: "₦ 20,000,000.00",
  beds: 3,
  baths: 2,
  area: "120 sqm",
  tag: i % 2 === 0 ? "For Rent" : "For Sale",
  image: i % 2 === 0 ?  "/images/property1.png" : "/images/property2.png",
  agent: "Sarah Homes",
  // sample coords (spread around a center)
  lat: 6.500 + i * 0.02,
  lng: 7.400 + (i % 3) * 0.03,
}));

  // amenities mapping per property type
  const amenitiesByType: Record<string, string[]> = {
    Residential: [
      'Furnished',
      'Air Conditioning',
      'Balcony / Terrace',
      'Garden / Green Area',
      'Pet-Friendly',
      'laundary Area',
      'Storage Room',
      'Ensuite Bathroom',
      'Walk-in Closet',
      'Smart Home Features',
    ],
    Commercial: [
      'Conference / Meeting Rooms',
      'Reception Area',
      'High-Speed Internet Infrastructure',
      'Parking Lot (Commercial Scale)',
      'Fire Safety System',
      'Wheelchair Accessibility',
      'Warehouse / Storage Facilities',
    ],
    'Plots/Land': [
      'Good Road Access',
      'C of O',
      'Fenced & Gated',
      'Water Access (Borehole / River)',
      'Electricity Access (Poles Nearby)',
      'Government Approved Survey',
      'Dry Land (Non-Swampy)',
      'Secure Neighborhood',
    ],
    'Service Apartments & Short Lets': [
      'Housekeeping Service',
      'Fully Equipped Kitchen',
      'Concierge Service',
      'In-house Restaurant / Dining',
      'Entertainment System',
      'Workspace / Study Desk',
      'Daily Cleaning Service',
      '24hr Front Desk / Reception',
    ],
    'PG/Hostel': [
      'WiFi / Internet Access',
      'Shared Kitchen Access',
      'Laundry Facilities',
      'Furnished Rooms',
      '24/7 Electricity / Generator',
      'Water Supply',
      'Study/Reading Area',
      'Security / Gated Compound',
      'Parking (if available)',
    ],
  };

  // compute displayed amenities: default if no type selected, otherwise union of selected types
  const displayedAmenities = React.useMemo(() => {
    if (selectedPropertyTypes.size === 0) return defaultAmenities;
    const union = new Set<string>();
    selectedPropertyTypes.forEach((type) => {
      const list = amenitiesByType[type];
      if (list) list.forEach((a) => union.add(a));
    });
    return Array.from(union);
  }, [selectedPropertyTypes]);

  // prune selected amenities when displayed amenities change
  useEffect(() => {
    setSelectedAmenities((prev) => {
      const next = new Set<string>();
      displayedAmenities.forEach((a) => {
        if (prev.has(a)) next.add(a);
      });
      return next;
    });
  }, [displayedAmenities]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key);
      else s.add(key);
      return s;
    });
  };

  // small CSS overrides for range thumb styling
  const rangeThumbStyle = `
    /* track invisible - we render our own */
    input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
    input[type=range]::-webkit-slider-runnable-track { height: 8px; background: transparent; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height:18px; margin-top: -6px; border-radius: 9999px; background: #2563EB; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    input[type=range]::-moz-range-track { height: 8px; background: transparent; }
    input[type=range]::-moz-range-thumb { width: 18px; height:18px; border-radius: 9999px; background: #2563EB; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    input[type=range]:focus { outline: none; }
  `;

  // marker styles for MapLibre bubbles
  const mapMarkerStyle = `
    .map-marker-bubble { display:inline-flex; align-items:center; justify-content:center; padding:8px 12px; background:#D35400; color:white; font-weight:700; border-radius:20px; box-shadow: 0 6px 14px rgba(0,0,0,0.18); transform: translateY(-6px); cursor: pointer; }
    .map-marker-bubble:after { content: ''; width:12px; height:12px; background:#D35400; position: absolute; transform: rotate(45deg); margin-top:18px; margin-left:0; box-shadow: 0 6px 14px rgba(0,0,0,0.12); }
    .map-marker-label { font-size:12px; line-height:1; }
    .mapboxgl-ctrl-bottom-right { right: 8px; bottom: 8px; }
  `;

  const formatShortPrice = (priceStr: string) => {
    if (!priceStr) return '';
    // extract digits
    const digits = Number((priceStr + '').replace(/[^0-9.-]/g, ''));
    if (!isFinite(digits)) return priceStr;
    if (Math.abs(digits) >= 1_000_000) return `₦${Math.round(digits / 1_000_000)}M`;
    if (Math.abs(digits) >= 1_000) return `₦${Math.round(digits / 1_000)}K`;
    return `₦${digits.toLocaleString()}`;
  };

  // which thumb is currently active ("min" | "max" | null)
  const [activeThumb, setActiveThumb] = React.useState<"min" | "max" | null>(null);
  const [mapMode, setMapMode] = useState(false);
  // persist map mode in localStorage so it stays toggled across sessions
  useEffect(() => {
    try {
      const raw = localStorage.getItem('listings_mapMode');
      if (raw !== null) {
        setMapMode(raw === '1');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('listings_mapMode', mapMode ? '1' : '0');
    } catch (e) {
      // ignore
    }
  }, [mapMode]);
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null);
  // liked IDs for listing cards (lifted to top-level to follow hooks rules)
  const [likedIds, setLikedIds] = useState<Set<number>>(() => new Set(getFavorites()));
  const toggleLike = (id: number) => {
    // use helper to persist
    toggleFavLocal(id);
    // refresh local set from storage
    setLikedIds(new Set(getFavorites()));
  };

  useEffect(() => {
    function onChange() {
      setLikedIds(new Set(getFavorites()));
    }
    window.addEventListener('favorites-changed', onChange as EventListener);
    // also listen to storage so other tabs update
    window.addEventListener('storage', onChange as EventListener);
    return () => {
      window.removeEventListener('favorites-changed', onChange as EventListener);
      window.removeEventListener('storage', onChange as EventListener);
    };
  }, []);

  // MapLibre refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const popupRef = useRef<any>(null);

  // Initialize MapLibre when mapMode toggled on
  useEffect(() => {
    if (!mapMode) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [7.4, 6.5], // [lng, lat] - Enugu area
      zoom: 9,
    });

    mapRef.current = map;

    // navigation control (zoom buttons)
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    // attribution
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    // add markers
    sampleProperties.forEach((p) => {
      if (typeof p.lng !== 'number' || typeof p.lat !== 'number') return;

      const el = document.createElement('div');
      el.className = 'map-marker-bubble';
      el.style.position = 'relative';
      const label = document.createElement('span');
      label.className = 'map-marker-label';
      label.textContent = formatShortPrice(p.price || '');
      el.appendChild(label);
      el.setAttribute('aria-label', `Property ${p.id}`);

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        setActivePropertyId(p.id);
        map.easeTo({ center: [p.lng!, p.lat!], zoom: 14 });

        if (popupRef.current) {
          try { popupRef.current.remove(); } catch (e) {}
          popupRef.current = null;
        }

        const popup = new maplibregl.Popup({ offset: 12, closeOnClick: true })
          .setLngLat([p.lng!, p.lat!])
          .setHTML(`
            <div style="width:260px;font-family:Inter,Arial,Helvetica,sans-serif">
              <a href="/listings/${p.id}" style="text-decoration:none;color:inherit">
                <div style="display:flex;gap:8px">
                  <img src="${p.image}" alt="${p.title}" style="width:84px;height:64px;object-fit:cover;border-radius:6px" />
                  <div>
                    <div style="font-weight:700">${p.title}</div>
                    <div style="font-size:12px;color:#6b7280">${p.location}</div>
                    <div style="margin-top:6px;font-weight:700">${p.price}</div>
                  </div>
                </div>
              </a>
            </div>
          `)
          .addTo(map);

        popupRef.current = popup;
      });

      new maplibregl.Marker({ element: el as HTMLElement, anchor: 'bottom' }).setLngLat([p.lng!, p.lat!]).addTo(map);
    });

    // fit to markers
    const coords = sampleProperties.filter((p) => typeof p.lng === 'number' && typeof p.lat === 'number').map((p) => [p.lng!, p.lat!] as [number, number]);
    if (coords.length) {
      const bounds = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]));
      map.fitBounds(bounds, { padding: 80, maxZoom: 12, duration: 800 });
    }

    map.on('click', () => {
      setActivePropertyId(null);
      if (popupRef.current) {
        try { popupRef.current.remove(); } catch (e) {}
        popupRef.current = null;
      }
    });

    return () => {
      try { if (popupRef.current) popupRef.current.remove(); } catch (e) {}
      try { map.remove(); } catch (e) {}
      mapRef.current = null;
    };
  }, [mapMode]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mapMarkerStyle }} />
      <div className="flex gap-6">
        {/* Sidebar Filters (hidden on small screens) */}
        <aside className={`hidden lg:block w-72 shrink-0`}>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Filters</h3>
              <button className="text-sm text-blue-600">Reset Filters</button>
            </div>

            {/* Price Range (mock) */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium">Price Range</span>
                <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("price") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.has("price") && (
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <div>{formatCurrency(priceMin)}</div>
                    <div>{formatCurrency(priceMax)}</div>
                  </div>

                  {/* Double-thumb slider using two range inputs */}
                  <div className="relative h-6">
                    {/* visual track (our own) */}
                    <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-2 bg-gray-200 rounded" />

                    {/* compute percent positions */}
                    {(() => {
                      const leftPct = (priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN) * 100;
                      const rightPct = (priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN) * 100;
                      const widthPct = Math.max(0, rightPct - leftPct);
                      return (
                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded"
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        />
                      );
                    })()}

                    {/* min thumb */}
                    <input
                      aria-label="Minimum price"
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={100000}
                      value={priceMin}
                      onFocus={() => setActiveThumb('min')}
                      onBlur={() => setActiveThumb(null)}
                      onMouseDown={() => setActiveThumb('min')}
                      onMouseUp={() => setActiveThumb(null)}
                      onTouchStart={() => setActiveThumb('min')}
                      onTouchEnd={() => setActiveThumb(null)}
                      onChange={(e) => {
                        const v = Math.min(Number(e.target.value), priceMax - 1000);
                        setPriceMin(v);
                      }}
                      className={`absolute left-0 right-0 w-full appearance-none h-6 bg-transparent`}
                      style={{ zIndex: activeThumb === 'min' ? 4 : 3, pointerEvents: 'auto' }}
                    />

                    {/* max thumb */}
                    <input
                      aria-label="Maximum price"
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={100000}
                      value={priceMax}
                      onFocus={() => setActiveThumb('max')}
                      onBlur={() => setActiveThumb(null)}
                      onMouseDown={() => setActiveThumb('max')}
                      onMouseUp={() => setActiveThumb(null)}
                      onTouchStart={() => setActiveThumb('max')}
                      onTouchEnd={() => setActiveThumb(null)}
                      onChange={(e) => {
                        const v = Math.max(Number(e.target.value), priceMin + 1000);
                        setPriceMax(v);
                      }}
                      className={`absolute left-0 right-0 w-full appearance-none h-6 bg-transparent`}
                      style={{ zIndex: activeThumb === 'max' ? 4 : 2, pointerEvents: 'auto' }}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      value={priceMin}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        const clamped = Math.max(PRICE_MIN, Math.min(v, priceMax - 1000));
                        setPriceMin(clamped);
                      }}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      value={priceMax}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        const clamped = Math.min(PRICE_MAX, Math.max(v, priceMin + 1000));
                        setPriceMax(clamped);
                      }}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Property Type */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("type")}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium">Property Type</span>
                <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("type") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.has("type") && (
                <div className="mt-3 text-sm text-gray-700 space-y-2">
                  {[
                    'Residential',
                    'Commercial',
                    'Plots/Land',
                    'Service Apartments & Short Lets',
                    'PG/Hostel'
                  ].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPropertyTypes.has(type)}
                        onChange={() => {
                          setSelectedPropertyTypes((prev) => {
                            const next = new Set(prev);
                            if (next.has(type)) next.delete(type); else next.add(type);
                            return next;
                          });
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities (long list mock) */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("amenities")}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium">Amenities</span>
                <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("amenities") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.has("amenities") && (
                <div className="mt-3 text-sm text-gray-700 space-y-2 max-h-64 overflow-auto pr-2">
                  {displayedAmenities.map((a) => (
                    <label key={a} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.has(a)}
                        onChange={() => {
                          setSelectedAmenities((prev) => {
                            const next = new Set(prev);
                            if (next.has(a)) next.delete(a); else next.add(a);
                            return next;
                          });
                        }}
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

              {/* Property Status */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("status")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium">Property Status</span>
                  <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("status") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.has("status") && (
                  <div className="mt-3 text-sm text-gray-700 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Ready</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Under Construction</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Number of Bedrooms */}
              <div >
                <button
                  onClick={() => toggleSection("bedrooms")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium">Bedrooms</span>
                  <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("bedrooms") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.has("bedrooms") && (
                  <div className="mt-3 text-sm text-gray-700 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>1 Bedroom</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>2 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>3 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>4 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>5 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>6+ Bedrooms</span>
                    </label>
                  </div>
                )}
              </div>
            
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Top controls: search + map toggle */}
          <div className="mb-4">
            {/* Search input full width with left icon */}
            <div className="relative">
              <img src="/icons/locationIcon.svg" alt="loc" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search By Location"
                className="w-full border rounded-xl pl-14 pr-4 py-3 text-sm"
              />
            </div>

            {/* Property Listings Tabs and View On Map row */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                <div className="flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <button onClick={() => setActiveTab('all')} className={`w-full sm:w-auto px-4 py-2 rounded text-center ${activeTab==='all' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>All</button>
                  <button onClick={() => setActiveTab('sale')} className={`w-full sm:w-auto px-4 py-2 rounded text-center ${activeTab==='sale' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>For Sale</button>
                  <button onClick={() => setActiveTab('rent')} className={`w-full sm:w-auto px-4 py-2 rounded text-center ${activeTab==='rent' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>For Rent</button>
                </div>

                {/* Mobile-only filter button (keeps desktop unchanged) */}
                <div className="flex justify-between mt-2 sm:mt-0">
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="sm:hidden inline-flex items-center gap-2 px-3 py-2 border rounded text-sm bg-white"
                    aria-label="Open filters"
                  >
                    <img src="/icons/filter.svg" alt="filter" className="w-4 h-4" />
                    Filter
                  </button>
                  <button onClick={() => { setMapMode((m) => !m); setActivePropertyId(null); }} className="sm:hidden flex items-center gap-2">
                    <span>View On Map</span>
                    <img src={mapMode ? '/icons/maptoggle-on.svg' : '/icons/maptoggle-off.svg'} alt="map" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="hidden lg:block flex items-center gap-2 text-sm text-gray-700">
                <button onClick={() => { setMapMode((m) => !m); setActivePropertyId(null); }} className="flex items-center gap-2">
                  <span>View On Map</span>
                  <img src={mapMode ? '/icons/maptoggle-on.svg' : '/icons/maptoggle-off.svg'} alt="map" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile filter slide-over/modal (mobile-only) */}
            <div className={`fixed inset-0 z-50 sm:hidden ${filtersOpen ? 'block' : 'hidden'}`} aria-hidden={!filtersOpen}>
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute inset-x-4 bottom-4 top-16 bg-white rounded-lg shadow-lg overflow-auto">
                <div className="p-4">
                  

                  {/* Reuse same filter markup as sidebar (mobile copy) */}
                  <div className="mt-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-0">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold">Filters</h4>
                          <button className="text-sm text-blue-600">Reset Filters</button>
                        </div>
                        {/* Price/Type/Amenities sections - reuse toggleSection and openSections state */}
                        <div className="space-y-4">
                          <div>
                            <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between text-left">
                              <span className="text-sm font-medium">Price Range</span>
                              <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has('price') ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {openSections.has('price') && (
                              <div className="mt-3 text-sm text-gray-600">
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                  <div>{formatCurrency(priceMin)}</div>
                                  <div>{formatCurrency(priceMax)}</div>
                                </div>
                                {/* price controls (simple) */}
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  <input type="number" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value) || 0)} className="w-full border rounded px-2 py-1 text-sm" />
                                  <input type="number" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value) || PRICE_MAX)} className="w-full border rounded px-2 py-1 text-sm" />
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <button onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-left">
                              <span className="text-sm font-medium">Property Type</span>
                              <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has('type') ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {openSections.has('type') && (
                              <div className="mt-3 text-sm text-gray-700 space-y-2">
                                {['Residential','Commercial','Plots/Land','Service Apartments & Short Lets','PG/Hostel'].map((type) => (
                                  <label key={type} className="flex items-center gap-2">
                                    <input type="checkbox" checked={selectedPropertyTypes.has(type)} onChange={() => setSelectedPropertyTypes((prev)=>{const next=new Set(prev); if(next.has(type)) next.delete(type); else next.add(type); return next;})} />
                                    <span>{type}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <button onClick={() => toggleSection('amenities')} className="w-full flex items-center justify-between text-left">
                              <span className="text-sm font-medium">Amenities</span>
                              <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has('amenities') ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {openSections.has('amenities') && (
                              <div className="mt-3 text-sm text-gray-700 space-y-2 max-h-64 overflow-auto pr-2">
                                {displayedAmenities.map((a)=> (
                                  <label key={a} className="flex items-center gap-2">
                                    <input type="checkbox" checked={selectedAmenities.has(a)} onChange={()=> setSelectedAmenities((prev)=>{const next=new Set(prev); if(next.has(a)) next.delete(a); else next.add(a); return next;})} />
                                    <span>{a}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>

                            {/* Property Status */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("status")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium">Property Status</span>
                  <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("status") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.has("status") && (
                  <div className="mt-3 text-sm text-gray-700 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Ready</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Under Construction</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Number of Bedrooms */}
              <div >
                <button
                  onClick={() => toggleSection("bedrooms")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium">Bedrooms</span>
                  <svg className={`w-4 h-4 text-gray-400 transform ${openSections.has("bedrooms") ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.has("bedrooms") && (
                  <div className="mt-3 text-sm text-gray-700 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>1 Bedroom</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>2 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>3 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>4 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>5 Bedrooms</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>6+ Bedrooms</span>
                    </label>
                  </div>
                )}
              </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button onClick={() => setFiltersOpen(false)} className="w-full bg-blue-600 text-white py-3 rounded">Apply Filters</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Showing 247 properties in Enugu</div>
            <div className="text-sm text-gray-500">Page {page} of 30</div>
          </div>

          {/* Grid or Map */}
          {mapMode ? (
            <div
              className="relative rounded-lg overflow-hidden border bg-white"
              style={{ height: 600 }}
              onClick={() => {
                setActivePropertyId(null);
                if (popupRef.current) {
                  try { popupRef.current.remove(); } catch (e) {}
                  popupRef.current = null;
                }
              }}
            >
              <div ref={mapContainerRef} className="absolute inset-0" style={{ height: '100%' }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProperties.map((p) => (
                <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#F1F1F1] relative">
                  <div className="relative" style={{ height: 200 }}>
                    <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute left-4 top-4 text-xs font-bold px-3 py-1 rounded-full ${p.tag && p.tag.toLowerCase().includes('sale') ? 'bg-[#2563EB] text-white' : 'bg-white text-[#2563EB]'}`}>{p.tag}</div>
                    <button
                      onClick={() => toggleLike(p.id)}
                      aria-pressed={likedIds.has(p.id)}
                      className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#160B0B]/80 p-1 z-30"
                    >
                      <img src={likedIds.has(p.id) ? '/icons/favorite-filled.svg' : '/icons/favorite.svg'} alt="fav" className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-sm">{p.title}</div>
                    <div className="text-xs text-gray-500 mb-2">{p.location}</div>
                    <div className="font-bold text-lg">{p.price}</div>
                    <div className="text-xs text-gray-500 mt-2">{p.beds} beds • {p.baths} baths • {p.area}</div>
                    <div className="flex items-center mt-3">
                      <img src="/images/agent-sarah.png" alt={p.agent} className="w-6 h-6 rounded-full mr-2" />
                      <div className="text-xs text-gray-600">{p.agent} <img src="/icons/verifiedbadge.svg" alt="verified" className="inline w-4 h-4 ml-2" /></div>
                    </div>
                  </div>
                  {/* overlay link so clicking the card opens details (favorite remains clickable due to z-30) */}
                  <Link href={`/listings/${p.id}`} className="absolute inset-0 z-10" aria-label={`View property ${p.id}`} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of 30</div>

            <div className="flex items-center gap-4">
              {/* page numbers */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${page === n ? 'border border-blue-200 text-blue-700 bg-white' : 'bg-white border text-gray-500 hover:text-gray-700'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* chevrons in blue pill */}
              <div>
                <div className="flex items-center bg-blue-600 text-white rounded-full overflow-hidden">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                    className="px-3 py-2 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(30, p + 1))}
                    aria-label="Next page"
                    className="px-3 py-2 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
