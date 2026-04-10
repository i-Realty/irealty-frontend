import React from "react";
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants";
import type { ListingsPageConfig } from "./ClientListingsContent";
import SaveSearchButton from "@/components/listings/SaveSearchButton";
import SavedSearchesList from "@/components/listings/SavedSearchesList";
import type { SavedSearch } from "@/lib/store/useSavedSearchesStore";
import { getStateNames, getLGAsForState } from "@/lib/data/nigeriaLocations";

function formatMillion(v: number): string {
  if (v === 0) return '₦0';
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    return `₦${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
  return `₦${(v / 1_000).toFixed(0)}K`;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={`w-4 h-4 text-gray-400 transform ${open ? "rotate-180" : ""}`}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

interface FilterSidebarProps {
  config: ListingsPageConfig;
  displayedAmenities: string[];
}

export default function FilterSidebar({ config, displayedAmenities }: FilterSidebarProps) {
  const {
    selectedPropertyTypes, togglePropertyType,
    selectedAmenities, toggleAmenity,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    selectedBedrooms, toggleBedroom,
    selectedStatuses, toggleStatus,
    selectedState, setSelectedState,
    selectedLGA, setSelectedLGA,
    resetFilters,
  } = config.useStore();

  const allStates = React.useMemo(() => getStateNames(), []);
  const lgasForState = React.useMemo(() => selectedState ? getLGAsForState(selectedState) : [], [selectedState]);

  // Auto-expand sections that have active filter selections
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());
  const toggleSection = (key: string) => setOpenSections((prev) => {
    const s = new Set(prev); if (s.has(key)) s.delete(key); else s.add(key); return s;
  });

  // Sync: auto-open sections when filters are applied (e.g. via URL params)
  React.useEffect(() => {
    const toOpen = new Set<string>();
    if (selectedPropertyTypes.size > 0) toOpen.add('type');
    if (selectedBedrooms.size > 0) toOpen.add('bedrooms');
    if (selectedStatuses.size > 0) toOpen.add('status');
    if (selectedAmenities.size > 0) toOpen.add('amenities');
    if (toOpen.size > 0) setOpenSections((prev) => new Set([...prev, ...toOpen]));
  }, [selectedPropertyTypes.size, selectedBedrooms.size, selectedStatuses.size, selectedAmenities.size]);

  const FilterSection = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between text-left">
        <span className="text-sm font-medium">{label}</span>
        <ChevronIcon open={openSections.has(id)} />
      </button>
      {openSections.has(id) && children}
    </div>
  );

  const PRICE_STEP = 100_000;
  const leftPct  = ((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const rightPct = ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  // When min thumb is at/near max, keep it on top so the user can drag it left
  const minZ = priceMin >= priceMax - PRICE_STEP ? 5 : 3;

  const priceFilterContent = (
    <div className="mt-3 text-sm text-gray-600">
      {/* Thumb styles — pointer-events: none on the track, all on the thumb */}
      <style>{`
        .price-slider { pointer-events: none; -webkit-appearance: none; appearance: none; background: transparent; }
        .price-slider::-webkit-slider-thumb {
          pointer-events: all; -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #2563eb; border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.28); cursor: grab; transition: transform 0.1s;
        }
        .price-slider::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.2); }
        .price-slider::-moz-range-thumb {
          pointer-events: all; width: 16px; height: 16px; border-radius: 50%;
          background: #2563eb; border: 2px solid #fff; cursor: grab;
        }
        .price-slider::-webkit-slider-runnable-track { background: transparent; }
        .price-slider::-moz-range-track { background: transparent; }
      `}</style>

      {/* Live labels */}
      <div className="flex items-center justify-between text-xs font-semibold text-blue-600 mb-3">
        <span>{formatMillion(priceMin)}</span>
        <span>{formatMillion(priceMax)}</span>
      </div>

      {/* Dual-range track */}
      <div className="relative h-5">
        {/* Grey base track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-gray-200 rounded-full" />
        {/* Blue fill between thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-blue-500 rounded-full"
          style={{ left: `${leftPct}%`, width: `${Math.max(0, rightPct - leftPct)}%` }}
        />
        {/* Min thumb */}
        <input
          aria-label="Minimum price"
          type="range"
          className="price-slider absolute inset-0 w-full h-full"
          min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={priceMin}
          style={{ zIndex: minZ }}
          onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - PRICE_STEP))}
        />
        {/* Max thumb */}
        <input
          aria-label="Maximum price"
          type="range"
          className="price-slider absolute inset-0 w-full h-full"
          min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={priceMax}
          style={{ zIndex: 2 }}
          onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + PRICE_STEP))}
        />
      </div>

      {/* Number inputs — step 100,000 */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Min (₦)</label>
          <input
            type="number" min={PRICE_MIN} max={PRICE_MAX} step={100000} value={priceMin}
            onChange={(e) => setPriceMin(Math.max(PRICE_MIN, Math.min(Number(e.target.value) || 0, priceMax - PRICE_STEP)))}
            className="w-full border rounded px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Max (₦)</label>
          <input
            type="number" min={PRICE_MIN} max={PRICE_MAX} step={100000} value={priceMax}
            onChange={(e) => setPriceMax(Math.min(PRICE_MAX, Math.max(Number(e.target.value) || 0, priceMin + PRICE_STEP)))}
            className="w-full border rounded px-2 py-1.5 text-sm"
          />
        </div>
      </div>
    </div>
  );

  const currentFilters: SavedSearch['filters'] = {
    query: config.useStore().query,
    activeTab: config.useStore().activeTab,
    selectedPropertyTypes: Array.from(selectedPropertyTypes),
    selectedAmenities: Array.from(selectedAmenities),
    selectedBedrooms: Array.from(selectedBedrooms),
    priceMin,
    priceMax,
    selectedState: selectedState || undefined,
    selectedLGA: selectedLGA || undefined,
  };

  const handleApplySavedSearch = (filters: SavedSearch['filters']) => {
    resetFilters();
    if (filters.query) config.useStore().setQuery(filters.query);
    if (filters.activeTab !== 'all') config.useStore().setActiveTab(filters.activeTab);
    filters.selectedPropertyTypes.forEach((t) => togglePropertyType(t));
    filters.selectedAmenities.forEach((a) => toggleAmenity(a));
    filters.selectedBedrooms.forEach((b) => toggleBedroom(b));
    setPriceMin(filters.priceMin);
    setPriceMax(filters.priceMax);
    if (filters.selectedState) setSelectedState(filters.selectedState);
    if (filters.selectedLGA) setSelectedLGA(filters.selectedLGA);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button className="text-sm text-blue-600" onClick={resetFilters}>Reset Filters</button>
      </div>
      <SavedSearchesList onApply={handleApplySavedSearch} />

      {/* ── Price Range (first) ── */}
      <FilterSection id="price" label="Price Range">{priceFilterContent}</FilterSection>

      {/* ── State ── */}
      <FilterSection id="state" label="State">
        <div className="mt-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full border rounded px-2 py-2 text-sm text-gray-700"
            aria-label="Filter by state"
          >
            <option value="">All States</option>
            {allStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* ── LGA (shown only when a state is selected) ── */}
      {selectedState && (
        <FilterSection id="lga" label="Local Government Area">
          <div className="mt-3">
            <select
              value={selectedLGA}
              onChange={(e) => setSelectedLGA(e.target.value)}
              className="w-full border rounded px-2 py-2 text-sm text-gray-700"
              aria-label="Filter by LGA"
            >
              <option value="">All LGAs in {selectedState}</option>
              {lgasForState.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </FilterSection>
      )}

      <FilterSection id="type" label="Property Type">
        <div className="mt-3 text-sm text-gray-700 space-y-2">
          {config.propertyTypes.map((type) => (
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
          {["Ready", "Under Construction"].map((s) => (
            <label key={s} className="flex items-center gap-2">
              <input type="checkbox" checked={selectedStatuses.has(s)} onChange={() => toggleStatus(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      <FilterSection id="bedrooms" label="Bedrooms">
        <div className="mt-3 text-sm text-gray-700 space-y-2">
          {["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5 Bedrooms", "6+ Bedrooms"].map((b) => (
            <label key={b} className="flex items-center gap-2">
              <input type="checkbox" checked={selectedBedrooms.has(b)} onChange={() => toggleBedroom(b)} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      <div className="border-t border-gray-100 pt-2">
        <SaveSearchButton currentFilters={currentFilters} />
      </div>
    </div>
  );
}
