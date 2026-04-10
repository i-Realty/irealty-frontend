import React from "react";
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants";
import type { ListingsPageConfig } from "./ClientListingsContent";
import SaveSearchButton from "@/components/listings/SaveSearchButton";
import SavedSearchesList from "@/components/listings/SavedSearchesList";
import type { SavedSearch } from "@/lib/store/useSavedSearchesStore";
import { getStateNames, getLGAsForState } from "@/lib/data/nigeriaLocations";

function formatCurrency(v: number): string {
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(v);
  } catch { return `₦${v.toLocaleString()}`; }
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
    activeThumb, setActiveThumb,
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

      {/* State filter */}
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

      {/* LGA filter (only active when a state is selected) */}
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

      <FilterSection id="price" label="Price Range">{priceFilterContent}</FilterSection>
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
