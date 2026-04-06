import { create } from 'zustand';
import type { TransactionStatus } from '@/lib/store/useTransactionsStore';

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
  clientName: string;       // The counterpart: agent / developer / landlord name
  clientAvatar: string;
  clientVerified: boolean;
  clientLabel: 'Client' | 'Developer';
  flow: SeekerTransactionFlow;
  inspectionType?: 'In Person' | 'Video Chat';
  amount: number;
  status: TransactionStatus;
  currentStep: number;

  // Financial
  escrowAmount: number;
  irealtyFee: number;
  propertyPrice: number;

  // Schedule (inspection)
  scheduledDate?: string;
  scheduledTime?: string;

  // Developer milestones
  developerMilestones?: DeveloperMilestone[];

  // Feedback
  reviewRating?: number;    // 1–5, set on submit
  reviewComment?: string;

  // Property detail tab
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

  // Filters
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

  fetchTransactionsMock: () => Promise<void>;
  fetchTransactionByIdMock: (id: string) => Promise<void>;
  confirmInspectionMock: (id: string) => Promise<void>;
  confirmHandoverMock: (id: string) => Promise<void>;
  approveMilestoneMock: (id: string) => Promise<void>;
  makePaymentMock: (id: string) => Promise<void>;
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

  fetchTransactionsMock: async () => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 600));
    set({ transactions: mockSeekerTransactions, isLoading: false });
  },

  fetchTransactionByIdMock: async (id) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));
    const tx =
      get().transactions.find((t) => t.id === id) ??
      mockSeekerTransactions.find((t) => t.id === id) ??
      null;
    set({ selectedTransaction: tx, isLoading: false });
  },

  confirmInspectionMock: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id !== id ? t : { ...t, status: 'Completed' as TransactionStatus, currentStep: 3 }
      );
      const sel = state.selectedTransaction?.id === id
        ? { ...state.selectedTransaction, status: 'Completed' as TransactionStatus, currentStep: 3 }
        : state.selectedTransaction;
      return { transactions: updated, selectedTransaction: sel, isActionLoading: false };
    });
  },

  confirmHandoverMock: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id !== id ? t : { ...t, status: 'Completed' as TransactionStatus, currentStep: 3 }
      );
      const sel = state.selectedTransaction?.id === id
        ? { ...state.selectedTransaction, status: 'Completed' as TransactionStatus, currentStep: 3 }
        : state.selectedTransaction;
      return { transactions: updated, selectedTransaction: sel, isActionLoading: false };
    });
  },

  approveMilestoneMock: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => {
      const updated = state.transactions.map((t) => {
        if (t.id !== id) return t;
        const nextStep = Math.min(t.currentStep + 1, 5);
        return { ...t, currentStep: nextStep };
      });
      const sel = state.selectedTransaction?.id === id
        ? { ...state.selectedTransaction, currentStep: Math.min(state.selectedTransaction.currentStep + 1, 5) }
        : state.selectedTransaction;
      return { transactions: updated, selectedTransaction: sel, isActionLoading: false };
    });
  },

  makePaymentMock: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    set((state) => {
      const updated = state.transactions.map((t) => {
        if (t.id !== id) return t;
        const nextStep = Math.min(t.currentStep + 1, 5);
        return { ...t, currentStep: nextStep };
      });
      const sel = state.selectedTransaction?.id === id
        ? { ...state.selectedTransaction, currentStep: Math.min(state.selectedTransaction.currentStep + 1, 5) }
        : state.selectedTransaction;
      return { transactions: updated, selectedTransaction: sel, isActionLoading: false };
    });
  },

  submitReviewMock: async (id, rating, comment) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id !== id ? t : { ...t, reviewRating: rating, reviewComment: comment, currentStep: t.currentStep + 1 }
      );
      const sel = state.selectedTransaction?.id === id
        ? { ...state.selectedTransaction, reviewRating: rating, reviewComment: comment }
        : state.selectedTransaction;
      return { transactions: updated, selectedTransaction: sel, isActionLoading: false };
    });
  },
}));
