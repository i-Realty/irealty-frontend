import { create } from 'zustand';
import type { PropertyWithCoords, BBox } from '@/lib/types';

interface MapState {
  // Cluster panel
  clusterPanelOpen: boolean;
  clusterProperties: PropertyWithCoords[];

  // Search this area
  searchAreaVisible: boolean;

  // Viewport tracking
  viewportBounds: BBox | null;
  viewportZoom: number;
  viewportCenter: [number, number];

  // Loading states
  isLoadingProperties: boolean;
  isLoadingLandmarks: boolean;

  // Active layers
  showHeatmap: boolean;
  showBoundaries: boolean;
  showIsochrone: boolean;
  isochroneCenter: [number, number] | null;
  isochroneMinutes: number;
  isochroneProfile: 'driving' | 'walking' | 'cycling';
  isochronePolygon: GeoJSON.Feature | null;

  // Street View
  streetViewOpen: boolean;
  streetViewCoords: { lat: number; lng: number } | null;

  // Recently viewed
  recentlyViewed: number[];

  // Actions
  openClusterPanel: (properties: PropertyWithCoords[]) => void;
  closeClusterPanel: () => void;
  showSearchArea: () => void;
  hideSearchArea: () => void;
  setViewport: (bounds: BBox, zoom: number, center: [number, number]) => void;
  setLoadingProperties: (v: boolean) => void;
  setLoadingLandmarks: (v: boolean) => void;
  toggleHeatmap: () => void;
  toggleBoundaries: () => void;
  toggleIsochrone: () => void;
  setIsochroneCenter: (center: [number, number] | null) => void;
  setIsochroneMinutes: (min: number) => void;
  setIsochroneProfile: (profile: 'driving' | 'walking' | 'cycling') => void;
  setIsochronePolygon: (polygon: GeoJSON.Feature | null) => void;
  openStreetView: (lat: number, lng: number) => void;
  closeStreetView: () => void;
  addRecentlyViewed: (id: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  clusterPanelOpen: false,
  clusterProperties: [],
  searchAreaVisible: false,
  viewportBounds: null,
  viewportZoom: 11,
  viewportCenter: [3.42, 6.45],
  isLoadingProperties: false,
  isLoadingLandmarks: false,
  showHeatmap: false,
  showBoundaries: false,
  showIsochrone: false,
  isochroneCenter: null,
  isochroneMinutes: 30,
  isochroneProfile: 'driving',
  isochronePolygon: null,
  streetViewOpen: false,
  streetViewCoords: null,
  recentlyViewed: [],

  openClusterPanel: (properties) =>
    set({ clusterPanelOpen: true, clusterProperties: properties }),
  closeClusterPanel: () =>
    set({ clusterPanelOpen: false, clusterProperties: [] }),

  showSearchArea: () => set({ searchAreaVisible: true }),
  hideSearchArea: () => set({ searchAreaVisible: false }),

  setViewport: (bounds, zoom, center) =>
    set({ viewportBounds: bounds, viewportZoom: zoom, viewportCenter: center }),

  setLoadingProperties: (v) => set({ isLoadingProperties: v }),
  setLoadingLandmarks: (v) => set({ isLoadingLandmarks: v }),

  toggleHeatmap: () => set((s) => ({
    showHeatmap: !s.showHeatmap,
    // Mutual exclusion: turn off boundaries if enabling heatmap
    showBoundaries: !s.showHeatmap ? false : s.showBoundaries,
  })),
  toggleBoundaries: () => set((s) => ({
    showBoundaries: !s.showBoundaries,
    showHeatmap: !s.showBoundaries ? false : s.showHeatmap,
  })),
  toggleIsochrone: () => set((s) => ({
    showIsochrone: !s.showIsochrone,
    isochronePolygon: !s.showIsochrone ? s.isochronePolygon : null,
  })),
  setIsochroneCenter: (center) => set({ isochroneCenter: center }),
  setIsochroneMinutes: (min) => set({ isochroneMinutes: min }),
  setIsochroneProfile: (profile) => set({ isochroneProfile: profile }),
  setIsochronePolygon: (polygon) => set({ isochronePolygon: polygon }),

  openStreetView: (lat, lng) =>
    set({ streetViewOpen: true, streetViewCoords: { lat, lng } }),
  closeStreetView: () =>
    set({ streetViewOpen: false, streetViewCoords: null }),

  addRecentlyViewed: (id) => set((s) => {
    if (s.recentlyViewed[s.recentlyViewed.length - 1] === id) return s;
    const next = [...s.recentlyViewed.filter((v) => v !== id), id].slice(-50);
    return { recentlyViewed: next };
  }),
}));
