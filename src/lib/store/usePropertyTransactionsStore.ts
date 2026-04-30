/**
 * usePropertyTransactionsStore
 *
 * Unified store for property transactions — used by all role dashboards.
 * Fetches from the backend and exposes action endpoints.
 * Each role dashboard store fetches from this store when USE_API=true.
 */
import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// Backend types (from GET /api/property-transactions)
// ---------------------------------------------------------------------------
export interface BackendUser {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  verificationStatus?: string;
  roles?: string[];
}

export interface BackendListing {
  id: string;
  title?: string;
  propertyType?: string;
  listingType?: string;
  state?: string;
  city?: string;
  fullAddress?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqm?: number;
  images?: { url: string; isCover?: boolean; sortOrder?: number }[];
}

export interface BackendPropertyTransaction {
  id: string;
  referenceNumber: string;
  type: 'INSPECTION' | 'SALES' | 'RENTAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED' | 'CANCELLED';
  step: number;
  listingId: string;
  listing?: BackendListing;
  buyerId: string;
  buyer?: BackendUser;
  sellerId: string;
  seller?: BackendUser;
  fundedAmountKobo?: string;
  propertyPriceKobo?: string;
  paymentRef?: string;
  scheduledAt?: string;
  scheduledEndAt?: string;
  acceptedAt?: string;
  declinedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Frontend-facing mapped type
// ---------------------------------------------------------------------------
export interface PropertyTransaction {
  id: string;
  referenceNumber: string;
  type: 'inspection' | 'sale' | 'rental';
  status: 'Pending' | 'In-progress' | 'Completed' | 'Declined' | 'Cancelled';
  step: number;
  // Property info
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  propertyLocation: string;
  propertyPrice: number;
  propertyBeds: number;
  propertyBaths: number;
  propertySqm: number;
  propertyImage: string;
  propertyTag: 'For Sale' | 'For Rent';
  // Parties
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  buyerVerified: boolean;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  // Financials
  amount: number;
  escrowAmount: number;
  // Dates
  date: string;
  scheduledDate?: string;
  scheduledTime?: string;
  // Raw backend data for role-specific UI
  raw: BackendPropertyTransaction;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------
const TYPE_MAP: Record<string, PropertyTransaction['type']> = {
  INSPECTION: 'inspection', SALES: 'sale', RENTAL: 'rental',
};
const STATUS_MAP: Record<string, PropertyTransaction['status']> = {
  PENDING: 'Pending', IN_PROGRESS: 'In-progress', COMPLETED: 'Completed',
  DECLINED: 'Declined', CANCELLED: 'Cancelled',
};
const PROPERTY_TYPE_MAP: Record<string, string> = {
  RESIDENTIAL: 'Residential', COMMERCIAL: 'Commercial',
  LAND: 'Plots/Lands', SHORT_LET: 'Service Apartments & Short Lets', PG_HOSTEL: 'PG/Hostel',
};

function userName(u?: BackendUser): string {
  return u?.displayName || `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim() || 'Unknown';
}

export function mapBackendTransaction(t: BackendPropertyTransaction): PropertyTransaction {
  const listing = t.listing;
  const coverImg = listing?.images
    ?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .find(i => i.isCover)?.url
    ?? listing?.images?.[0]?.url
    ?? '';

  const propertyPrice = Number(t.propertyPriceKobo ?? 0) / 100;
  const fundedAmount  = Number(t.fundedAmountKobo ?? 0) / 100;

  const scheduledDate = t.scheduledAt
    ? new Date(t.scheduledAt).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })
    : undefined;
  const scheduledTime = t.scheduledAt && t.scheduledEndAt
    ? `${new Date(t.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – ${new Date(t.scheduledEndAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : undefined;

  return {
    id:              t.id,
    referenceNumber: t.referenceNumber,
    type:            TYPE_MAP[t.type] ?? 'inspection',
    status:          STATUS_MAP[t.status] ?? 'Pending',
    step:            t.step ?? 1,
    propertyId:      t.listingId,
    propertyTitle:   listing?.title ?? 'Property',
    propertyType:    PROPERTY_TYPE_MAP[listing?.propertyType ?? ''] ?? listing?.propertyType ?? 'Residential',
    propertyLocation:`${listing?.city ?? ''}, ${listing?.state ?? ''}`.replace(/^, |, $/, ''),
    propertyPrice,
    propertyBeds:    listing?.bedrooms ?? 0,
    propertyBaths:   listing?.bathrooms ?? 0,
    propertySqm:     listing?.sizeSqm ?? 0,
    propertyImage:   coverImg,
    propertyTag:     listing?.listingType === 'FOR_RENT' ? 'For Rent' : 'For Sale',
    buyerId:         t.buyerId,
    buyerName:       userName(t.buyer),
    buyerAvatar:     t.buyer?.avatarUrl ?? '/images/demo-avatar.jpg',
    buyerVerified:   t.buyer?.verificationStatus === 'VERIFIED',
    sellerId:        t.sellerId,
    sellerName:      userName(t.seller),
    sellerAvatar:    t.seller?.avatarUrl ?? '/images/demo-avatar.jpg',
    amount:          fundedAmount,
    escrowAmount:    propertyPrice,
    date:            new Date(t.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
    scheduledDate,
    scheduledTime,
    raw: t,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface PropertyTransactionsStore {
  transactions: PropertyTransaction[];
  selectedTransaction: PropertyTransaction | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchTransactions: (type?: string) => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;
  acceptTransaction: (id: string) => Promise<void>;
  declineTransaction: (id: string) => Promise<void>;
  confirmTour: (id: string) => Promise<void>;
  confirmHandover: (id: string) => Promise<void>;
  confirmCompletion: (id: string) => Promise<void>;
}

function patchTx(
  state: PropertyTransactionsStore,
  id: string,
  patch: Partial<PropertyTransaction>,
) {
  const transactions = state.transactions.map(t => t.id !== id ? t : { ...t, ...patch });
  const selectedTransaction = state.selectedTransaction?.id === id
    ? { ...state.selectedTransaction, ...patch }
    : state.selectedTransaction;
  return { transactions, selectedTransaction, isActionLoading: false };
}

async function callAction(id: string, action: string): Promise<Partial<PropertyTransaction>> {
  const raw = await apiPost<BackendPropertyTransaction>(
    `/api/property-transactions/${id}/${action}`
  );
  return { status: STATUS_MAP[raw.status] ?? 'In-progress', step: raw.step };
}

export const usePropertyTransactionsStore = create<PropertyTransactionsStore>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchTransactions: async (type?: string) => {
    if (!USE_API) return;
    set({ isLoading: true, error: null });
    try {
      const qs  = type ? `?type=${type}` : '';
      const raw = await apiGet<BackendPropertyTransaction[]>(`/api/property-transactions${qs}`);
      const list = Array.isArray(raw) ? raw : [];
      set({ transactions: list.map(mapBackendTransaction), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load transactions', isLoading: false });
    }
  },

  fetchTransactionById: async (id: string) => {
    if (!USE_API) return;
    set({ isLoading: true, error: null });
    try {
      const raw = await apiGet<BackendPropertyTransaction>(`/api/property-transactions/${id}`);
      set({ selectedTransaction: mapBackendTransaction(raw), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
    }
  },

  acceptTransaction: async (id: string) => {
    set({ isActionLoading: true });
    try {
      const patch = USE_API ? await callAction(id, 'accept') : { status: 'In-progress' as const, step: 2 };
      set((s) => patchTx(s, id, patch));
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Action failed' });
    }
  },

  declineTransaction: async (id: string) => {
    set({ isActionLoading: true });
    try {
      const patch = USE_API ? await callAction(id, 'decline') : { status: 'Declined' as const };
      set((s) => patchTx(s, id, patch));
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Action failed' });
    }
  },

  confirmTour: async (id: string) => {
    set({ isActionLoading: true });
    try {
      const patch = USE_API ? await callAction(id, 'confirm-tour') : { status: 'In-progress' as const, step: 2 };
      set((s) => patchTx(s, id, patch));
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Action failed' });
    }
  },

  confirmHandover: async (id: string) => {
    set({ isActionLoading: true });
    try {
      const patch = USE_API ? await callAction(id, 'confirm-handover') : { status: 'In-progress' as const, step: 3 };
      set((s) => patchTx(s, id, patch));
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Action failed' });
    }
  },

  confirmCompletion: async (id: string) => {
    set({ isActionLoading: true });
    try {
      const patch = USE_API ? await callAction(id, 'confirm-completion') : { status: 'Completed' as const, step: 4 };
      set((s) => patchTx(s, id, patch));
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Action failed' });
    }
  },
}));
