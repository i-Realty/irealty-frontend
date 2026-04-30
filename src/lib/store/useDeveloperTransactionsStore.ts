import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export type DeveloperTabKey = 'all' | 'pending' | 'in-progress' | 'completed' | 'declined';
export type DeveloperTransactionStatus = 'Pending' | 'Completed' | 'Declined' | 'In-progress';

export interface DeveloperMilestone {
  name: string;
  percentage: number;
  status: 'completed' | 'active' | 'pending';
}

export interface DeveloperTransactionDetail {
  id: string;
  date: string;
  projectName: string;
  unitName: string;
  propertyType: string;
  buyerName: string;
  buyerAvatar: string;
  buyerVerified: boolean;
  totalAmount: number;
  paidAmount: number;
  progress: string;
  status: DeveloperTransactionStatus;
  currentStep: number;

  milestones: DeveloperMilestone[];

  escrowAmount: number;
  propertyPrice: number;

  propertyImage: string;
  propertyLocation: string;
  beds: number;
  baths: number;
  sqm: number;
  tag: string;
}

interface DeveloperTransactionsState {
  transactions: DeveloperTransactionDetail[];
  selectedTransaction: DeveloperTransactionDetail | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  activeTab: DeveloperTabKey;
  statusFilter: string;
  searchQuery: string;
  propertyTypeFilter: string;
  currentPage: number;

  setActiveTab: (tab: DeveloperTabKey) => void;
  setStatusFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setPropertyTypeFilter: (filter: string) => void;
  setCurrentPage: (page: number) => void;

  fetchTransactions: () => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;
  acceptTransaction: (id: string) => Promise<void>;
  declineTransaction: (id: string) => Promise<void>;
  uploadMilestoneDocs: (id: string, milestoneIndex: number) => Promise<void>;

  /** @deprecated Use fetchTransactions() */
  fetchTransactionsMock: () => Promise<void>;
  /** @deprecated Use fetchTransactionById() */
  fetchTransactionByIdMock: (id: string) => Promise<void>;
  /** @deprecated Use acceptTransaction() */
  acceptTransactionMock: (id: string) => Promise<void>;
  /** @deprecated Use declineTransaction() */
  declineTransactionMock: (id: string) => Promise<void>;
  /** @deprecated Use uploadMilestoneDocs() */
  uploadMilestoneDocsMock: (id: string, milestoneIndex: number) => Promise<void>;
}

const BASE_MILESTONES: DeveloperMilestone[] = [
  { name: 'Foundation / Lock-Up Stage', percentage: 30, status: 'pending' },
  { name: 'Roofing / Structure Completion', percentage: 30, status: 'pending' },
  { name: 'Handover / Finishing', percentage: 20, status: 'pending' },
];

function buildMilestones(
  status: DeveloperTransactionStatus,
  completedCount: number,
): DeveloperMilestone[] {
  return BASE_MILESTONES.map((m, i) => {
    if (status === 'Completed') return { ...m, status: 'completed' as const };
    if (status === 'Declined') return { ...m, status: 'pending' as const };
    if (i < completedCount) return { ...m, status: 'completed' as const };
    if (i === completedCount) return { ...m, status: 'active' as const };
    return m;
  });
}

const generateMockTransactions = (): DeveloperTransactionDetail[] => [
  {
    id: 'TXN-0932',
    date: '28 Aug 2025',
    projectName: 'Lekki Gardens Phase 3',
    unitName: 'Unit A1',
    propertyType: 'Residential',
    buyerName: 'Sarah Homes',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 45000000,
    paidAmount: 9000000,
    progress: '0/3 Milestones',
    status: 'Pending',
    currentStep: 1,
    milestones: buildMilestones('Pending', 0),
    escrowAmount: 9000000,
    propertyPrice: 45000000,
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Lekki, Lagos',
    beds: 3,
    baths: 3,
    sqm: 150,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0933',
    date: '25 Aug 2025',
    projectName: '3-Bed Duplex, Enugu',
    unitName: 'Unit B2',
    propertyType: 'Residential',
    buyerName: 'Marcus Bell',
    buyerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    buyerVerified: false,
    totalAmount: 35000000,
    paidAmount: 35000000,
    progress: '3/3 Milestones',
    status: 'Completed',
    currentStep: 5,
    milestones: buildMilestones('Completed', 3),
    escrowAmount: 35000000,
    propertyPrice: 35000000,
    propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Independence Layout, Enugu',
    beds: 3,
    baths: 2,
    sqm: 120,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0934',
    date: '22 Aug 2025',
    projectName: 'Opal Residences Tower',
    unitName: 'Unit C3',
    propertyType: 'Commercial',
    buyerName: 'Amara Osei',
    buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 60000000,
    paidAmount: 18000000,
    progress: '1/3 Milestones',
    status: 'In-progress',
    currentStep: 2,
    milestones: buildMilestones('In-progress', 1),
    escrowAmount: 18000000,
    propertyPrice: 60000000,
    propertyImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Victoria Island, Lagos',
    beds: 0,
    baths: 2,
    sqm: 200,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0935',
    date: '20 Aug 2025',
    projectName: '4-Bed Semi-Detached, Ajah',
    unitName: 'Unit D4',
    propertyType: 'Residential',
    buyerName: 'Ngozi Adeyemi',
    buyerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 28000000,
    paidAmount: 5600000,
    progress: '0/3 Milestones',
    status: 'Declined',
    currentStep: 1,
    milestones: buildMilestones('Declined', 0),
    escrowAmount: 5600000,
    propertyPrice: 28000000,
    propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Ajah, Lagos',
    beds: 4,
    baths: 3,
    sqm: 180,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0936',
    date: '18 Aug 2025',
    projectName: 'Green Valley Estate',
    unitName: 'Unit E5',
    propertyType: 'Off-Plan',
    buyerName: 'Emeka Nwosu',
    buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 50000000,
    paidAmount: 10000000,
    progress: '0/3 Milestones',
    status: 'Pending',
    currentStep: 1,
    milestones: buildMilestones('Pending', 0),
    escrowAmount: 10000000,
    propertyPrice: 50000000,
    propertyImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Magodo, Lagos',
    beds: 5,
    baths: 4,
    sqm: 250,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0937',
    date: '15 Aug 2025',
    projectName: 'Ikeja Tech Hub',
    unitName: 'Suite F1',
    propertyType: 'Commercial',
    buyerName: 'Fatima Ibrahim',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 75000000,
    paidAmount: 45000000,
    progress: '2/3 Milestones',
    status: 'In-progress',
    currentStep: 3,
    milestones: buildMilestones('In-progress', 2),
    escrowAmount: 45000000,
    propertyPrice: 75000000,
    propertyImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Ikeja GRA, Lagos',
    beds: 0,
    baths: 4,
    sqm: 350,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0938',
    date: '12 Aug 2025',
    projectName: 'Asokoro Villas',
    unitName: 'Villa G2',
    propertyType: 'Residential',
    buyerName: 'Ada Obi',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    buyerVerified: false,
    totalAmount: 90000000,
    paidAmount: 90000000,
    progress: '3/3 Milestones',
    status: 'Completed',
    currentStep: 5,
    milestones: buildMilestones('Completed', 3),
    escrowAmount: 90000000,
    propertyPrice: 90000000,
    propertyImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Asokoro, Abuja',
    beds: 5,
    baths: 5,
    sqm: 400,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0939',
    date: '10 Aug 2025',
    projectName: 'Sunrise Court, Ikoyi',
    unitName: 'Unit H3',
    propertyType: 'Off-Plan',
    buyerName: 'Tunde Bakare',
    buyerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 120000000,
    paidAmount: 36000000,
    progress: '1/3 Milestones',
    status: 'In-progress',
    currentStep: 2,
    milestones: buildMilestones('In-progress', 1),
    escrowAmount: 36000000,
    propertyPrice: 120000000,
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Ikoyi, Lagos',
    beds: 4,
    baths: 4,
    sqm: 220,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0940',
    date: '08 Aug 2025',
    projectName: 'Maitama Heights',
    unitName: 'Penthouse J1',
    propertyType: 'Residential',
    buyerName: 'Grace Adekunle',
    buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 150000000,
    paidAmount: 30000000,
    progress: '0/3 Milestones',
    status: 'Pending',
    currentStep: 1,
    milestones: buildMilestones('Pending', 0),
    escrowAmount: 30000000,
    propertyPrice: 150000000,
    propertyImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Maitama, Abuja',
    beds: 6,
    baths: 6,
    sqm: 500,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0941',
    date: '05 Aug 2025',
    projectName: 'Banana Island Terrace',
    unitName: 'Unit K4',
    propertyType: 'Residential',
    buyerName: 'Chidi Okeke',
    buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 200000000,
    paidAmount: 200000000,
    progress: '3/3 Milestones',
    status: 'Completed',
    currentStep: 5,
    milestones: buildMilestones('Completed', 3),
    escrowAmount: 200000000,
    propertyPrice: 200000000,
    propertyImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Banana Island, Lagos',
    beds: 5,
    baths: 5,
    sqm: 380,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0942',
    date: '02 Aug 2025',
    projectName: 'GRA Commercial Plaza',
    unitName: 'Shop L2',
    propertyType: 'Commercial',
    buyerName: 'Kemi Afolabi',
    buyerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    buyerVerified: false,
    totalAmount: 25000000,
    paidAmount: 5000000,
    progress: '0/3 Milestones',
    status: 'Declined',
    currentStep: 1,
    milestones: buildMilestones('Declined', 0),
    escrowAmount: 5000000,
    propertyPrice: 25000000,
    propertyImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'GRA, Port Harcourt',
    beds: 0,
    baths: 2,
    sqm: 150,
    tag: 'For Sale',
  },
  {
    id: 'TXN-0943',
    date: '30 Jul 2025',
    projectName: 'Wuse Zone 5 Flats',
    unitName: 'Flat M3',
    propertyType: 'Off-Plan',
    buyerName: 'Obinna Eze',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    buyerVerified: true,
    totalAmount: 38000000,
    paidAmount: 11400000,
    progress: '1/3 Milestones',
    status: 'In-progress',
    currentStep: 2,
    milestones: buildMilestones('In-progress', 1),
    escrowAmount: 11400000,
    propertyPrice: 38000000,
    propertyImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop',
    propertyLocation: 'Wuse, Abuja',
    beds: 3,
    baths: 2,
    sqm: 110,
    tag: 'For Sale',
  },
];

export const useDeveloperTransactionsStore = create<DeveloperTransactionsState>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  activeTab: 'all',
  statusFilter: 'all',
  searchQuery: '',
  propertyTypeFilter: 'all',
  currentPage: 1,

  setActiveTab: (tab) => set({ activeTab: tab, currentPage: 1 }),
  setStatusFilter: (filter) => set({ statusFilter: filter, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setPropertyTypeFilter: (filter) => set({ propertyTypeFilter: filter, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ transactions: DeveloperTransactionDetail[] }>('/api/property-transactions');
        set({ transactions: data.transactions, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({ transactions: generateMockTransactions(), isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
    }
  },

  fetchTransactionById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ transaction: DeveloperTransactionDetail }>(`/api/developer/transactions/${id}`);
        set({ selectedTransaction: data.transaction, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const { transactions } = get();
        const found = transactions.find((t) => t.id === id) || generateMockTransactions()[0];
        set({ selectedTransaction: { ...found, id }, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
    }
  },

  acceptTransaction: async (id) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/property-transactions/${id}/accept`);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((s) => {
      if (!s.selectedTransaction) return { isActionLoading: false };
      const milestones = s.selectedTransaction.milestones.map((m, i) =>
        i === 0 ? { ...m, status: 'active' as const } : m
      );
      return { selectedTransaction: { ...s.selectedTransaction, status: 'In-progress', currentStep: 2, milestones }, isActionLoading: false };
    });
  },

  declineTransaction: async (id) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/property-transactions/${id}/decline`);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((s) => ({
      selectedTransaction: s.selectedTransaction ? { ...s.selectedTransaction, status: 'Declined' } : null,
      isActionLoading: false,
    }));
  },

  uploadMilestoneDocs: async (id, milestoneIndex) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/developer/transactions/${id}/milestones/${milestoneIndex}/docs`);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((s) => {
      if (!s.selectedTransaction) return { isActionLoading: false };
      const milestones = s.selectedTransaction.milestones.map((m, i) => {
        if (i === milestoneIndex) return { ...m, status: 'completed' as const };
        if (i === milestoneIndex + 1) return { ...m, status: 'active' as const };
        return m;
      });
      const allDone = milestones.every((m) => m.status === 'completed');
      return {
        selectedTransaction: { ...s.selectedTransaction, milestones, currentStep: allDone ? 5 : s.selectedTransaction.currentStep + 1, status: allDone ? 'Completed' : s.selectedTransaction.status },
        isActionLoading: false,
      };
    });
  },

  // Backward-compatible aliases
  fetchTransactionsMock: async () => get().fetchTransactions(),
  fetchTransactionByIdMock: async (id) => get().fetchTransactionById(id),
  acceptTransactionMock: async (id) => get().acceptTransaction(id),
  declineTransactionMock: async (id) => get().declineTransaction(id),
  uploadMilestoneDocsMock: async (id, milestoneIndex) => get().uploadMilestoneDocs(id, milestoneIndex),
}));
