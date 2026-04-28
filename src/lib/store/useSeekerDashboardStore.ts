import { create } from 'zustand';
import { apiGet } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

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
  period: string;
  dateFrom: string;
  dateTo: string;
  setPeriod: (period: string) => void;
  setDateRange: (from: string, to: string) => void;
  fetchDashboardData: () => Promise<void>;
  /** @deprecated Use fetchDashboardData() */
  fetchDashboardDataMock: () => Promise<void>;
}

// ── Mock data ───────────────────────────────────────────────────────────

const MOCK_STATS: SeekerStats = {
  savedProperties: 12,
  activeDeals: 3,
  closedDeals: 5,
  upcomingTours: 2,
};

export const useSeekerDashboardStore = create<SeekerDashboardState>((set, get) => ({
  stats: {
    savedProperties: 0,
    activeDeals: 0,
    closedDeals: 0,
    upcomingTours: 0,
  },
  isLoading: false,
  error: null,
  period: 'all',
  dateFrom: '',
  dateTo: '',

  setPeriod: (period) => {
    set({ period });
    get().fetchDashboardData();
  },

  setDateRange: (from, to) => {
    set({ dateFrom: from, dateTo: to });
    get().fetchDashboardData();
  },

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const { period, dateFrom, dateTo } = get();
        const params = new URLSearchParams();
        if (period && period !== 'all') params.set('period', period);
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);
        const data = await apiGet<{ stats: SeekerStats }>(`/api/seeker/dashboard/stats?${params}`);
        set({ stats: data.stats, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({ stats: MOCK_STATS, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load dashboard', isLoading: false });
    }
  },

  // Backward-compatible alias
  fetchDashboardDataMock: async () => {
    return get().fetchDashboardData();
  },
}));
