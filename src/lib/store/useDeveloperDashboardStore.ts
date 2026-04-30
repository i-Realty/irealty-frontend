import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export interface DeveloperProfile {
  id: string;
  name: string;
  avatarUrl: string;
  kycStatus: 'unverified' | 'in-progress' | 'verified';
  kycProgress: number;
}

export interface DeveloperDashboardStats {
  totalListings: number;
  activeDeals: number;
  closedDeals: number;
}

export interface DeveloperRevenueData {
  day: string;
  sales: number;
}

export interface EscrowData {
  fundsInEscrow: number;
  availableForWithdrawal: number;
}

export interface DeveloperTransaction {
  id: string;
  date: string;
  projectName: string;
  unitName: string;
  propertyType: string;
  buyerName: string;
  totalAmount: number;
  paidAmount: number;
  progress: string;
  status: 'Pending' | 'Completed' | 'Declined' | 'In-progress';
}

interface DeveloperDashboardState {
  profile: DeveloperProfile | null;
  stats: DeveloperDashboardStats;
  revenueData: DeveloperRevenueData[];
  escrowData: EscrowData | null;
  transactions: DeveloperTransaction[];

  isLoading: boolean;
  error: string | null;
  isKycModalOpen: boolean;
  currentKycStep: number;

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

export const mockDeveloperTransactions: DeveloperTransaction[] = [
  { id: 'TXN-0932', date: '28 Aug 2025', projectName: 'Lekki Gardens Phase 3', unitName: 'Unit A1', propertyType: 'Residential', buyerName: 'Sarah Homes',    totalAmount: 45000000, paidAmount: 9000000,  progress: '0/3 Milestones', status: 'Pending' },
  { id: 'TXN-0933', date: '25 Aug 2025', projectName: '3-Bed Duplex, Enugu',   unitName: 'Unit B2', propertyType: 'Residential', buyerName: 'Marcus Bell',    totalAmount: 35000000, paidAmount: 35000000, progress: '3/3 Milestones', status: 'Completed' },
  { id: 'TXN-0934', date: '22 Aug 2025', projectName: 'Opal Residences Tower', unitName: 'Unit C3', propertyType: 'Commercial',  buyerName: 'Amara Osei',     totalAmount: 60000000, paidAmount: 18000000, progress: '1/3 Milestones', status: 'In-progress' },
  { id: 'TXN-0935', date: '20 Aug 2025', projectName: '4-Bed Semi-Detached',   unitName: 'Unit D4', propertyType: 'Residential', buyerName: 'Ngozi Adeyemi',  totalAmount: 28000000, paidAmount: 5600000,  progress: '0/3 Milestones', status: 'Declined' },
  { id: 'TXN-0936', date: '18 Aug 2025', projectName: 'Green Valley Estate',   unitName: 'Unit E5', propertyType: 'Off-Plan',    buyerName: 'Emeka Nwosu',    totalAmount: 50000000, paidAmount: 10000000, progress: '0/3 Milestones', status: 'Pending' },
];

export const useDeveloperDashboardStore = create<DeveloperDashboardState>((set, get) => ({
  profile: {
    id: 'dev-123',
    name: 'Waden Warren',
    avatarUrl: '/images/avatar.png',
    kycStatus: 'unverified',
    kycProgress: 0,
  },
  stats: { totalListings: 0, activeDeals: 0, closedDeals: 0 },
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
        profile: DeveloperProfile;
        stats: DeveloperDashboardStats;
        revenueData: DeveloperRevenueData[];
        escrowData: EscrowData;
        transactions: DeveloperTransaction[];
      }>(`/api/developer/dashboard?${params}`);
      set({ ...data, isLoading: false });
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { profile } = get();

    let stats: DeveloperDashboardStats = { totalListings: 0, activeDeals: 0, closedDeals: 0 };
    let revenueData: DeveloperRevenueData[] = [];
    let escrowData: EscrowData = { fundsInEscrow: 0, availableForWithdrawal: 0 };
    let transactions: DeveloperTransaction[] = [];

    if (profile?.kycStatus === 'verified') {
      stats = { totalListings: 30, activeDeals: 20, closedDeals: 20 };
      revenueData = [
        { day: 'Mon', sales: 20000000 },
        { day: 'Tue', sales: 25000000 },
        { day: 'Wed', sales: 15000000 },
        { day: 'Thu', sales: 35000000 },
        { day: 'Fri', sales: 30000000 },
        { day: 'Sat', sales: 45000000 },
        { day: 'Sun', sales: 30000000 },
      ];
      escrowData = { fundsInEscrow: 120000000, availableForWithdrawal: 80000000 };
      transactions = mockDeveloperTransactions;
    }

    set({ stats, revenueData, escrowData, transactions, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load dashboard', isLoading: false });
    }
  },

  updateKycProgress: async (step: number) => {
    const progressMap: Record<number, number> = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, kycProgress: progressMap[step] || state.profile.kycProgress }
        : null,
    }));
  },

  setKycModalOpen: (isOpen: boolean) => {
    set({ isKycModalOpen: isOpen });
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
          set({ isKycModalOpen: false });
        } else {
          set({ currentKycStep: STEP_MAP[stepKey] ?? 1 });
        }
      }).catch(() => {});
    }
  },
  setCurrentKycStep: (step: number) => set({ currentKycStep: step }),

  submitKycForVerification: async () => {
    set({ isLoading: true });
    try {
      if (USE_API) {
        await apiPost('/api/developer/kyc/submit', {});
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
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Verification failed' });
      return false;
    }
  },

  // Backward-compatible alias
  mockSubmitKycForVerification: async () => get().submitKycForVerification(),

  resetDashboard: () => {
    set({
      profile: {
        id: 'dev-123',
        name: 'Waden Warren',
        avatarUrl: '/images/avatar.png',
        kycStatus: 'unverified',
        kycProgress: 0,
      },
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
}));
