import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// Types mimicking expected API payloads
export interface AgentProfile {
  id: string;
  name: string;
  avatarUrl: string;
  kycStatus: 'unverified' | 'in-progress' | 'verified';
  kycProgress: number; // 0 to 100
}

export interface DashboardStats {
  totalListings: number;
  activeDeals: number;
  closedDeals: number;
  upcomingTours: number;
}

export interface RevenueData {
  day: string;
  inspectionFee: number;
  sales: number;
  rentals: number;
}

export interface EscrowData {
  fundsInEscrow: number;
  availableForWithdrawal: number;
}

export interface Transaction {
  id: string;
  date: string;
  propertyName: string;
  propertyType: string;
  clientName: string;
  transactionType: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Declined' | 'In-progress';
}

interface AgentDashboardState {
  // State
  profile: AgentProfile | null;
  stats: DashboardStats;
  revenueData: RevenueData[];
  escrowData: EscrowData | null;
  transactions: Transaction[];

  // UI State
  isLoading: boolean;
  error: string | null;
  isKycModalOpen: boolean;
  currentKycStep: number;

  // Actions
  period: string;
  dateFrom: string;
  dateTo: string;
  setPeriod: (period: string) => void;
  setDateRange: (from: string, to: string) => void;
  fetchDashboardData: () => Promise<void>;
  updateKycProgress: (step: number) => Promise<void>;
  setKycModalOpen: (isOpen: boolean) => void;
  setCurrentKycStep: (step: number) => void;
  submitKycForVerification: () => Promise<boolean>;
  resetDashboard: () => void;
  verifyProfileLocally: () => void;

  /** @deprecated Use submitKycForVerification() */
  mockSubmitKycForVerification: () => Promise<boolean>;
}

// Mock Data
export const mockTransactions: Transaction[] = [
  { id: 'TRN-0932', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Residential', clientName: 'John Doe', transactionType: 'Inspection Fee', amount: 25000, status: 'Pending' },
  { id: 'TRN-0933', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Residential', clientName: 'John Doe', transactionType: 'Inspection Fee', amount: 25000, status: 'Completed' },
  { id: 'TRN-0934', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Residential', clientName: 'John Doe', transactionType: 'Inspection Fee', amount: 25000, status: 'Declined' },
  { id: 'TRN-0935', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Residential', clientName: 'John Doe', transactionType: 'Inspection Fee', amount: 25000, status: 'In-progress' },
];

export const useAgentDashboardStore = create<AgentDashboardState>((set, get) => ({
  profile: {
    id: 'agent-123',
    name: 'Waden Warren',
    avatarUrl: '/images/avatar.png',
    kycStatus: 'unverified',
    kycProgress: 0,
  },
  stats: { totalListings: 0, activeDeals: 0, closedDeals: 0, upcomingTours: 0 },
  revenueData: [],
  escrowData: null,
  transactions: [],

  isLoading: false,
  error: null,
  isKycModalOpen: false,
  currentKycStep: 1,

  period: 'all',
  dateFrom: '',
  dateTo: '',

  setPeriod: (period) => { set({ period }); get().fetchDashboardData(); },
  setDateRange: (from, to) => { set({ dateFrom: from, dateTo: to }); get().fetchDashboardData(); },

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const { period, dateFrom, dateTo } = get();
        const params = new URLSearchParams();
        if (period && period !== 'all') params.set('period', period);
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);
        const data = await apiGet<{
          profile: AgentProfile;
          stats: DashboardStats;
          revenueData: RevenueData[];
          escrowData: EscrowData;
          transactions: Transaction[];
        }>(`/api/agent/dashboard?${params}`);
        set({ ...data, isLoading: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const { profile } = get();
        let stats = { totalListings: 0, activeDeals: 0, closedDeals: 0, upcomingTours: 0 };
        let revenueData: RevenueData[] = [];
        let escrowData = { fundsInEscrow: 0, availableForWithdrawal: 0 };
        let transactions: Transaction[] = [];

        if (profile?.kycStatus === 'verified') {
          stats = { totalListings: 30, activeDeals: 20, closedDeals: 20, upcomingTours: 3 };
          revenueData = [
            { day: 'Mon', inspectionFee: 10, sales: 50, rentals: 20 },
            { day: 'Tue', inspectionFee: 20, sales: 60, rentals: 25 },
            { day: 'Wed', inspectionFee: 15, sales: 40, rentals: 30 },
            { day: 'Thu', inspectionFee: 25, sales: 70, rentals: 35 },
            { day: 'Fri', inspectionFee: 30, sales: 80, rentals: 40 },
            { day: 'Sat', inspectionFee: 40, sales: 90, rentals: 50 },
            { day: 'Sun', inspectionFee: 35, sales: 85, rentals: 45 },
          ];
          escrowData = { fundsInEscrow: 120000000, availableForWithdrawal: 80000000 };
          transactions = mockTransactions;
        }
        set({ stats, revenueData, escrowData, transactions, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An error occurred', isLoading: false });
    }
  },

  updateKycProgress: async (step: number) => {
    const progressMap: Record<number, number> = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };
    set((state) => ({
      profile: state.profile ? {
        ...state.profile,
        kycProgress: progressMap[step] || state.profile.kycProgress,
      } : null,
    }));
  },

  setKycModalOpen: (isOpen: boolean) => {
    set({ isKycModalOpen: isOpen });
    // When opening in API mode, fetch current KYC status to resume from the right step
    if (isOpen && USE_API) {
      const STEP_MAP: Record<string, number> = {
        PERSONAL_INFO: 1, PHONE_VERIFICATION: 2,
        ID_VERIFICATION: 3, LIVENESS: 4, PAYMENT: 5,
      };
      apiGet<{ onboardingStep?: string; step?: string; currentStep?: string }>(
        '/api/kyc/status'
      ).then(data => {
        const stepKey = data.onboardingStep ?? data.step ?? data.currentStep ?? '';
        if (stepKey === 'COMPLETE') {
          // KYC already completed — close modal, mark verified
          set({ isKycModalOpen: false });
        } else {
          const step = STEP_MAP[stepKey] ?? 1;
          set({ currentKycStep: step });
        }
      }).catch(() => { /* keep at step 1 */ });
    }
  },
  setCurrentKycStep: (step: number) => set({ currentKycStep: step }),

  submitKycForVerification: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        await apiPost('/api/agent/kyc/submit', {});
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      set((state) => ({
        profile: state.profile ? { ...state.profile, kycStatus: 'verified', kycProgress: 100 } : null,
        isKycModalOpen: false,
        isLoading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An error occurred', isLoading: false });
      return false;
    }
  },

  resetDashboard: () => {
    set({
      profile: { id: 'agent-123', name: 'Waden Warren', avatarUrl: '/images/avatar.png', kycStatus: 'unverified', kycProgress: 0 },
      isKycModalOpen: false,
      currentKycStep: 1,
    });
    get().fetchDashboardData();
  },

  verifyProfileLocally: () => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, kycStatus: 'verified', kycProgress: 100 } : null,
      isKycModalOpen: false,
    }));
    get().fetchDashboardData();
  },

  // Backward-compatible alias
  mockSubmitKycForVerification: async () => get().submitKycForVerification(),
}));
