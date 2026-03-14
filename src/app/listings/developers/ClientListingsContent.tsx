"use client";

import React, { useState, useEffect, useRef } from "react";
import { getFavorites, toggleFavorite as toggleFavLocal } from "@/lib/favorites";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { sampleProperties } from "@/lib/data/properties";
import { defaultAmenities, amenitiesByType } from "@/lib/data/amenities";
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants";
import PropertyCard from "@/components/shared/PropertyCard";

// Marker styles for MapLibre price bubbles — refined blue palette
const mapMarkerStyle = `
  .map-marker-bubble { display:inline-flex; align-items:center; justify-content:center; padding:6px 14px; background:#2563EB; color:white; font-weight:700; border-radius:24px; box-shadow: 0 4px 16px rgba(37,99,235,0.35); transform: translateY(-6px); cursor: pointer; transition: background 0.2s, box-shadow 0.2s; }
  .map-marker-bubble:hover { background:#1d4ed8; box-shadow: 0 6px 20px rgba(37,99,235,0.5); }
  .map-marker-bubble:after { content: ''; width:10px; height:10px; background:#2563EB; position: absolute; transform: rotate(45deg); margin-top:16px; margin-left:0; box-shadow: 0 4px 8px rgba(37,99,235,0.18); }
  .map-marker-label { font-size:12px; line-height:1; letter-spacing:0.01em; }
  .mapboxgl-ctrl-bottom-right { right: 8px; bottom: 8px; }
  .maplibregl-popup-content { border-radius:12px !important; padding:0 !important; overflow:hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important; border: 1px solid #e5e7eb !important; }
  .maplibregl-popup-close-button { font-size:18px; padding:4px 8px; color:#6b7280; }
  .maplibregl-popup-close-button:hover { color:#111827; background:transparent; }
`;

// CSS for the double-thumb price range slider
const rangeThumbStyle = `
  input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
  input[type=range]::-webkit-slider-runnable-track { height: 8px; background: transparent; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height:18px; margin-top: -6px; border-radius: 9999px; background: #2563EB; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  input[type=range]::-moz-range-track { height: 8px; background: transparent; }
  input[type=range]::-moz-range-thumb { width: 18px; height:18px; border-radius: 9999px; background: #2563EB; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  input[type=range]:focus { outline: none; }
`;

function formatShortPrice(priceStr: string): string {
  if (!priceStr) return "";
  const digits = Number((priceStr + "").replace(/[^0-9.-]/g, ""));
  if (!isFinite(digits)) return priceStr;
  if (Math.abs(digits) >= 1_000_000) return `₦${Math.round(digits / 1_000_000)}M`;
  if (Math.abs(digits) >= 1_000) return `₦${Math.round(digits / 1_000)}K`;
  return `₦${digits.toLocaleString()}`;
}

function formatCurrency(v: number): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `₦${v.toLocaleString()}`;
  }
}

// Developer listings use a subset of property types
const DEVELOPER_PROPERTY_TYPES = ["Residential", "Commercial", "Off-Plan"];

export default function ClientListingsContent() {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all");
  const [page, setPage] = useState(1);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<Set<string>>(new Set());
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX);
  const [activeThumb, setActiveThumb] = React.useState<"min" | "max" | null>(null);
  const [mapMode, setMapMode] = useState(false);
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null);
  const [likedIds, setLikedIds] = useState<Set<number>>(() => new Set(getFavorites()));

  // MapLibre refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  // Sync property type filter from URL param
  useEffect(() => {
    try {
      const param = searchParams?.get?.("propertyType");
      if (param) {
        setSelectedPropertyTypes(new Set([param]));
        setOpenSections((s) => { const next = new Set(s); next.add("type"); return next; });
      }
    } catch { /* ignore */ }
  }, [searchParams]);

  // Sync purpose and search query from URL params
  useEffect(() => {
    try {
      const purpose = searchParams?.get?.("purpose");
      if (purpose === "sale") setActiveTab("sale");
      else if (purpose === "rent") setActiveTab("rent");
      const q = searchParams?.get?.("q");
      if (q) setQuery(q);
    } catch { /* ignore */ }
  }, [searchParams]);

  // Persist map mode to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("listings_mapMode");
      if (raw !== null) setMapMode(raw === "1");
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("listings_mapMode", mapMode ? "1" : "0"); } catch { /* ignore */ }
  }, [mapMode]);

  // Favorites sync
  useEffect(() => {
    function onChange() { setLikedIds(new Set(getFavorites())); }
    window.addEventListener("favorites-changed", onChange as EventListener);
    window.addEventListener("storage", onChange as EventListener);
    return () => {
      window.removeEventListener("favorites-changed", onChange as EventListener);
      window.removeEventListener("storage", onChange as EventListener);
    };
  }, []);

  const toggleLike = (id: number) => {
    toggleFavLocal(id);
    setLikedIds(new Set(getFavorites()));
  };

  // Compute displayed amenities based on selected property types
  const displayedAmenities = React.useMemo(() => {
    if (selectedPropertyTypes.size === 0) return defaultAmenities;
    const union = new Set<string>();
    selectedPropertyTypes.forEach((type) => {
      const list = amenitiesByType[type];
      if (list) list.forEach((a) => union.add(a));
    });
    return Array.from(union);
  }, [selectedPropertyTypes]);

  // Prune selected amenities when displayed list changes
  useEffect(() => {
    setSelectedAmenities((prev) => {
      const next = new Set<string>();
      displayedAmenities.forEach((a) => { if (prev.has(a)) next.add(a); });
      return next;
    });
  }, [displayedAmenities]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  };

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a); else next.add(a);
      return next;
    });
  };

  // Initialize MapLibre when map mode is toggled on
  useEffect(() => {
    if (!mapMode || !mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [7.4, 6.5],
      zoom: 9,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    sampleProperties.forEach((p) => {
      if (typeof p.lng !== "number" || typeof p.lat !== "number") return;

      const el = document.createElement("div");
      el.className = "map-marker-bubble";
      el.style.position = "relative";
      const label = document.createElement("span");
      label.className = "map-marker-label";
      label.textContent = formatShortPrice(p.price || "");
      el.appendChild(label);
      el.setAttribute("aria-label", `Property ${p.id}`);

      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        setActivePropertyId(p.id);
        map.easeTo({ center: [p.lng!, p.lat!], zoom: 14 });

        if (popupRef.current) {
          try { popupRef.current.remove(); } catch { }
          popupRef.current = null;
        }

        const popup = new maplibregl.Popup({ offset: 12, closeOnClick: true })
          .setLngLat([p.lng!, p.lat!])
          .setHTML(`
            <div style="width:270px;font-family:'Lato',sans-serif">
              <a href="/listings/developers/${p.id}" style="text-decoration:none;color:inherit">
                <div style="position:relative">
                  <img src="${p.image}" alt="${p.title}" style="width:100%;height:140px;object-fit:cover" />
                  <span style="position:absolute;left:10px;top:10px;background:white;font-size:11px;padding:3px 10px;border-radius:20px;box-shadow:0 1px 4px rgba(0,0,0,0.1)">${p.tag}</span>
                </div>
                <div style="padding:12px 14px">
                  <div style="font-weight:700;font-size:14px;color:#111827">${p.title}</div>
                  <div style="font-size:12px;color:#6b7280;margin-top:4px">${p.location}</div>
                  <div style="margin-top:8px;font-weight:700;font-size:16px;color:#2563EB">${p.price}</div>
                  <div style="font-size:11px;color:#9ca3af;margin-top:4px">${p.beds} beds • ${p.baths} baths • ${p.area}</div>
                </div>
              </a>
            </div>
          `)
          .addTo(map);

        popupRef.current = popup;
      });

      new maplibregl.Marker({ element: el as HTMLElement, anchor: "bottom" })
        .setLngLat([p.lng!, p.lat!])
        .addTo(map);
    });

    const coords = sampleProperties
      .filter((p) => typeof p.lng === "number" && typeof p.lat === "number")
      .map((p) => [p.lng!, p.lat!] as [number, number]);

    if (coords.length) {
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new maplibregl.LngLatBounds(coords[0], coords[0])
      );
      map.fitBounds(bounds, { padding: 80, maxZoom: 12, duration: 800 });
    }

    map.on("click", () => {
      setActivePropertyId(null);
      if (popupRef.current) {
        try { popupRef.current.remove(); } catch { }
        popupRef.current = null;
      }
    });

    return () => {
      try { if (popupRef.current) popupRef.current.remove(); } catch { }
      try { map.remove(); } catch { }
      mapRef.current = null;
    };
  }, [mapMode]);

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
      className={`w-4 h-4 text-gray-400 transform ${open ? "rotate-180" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const FilterSection = ({
    id,
    label,
    children,
  }: {
    id: string;
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium">{label}</span>
        <ChevronIcon open={openSections.has(id)} />
      </button>
      {openSections.has(id) && children}
    </div>
  );

  const priceFilterContent = (
    <div className="mt-3 text-sm text-gray-600">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <div>{formatCurrency(priceMin)}</div>
        <div>{formatCurrency(priceMax)}</div>
      </div>
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-2 bg-gray-200 rounded" />
        {(() => {
          const leftPct = ((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
          const rightPct = ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
          return (
            <div
              className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded"
              style={{ left: `${leftPct}%`, width: `${Math.max(0, rightPct - leftPct)}%` }}
            />
          );
        })()}
        <input
          aria-label="Minimum price"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={100000}
          value={priceMin}
          onFocus={() => setActiveThumb("min")}
          onBlur={() => setActiveThumb(null)}
          onMouseDown={() => setActiveThumb("min")}
          onMouseUp={() => setActiveThumb(null)}
          onTouchStart={() => setActiveThumb("min")}
          onTouchEnd={() => setActiveThumb(null)}
          onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1000))}
          className="absolute left-0 right-0 w-full appearance-none h-6 bg-transparent"
          style={{ zIndex: activeThumb === "min" ? 4 : 3, pointerEvents: "auto" }}
        />
        <input
          aria-label="Maximum price"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={100000}
          value={priceMax}
          onFocus={() => setActiveThumb("max")}
          onBlur={() => setActiveThumb(null)}
          onMouseDown={() => setActiveThumb("max")}
          onMouseUp={() => setActiveThumb(null)}
          onTouchStart={() => setActiveThumb("max")}
          onTouchEnd={() => setActiveThumb(null)}
          onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1000))}
          className="absolute left-0 right-0 w-full appearance-none h-6 bg-transparent"
          style={{ zIndex: activeThumb === "max" ? 4 : 2, pointerEvents: "auto" }}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input
          type="number"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={priceMin}
          onChange={(e) => setPriceMin(Math.max(PRICE_MIN, Math.min(Number(e.target.value) || 0, priceMax - 1000)))}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="Min"
        />
        <input
          type="number"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={priceMax}
          onChange={(e) => setPriceMax(Math.min(PRICE_MAX, Math.max(Number(e.target.value) || 0, priceMin + 1000)))}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="Max"
        />
      </div>
    </div>
  );

  const filterSidebar = (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button className="text-sm text-blue-600">Reset Filters</button>
      </div>

      <FilterSection id="price" label="Price Range">
        {priceFilterContent}
      </FilterSection>

      <FilterSection id="type" label="Property Type">
        <div className="mt-3 text-sm text-gray-700 space-y-2">
          {DEVELOPER_PROPERTY_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPropertyTypes.has(type)}
                onChange={() => togglePropertyType(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection id="amenities" label="Amenities">
        <div className="mt-3 text-sm text-gray-700 space-y-2 max-h-64 overflow-auto pr-2">
          {displayedAmenities.map((a) => (
            <label key={a} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedAmenities.has(a)}
                onChange={() => toggleAmenity(a)}
              />
              <span>{a}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection id="status" label="Property Status">
        <div className="mt-3 text-sm text-gray-700 space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" /><span>Ready</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" /><span>Under Construction</span></label>
        </div>
      </FilterSection>

      <FilterSection id="bedrooms" label="Bedrooms">
        <div className="mt-3 text-sm text-gray-700 space-y-2">
          {["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5 Bedrooms", "6+ Bedrooms"].map((b) => (
            <label key={b} className="flex items-center gap-2"><input type="checkbox" /><span>{b}</span></label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: rangeThumbStyle }} />
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          {filterSidebar}
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Search + tab controls */}
          <div className="mb-4">
            <div className="relative">
              <img
                src="/icons/locationIcon.svg"
                alt="loc"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search By Location"
                className="w-full border rounded-xl pl-14 pr-4 py-3 text-sm"
                aria-label="Search by location"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                <div className="flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {(["all", "sale", "rent"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full sm:w-auto px-4 py-2 rounded text-center ${
                        activeTab === tab ? "bg-blue-600 text-white" : "bg-white border text-gray-600"
                      }`}
                    >
                      {tab === "all" ? "All" : tab === "sale" ? "For Sale" : "For Rent"}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-2 sm:mt-0">
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="sm:hidden inline-flex items-center gap-2 px-3 py-2 border rounded text-sm bg-white"
                    aria-label="Open filters"
                  >
                    <img src="/icons/filter.svg" alt="" className="w-4 h-4" />
                    Filter
                  </button>
                  <button
                    onClick={() => { setMapMode((m) => !m); setActivePropertyId(null); }}
                    className="sm:hidden flex items-center gap-2"
                  >
                    <span>View On Map</span>
                    <img src={mapMode ? "/icons/maptoggle-on.svg" : "/icons/maptoggle-off.svg"} alt="map" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-700">
                <button
                  onClick={() => { setMapMode((m) => !m); setActivePropertyId(null); }}
                  className="flex items-center gap-2"
                >
                  <span>View On Map</span>
                  <img src={mapMode ? "/icons/maptoggle-on.svg" : "/icons/maptoggle-off.svg"} alt="map" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile filter modal */}
            <div
              className={`fixed inset-0 z-50 sm:hidden ${filtersOpen ? "block" : "hidden"}`}
              aria-hidden={!filtersOpen}
            >
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute inset-x-4 bottom-4 top-16 bg-white rounded-lg shadow-lg overflow-auto">
                <div className="p-4">
                  {filterSidebar}
                  <div className="mt-6">
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="w-full bg-blue-600 text-white py-3 rounded"
                    >
                      Apply Filters
                    </button>
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
              className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
              style={{ height: 600 }}
              onClick={() => {
                setActivePropertyId(null);
                if (popupRef.current) {
                  try { popupRef.current.remove(); } catch { }
                  popupRef.current = null;
                }
              }}
            >
              <div ref={mapContainerRef} className="absolute inset-0" style={{ height: "100%" }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                  href={`/listings/developers/${p.id}`}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of 30</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                      page === n
                        ? "border border-blue-200 text-blue-700 bg-white"
                        : "bg-white border text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
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
        </main>
      </div>
    </>
  );
}
