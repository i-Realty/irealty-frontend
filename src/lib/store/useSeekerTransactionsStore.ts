import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';
import type { TransactionStatus } from '@/lib/store/useTransactionsStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ── Types ──────────────────────────────────────────────────────────────

export type SeekerTransactionFlow =
  | 'inspection'
  | 'agent-rental'
  | 'agent-sale'
  | 'developer-purchase';

export type SeekerTabKey = 'all' | 'inspection' | 'purchases' | 'rentals';
export type SeekerStatusFilter = 'All' | TransactionStatus;

export interface DeveloperMilestone {
  stage: string;
  percentage: number;
  amount: number;
}

export interface SeekerTransactionDetail {
  id: string;
  date: string;
  propertyName: string;
  propertyType: string;
  clientName: string;
  clientAvatar: string;
  clientVerified: boolean;
  clientLabel: 'Client' | 'Developer';
  flow: SeekerTransactionFlow;
  inspectionType?: 'In Person' | 'Video Chat';
  amount: number;
  status: TransactionStatus;
  currentStep: number;
  escrowAmount: number;
  irealtyFee: number;
  propertyPrice: number;
  scheduledDate?: string;
  scheduledTime?: string;
  developerMilestones?: DeveloperMilestone[];
  reviewRating?: number;
  reviewComment?: string;
  propertyImage: string;
  propertyTag: 'For Sale' | 'For Rent';
  propertyLocation: string;
  propertyFullPrice: number;
  propertyBeds: number;
  propertyBaths: number;
  propertySqm: number;
}

interface SeekerTransactionsState {
  transactions: SeekerTransactionDetail[];
  selectedTransaction: SeekerTransactionDetail | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  activeTab: SeekerTabKey;
  statusFilter: SeekerStatusFilter;
  searchQuery: string;
  propertyTypeFilter: string;
  currentPage: number;

  setActiveTab: (tab: SeekerTabKey) => void;
  setStatusFilter: (f: SeekerStatusFilter) => void;
  setSearchQuery: (q: string) => void;
  setPropertyTypeFilter: (f: string) => void;
  setCurrentPage: (p: number) => void;

  fetchTransactions: () => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;
  confirmInspection: (id: string) => Promise<void>;
  confirmHandover: (id: string) => Promise<void>;
  approveMilestone: (id: string) => Promise<void>;
  makePayment: (id: string) => Promise<void>;
  submitReview: (id: string, rating: number, comment: string) => Promise<void>;

  /** @deprecated Use fetchTransactions() */
  fetchTransactionsMock: () => Promise<void>;
  /** @deprecated Use fetchTransactionById() */
  fetchTransactionByIdMock: (id: string) => Promise<void>;
  /** @deprecated Use confirmInspection() */
  confirmInspectionMock: (id: string) => Promise<void>;
  /** @deprecated Use confirmHandover() */
  confirmHandoverMock: (id: string) => Promise<void>;
  /** @deprecated Use approveMilestone() */
  approveMilestoneMock: (id: string) => Promise<void>;
  /** @deprecated Use makePayment() */
  makePaymentMock: (id: string) => Promise<void>;
  /** @deprecated Use submitReview() */
  submitReviewMock: (id: string, rating: number, comment: string) => Promise<void>;
}

// ── Mock Data ──────────────────────────────────────────────────────────

const mockSeekerTransactions: SeekerTransactionDetail[] = [
  {
    id: 'TRN-0932',
    date: '28 Aug 2025',
    propertyName: '3-Bed Duplex, Lekki',
    propertyType: 'Residential',
    clientName: 'Sarah Homes',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    clientVerified: true,
    clientLabel: 'Client',
    flow: 'inspection',
    inspectionType: 'Video Chat',
    amount: 20000,
    status: 'Pending',
    currentStep: 1,
    escrowAmount: 25000000,
    irealtyFee: 2500,
    propertyPrice: 25000,
    scheduledDate: 'Sun, Jul 2',
    scheduledTime: '11:00 AM - 1:00 PM',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop',
    propertyTag: 'For Sale',
    propertyLocation: 'Independence Layout, Enugu',
    propertyFullPrice: 20000000,
    propertyBeds: 5, propertyBaths: 3, propertySqm: 120,
  },
  {
    id: 'TRN-0933',
    date: '28 Aug 2025',
    propertyName: '3-Bed Duplex, Lekki',
    propertyType: 'Residential',
    clientName: 'Sarah Homes',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    clientVerified: true,
    clientLabel: 'Client',
    flow: 'inspection',
    inspectionType: 'In Person',
    amount: 20000,
    status: 'In-progress',
    currentStep: 2,
    escrowAmount: 25000000,
    irealtyFee: 2500,
    propertyPrice: 25000,
    scheduledDate: 'Sun, Jul 2',
    scheduledTime: '11:00 AM - 1:00 PM',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop',
    propertyTag: 'For Sale',
    propertyLocation: 'Independence Layout, Enugu',
    propertyFullPrice: 20000000,
    propertyBeds: 5, propertyBaths: 3, propertySqm: 120,
  },
  {
    id: 'TRN-0934',
    date: '28 Aug 2025',
    propertyName: '3-Bed Duplex, Lekki',
    propertyType: 'Land/Plots',
    clientName: 'Sarah Homes',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    clientVerified: true,
    clientLabel: 'Client',
    flow: 'inspection',
    inspectionType: 'Video Chat',
    amount: 20000,
    status: 'Completed',
    currentStep: 4,
    escrowAmount: 25000000,
    irealtyFee: 2500,
    propertyPrice: 25000,
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop',
    propertyTag: 'For Sale',
    propertyLocation: 'Independence Layout, Enugu',
    propertyFullPrice: 20000000,
    propertyBeds: 5, propertyBaths: 3, propertySqm: 120,
  },
  {
    id: 'TRN-0935',
    date: '28 Aug 2025',
    propertyName: '3-Bed Duplex, Lekki',
    propertyType: 'Commercial',
    clientName: 'Ada Obi',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    clientVerified: true,
    clientLabel: 'Client',
    flow: 'agent-rental',
    amount: 20000,
    status: 'Pending',
    currentStep: 1,
    escrowAmount: 25000000,
    irealtyFee: 2500,
    propertyPrice: 25000,
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
    propertyTag: 'For Rent',
    propertyLocation: 'Victoria Island, Lagos',
    propertyFullPrice: 3500000,
    propertyBeds: 2, propertyBaths: 2, propertySqm: 95,
  },
  {
    id: 'TRN-0936',
    date: '25 Aug 2025',
    propertyName: '5-Bed Mansion, Ikoyi',
    propertyType: 'Residential',
    clientName: 'Marcus Bell',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    clientVerified: true,
    clientLabel: 'Client',
    flow: 'agent-sale',
    amount: 200000,
    status: 'In-progress',
    currentStep: 2,
    escrowAmount: 25000000,
    irealtyFee: 2500,
    propertyPrice: 25000,
    propertyImage: 'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?q=80&w=600&auto=format&fit=crop',
    propertyTag: 'For Sale',
    propertyLocation: 'Ikoyi, Lagos',
    propertyFullPrice: 85000000,
    propertyBeds: 5, propertyBaths: 4, propertySqm: 350,
  },
  {
    id: 'TRN-0937',
    date: '22 Aug 2025',
    propertyName: '3-Bed Duplex, Lekki',
    propertyType: 'Residential',
    clientName: 'Sarah Homes',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    clientVerified: true,
    clientLabel: 'Developer',
    flow: 'developer-purchase',
    amount: 20000,
    status: 'In-progress',
    currentStep: 2,
    escrowAmount: 25000000,
    irealtyFee: 2500,
    propertyPrice: 25000,
    developerMilestones: [
      { stage: 'Foundation / Lock-Up Stage', percentage: 30, amount: 7500000 },
      { stage: 'Roofing / Structure Completion', percentage: 30, amount: 7500000 },
      { stage: 'Handover / Finishing', percentage: 20, amount: 5000000 },
    ],
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop',
    propertyTag: 'For Sale',
    propertyLocation: 'Independence Layout, Enugu',
    propertyFullPrice: 20000000,
    propertyBeds: 5, propertyBaths: 3, propertySqm: 120,
  },
  {
    id: 'TRN-0938',
    date: '20 Aug 2025',
    propertyName: 'Office Space, Ikeja GRA',
    propertyType: 'Commercial',
    clientName: 'Fatima Ibrahim',
    clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    clientVerified: true,
    clientLabel: 'Client',
    flow: 'agent-rental',
    amount: 20000,
    status: 'Declined',
    currentStep: 1,
    escrowAmount: 25000000,
    irealtyFee: 2500,
    propertyPrice: 25000,
    propertyImage: 'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?q=80&w=600&auto=format&fit=crop',
    propertyTag: 'For Rent',
    propertyLocation: 'Ikeja GRA, Lagos',
    propertyFullPrice: 5000000,
    propertyBeds: 0, propertyBaths: 2, propertySqm: 200,
  },
];

// ── Helpers for mock action updates ─────────────────────────────────────

function updateTx(
  state: SeekerTransactionsState,
  id: string,
  patch: Partial<SeekerTransactionDetail>,
) {
  const transactions = state.transactions.map((t) =>
    t.id !== id ? t : { ...t, ...patch },
  );
  const selectedTransaction =
    state.selectedTransaction?.id === id
      ? { ...state.selectedTransaction, ...patch }
      : state.selectedTransaction;
  return { transactions, selectedTransaction, isActionLoading: false };
}

// ── Store ──────────────────────────────────────────────────────────────

export const useSeekerTransactionsStore = create<SeekerTransactionsState>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  activeTab: 'all',
  statusFilter: 'All',
  searchQuery: '',
  propertyTypeFilter: '',
  currentPage: 1,

  setActiveTab: (tab) => set({ activeTab: tab, statusFilter: 'All', currentPage: 1 }),
  setStatusFilter: (f) => set({ statusFilter: f, currentPage: 1 }),
  setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
  setPropertyTypeFilter: (f) => set({ propertyTypeFilter: f, currentPage: 1 }),
  setCurrentPage: (p) => set({ currentPage: p }),

  // ── Fetch all ─────────────────────────────────────────────────────

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ transactions: SeekerTransactionDetail[] }>('/api/seeker/transactions');
        set({ transactions: data.transactions, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({ transactions: mockSeekerTransactions, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load transactions', isLoading: false });
    }
  },

  // ── Fetch by ID ───────────────────────────────────────────────────

  fetchTransactionById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ transaction: SeekerTransactionDetail }>(`/api/seeker/transactions/${id}`);
        set({ selectedTransaction: data.transaction, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const tx =
          get().transactions.find((t) => t.id === id) ??
          mockSeekerTransactions.find((t) => t.id === id) ??
          null;
        set({ selectedTransaction: tx, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load transaction', isLoading: false });
    }
  },

  // ── Actions ───────────────────────────────────────────────────────

  confirmInspection: async (id) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/seeker/transactions/${id}/confirm-inspection`);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((s) => updateTx(s, id, { status: 'Completed' as TransactionStatus, currentStep: 3 }));
  },

  confirmHandover: async (id) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/seeker/transactions/${id}/confirm-handover`);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((s) => updateTx(s, id, { status: 'Completed' as TransactionStatus, currentStep: 3 }));
  },

  approveMilestone: async (id) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/seeker/transactions/${id}/approve-milestone`);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((s) => {
      const tx = s.transactions.find((t) => t.id === id);
      const nextStep = tx ? Math.min(tx.currentStep + 1, 5) : 3;
      return updateTx(s, id, { currentStep: nextStep });
    });
  },

  makePayment: async (id) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/seeker/transactions/${id}/make-payment`);
    } else {
      await new Promise((r) => setTimeout(r, 1000));
    }
    set((s) => {
      const tx = s.transactions.find((t) => t.id === id);
      const nextStep = tx ? Math.min(tx.currentStep + 1, 5) : 3;
      return updateTx(s, id, { currentStep: nextStep });
    });
  },

  submitReview: async (id, rating, comment) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await apiPost(`/api/seeker/transactions/${id}/submit-review`, { rating, comment });
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((s) => {
      const tx = s.transactions.find((t) => t.id === id);
      return updateTx(s, id, {
        reviewRating: rating,
        reviewComment: comment,
        currentStep: tx ? tx.currentStep + 1 : 5,
      });
    });
  },

  // ── Backward-compatible aliases ───────────────────────────────────

  fetchTransactionsMock: async () => get().fetchTransactions(),
  fetchTransactionByIdMock: async (id) => get().fetchTransactionById(id),
  confirmInspectionMock: async (id) => get().confirmInspection(id),
  confirmHandoverMock: async (id) => get().confirmHandover(id),
  approveMilestoneMock: async (id) => get().approveMilestone(id),
  makePaymentMock: async (id) => get().makePayment(id),
  submitReviewMock: async (id, rating, comment) => get().submitReview(id, rating, comment),
}));
