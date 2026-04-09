import { create } from 'zustand';

export interface SeekerStats {
  savedProperties: number;
  activeDeals: number;
  closedDeals: number;
  upcomingTours: number;
}

interface SeekerDashboardState {
  stats: SeekerStats;
  isLoading: boolean;
  error: string | null;
  fetchDashboardDataMock: () => Promise<void>;
}

export const useSeekerDashboardStore = create<SeekerDashboardState>((set) => ({
  stats: {
    savedProperties: 0,
    activeDeals: 0,
    closedDeals: 0,
    upcomingTours: 0,
  },
  isLoading: false,
  error: null,

  fetchDashboardDataMock: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 600));
      set({
        stats: {
          savedProperties: 12,
          activeDeals: 3,
          closedDeals: 5,
          upcomingTours: 2,
        },
        isLoading: false,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load dashboard', isLoading: false });
    }
  },
}));
