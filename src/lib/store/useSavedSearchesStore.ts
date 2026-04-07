import { create } from 'zustand';

export interface SavedSearch {
  id: string;
  name: string;
  createdAt: string;
  filters: {
    query: string;
    activeTab: 'all' | 'sale' | 'rent';
    selectedPropertyTypes: string[];
    selectedAmenities: string[];
    selectedBedrooms: string[];
    priceMin: number;
    priceMax: number;
  };
}

interface SavedSearchesState {
  searches: SavedSearch[];
  saveSearch: (name: string, filters: SavedSearch['filters']) => void;
  deleteSearch: (id: string) => void;
  renameSearch: (id: string, name: string) => void;
}

function loadFromStorage(): SavedSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('irealty-saved-searches');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(searches: SavedSearch[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('irealty-saved-searches', JSON.stringify(searches));
}

export const useSavedSearchesStore = create<SavedSearchesState>((set, get) => ({
  searches: loadFromStorage(),

  saveSearch: (name, filters) => {
    const search: SavedSearch = {
      id: `ss-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      filters,
    };
    const updated = [search, ...get().searches];
    saveToStorage(updated);
    set({ searches: updated });
  },

  deleteSearch: (id) => {
    const updated = get().searches.filter((s) => s.id !== id);
    saveToStorage(updated);
    set({ searches: updated });
  },

  renameSearch: (id, name) => {
    const updated = get().searches.map((s) => (s.id === id ? { ...s, name } : s));
    saveToStorage(updated);
    set({ searches: updated });
  },
}));
