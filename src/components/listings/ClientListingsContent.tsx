"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import mapboxgl from "mapbox-gl";
import { defaultAmenities, amenitiesByType } from "@/lib/data/amenities";
import type { PropertyWithCoords, BBox } from "@/lib/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";

import PropertyCard from "@/components/shared/PropertyCard";
import dynamic from "next/dynamic";
const MapMarkers = dynamic(() => import("@/components/map/MapMarkers"), { ssr: false });
import ClusterPanel from "@/components/map/ClusterPanel";
import MapToolbar from "@/components/map/MapToolbar";
import FilterSidebar from "@/components/listings/FilterSidebar";
import ComparisonBar from "@/components/listings/ComparisonBar";
import ComparisonModal from "@/components/listings/ComparisonModal";
import type { ListingsState } from "@/lib/store/useListingsStore";
import { useMapStore } from "@/lib/store/useMapStore";
import Image from 'next/image';

const StreetViewModal = dynamic(() => import("@/components/map/StreetViewModal"), { ssr: false });
const HeatmapLayer = dynamic(() => import("@/components/map/HeatmapLayer"), { ssr: false });
const NeighbourhoodLayer = dynamic(() => import("@/components/map/NeighbourhoodLayer"), { ssr: false });
const IsochroneControl = dynamic(() => import("@/components/map/IsochroneControl"), { ssr: false });
const MobilePropertySheet = dynamic(() => import("@/components/map/MobilePropertySheet"), { ssr: false });

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// ── Configuration props ─────────────────────────────────────────────────────

export interface ListingsPageConfig {
  useStore: () => ListingsState;
  propertyTypes: string[];
  hrefPrefix: string;
  resultsLabel: string;
  properties: PropertyWithCoords[];
}

// ── Bbox filter helper ──────────────────────────────────────────────────────

function propertyInBBox(p: PropertyWithCoords, bbox: BBox): boolean {
  if (typeof p.lat !== "number" || typeof p.lng !== "number") return true; // include properties without coords
  const [west, south, east, north] = bbox;
  return p.lng >= west && p.lng <= east && p.lat >= south && p.lat <= north;
}

// ── Main unified component ──────────────────────────────────────────────────

export default function ClientListingsContent({ config }: { config: ListingsPageConfig }) {
  const searchParams = useSearchParams();
  const {
    query, setQuery,
    activeTab, setActiveTab,
    page, setPage,
    selectedPropertyTypes, togglePropertyType,
    priceMin,
    priceMax,
    selectedBedrooms,
    selectedStatuses,
    selectedAmenities,
    selectedState,
    selectedLGA,
    mapMode, setMapMode,
    mapStyle, setMapStyle,
    filtersOpen, setFiltersOpen,
    resetFilters,
  } = config.useStore();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Map store
  const {
    searchAreaVisible,
    hideSearchArea,
    viewportBounds,
    streetViewOpen,
    streetViewCoords,
    closeStreetView,
    showHeatmap,
    showBoundaries,
    showIsochrone,
    isochronePolygon,
  } = useMapStore();

  // Search area bbox filter state
  const [searchBBox, setSearchBBox] = React.useState<BBox | null>(null);

  // Street View click-on-map mode
  const [streetViewMode, setStreetViewMode] = React.useState(false);

  // Mobile bottom sheet popup state
  const [mobilePopupProp, setMobilePopupProp] = React.useState<PropertyWithCoords | null>(null);
  const [mobilePopupLandmarks, setMobilePopupLandmarks] = React.useState<import("@/lib/types").Landmark[]>([]);

  const handleMobilePopup = React.useCallback((property: PropertyWithCoords, landmarks: import("@/lib/types").Landmark[]) => {
    setMobilePopupProp(property);
    setMobilePopupLandmarks(landmarks);
  }, []);

  // ── URL param sync ────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const param = searchParams?.get?.("propertyType");
      const purpose = searchParams?.get?.("purpose");
      const q = searchParams?.get?.("q");

      resetFilters();
      if (param) togglePropertyType(param);
      if (purpose === "sale") setActiveTab("sale");
      else if (purpose === "rent") setActiveTab("rent");
      if (q) setQuery(q);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Filter properties ──────────────────────────────────────────────
  const filteredProperties = React.useMemo(() => {
    return config.properties.filter(p => {
      if (activeTab !== "all" && p.category !== activeTab) return false;

      if (query) {
        const q = query.toLowerCase();
        const tSearch = p.title.toLowerCase().includes(q);
        const lSearch = p.location.toLowerCase().includes(q);
        const nSearch = p.neighbourhood?.toLowerCase().includes(q);
        if (!tSearch && !lSearch && !nSearch) return false;
      }

      if (selectedPropertyTypes.size > 0) {
        let matched = false;
        for (const type of selectedPropertyTypes) {
           const kw = type.split(' ')[0].toLowerCase();
           if (p.title.toLowerCase().includes(kw)) { matched = true; break; }
        }
        if (!matched) return false;
      }

      if (selectedBedrooms.size > 0) {
        if (!p.beds) return false;
        let matched = false;
        for (const bStr of selectedBedrooms) {
           if (bStr === "6+ Bedrooms") { if (p.beds >= 6) { matched = true; break; } }
           else {
             const nb = parseInt(bStr, 10);
             if (p.beds === nb) { matched = true; break; }
           }
        }
        if (!matched) return false;
      }

      if (selectedStatuses.size > 0) {
        const s = (p.id % 2 === 0) ? "Ready" : "Under Construction";
        if (!selectedStatuses.has(s)) return false;
      }

      if (selectedState && p.state !== selectedState) return false;
      if (selectedLGA && p.lga !== selectedLGA) return false;

      if (selectedAmenities.size > 0) {
        if (!p.amenities || p.amenities.length === 0) return false;
        const hasAny = [...selectedAmenities].some((a) => p.amenities!.includes(a));
        if (!hasAny) return false;
      }

      const numPrice = p.priceValue ?? parseInt(p.price.replace(/[^\d]/g, ''), 10);
      if (!isNaN(numPrice) && (numPrice < priceMin || numPrice > priceMax)) return false;

      // Bbox filter (Search This Area)
      if (searchBBox && !propertyInBBox(p, searchBBox)) return false;

      // Isochrone filter — only show properties within travel-time polygon
      if (isochronePolygon && typeof p.lat === "number" && typeof p.lng === "number") {
        try {
          const pt = turfPoint([p.lng, p.lat]);
          if (!booleanPointInPolygon(pt, isochronePolygon as GeoJSON.Feature<GeoJSON.Polygon>)) return false;
        } catch { /* if geometry is invalid, don't filter */ }
      }

      return true;
    });
  }, [
    activeTab, query, selectedPropertyTypes,
    selectedBedrooms, selectedStatuses,
    selectedAmenities, selectedState, selectedLGA,
    priceMin, priceMax, searchBBox, isochronePolygon, config.properties,
  ]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / ITEMS_PER_PAGE));

  const goToPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filteredProperties.length, page, totalPages, setPage]);

  const displayedProperties = React.useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, page]);

  // ── Amenity pruning ──────────────────────────────────────────────────
  const displayedAmenities = React.useMemo(() => {
    if (selectedPropertyTypes.size === 0) return defaultAmenities;
    const union = new Set<string>();
    selectedPropertyTypes.forEach((type) => {
      const list = (amenitiesByType as Record<string, string[]>)[type];
      if (list) list.forEach((a) => union.add(a));
    });
    return Array.from(union);
  }, [selectedPropertyTypes]);

  // ── Handle "Search This Area" click ──────────────────────────────────
  const handleSearchArea = useCallback(() => {
    if (viewportBounds) {
      setSearchBBox(viewportBounds);
    }
    hideSearchArea();
  }, [viewportBounds, hideSearchArea]);

  const handleClearSearchArea = useCallback(() => {
    setSearchBBox(null);
    hideSearchArea();
  }, [hideSearchArea]);

  // ── Map init ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapMode || !mapContainerRef.current || mapRef.current) return;

    const initialStyle = mapStyle === 'satellite'
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/standard';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [3.42, 6.45],
      zoom: 11,
      pitch: 60,
      minPitch: 45,
      bearing: 0,
      attributionControl: true,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");

    return () => {
      try { map.remove(); } catch { }
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapMode]);

  // ── Map style switcher ────────────────────────────────────────────────
  function handleMapStyleChange(style: 'light' | 'satellite') {
    setMapStyle(style);
    if (!mapRef.current) return;
    const url = style === 'satellite'
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/standard';
    mapRef.current.setStyle(url);
  }

  // ── Street View click-on-map mode ────────────────────────────────────
  const { openStreetView } = useMapStore();

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !streetViewMode) return;

    map.getCanvas().style.cursor = "crosshair";

    const onClick = (e: mapboxgl.MapMouseEvent) => {
      openStreetView(e.lngLat.lat, e.lngLat.lng);
      setStreetViewMode(false);
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
      if (map.getCanvas()) map.getCanvas().style.cursor = "";
    };
  }, [streetViewMode, mapRef, openStreetView]);

  return (
    <>
      <ComparisonBar />
      <ComparisonModal />
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterSidebar config={config} displayedAmenities={displayedAmenities} />
        </aside>

        <main className="flex-1">
          {/* Search + tab controls */}
          <div className="mb-4">
            <div className="relative">
              <Image src="/icons/locationIcon.svg" alt="loc"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"  width={20} height={20} />
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
                    <Image src="/icons/filter.svg" alt="" className="w-4 h-4"  width={16} height={16} /> Filter
                  </button>
                  <button onClick={() => { setMapMode(!mapMode); }}
                    className="sm:hidden flex items-center gap-2">
                    <span>View On Map</span>
                    <Image src={mapMode ? "/icons/maptoggle-on.svg" : "/icons/maptoggle-off.svg"} alt="map" className="w-5 h-5"  width={20} height={20} />
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-700">
                <button onClick={() => setMapMode(!mapMode)} className="flex items-center gap-2">
                  <span>View On Map</span>
                  <Image src={mapMode ? "/icons/maptoggle-on.svg" : "/icons/maptoggle-off.svg"} alt="map" className="w-5 h-5"  width={20} height={20} />
                </button>
              </div>
            </div>

            {/* Mobile filter modal */}
            <div className={`fixed inset-0 z-50 sm:hidden ${filtersOpen ? "block" : "hidden"}`} aria-hidden={!filtersOpen}>
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute inset-x-4 bottom-4 top-16 bg-white rounded-lg shadow-lg overflow-auto">
                <div className="p-4">
                  <FilterSidebar config={config} displayedAmenities={displayedAmenities} />
                  <div className="mt-6">
                    <button onClick={() => setFiltersOpen(false)} className="w-full bg-blue-600 text-white py-3 rounded">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
            <div className="text-sm text-gray-600 truncate min-w-0">
              Showing {filteredProperties.length} {config.resultsLabel}
              {searchBBox ? " in this area" : selectedLGA ? ` in ${selectedLGA}, ${selectedState}` : selectedState ? ` in ${selectedState}` : ' across Nigeria'}
              {searchBBox && (
                <button onClick={handleClearSearchArea} className="ml-2 text-blue-600 underline text-xs">
                  Clear area filter
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500 shrink-0">Page {page} of {totalPages}</div>
          </div>

          {/* Grid or Map */}
          {mapMode ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
              style={{ height: "calc(100vh - 260px)", minHeight: 400, maxHeight: 800 }}>
              {/* Map skeleton shown while map initializes */}
              {!mapRef.current && (
                <div className="absolute inset-0 irealty-map-skeleton flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Loading map...</span>
                </div>
              )}

              <div ref={mapContainerRef} className="absolute inset-0" style={{ height: "100%" }} />

              {/* Viewport loading indicator */}
              {useMapStore.getState().isLoadingProperties && (
                <div className="absolute top-0 left-0 right-0 z-30 h-1">
                  <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
              )}

              {/* Map toolbar (replaces MapStyleSwitcher) */}
              <MapToolbar
                mapStyle={mapStyle}
                onStyleChange={handleMapStyleChange}
                streetViewMode={streetViewMode}
                onToggleStreetViewMode={() => setStreetViewMode((v) => !v)}
              />

              {mapRef.current && (
                <>
                  <MapMarkers
                    mapRef={mapRef}
                    properties={filteredProperties}
                    listingHrefPrefix={config.hrefPrefix}
                    onSearchArea={handleSearchArea}
                    onMobilePopup={handleMobilePopup}
                  />

                  {/* Layer overlays */}
                  {showHeatmap && (
                    <HeatmapLayer mapRef={mapRef} properties={filteredProperties} />
                  )}
                  {showBoundaries && (
                    <NeighbourhoodLayer mapRef={mapRef} properties={filteredProperties} />
                  )}
                  {showIsochrone && (
                    <IsochroneControl mapRef={mapRef} />
                  )}
                </>
              )}

              <ClusterPanel listingHrefPrefix={config.hrefPrefix} />

              {/* Mobile bottom sheet popup */}
              <MobilePropertySheet
                property={mobilePopupProp}
                landmarks={mobilePopupLandmarks}
                hrefPrefix={config.hrefPrefix}
                onClose={() => setMobilePopupProp(null)}
              />

              {/* Search This Area button */}
              {searchAreaVisible && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
                  <button
                    onClick={handleSearchArea}
                    className="bg-white shadow-lg border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Search This Area
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProperties.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">No properties found matching your criteria.</div>
              ) : (
                displayedProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} href={`${config.hrefPrefix}/${p.id}`} />
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between gap-2">
            <div className="text-sm text-gray-600 shrink-0">Page {page} of {totalPages}</div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="hidden sm:flex items-center gap-1 flex-wrap">
                {Array.from({ length: totalPages }).map((_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => goToPage(n)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${page === n ? "border border-blue-200 text-blue-700 bg-white" : "bg-white border text-gray-500 hover:text-gray-700"}`}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-blue-600 text-white rounded-full overflow-hidden shrink-0">
                <button onClick={() => goToPage(Math.max(1, page - 1))} aria-label="Previous page" className="px-3 py-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => goToPage(Math.min(totalPages, page + 1))} aria-label="Next page" className="px-3 py-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Street View modal */}
      {streetViewOpen && streetViewCoords && (
        <StreetViewModal
          lat={streetViewCoords.lat}
          lng={streetViewCoords.lng}
          onClose={closeStreetView}
        />
      )}
    </>
  );
}
