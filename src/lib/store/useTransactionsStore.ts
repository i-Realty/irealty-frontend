import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';
import { usePropertyTransactionsStore, mapBackendTransaction, type BackendPropertyTransaction } from './usePropertyTransactionsStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// Backend → TransactionDetail adapter
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToTransactionDetail(t: BackendPropertyTransaction): TransactionDetail {
  const pt = mapBackendTransaction(t);
  return {
    id:                  pt.id,
    date:                pt.date,
    propertyName:        pt.propertyTitle,
    propertyType:        pt.propertyType,
    clientName:          pt.buyerName,
    clientAvatar:        pt.buyerAvatar,
    clientVerified:      pt.buyerVerified,
    transactionCategory: pt.type === 'inspection' ? 'Inspection Fee' : pt.type === 'rental' ? 'Rental' : 'Sale',
    amount:              pt.amount,
    status:              pt.status === 'Cancelled' ? 'Declined' : pt.status,
    currentStep:         pt.step,
    escrowAmount:        pt.escrowAmount,
    propertyPrice:       pt.propertyPrice,
    scheduledDate:       pt.scheduledDate,
    scheduledTime:       pt.scheduledTime,
    propertyImage:       pt.propertyImage,
    propertyTag:         pt.propertyTag,
    propertyLocation:    pt.propertyLocation,
    propertyFullPrice:   pt.propertyPrice,
    propertyBeds:        pt.propertyBeds,
    propertyBaths:       pt.propertyBaths,
    propertySqm:         pt.propertySqm,
  };
}

// ── Types ──────────────────────────────────────────────────────────────

export type TransactionCategory = 'Inspection Fee' | 'Sale' | 'Rental';
export type TransactionStatus = 'Pending' | 'In-progress' | 'Completed' | 'Declined';
export type InspectionType = 'In Person' | 'Video Chat';
export type TabKey = 'all' | 'inspection' | 'sales' | 'rentals';
export type StatusFilter = 'All' | TransactionStatus;

export interface TransactionDetail {
  id: string;
  date: string;
  propertyName: string;
  propertyType: string;
  clientName: string;
  clientAvatar: string;
  clientVerified: boolean;
  transactionCategory: TransactionCategory;
  inspectionType?: InspectionType;
  amount: number;
  status: TransactionStatus;
  currentStep: number;

  escrowAmount: number;
  propertyPrice: number;
  irealtyFee?: number;

  scheduledDate?: string;
  scheduledTime?: string;

  propertyImage: string;
  propertyTag: 'For Sale' | 'For Rent';
  propertyLocation: string;
  propertyFullPrice: number;
  propertyBeds: number;
  propertyBaths: number;
  propertySqm: number;
}

interface TransactionsState {
  transactions: TransactionDetail[];
  selectedTransaction: TransactionDetail | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  activeTab: TabKey;
  statusFilter: StatusFilter;
  searchQuery: string;
  propertyTypeFilter: string;
  inspectionTypeFilter: string;
  currentPage: number;

  setActiveTab: (tab: TabKey) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setSearchQuery: (query: string) => void;
  setPropertyTypeFilter: (filter: string) => void;
  setInspectionTypeFilter: (filter: string) => void;
  setCurrentPage: (page: number) => void;

  fetchTransactions: () => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;
  acceptTransaction: (id: string) => Promise<void>;
  declineTransaction: (id: string) => Promise<void>;
  confirmHandover: (id: string) => Promise<void>;

  /** @deprecated Use fetchTransactions() */
  fetchTransactionsMock: () => Promise<void>;
  /** @deprecated Use fetchTransactionById() */
  fetchTransactionByIdMock: (id: string) => Promise<void>;
  /** @deprecated Use acceptTransaction() */
  acceptTransactionMock: (id: string) => Promise<void>;
  /** @deprecated Use declineTransaction() */
  declineTransactionMock: (id: string) => Promise<void>;
  /** @deprecated Use confirmHandover() */
  confirmHandoverMock: (id: string) => Promise<void>;
}

// ── Mock Data ──────────────────────────────────────────────────────────

const mockTransactions: TransactionDetail[] = [
  { id: 'TRN-0932', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Residential', clientName: 'Sarah Homes', clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Inspection Fee', inspectionType: 'Video Chat', amount: 25000, status: 'Pending', currentStep: 1, escrowAmount: 25000000, propertyPrice: 25000, scheduledDate: 'Sun, Jul 2', scheduledTime: '11:00 AM - 1:00 PM', propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop', propertyTag: 'For Sale', propertyLocation: 'Independence Layout, Enugu', propertyFullPrice: 20000000, propertyBeds: 5, propertyBaths: 3, propertySqm: 120 },
  { id: 'TRN-0933', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Residential', clientName: 'Marcus Bell', clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', clientVerified: false, transactionCategory: 'Inspection Fee', inspectionType: 'In Person', amount: 25000, status: 'Pending', currentStep: 1, escrowAmount: 25000000, propertyPrice: 25000, scheduledDate: 'Sun, Jul 2', scheduledTime: '11:00 AM - 1:00 PM', propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop', propertyTag: 'For Sale', propertyLocation: 'Independence Layout, Enugu', propertyFullPrice: 20000000, propertyBeds: 5, propertyBaths: 3, propertySqm: 120 },
  { id: 'TRN-0934', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Commercial', clientName: 'Amara Osei', clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Inspection Fee', inspectionType: 'Video Chat', amount: 25000, status: 'In-progress', currentStep: 2, escrowAmount: 25000000, propertyPrice: 25000, scheduledDate: 'Sun, Jul 2', scheduledTime: '11:00 AM - 1:00 PM', propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop', propertyTag: 'For Sale', propertyLocation: 'Independence Layout, Enugu', propertyFullPrice: 20000000, propertyBeds: 5, propertyBaths: 3, propertySqm: 120 },
  { id: 'TRN-0935', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Land/Plots', clientName: 'Ngozi Adeyemi', clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Inspection Fee', inspectionType: 'In Person', amount: 25000, status: 'Completed', currentStep: 3, escrowAmount: 25000000, propertyPrice: 25000, irealtyFee: 2500, propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop', propertyTag: 'For Sale', propertyLocation: 'Independence Layout, Enugu', propertyFullPrice: 20000000, propertyBeds: 5, propertyBaths: 3, propertySqm: 120 },
  { id: 'TRN-0936', date: '28 Aug 2025', propertyName: '3-Bed Duplex, Lekki', propertyType: 'Residential', clientName: 'Emeka Nwosu', clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop', clientVerified: false, transactionCategory: 'Inspection Fee', inspectionType: 'Video Chat', amount: 25000, status: 'Declined', currentStep: 1, escrowAmount: 25000000, propertyPrice: 25000, propertyImage: '/images/house1.jpg', propertyTag: 'For Sale', propertyLocation: 'Independence Layout, Enugu', propertyFullPrice: 20000000, propertyBeds: 5, propertyBaths: 3, propertySqm: 120 },
  { id: 'TRN-0937', date: '25 Aug 2025', propertyName: '5-Bed Mansion, Ikoyi', propertyType: 'Residential', clientName: 'Ada Obi', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Sale', amount: 85000000, status: 'Pending', currentStep: 1, escrowAmount: 25000000, propertyPrice: 25000, propertyImage: '/images/house1.jpg', propertyTag: 'For Sale', propertyLocation: 'Ikoyi, Lagos', propertyFullPrice: 85000000, propertyBeds: 5, propertyBaths: 4, propertySqm: 350 },
  { id: 'TRN-0938', date: '24 Aug 2025', propertyName: '2-Bed Flat, Victoria Island', propertyType: 'Residential', clientName: 'Emeka Nwankwo', clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', clientVerified: false, transactionCategory: 'Rental', amount: 3500000, status: 'Pending', currentStep: 1, escrowAmount: 25000000, propertyPrice: 25000, propertyImage: '/images/house1.jpg', propertyTag: 'For Rent', propertyLocation: 'Victoria Island, Lagos', propertyFullPrice: 3500000, propertyBeds: 2, propertyBaths: 2, propertySqm: 95 },
  { id: 'TRN-0939', date: '22 Aug 2025', propertyName: 'Office Space, Ikeja GRA', propertyType: 'Commercial', clientName: 'Fatima Ibrahim', clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Sale', amount: 45000000, status: 'In-progress', currentStep: 2, escrowAmount: 25000000, propertyPrice: 25000, propertyImage: '/images/house1.jpg', propertyTag: 'For Sale', propertyLocation: 'Ikeja GRA, Lagos', propertyFullPrice: 45000000, propertyBeds: 0, propertyBaths: 2, propertySqm: 200 },
  { id: 'TRN-0940', date: '20 Aug 2025', propertyName: '4-Bed Semi-Detached, Ajah', propertyType: 'Residential', clientName: 'Chidi Okeke', clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Rental', amount: 5000000, status: 'In-progress', currentStep: 3, escrowAmount: 25000000, propertyPrice: 25000, propertyImage: '/images/house1.jpg', propertyTag: 'For Rent', propertyLocation: 'Ajah, Lagos', propertyFullPrice: 5000000, propertyBeds: 4, propertyBaths: 3, propertySqm: 180 },
  { id: 'TRN-0941', date: '18 Aug 2025', propertyName: 'Studio Apartment, Surulere', propertyType: 'Residential', clientName: 'Grace Adekunle', clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Sale', amount: 35000000, status: 'Completed', currentStep: 4, escrowAmount: 25000000, propertyPrice: 25000, propertyImage: '/images/house1.jpg', propertyTag: 'For Sale', propertyLocation: 'Surulere, Lagos', propertyFullPrice: 35000000, propertyBeds: 1, propertyBaths: 1, propertySqm: 45 },
  { id: 'TRN-0942', date: '15 Aug 2025', propertyName: 'Warehouse, Apapa', propertyType: 'Commercial', clientName: 'Tunde Bakare', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Rental', amount: 12000000, status: 'Completed', currentStep: 4, escrowAmount: 25000000, propertyPrice: 25000, propertyImage: '/images/house1.jpg', propertyTag: 'For Rent', propertyLocation: 'Apapa, Lagos', propertyFullPrice: 12000000, propertyBeds: 0, propertyBaths: 1, propertySqm: 500 },
  { id: 'TRN-0943', date: '12 Aug 2025', propertyName: '3-Bed Bungalow, Magodo', propertyType: 'Residential', clientName: 'Ngozi Okafor', clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', clientVerified: true, transactionCategory: 'Inspection Fee', inspectionType: 'In Person', amount: 25000, status: 'Pending', currentStep: 1, escrowAmount: 25000000, propertyPrice: 25000, scheduledDate: 'Wed, Aug 15', scheduledTime: '2:00 PM - 4:00 PM', propertyImage: '/images/house1.jpg', propertyTag: 'For Sale', propertyLocation: 'Magodo, Lagos', propertyFullPrice: 25000000, propertyBeds: 3, propertyBaths: 2, propertySqm: 150 },
];

// ── Optimistic update helper ──────────────────────────────────────────

function patchTx(
  state: TransactionsState,
  id: string,
  patch: Partial<TransactionDetail>,
) {
  const transactions = state.transactions.map((t) =>
    t.id !== id ? t : { ...t, ...patch }
  );
  const selectedTransaction =
    state.selectedTransaction?.id === id
      ? { ...state.selectedTransaction, ...patch }
      : state.selectedTransaction;
  return { transactions, selectedTransaction, isActionLoading: false };
}

// ── Store ──────────────────────────────────────────────────────────────

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  activeTab: 'all',
  statusFilter: 'All',
  searchQuery: '',
  propertyTypeFilter: '',
  inspectionTypeFilter: '',
  currentPage: 1,

  setActiveTab: (tab) => set({ activeTab: tab, statusFilter: 'All', currentPage: 1, inspectionTypeFilter: '' }),
  setStatusFilter: (filter) => set({ statusFilter: filter, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setPropertyTypeFilter: (filter) => set({ propertyTypeFilter: filter, currentPage: 1 }),
  setInspectionTypeFilter: (filter) => set({ inspectionTypeFilter: filter, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        await usePropertyTransactionsStore.getState().fetchTransactions();
        const transactions = usePropertyTransactionsStore.getState().transactions.map(mapToTransactionDetail);
        set({ transactions, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({ transactions: mockTransactions, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
    }
  },

  fetchTransactionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const raw = await apiGet<BackendPropertyTransaction>(`/api/property-transactions/${id}`);
        set({ selectedTransaction: mapToTransactionDetail(raw), isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const tx = get().transactions.length > 0
          ? get().transactions.find((t) => t.id === id) || null
          : mockTransactions.find((t) => t.id === id) || null;
        set({ selectedTransaction: tx, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
    }
  },

  acceptTransaction: async (id: string) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await usePropertyTransactionsStore.getState().acceptTransaction(id);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((state) => patchTx(state, id, { status: 'In-progress' as TransactionStatus, currentStep: 2 }));
  },

  declineTransaction: async (id: string) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await usePropertyTransactionsStore.getState().declineTransaction(id);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((state) => patchTx(state, id, { status: 'Declined' as TransactionStatus }));
  },

  confirmHandover: async (id: string) => {
    set({ isActionLoading: true });
    if (USE_API) {
      await usePropertyTransactionsStore.getState().confirmHandover(id);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    set((state) => patchTx(state, id, { currentStep: 3, status: 'In-progress' as TransactionStatus }));
  },

  // Backward-compatible aliases
  fetchTransactionsMock: async () => get().fetchTransactions(),
  fetchTransactionByIdMock: async (id) => get().fetchTransactionById(id),
  acceptTransactionMock: async (id) => get().acceptTransaction(id),
  declineTransactionMock: async (id) => get().declineTransaction(id),
  confirmHandoverMock: async (id) => get().confirmHandover(id),
}));
