import { create } from 'zustand';
import { PRICE_MIN, PRICE_MAX } from '@/lib/constants';

export interface ListingsState {
  query: string;
  activeTab: 'all' | 'sale' | 'rent';
  page: number;
  selectedPropertyTypes: Set<string>;
  selectedAmenities: Set<string>;
  selectedBedrooms: Set<string>;
  selectedStatuses: Set<string>;
  priceMin: number;
  priceMax: number;
  activeThumb: 'min' | 'max' | null;
  mapMode: boolean;
  mapStyle: 'light' | 'satellite';
  activePropertyId: number | null;
  filtersOpen: boolean;
  // Actions
  setQuery: (q: string) => void;
  setActiveTab: (tab: 'all' | 'sale' | 'rent') => void;
  setPage: (page: number) => void;
  togglePropertyType: (type: string) => void;
  toggleAmenity: (a: string) => void;
  toggleBedroom: (b: string) => void;
  toggleStatus: (s: string) => void;
  setPriceMin: (v: number) => void;
  setPriceMax: (v: number) => void;
  setActiveThumb: (t: 'min' | 'max' | null) => void;
  setMapMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  setMapStyle: (s: 'light' | 'satellite') => void;
  setActivePropertyId: (id: number | null) => void;
  setFiltersOpen: (v: boolean) => void;
  resetFilters: () => void;
}

export const useListingsStore = create<ListingsState>((set) => ({
  query: '',
  activeTab: 'all',
  page: 1,
  selectedPropertyTypes: new Set(),
  selectedAmenities: new Set(),
  selectedBedrooms: new Set(),
  selectedStatuses: new Set(),
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  activeThumb: null,
  mapMode: false,
  mapStyle: 'light',
  activePropertyId: null,
  filtersOpen: false,

  setQuery: (q) => set({ query: q }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPage: (page) => set({ page }),

  togglePropertyType: (type) =>
    set((s) => {
      const next = new Set(s.selectedPropertyTypes);
      if (next.has(type)) next.delete(type); else next.add(type);
      return { selectedPropertyTypes: next };
    }),

  toggleAmenity: (a) =>
    set((s) => {
      const next = new Set(s.selectedAmenities);
      if (next.has(a)) next.delete(a); else next.add(a);
      return { selectedAmenities: next };
    }),

  toggleBedroom: (b) =>
    set((s) => {
      const next = new Set(s.selectedBedrooms);
      if (next.has(b)) next.delete(b); else next.add(b);
      return { selectedBedrooms: next };
    }),

  toggleStatus: (st) =>
    set((s) => {
      const next = new Set(s.selectedStatuses);
      if (next.has(st)) next.delete(st); else next.add(st);
      return { selectedStatuses: next };
    }),

  setPriceMin: (v) => set({ priceMin: v }),
  setPriceMax: (v) => set({ priceMax: v }),
  setActiveThumb: (t) => set({ activeThumb: t }),

  setMapMode: (v) =>
    set((s) => ({ mapMode: typeof v === 'function' ? v(s.mapMode) : v })),

  setMapStyle: (s) => set({ mapStyle: s }),
  setActivePropertyId: (id) => set({ activePropertyId: id }),
  setFiltersOpen: (v) => set({ filtersOpen: v }),

  resetFilters: () => set({
    query: '',
    activeTab: 'all',
    page: 1,
    selectedPropertyTypes: new Set(),
    selectedAmenities: new Set(),
    selectedBedrooms: new Set(),
    selectedStatuses: new Set(),
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
  }),
}));
