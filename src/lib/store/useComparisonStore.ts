import { create } from 'zustand';
import type { Property } from '@/lib/types';

const MAX_COMPARE = 3;

interface ComparisonState {
  items: Property[];
  isModalOpen: boolean;

  addItem: (property: Property) => void;
  removeItem: (id: number) => void;
  clearAll: () => void;
  hasItem: (id: number) => boolean;
  toggleItem: (property: Property) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  items: [],
  isModalOpen: false,

  addItem: (property) => {
    const { items } = get();
    if (items.length >= MAX_COMPARE) return;
    if (items.some((p) => p.id === property.id)) return;
    set({ items: [...items, property] });
  },

  removeItem: (id) => set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
  clearAll: () => set({ items: [], isModalOpen: false }),

  hasItem: (id) => get().items.some((p) => p.id === id),

  toggleItem: (property) => {
    const { items } = get();
    if (items.some((p) => p.id === property.id)) {
      set({ items: items.filter((p) => p.id !== property.id) });
    } else if (items.length < MAX_COMPARE) {
      set({ items: [...items, property] });
    }
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
