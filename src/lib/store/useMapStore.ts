import { create } from 'zustand';
import type { PropertyWithCoords } from '@/lib/types';

interface MapState {
  clusterPanelOpen: boolean;
  clusterProperties: PropertyWithCoords[];
  searchAreaVisible: boolean;
  // Actions
  openClusterPanel: (properties: PropertyWithCoords[]) => void;
  closeClusterPanel: () => void;
  showSearchArea: () => void;
  hideSearchArea: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  clusterPanelOpen: false,
  clusterProperties: [],
  searchAreaVisible: false,

  openClusterPanel: (properties) =>
    set({ clusterPanelOpen: true, clusterProperties: properties }),

  closeClusterPanel: () =>
    set({ clusterPanelOpen: false, clusterProperties: [] }),

  showSearchArea: () => set({ searchAreaVisible: true }),
  hideSearchArea: () => set({ searchAreaVisible: false }),
}));
