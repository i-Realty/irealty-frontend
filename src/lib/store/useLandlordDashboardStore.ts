import { create } from 'zustand';
import { apiGet } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ── Types ──────────────────────────────────────────────────────────────

export interface LandlordStats {
  totalProperties: number;
  occupiedUnits: number;
  vacantUnits: number;
  monthlyIncome: number;
}

export type LandlordPropertyStatus = 'Occupied' | 'Vacant' | 'Maintenance';
export type LandlordPropertyTab = 'All' | 'Occupied' | 'Vacant' | 'Maintenance';

export interface LandlordProperty {
  id: string;
  title: string;
  image: string;
  location: string;
  type: string;
  monthlyRent: number;
  status: LandlordPropertyStatus;
  tenant?: string;
  leaseEnd?: string;
}

export type LandlordTransactionType = 'Rent' | 'Deposit' | 'Maintenance' | 'Service Fee';
export type LandlordTransactionStatus = 'Pending' | 'Completed' | 'Failed';
export type LandlordTransactionTabKey = 'All' | 'Rent' | 'Deposit' | 'Maintenance' | 'Service Fee';
export type LandlordStatusFilter = 'All' | LandlordTransactionStatus;

export interface LandlordTransaction {
  id: string;
  date: string;
  propertyName: string;
  tenantName: string;
  amount: number;
  type: LandlordTransactionType;
  status: LandlordTransactionStatus;
}

// ── Mock Data ──────────────────────────────────────────────────────────

const mockProperties: LandlordProperty[] = [
  { id: 'lp-001', title: '3-Bedroom Flat, Lekki Phase 1', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop', location: 'Lekki Phase 1, Lagos', type: 'Residential', monthlyRent: 350000, status: 'Occupied', tenant: 'Adebayo Ogunlade', leaseEnd: 'Dec 2026' },
  { id: 'lp-002', title: '2-Bedroom Apartment, Victoria Island', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop', location: 'Victoria Island, Lagos', type: 'Residential', monthlyRent: 500000, status: 'Occupied', tenant: 'Chioma Eze', leaseEnd: 'Jun 2026' },
  { id: 'lp-003', title: 'Office Space, Ikeja GRA', image: 'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?q=80&w=600&auto=format&fit=crop', location: 'Ikeja GRA, Lagos', type: 'Commercial', monthlyRent: 750000, status: 'Vacant' },
  { id: 'lp-004', title: '4-Bedroom Duplex, Maitama', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&auto=format&fit=crop', location: 'Maitama, Abuja', type: 'Residential', monthlyRent: 800000, status: 'Occupied', tenant: 'Emeka Nwosu', leaseEnd: 'Mar 2027' },
  { id: 'lp-005', title: 'Studio Apartment, Yaba', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop', location: 'Yaba, Lagos', type: 'Residential', monthlyRent: 150000, status: 'Maintenance' },
  { id: 'lp-006', title: 'Shop Space, Wuse Market', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', location: 'Wuse, Abuja', type: 'Commercial', monthlyRent: 200000, status: 'Vacant' },
];

const mockTransactions: LandlordTransaction[] = [
  { id: 'LTX-1001', date: '28 Mar 2026', propertyName: '3-Bedroom Flat, Lekki Phase 1', tenantName: 'Adebayo Ogunlade', amount: 350000, type: 'Rent', status: 'Completed' },
  { id: 'LTX-1002', date: '25 Mar 2026', propertyName: '2-Bedroom Apartment, Victoria Island', tenantName: 'Chioma Eze', amount: 500000, type: 'Rent', status: 'Completed' },
  { id: 'LTX-1003', date: '20 Mar 2026', propertyName: '4-Bedroom Duplex, Maitama', tenantName: 'Emeka Nwosu', amount: 1600000, type: 'Deposit', status: 'Completed' },
  { id: 'LTX-1004', date: '15 Mar 2026', propertyName: 'Studio Apartment, Yaba', tenantName: '-', amount: 85000, type: 'Maintenance', status: 'Pending' },
  { id: 'LTX-1005', date: '10 Mar 2026', propertyName: '3-Bedroom Flat, Lekki Phase 1', tenantName: 'Adebayo Ogunlade', amount: 15000, type: 'Service Fee', status: 'Completed' },
  { id: 'LTX-1006', date: '05 Mar 2026', propertyName: '2-Bedroom Apartment, Victoria Island', tenantName: 'Chioma Eze', amount: 500000, type: 'Rent', status: 'Pending' },
  { id: 'LTX-1007', date: '01 Mar 2026', propertyName: '4-Bedroom Duplex, Maitama', tenantName: 'Emeka Nwosu', amount: 800000, type: 'Rent', status: 'Failed' },
  { id: 'LTX-1008', date: '28 Feb 2026', propertyName: 'Office Space, Ikeja GRA', tenantName: '-', amount: 25000, type: 'Service Fee', status: 'Completed' },
];

// ── Store ──────────────────────────────────────────────────────────────

interface LandlordDashboardState {
  // Dashboard
  stats: LandlordStats;
  isLoading: boolean;
  error: string | null;
  period: string;
  dateFrom: string;
  dateTo: string;
  setPeriod: (period: string) => void;
  setDateRange: (from: string, to: string) => void;
  fetchDashboardData: () => Promise<void>;

  // Properties
  properties: LandlordProperty[];
  propertiesLoading: boolean;
  propertyTab: LandlordPropertyTab;
  propertySearch: string;
  setPropertyTab: (tab: LandlordPropertyTab) => void;
  setPropertySearch: (q: string) => void;
  fetchProperties: () => Promise<void>;

  // Transactions
  transactions: LandlordTransaction[];
  selectedTransaction: LandlordTransaction | null;
  transactionsLoading: boolean;
  activeTab: LandlordTransactionTabKey;
  statusFilter: LandlordStatusFilter;
  searchQuery: string;
  currentPage: number;
  setActiveTab: (tab: LandlordTransactionTabKey) => void;
  setStatusFilter: (f: LandlordStatusFilter) => void;
  setSearchQuery: (q: string) => void;
  setCurrentPage: (p: number) => void;
  fetchTransactions: () => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;

  /** @deprecated Use fetchDashboardData() */
  fetchDashboardDataMock: () => Promise<void>;
  /** @deprecated Use fetchProperties() */
  fetchPropertiesMock: () => Promise<void>;
  /** @deprecated Use fetchTransactions() */
  fetchTransactionsMock: () => Promise<void>;
  /** @deprecated Use fetchTransactionById() */
  fetchTransactionByIdMock: (id: string) => Promise<void>;
}

export const useLandlordDashboardStore = create<LandlordDashboardState>((set, get) => ({
  // Dashboard
  stats: { totalProperties: 0, occupiedUnits: 0, vacantUnits: 0, monthlyIncome: 0 },
  isLoading: false,
  error: null,

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
        const data = await apiGet<{ stats: LandlordStats }>(`/api/landlord/dashboard/stats?${params}`);
        set({ stats: data.stats, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({ stats: { totalProperties: 6, occupiedUnits: 3, vacantUnits: 2, monthlyIncome: 1650000 }, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load dashboard', isLoading: false });
    }
  },

  // Properties
  properties: [],
  propertiesLoading: false,
  propertyTab: 'All',
  propertySearch: '',

  setPropertyTab: (tab) => set({ propertyTab: tab }),
  setPropertySearch: (q) => set({ propertySearch: q }),

  fetchProperties: async () => {
    set({ propertiesLoading: true });
    try {
      if (USE_API) {
        const data = await apiGet<{ properties: LandlordProperty[] }>('/api/landlord/properties');
        set({ properties: data.properties, propertiesLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({ properties: mockProperties, propertiesLoading: false });
      }
    } catch (err) {
      set({ propertiesLoading: false });
      console.error('Failed to load properties', err);
    }
  },

  // Transactions
  transactions: [],
  selectedTransaction: null,
  transactionsLoading: false,
  activeTab: 'All',
  statusFilter: 'All',
  searchQuery: '',
  currentPage: 1,

  setActiveTab: (tab) => set({ activeTab: tab, statusFilter: 'All', currentPage: 1 }),
  setStatusFilter: (f) => set({ statusFilter: f, currentPage: 1 }),
  setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
  setCurrentPage: (p) => set({ currentPage: p }),

  fetchTransactions: async () => {
    set({ transactionsLoading: true });
    try {
      if (USE_API) {
        const data = await apiGet<{ transactions: LandlordTransaction[] }>('/api/property-transactions');
        set({ transactions: data.transactions, transactionsLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({ transactions: mockTransactions, transactionsLoading: false });
      }
    } catch (err) {
      set({ transactionsLoading: false });
      console.error('Failed to load transactions', err);
    }
  },

  fetchTransactionById: async (id) => {
    set({ transactionsLoading: true });
    try {
      if (USE_API) {
        const data = await apiGet<{ transaction: LandlordTransaction }>(`/api/landlord/transactions/${id}`);
        set({ selectedTransaction: data.transaction, transactionsLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const tx =
          get().transactions.find((t) => t.id === id) ??
          mockTransactions.find((t) => t.id === id) ??
          null;
        set({ selectedTransaction: tx, transactionsLoading: false });
      }
    } catch (err) {
      set({ transactionsLoading: false });
      console.error('Failed to load transaction', err);
    }
  },

  // Backward-compatible aliases
  fetchDashboardDataMock: async () => get().fetchDashboardData(),
  fetchPropertiesMock: async () => get().fetchProperties(),
  fetchTransactionsMock: async () => get().fetchTransactions(),
  fetchTransactionByIdMock: async (id) => get().fetchTransactionById(id),
}));
