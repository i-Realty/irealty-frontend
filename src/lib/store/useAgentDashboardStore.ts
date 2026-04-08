import { create } from 'zustand';

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
  currentKycStep: number; // 1 to 5

  // Actions (Mock API calls)
  fetchDashboardData: () => Promise<void>;
  updateKycProgress: (step: number) => Promise<void>;
  setKycModalOpen: (isOpen: boolean) => void;
  setCurrentKycStep: (step: number) => void;
  mockSubmitKycForVerification: () => Promise<boolean>;
  resetDashboard: () => void;
  verifyProfileLocally: () => void; // For demo purposes to toggle state easily
}

// Mock Data — dashboard widget only shows 4 recent items.
// The full transaction list lives in useTransactionsStore.
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
  stats: {
    totalListings: 0,
    activeDeals: 0,
    closedDeals: 0,
    upcomingTours: 0,
  },
  revenueData: [],
  escrowData: null,
  transactions: [],
  
  isLoading: false,
  error: null,
  isKycModalOpen: false,
  currentKycStep: 1,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { profile } = get();

      // Default empty state for unverified
      let stats = { totalListings: 0, activeDeals: 0, closedDeals: 0, upcomingTours: 0 };
      let revenueData: RevenueData[] = [];
      let escrowData = { fundsInEscrow: 0, availableForWithdrawal: 0 };
      let transactions: Transaction[] = [];

      // If verified, populate with mock data
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
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An error occurred', isLoading: false });
    }
  },

  updateKycProgress: async (step: number) => {
    // In real app, this sends data to the API and gets updated progress
    const progressMap: Record<number, number> = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };
    
    set((state) => ({
      profile: state.profile ? {
        ...state.profile,
        kycProgress: progressMap[step] || state.profile.kycProgress,
      } : null,
    }));
  },

  setKycModalOpen: (isOpen: boolean) => set({ isKycModalOpen: isOpen }),
  
  setCurrentKycStep: (step: number) => set({ currentKycStep: step }),

  mockSubmitKycForVerification: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success 100% for easier testing
      const isSuccess = true;

      if (isSuccess) {
        set((state) => ({
          profile: state.profile ? { ...state.profile, kycStatus: 'verified', kycProgress: 100 } : null,
          isKycModalOpen: false,
          isLoading: false
        }));

        return true;
      } else {
        set({ isLoading: false, error: 'Verification failed. Please try again.' });
        return false;
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An error occurred', isLoading: false });
      return false;
    }
  },

  resetDashboard: () => {
    set({
      profile: {
        id: 'agent-123',
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
  }
}));
