"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import mapboxgl from "mapbox-gl";
import { sampleProperties } from "@/lib/data/properties";
import { defaultAmenities, amenitiesByType } from "@/lib/data/amenities";
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants";
import PropertyCard from "@/components/shared/PropertyCard";
import MapMarkers from "@/components/map/MapMarkers";
import ClusterPanel from "@/components/map/ClusterPanel";
import { useDeveloperListingsStore, DEVELOPER_TYPES } from "@/lib/store/useDeveloperListingsStore";
import { useMapStore } from "@/lib/store/useMapStore";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const rangeThumbStyle = `
  input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
  input[type=range]::-webkit-slider-runnable-track { height: 8px; background: transparent; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height:18px; margin-top: -6px; border-radius: 9999px; background: #2563EB; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  input[type=range]::-moz-range-track { height: 8px; background: transparent; }
  input[type=range]::-moz-range-thumb { width: 18px; height:18px; border-radius: 9999px; background: #2563EB; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  input[type=range]:focus { outline: none; }
`;

function formatCurrency(v: number): string {
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(v);
  } catch { return `₦${v.toLocaleString()}`; }
}

export default function ClientListingsContent() {
  const searchParams = useSearchParams();

  const {
    query, setQuery,
    activeTab, setActiveTab,
    page, setPage,
    selectedPropertyTypes, togglePropertyType,
    selectedAmenities, toggleAmenity,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    activeThumb, setActiveThumb,
    mapMode, setMapMode,
    filtersOpen, setFiltersOpen,
    resetFilters,
  } = useDeveloperListingsStore();

  const { searchAreaVisible, hideSearchArea } = useMapStore();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    try {
      const param = searchParams?.get?.("propertyType");
      if (param) togglePropertyType(param);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const purpose = searchParams?.get?.("purpose");
      if (purpose === "sale") setActiveTab("sale");
      else if (purpose === "rent") setActiveTab("rent");
      const q = searchParams?.get?.("q");
      if (q) setQuery(q);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayedAmenities = React.useMemo(() => {
    if (selectedPropertyTypes.size === 0) return defaultAmenities;
    const union = new Set<string>();
    selectedPropertyTypes.forEach((type) => {
      const list = (amenitiesByType as Record<string, string[]>)[type];
      if (list) list.forEach((a) => union.add(a));
    });
    return Array.from(union);
  }, [selectedPropertyTypes]);

  useEffect(() => {
    if (!mapMode || !mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [3.42, 6.45],
      zoom: 11,
      pitch: 60,      // start in 3D
      minPitch: 45,   // can't go below 45° — always 3D
      bearing: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    // Navigation: zoom + compass (visualizePitch shows the tilt angle in the compass)
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");
    // Fullscreen
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    // Scale bar
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");

    return () => {
      try { map.remove(); } catch { }
      mapRef.current = null;
    };
  }, [mapMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());
  const toggleSection = (key: string) => setOpenSections((prev) => {
    const s = new Set(prev); if (s.has(key)) s.delete(key); else s.add(key); return s;
  });

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`w-4 h-4 text-gray-400 transform ${open ? "rotate-180" : ""}`}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const FilterSection = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between text-left">
        <span className="text-sm font-medium">{label}</span>
        <ChevronIcon open={openSections.has(id)} />
      </button>
      {openSections.has(id) && children}
    </div>
  );

  const priceFilterContent = (
    <div className="mt-3 text-sm text-gray-600">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <div>{formatCurrency(priceMin)}</div><div>{formatCurrency(priceMax)}</div>
      </div>
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-2 bg-gray-200 rounded" />
        {(() => {
          const lp = ((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
          const rp = ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
          return <div className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded"
            style={{ left: `${lp}%`, width: `${Math.max(0, rp - lp)}%` }} />;
        })()}
        <input aria-label="Minimum price" type="range" min={PRICE_MIN} max={PRICE_MAX} step={100000} value={priceMin}
          onFocus={() => setActiveThumb("min")} onBlur={() => setActiveThumb(null)}
          onMouseDown={() => setActiveThumb("min")} onMouseUp={() => setActiveThumb(null)}
          onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1000))}
          className="absolute left-0 right-0 w-full appearance-none h-6 bg-transparent"
          style={{ zIndex: activeThumb === "min" ? 4 : 3 }} />
        <input aria-label="Maximum price" type="range" min={PRICE_MIN} max={PRICE_MAX} step={100000} value={priceMax}
          onFocus={() => setActiveThumb("max")} onBlur={() => setActiveThumb(null)}
          onMouseDown={() => setActiveThumb("max")} onMouseUp={() => setActiveThumb(null)}
          onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1000))}
          className="absolute left-0 right-0 w-full appearance-none h-6 bg-transparent"
          style={{ zIndex: activeThumb === "max" ? 4 : 2 }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input type="number" min={PRICE_MIN} max={PRICE_MAX} value={priceMin}
          onChange={(e) => setPriceMin(Math.max(PRICE_MIN, Math.min(Number(e.target.value) || 0, priceMax - 1000)))}
          className="w-full border rounded px-2 py-1 text-sm" placeholder="Min" />
        <input type="number" min={PRICE_MIN} max={PRICE_MAX} value={priceMax}
          onChange={(e) => setPriceMax(Math.min(PRICE_MAX, Math.max(Number(e.target.value) || 0, priceMin + 1000)))}
          className="w-full border rounded px-2 py-1 text-sm" placeholder="Max" />
      </div>
    </div>
  );

  const filterSidebar = (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button className="text-sm text-blue-600" onClick={resetFilters}>Reset Filters</button>
      </div>
      <FilterSection id="price" label="Price Range">{priceFilterContent}</FilterSection>
      <FilterSection id="type" label="Property Type">
        <div className="mt-3 text-sm text-gray-700 space-y-2">
          {DEVELOPER_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input type="checkbox" checked={selectedPropertyTypes.has(type)} onChange={() => togglePropertyType(type)} />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      <FilterSection id="amenities" label="Amenities">
        <div className="mt-3 text-sm text-gray-700 space-y-2 max-h-64 overflow-auto pr-2">
          {displayedAmenities.map((a) => (
            <label key={a} className="flex items-center gap-2">
              <input type="checkbox" checked={selectedAmenities.has(a)} onChange={() => toggleAmenity(a)} />
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
        <aside className="hidden lg:block w-72 shrink-0">{filterSidebar}</aside>

        <main className="flex-1">
          <div className="mb-4">
            <div className="relative">
              <img src="/icons/locationIcon.svg" alt="loc"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search By Location"
                className="w-full border rounded-xl pl-14 pr-4 py-3 text-sm"
                aria-label="Search by location" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                <div className="flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {(["all", "sale", "rent"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`w-full sm:w-auto px-4 py-2 rounded text-center ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white border text-gray-600"}`}>
                      {tab === "all" ? "All" : tab === "sale" ? "For Sale" : "For Rent"}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 sm:mt-0">
                  <button onClick={() => setFiltersOpen(true)}
                    className="sm:hidden inline-flex items-center gap-2 px-3 py-2 border rounded text-sm bg-white">
                    <img src="/icons/filter.svg" alt="" className="w-4 h-4" /> Filter
                  </button>
                  <button onClick={() => setMapMode(!mapMode)} className="sm:hidden flex items-center gap-2">
                    <span>View On Map</span>
                    <img src={mapMode ? "/icons/maptoggle-on.svg" : "/icons/maptoggle-off.svg"} alt="map" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-700">
                <button onClick={() => setMapMode(!mapMode)} className="flex items-center gap-2">
                  <span>View On Map</span>
                  <img src={mapMode ? "/icons/maptoggle-on.svg" : "/icons/maptoggle-off.svg"} alt="map" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`fixed inset-0 z-50 sm:hidden ${filtersOpen ? "block" : "hidden"}`} aria-hidden={!filtersOpen}>
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute inset-x-4 bottom-4 top-16 bg-white rounded-lg shadow-lg overflow-auto">
                <div className="p-4">
                  {filterSidebar}
                  <div className="mt-6">
                    <button onClick={() => setFiltersOpen(false)} className="w-full bg-blue-600 text-white py-3 rounded">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Showing {sampleProperties.length} developer listings in Lagos</div>
            <div className="text-sm text-gray-500">Page {page} of 30</div>
          </div>

          {mapMode ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm" style={{ height: 600 }}>
              <div ref={mapContainerRef} className="absolute inset-0" style={{ height: "100%" }} />

              {/* Markers (imperative, returns null) */}
              {mapRef.current && (
                <MapMarkers
                  mapRef={mapRef}
                  properties={sampleProperties}
                  listingHrefPrefix="/listings/developers"
                />
              )}

              <ClusterPanel listingHrefPrefix="/listings/developers" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProperties.map((p) => (
                <PropertyCard key={p.id} property={p} href={`/listings/developers/${p.id}`} />
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of 30</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${page === n ? "border border-blue-200 text-blue-700 bg-white" : "bg-white border text-gray-500 hover:text-gray-700"}`}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-blue-600 text-white rounded-full overflow-hidden">
                <button onClick={() => setPage(Math.max(1, page - 1))} aria-label="Previous page" className="px-3 py-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => setPage(Math.min(30, page + 1))} aria-label="Next page" className="px-3 py-2 flex items-center">
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
