import { create } from 'zustand';
import { apiGet, apiPost, apiPatch } from '@/lib/api/client';
import type { UserRole } from './useAuthStore';
import { mapRole, mapKycStatus, mapAccountStatus, formatDate } from '@/lib/api/adapters';
import { useNotificationStore } from './useNotificationStore';
import { usePropertyStore } from './usePropertyStore';
import { useTransactionLedger } from './useTransactionLedger';
import {
  usePropertyTransactionsStore,
  mapBackendTransaction,
  type BackendPropertyTransaction,
} from './usePropertyTransactionsStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ── Types ──────────────────────────────────────────────────────────────

export type KycStatus = 'unverified' | 'in-progress' | 'verified';
export type AccountStatus = 'active' | 'suspended';
export type ModerationStatus = 'Pending Review' | 'Verified' | 'Flagged' | 'Rejected';
export type TransactionType = 'Inspection' | 'Sale' | 'Rental' | 'Developer Milestone' | 'Diaspora Service';
export type TransactionStatus = 'Pending' | 'In-progress' | 'Completed' | 'Declined';
export type EscrowItemStatus = 'Held' | 'Releasing' | 'Released';
export type PayoutStatus = 'Pending' | 'Approved' | 'Rejected' | 'Processing';

export interface AdminStats {
  totalUsers: number;
  activeListings: number;
  pendingKyc: number;
  totalRevenue: number;
  escrowBalance: number;
  pendingPayouts: number;
}

export interface RevenueDataPoint {
  period: string;
  amount: number;
}

export interface UserGrowthPoint {
  period: string;
  agents: number;
  seekers: number;
  developers: number;
  diaspora: number;
  landlords: number;
}

export interface TransactionVolumePoint {
  category: string;
  count: number;
  amount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  kycStatus: KycStatus;
  joinDate: string;
  accountStatus: AccountStatus;
  totalListings: number;
  totalTransactions: number;
}

export interface KycDocument {
  step: string;
  status: 'submitted' | 'verified' | 'pending' | 'rejected';
  data?: string;
}

export interface AdminUserDetail extends AdminUser {
  avatarUrl: string;
  phone: string;
  kycProgress: number;
  kycDocuments: KycDocument[];
  recentTransactions: AdminTransaction[];
  lastLogin: string;
}

export interface AdminProperty {
  id: string;
  title: string;
  type: 'Property' | 'Project';
  ownerName: string;
  ownerRole: 'Agent' | 'Developer';
  category: string;
  price: number;
  moderationStatus: ModerationStatus;
  dateListed: string;
  image: string;
  location: string;
}

export interface AdminTransaction {
  id: string;
  date: string;
  type: TransactionType;
  partyA: string;
  partyB: string;
  amount: number;
  irealtyFee: number;
  status: TransactionStatus;
}

export interface AdminTransactionDetail extends AdminTransaction {
  escrowAmount: number;
  netToParties: number;
  partyAAvatar: string;
  partyBAvatar: string;
  auditLog: { timestamp: string; action: string; by: string }[];
}

export interface EscrowItem {
  id: string;
  transactionId: string;
  parties: string;
  amount: number;
  dateDeposited: string;
  expectedRelease: string;
  status: EscrowItemStatus;
  ageDays: number;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  amount: number;
  method: 'Bank' | 'Crypto';
  bankName?: string;
  accountNumber?: string;
  cryptoCurrency?: string;
  cryptoAddress?: string;
  requestDate: string;
  status: PayoutStatus;
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  count: number;
}

// ── Filter Types ──────────────────────────────────────────────────────

export interface UserFilters {
  role: string;
  kycStatus: string;
  accountStatus: string;
  search: string;
  page: number;
}

export interface PropertyFilters {
  tab: string;
  category: string;
  search: string;
  page: number;
}

export interface TransactionFilters {
  tab: string;
  status: string;
  search: string;
  page: number;
}

// ── Store Interface ───────────────────────────────────────────────────

interface AdminDashboardState {
  // Overview
  stats: AdminStats;
  revenueData: RevenueDataPoint[];
  userGrowthData: UserGrowthPoint[];
  transactionVolumeData: TransactionVolumePoint[];
  recentTransactions: AdminTransaction[];
  pendingKycUsers: AdminUser[];

  // Users
  users: AdminUser[];
  selectedUser: AdminUserDetail | null;
  userFilters: UserFilters;
  setUserFilters: (filters: Partial<UserFilters>) => void;

  // Properties
  properties: AdminProperty[];
  propertyFilters: PropertyFilters;
  setPropertyFilters: (filters: Partial<PropertyFilters>) => void;

  // Transactions
  transactions: AdminTransaction[];
  selectedTransaction: AdminTransactionDetail | null;
  transactionFilters: TransactionFilters;
  setTransactionFilters: (filters: Partial<TransactionFilters>) => void;

  // Finance
  revenueBreakdown: RevenueBreakdown[];
  escrowItems: EscrowItem[];
  payouts: PayoutRequest[];
  payoutFilter: string;
  setPayoutFilter: (f: string) => void;

  // Platform fees
  platformFees: { inspection: number; sale: number; rental: number; developer: number; diaspora: number };
  updatePlatformFees: (fees: Partial<AdminDashboardState['platformFees']>) => void;

  // Loading
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  // Period filter for chart/stats
  period: string;
  setPeriod: (period: string) => void;

  // API-ready actions
  fetchDashboardData: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  approveKyc: (userId: string) => Promise<void>;
  rejectKyc: (userId: string, reason: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  reactivateUser: (userId: string) => Promise<void>;
  fetchProperties: () => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string, reason: string) => Promise<void>;
  flagProperty: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;
  fetchFinance: () => Promise<void>;
  approvePayout: (id: string) => Promise<void>;
  rejectPayout: (id: string) => Promise<void>;
  flagTransaction: (id: string) => Promise<void>;
  refundTransaction: (id: string) => Promise<void>;
  submitPlatformFees: () => Promise<void>;

  /** @deprecated Use fetchDashboardData() */
  fetchDashboardDataMock: () => Promise<void>;
  /** @deprecated Use fetchUsers() */
  fetchUsersMock: () => Promise<void>;
  /** @deprecated Use fetchUserById() */
  fetchUserByIdMock: (id: string) => Promise<void>;
  /** @deprecated Use approveKyc() */
  approveKycMock: (userId: string) => Promise<void>;
  /** @deprecated Use rejectKyc() */
  rejectKycMock: (userId: string, reason?: string) => Promise<void>;
  /** @deprecated Use suspendUser() */
  suspendUserMock: (userId: string) => Promise<void>;
  /** @deprecated Use reactivateUser() */
  reactivateUserMock: (userId: string) => Promise<void>;
  /** @deprecated Use fetchProperties() */
  fetchPropertiesMock: () => Promise<void>;
  /** @deprecated Use approveProperty() */
  approvePropertyMock: (id: string) => Promise<void>;
  /** @deprecated Use rejectProperty() */
  rejectPropertyMock: (id: string, reason?: string) => Promise<void>;
  /** @deprecated Use flagProperty() */
  flagPropertyMock: (id: string) => Promise<void>;
  /** @deprecated Use fetchTransactions() */
  fetchTransactionsMock: () => Promise<void>;
  /** @deprecated Use fetchTransactionById() */
  fetchTransactionByIdMock: (id: string) => Promise<void>;
  /** @deprecated Use fetchFinance() */
  fetchFinanceMock: () => Promise<void>;
  /** @deprecated Use approvePayout() */
  approvePayoutMock: (id: string) => Promise<void>;
  /** @deprecated Use rejectPayout() */
  rejectPayoutMock: (id: string) => Promise<void>;
  /** @deprecated Use flagTransaction() */
  flagTransactionMock: (id: string) => Promise<void>;
  /** @deprecated Use refundTransaction() */
  refundTransactionMock: (id: string) => Promise<void>;
}

// ── Backend → Frontend Adapters ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendUser(u: Record<string, any>): AdminUser {
  const name = u.displayName || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username || 'User';
  return {
    id:                u.id,
    name,
    email:             u.email ?? '',
    role:              mapRole(u.roles?.[0] ?? ''),
    kycStatus:         mapKycStatus(u.verificationStatus ?? ''),
    joinDate:          u.createdAt ? formatDate(u.createdAt) : '',
    accountStatus:     (!u.isActive || u.verificationStatus === 'SUSPENDED') ? 'suspended' : 'active',
    totalListings:     u.totalListings ?? 0,
    totalTransactions: u.totalTransactions ?? 0,
  };
}

const ONBOARDING_STEP_MAP: Record<string, number> = {
  PERSONAL_INFO: 20, PHONE_VERIFICATION: 40, ID_VERIFICATION: 60, LIVENESS: 80, PAYMENT: 90, COMPLETE: 100,
};
const ONBOARDING_STEP_DOCS: Record<string, { step: string; status: 'submitted' | 'verified' | 'pending' }> = {
  PERSONAL_INFO:      { step: 'Personal Information (BVN)', status: 'pending' },
  PHONE_VERIFICATION: { step: 'Phone Verification',        status: 'pending' },
  ID_VERIFICATION:    { step: 'ID Verification',           status: 'pending' },
  LIVENESS:           { step: 'Face Match',                status: 'pending' },
  PAYMENT:            { step: 'Payment Details',           status: 'pending' },
  COMPLETE:           { step: 'Payment Details',           status: 'verified' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendUserDetail(u: Record<string, any>, recentTx: AdminTransaction[]): AdminUserDetail {
  const base = mapBackendUser(u);
  const step = u.onboardingStep ?? 'PERSONAL_INFO';
  const stepOrder = ['PERSONAL_INFO', 'PHONE_VERIFICATION', 'ID_VERIFICATION', 'LIVENESS', 'PAYMENT', 'COMPLETE'];
  const currentIdx = stepOrder.indexOf(step);

  const kycDocuments: KycDocument[] = [
    { step: 'Personal Information (BVN)', status: currentIdx >= 1 ? 'verified' : (currentIdx === 0 ? 'submitted' : 'pending') },
    { step: 'Phone Verification',        status: currentIdx >= 2 ? 'verified' : (currentIdx === 1 ? 'submitted' : 'pending') },
    { step: 'ID Verification',           status: currentIdx >= 3 ? 'verified' : (currentIdx === 2 ? 'submitted' : 'pending'), data: u.idNumber ? `${u.idType ?? 'ID'} - ${u.idNumber}` : undefined },
    { step: 'Face Match',                status: currentIdx >= 4 ? 'verified' : (currentIdx === 3 ? 'submitted' : 'pending') },
    { step: 'Payment Details',           status: currentIdx >= 5 ? 'verified' : (currentIdx === 4 ? 'submitted' : 'pending') },
  ];

  return {
    ...base,
    avatarUrl:          u.avatarUrl ?? '/images/demo-avatar.jpg',
    phone:              u.phoneNumber ?? '',
    kycProgress:        ONBOARDING_STEP_MAP[step] ?? 0,
    kycDocuments,
    recentTransactions: recentTx,
    lastLogin:          u.updatedAt ? formatDate(u.updatedAt) : '',
  };
}

function mapBackendTxToAdmin(t: BackendPropertyTransaction): AdminTransaction {
  const pt = mapBackendTransaction(t);
  const typeMap: Record<string, TransactionType> = {
    inspection: 'Inspection', sale: 'Sale', rental: 'Rental',
  };
  return {
    id:         pt.id,
    date:       pt.date,
    type:       typeMap[pt.type] ?? 'Inspection',
    partyA:     pt.buyerName,
    partyB:     pt.sellerName,
    amount:     pt.amount || pt.escrowAmount,
    irealtyFee: 0,
    status:     pt.status === 'Cancelled' ? 'Declined' : pt.status as TransactionStatus,
  };
}

// ── Mock Data ─────────────────────────────────────────────────────────

const MOCK_USERS: AdminUser[] = [
  { id: 'USR-001', name: 'Sarah Homes', email: 'sarah@homes.ng', role: 'Agent', kycStatus: 'verified', joinDate: '15 Jan 2025', accountStatus: 'active', totalListings: 12, totalTransactions: 45 },
  { id: 'USR-002', name: 'Marcus Bell', email: 'marcus@mail.com', role: 'Property Seeker', kycStatus: 'in-progress', joinDate: '22 Feb 2025', accountStatus: 'active', totalListings: 0, totalTransactions: 8 },
  { id: 'USR-003', name: 'Amara Osei', email: 'amara@dev.co', role: 'Developer', kycStatus: 'verified', joinDate: '10 Mar 2025', accountStatus: 'active', totalListings: 5, totalTransactions: 22 },
  { id: 'USR-004', name: 'Ngozi Adeyemi', email: 'ngozi@invest.uk', role: 'Diaspora', kycStatus: 'in-progress', joinDate: '05 Apr 2025', accountStatus: 'active', totalListings: 0, totalTransactions: 3 },
  { id: 'USR-005', name: 'Emeka Nwosu', email: 'emeka@land.ng', role: 'Landlord', kycStatus: 'unverified', joinDate: '18 Apr 2025', accountStatus: 'active', totalListings: 2, totalTransactions: 0 },
  { id: 'USR-006', name: 'Fatima Ibrahim', email: 'fatima@props.ng', role: 'Agent', kycStatus: 'verified', joinDate: '01 Jan 2025', accountStatus: 'suspended', totalListings: 8, totalTransactions: 30 },
  { id: 'USR-007', name: 'Chidi Okeke', email: 'chidi@mail.com', role: 'Property Seeker', kycStatus: 'in-progress', joinDate: '28 Mar 2025', accountStatus: 'active', totalListings: 0, totalTransactions: 5 },
  { id: 'USR-008', name: 'Ada Obi', email: 'ada@dev.ng', role: 'Developer', kycStatus: 'verified', joinDate: '12 Feb 2025', accountStatus: 'active', totalListings: 3, totalTransactions: 15 },
  { id: 'USR-009', name: 'Tunde Bakare', email: 'tunde@diaspora.com', role: 'Diaspora', kycStatus: 'verified', joinDate: '20 Jan 2025', accountStatus: 'active', totalListings: 0, totalTransactions: 12 },
  { id: 'USR-010', name: 'Grace Adekunle', email: 'grace@homes.ng', role: 'Agent', kycStatus: 'in-progress', joinDate: '15 May 2025', accountStatus: 'active', totalListings: 0, totalTransactions: 0 },
  { id: 'USR-011', name: 'Obinna Eze', email: 'obinna@mail.com', role: 'Property Seeker', kycStatus: 'verified', joinDate: '08 Jun 2025', accountStatus: 'active', totalListings: 0, totalTransactions: 20 },
  { id: 'USR-012', name: 'Kemi Afolabi', email: 'kemi@land.ng', role: 'Landlord', kycStatus: 'verified', joinDate: '25 May 2025', accountStatus: 'active', totalListings: 4, totalTransactions: 7 },
];

const MOCK_PROPERTIES: AdminProperty[] = [
  { id: 'PRP-001', title: '3-Bed Duplex, Lekki Phase 1', type: 'Property', ownerName: 'Sarah Homes', ownerRole: 'Agent', category: 'Residential', price: 45000000, moderationStatus: 'Verified', dateListed: '20 Jul 2025', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop', location: 'Lekki, Lagos' },
  { id: 'PRP-002', title: 'Opal Residences Tower', type: 'Project', ownerName: 'Amara Osei', ownerRole: 'Developer', category: 'Commercial', price: 120000000, moderationStatus: 'Pending Review', dateListed: '15 Aug 2025', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop', location: 'Victoria Island, Lagos' },
  { id: 'PRP-003', title: '5-Bed Mansion, Ikoyi', type: 'Property', ownerName: 'Fatima Ibrahim', ownerRole: 'Agent', category: 'Residential', price: 85000000, moderationStatus: 'Verified', dateListed: '10 Jul 2025', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop', location: 'Ikoyi, Lagos' },
  { id: 'PRP-004', title: 'Green Valley Estate', type: 'Project', ownerName: 'Ada Obi', ownerRole: 'Developer', category: 'Off-Plan', price: 50000000, moderationStatus: 'Pending Review', dateListed: '25 Aug 2025', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop', location: 'Magodo, Lagos' },
  { id: 'PRP-005', title: 'Office Space, Ikeja GRA', type: 'Property', ownerName: 'Sarah Homes', ownerRole: 'Agent', category: 'Commercial', price: 35000000, moderationStatus: 'Flagged', dateListed: '05 Aug 2025', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop', location: 'Ikeja GRA, Lagos' },
  { id: 'PRP-006', title: '2-Bed Flat, VI', type: 'Property', ownerName: 'Fatima Ibrahim', ownerRole: 'Agent', category: 'Residential', price: 3500000, moderationStatus: 'Rejected', dateListed: '01 Aug 2025', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop', location: 'Victoria Island, Lagos' },
  { id: 'PRP-007', title: 'Asokoro Villas Phase 2', type: 'Project', ownerName: 'Amara Osei', ownerRole: 'Developer', category: 'Residential', price: 90000000, moderationStatus: 'Verified', dateListed: '18 Jun 2025', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=400&auto=format&fit=crop', location: 'Asokoro, Abuja' },
  { id: 'PRP-008', title: 'Banana Island Terrace', type: 'Property', ownerName: 'Sarah Homes', ownerRole: 'Agent', category: 'Residential', price: 200000000, moderationStatus: 'Pending Review', dateListed: '28 Aug 2025', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=400&auto=format&fit=crop', location: 'Banana Island, Lagos' },
];

const MOCK_TRANSACTIONS: AdminTransaction[] = [
  { id: 'TXN-A001', date: '28 Aug 2025', type: 'Inspection', partyA: 'Marcus Bell', partyB: 'Sarah Homes', amount: 25000, irealtyFee: 2500, status: 'Completed' },
  { id: 'TXN-A002', date: '27 Aug 2025', type: 'Sale', partyA: 'Obinna Eze', partyB: 'Sarah Homes', amount: 45000000, irealtyFee: 1125000, status: 'In-progress' },
  { id: 'TXN-A003', date: '25 Aug 2025', type: 'Developer Milestone', partyA: 'Chidi Okeke', partyB: 'Amara Osei', amount: 18000000, irealtyFee: 540000, status: 'Completed' },
  { id: 'TXN-A004', date: '24 Aug 2025', type: 'Diaspora Service', partyA: 'Ngozi Adeyemi', partyB: 'i-Realty Team', amount: 625000, irealtyFee: 625000, status: 'Pending' },
  { id: 'TXN-A005', date: '22 Aug 2025', type: 'Rental', partyA: 'Marcus Bell', partyB: 'Kemi Afolabi', amount: 3500000, irealtyFee: 87500, status: 'Completed' },
  { id: 'TXN-A006', date: '20 Aug 2025', type: 'Inspection', partyA: 'Obinna Eze', partyB: 'Fatima Ibrahim', amount: 25000, irealtyFee: 2500, status: 'Declined' },
  { id: 'TXN-A007', date: '18 Aug 2025', type: 'Sale', partyA: 'Tunde Bakare', partyB: 'Ada Obi', amount: 90000000, irealtyFee: 2700000, status: 'Completed' },
  { id: 'TXN-A008', date: '15 Aug 2025', type: 'Developer Milestone', partyA: 'Grace Adekunle', partyB: 'Amara Osei', amount: 36000000, irealtyFee: 1080000, status: 'In-progress' },
  { id: 'TXN-A009', date: '12 Aug 2025', type: 'Rental', partyA: 'Chidi Okeke', partyB: 'Sarah Homes', amount: 5000000, irealtyFee: 125000, status: 'Pending' },
  { id: 'TXN-A010', date: '10 Aug 2025', type: 'Diaspora Service', partyA: 'Tunde Bakare', partyB: 'i-Realty Team', amount: 450000, irealtyFee: 450000, status: 'Completed' },
];

const MOCK_ESCROW: EscrowItem[] = [
  { id: 'ESC-001', transactionId: 'TXN-A002', parties: 'Obinna Eze ↔ Sarah Homes', amount: 45000000, dateDeposited: '27 Aug 2025', expectedRelease: '15 Sep 2025', status: 'Held', ageDays: 5 },
  { id: 'ESC-002', transactionId: 'TXN-A008', parties: 'Grace Adekunle ↔ Amara Osei', amount: 36000000, dateDeposited: '15 Aug 2025', expectedRelease: '30 Oct 2025', status: 'Held', ageDays: 17 },
  { id: 'ESC-003', transactionId: 'TXN-A009', parties: 'Chidi Okeke ↔ Sarah Homes', amount: 5000000, dateDeposited: '12 Aug 2025', expectedRelease: '12 Sep 2025', status: 'Held', ageDays: 20 },
  { id: 'ESC-004', transactionId: 'TXN-A003', parties: 'Chidi Okeke ↔ Amara Osei', amount: 18000000, dateDeposited: '10 Jul 2025', expectedRelease: '25 Aug 2025', status: 'Released', ageDays: 52 },
  { id: 'ESC-005', transactionId: 'TXN-A007', parties: 'Tunde Bakare ↔ Ada Obi', amount: 90000000, dateDeposited: '01 Jul 2025', expectedRelease: '18 Aug 2025', status: 'Released', ageDays: 62 },
];

const MOCK_PAYOUTS: PayoutRequest[] = [
  { id: 'PAY-001', userId: 'USR-001', userName: 'Sarah Homes', role: 'Agent', amount: 12500000, method: 'Bank', bankName: 'GTBank', accountNumber: '0123456789', requestDate: '28 Aug 2025', status: 'Pending' },
  { id: 'PAY-002', userId: 'USR-003', userName: 'Amara Osei', role: 'Developer', amount: 35000000, method: 'Bank', bankName: 'First Bank', accountNumber: '9876543210', requestDate: '27 Aug 2025', status: 'Pending' },
  { id: 'PAY-003', userId: 'USR-009', userName: 'Tunde Bakare', role: 'Diaspora', amount: 5000000, method: 'Crypto', cryptoCurrency: 'USDT', cryptoAddress: '0x1a2b...9f0e', requestDate: '25 Aug 2025', status: 'Processing' },
  { id: 'PAY-004', userId: 'USR-006', userName: 'Fatima Ibrahim', role: 'Agent', amount: 8000000, method: 'Bank', bankName: 'Zenith Bank', accountNumber: '5678901234', requestDate: '22 Aug 2025', status: 'Approved' },
  { id: 'PAY-005', userId: 'USR-008', userName: 'Ada Obi', role: 'Developer', amount: 20000000, method: 'Bank', bankName: 'Access Bank', accountNumber: '1122334455', requestDate: '20 Aug 2025', status: 'Rejected' },
];

// ── Store ──────────────────────────────────────────────────────────────

export const useAdminDashboardStore = create<AdminDashboardState>((set, get) => ({
  // Overview
  stats: { totalUsers: 0, activeListings: 0, pendingKyc: 0, totalRevenue: 0, escrowBalance: 0, pendingPayouts: 0 },
  revenueData: [],
  userGrowthData: [],
  transactionVolumeData: [],
  recentTransactions: [],
  pendingKycUsers: [],

  // Users
  users: [],
  selectedUser: null,
  userFilters: { role: 'all', kycStatus: 'all', accountStatus: 'all', search: '', page: 1 },
  setUserFilters: (filters) => set((s) => ({ userFilters: { ...s.userFilters, ...filters, page: filters.page ?? 1 } })),

  // Properties
  properties: [],
  propertyFilters: { tab: 'all', category: 'all', search: '', page: 1 },
  setPropertyFilters: (filters) => set((s) => ({ propertyFilters: { ...s.propertyFilters, ...filters, page: filters.page ?? 1 } })),

  // Transactions
  transactions: [],
  selectedTransaction: null,
  transactionFilters: { tab: 'all', status: 'all', search: '', page: 1 },
  setTransactionFilters: (filters) => set((s) => ({ transactionFilters: { ...s.transactionFilters, ...filters, page: filters.page ?? 1 } })),

  // Finance
  revenueBreakdown: [],
  escrowItems: [],
  payouts: [],
  payoutFilter: 'all',
  setPayoutFilter: (f) => set({ payoutFilter: f }),

  // Platform fees
  platformFees: { inspection: 10, sale: 2.5, rental: 2.5, developer: 3, diaspora: 100 },
  updatePlatformFees: (fees) => set((s) => ({ platformFees: { ...s.platformFees, ...fees } })),

  // Loading
  isLoading: false,
  isActionLoading: false,
  error: null,

  // Period
  period: 'week',
  setPeriod: (period) => { set({ period }); get().fetchDashboardData(); },

  // ── Dashboard Overview ──────────────────────────────────────────────

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    if (USE_API) {
      try {
        const { period } = get();
        const data = await apiGet<{
          stats: AdminStats; revenueData: RevenueDataPoint[]; userGrowthData: UserGrowthPoint[];
          transactionVolumeData: TransactionVolumePoint[]; recentTransactions: AdminTransaction[]; pendingKycUsers: AdminUser[];
        }>(`/api/admin/dashboard?period=${period}`);
        set({ ...data, isLoading: false });
        return;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
        return;
      }
    }
    await new Promise((r) => setTimeout(r, 600));
    set({
      stats: {
        totalUsers: 1247,
        activeListings: 342,
        pendingKyc: 28,
        totalRevenue: 156000000,
        escrowBalance: 86000000,
        pendingPayouts: 15,
      },
      revenueData: [
        { period: 'Mon', amount: 12000000 }, { period: 'Tue', amount: 18000000 },
        { period: 'Wed', amount: 9000000 },  { period: 'Thu', amount: 25000000 },
        { period: 'Fri', amount: 22000000 }, { period: 'Sat', amount: 35000000 },
        { period: 'Sun', amount: 20000000 },
      ],
      userGrowthData: [
        { period: 'Jan', agents: 12, seekers: 45, developers: 3, diaspora: 8, landlords: 5 },
        { period: 'Feb', agents: 18, seekers: 60, developers: 5, diaspora: 12, landlords: 8 },
        { period: 'Mar', agents: 25, seekers: 80, developers: 7, diaspora: 18, landlords: 10 },
        { period: 'Apr', agents: 30, seekers: 110, developers: 9, diaspora: 25, landlords: 14 },
        { period: 'May', agents: 38, seekers: 140, developers: 12, diaspora: 32, landlords: 18 },
        { period: 'Jun', agents: 45, seekers: 180, developers: 15, diaspora: 40, landlords: 22 },
      ],
      transactionVolumeData: [
        { category: 'Inspections', count: 450, amount: 11250000 },
        { category: 'Sales', count: 85, amount: 3400000000 },
        { category: 'Rentals', count: 210, amount: 735000000 },
        { category: 'Developer', count: 45, amount: 810000000 },
        { category: 'Diaspora', count: 30, amount: 18750000 },
      ],
      recentTransactions: MOCK_TRANSACTIONS.slice(0, 5),
      pendingKycUsers: MOCK_USERS.filter((u) => u.kycStatus === 'in-progress'),
      isLoading: false,
    });
  },

  // ── Users ───────────────────────────────────────────────────────────

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    if (USE_API) {
      try {
        const { userFilters } = get();
        const params = new URLSearchParams();
        if (userFilters.role !== 'all') params.set('role', userFilters.role);
        if (userFilters.accountStatus !== 'all') params.set('status', userFilters.accountStatus);
        if (userFilters.search) params.set('search', userFilters.search);
        params.set('page', String(userFilters.page));
        params.set('limit', '20');
        const raw = await apiGet<unknown>(`/api/admin/users?${params}`);
        // Handle both flat array and { items/data/users: [...] } response shapes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const list: Record<string, any>[] = Array.isArray(raw) ? raw
          : Array.isArray((raw as Record<string, unknown>)?.items) ? (raw as Record<string, unknown[]>).items as Record<string, unknown>[]
          : Array.isArray((raw as Record<string, unknown>)?.users) ? (raw as Record<string, unknown[]>).users as Record<string, unknown>[]
          : [];
        set({ users: list.map(mapBackendUser), isLoading: false });
        return;
      } catch (err) { set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false }); return; }
    }
    await new Promise((r) => setTimeout(r, 500));
    set({ users: MOCK_USERS, isLoading: false });
  },

  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    if (USE_API) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = await apiGet<Record<string, any>>(`/api/admin/users/${id}`);
        // Fetch recent transactions for this user from the property-transactions endpoint
        let recentTx: AdminTransaction[] = [];
        try {
          const txRaw = await apiGet<BackendPropertyTransaction[]>('/api/property-transactions');
          const txList = Array.isArray(txRaw) ? txRaw : [];
          recentTx = txList
            .filter(t => t.buyerId === id || t.sellerId === id)
            .slice(0, 5)
            .map(mapBackendTxToAdmin);
        } catch { /* non-critical */ }
        set({ selectedUser: mapBackendUserDetail(raw, recentTx), isLoading: false });
        return;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed to load user', isLoading: false });
        return;
      }
    }
    await new Promise((r) => setTimeout(r, 400));
    const user = MOCK_USERS.find((u) => u.id === id) ?? MOCK_USERS[0];
    set({
      selectedUser: {
        ...user,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        phone: '+234 904 543 3344',
        kycProgress: user.kycStatus === 'verified' ? 100 : user.kycStatus === 'in-progress' ? 60 : 0,
        kycDocuments: [
          { step: 'Personal Information (BVN)', status: 'submitted', data: '2234 **** **** 5678' },
          { step: 'Phone Verification', status: user.kycStatus === 'unverified' ? 'pending' : 'verified' },
          { step: 'ID Verification', status: user.kycStatus === 'verified' ? 'verified' : 'submitted', data: 'NIN - 1234567890' },
          { step: 'Face Match', status: user.kycStatus === 'verified' ? 'verified' : 'pending' },
          { step: 'Payment Details', status: user.kycStatus === 'verified' ? 'verified' : 'pending', data: 'GTBank - 0123456789' },
        ],
        recentTransactions: MOCK_TRANSACTIONS.filter((t) => t.partyA === user.name || t.partyB === user.name).slice(0, 5),
        lastLogin: '28 Aug 2025, 2:34 PM',
      },
      isLoading: false,
    });
  },

  approveKyc: async (userId) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    const user = (useAdminDashboardStore.getState().users.find((u) => u.id === userId) ??
      useAdminDashboardStore.getState().selectedUser) as AdminUser | null;
    set((s) => ({
      selectedUser: s.selectedUser?.id === userId
        ? { ...s.selectedUser, kycStatus: 'verified', kycProgress: 100, kycDocuments: s.selectedUser.kycDocuments.map((d) => ({ ...d, status: 'verified' as const })) }
        : s.selectedUser,
      users: s.users.map((u) => u.id === userId ? { ...u, kycStatus: 'verified' as const } : u),
      isActionLoading: false,
    }));
    useNotificationStore.getState().emit(
      'kyc',
      'KYC verification approved',
      `Identity verification for ${user?.name ?? 'user'} has been approved. Account is now fully verified.`,
      '/dashboard/agent/settings'
    );
  },

  rejectKyc: async (userId, reason = 'Rejected by admin') => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    const user = useAdminDashboardStore.getState().users.find((u) => u.id === userId);
    set((s) => ({
      selectedUser: s.selectedUser?.id === userId
        ? { ...s.selectedUser, kycStatus: 'unverified', kycProgress: 0, kycDocuments: s.selectedUser.kycDocuments.map((d) => ({ ...d, status: 'rejected' as const })) }
        : s.selectedUser,
      users: s.users.map((u) => u.id === userId ? { ...u, kycStatus: 'unverified' as const } : u),
      isActionLoading: false,
    }));
    useNotificationStore.getState().emit(
      'kyc',
      'KYC verification rejected',
      `Identity verification for ${user?.name ?? 'user'} was rejected: ${reason}`,
      '/dashboard/agent/settings'
    );
  },

  suspendUser: async (userId) => {
    set({ isActionLoading: true });
    const user = useAdminDashboardStore.getState().users.find((u) => u.id === userId);
    try {
      if (USE_API) {
        // apidocs: PATCH /api/v1/admin/users/{id}/suspend with { reason }
        await apiPatch(`/api/admin/users/${userId}/suspend`, { reason: 'Suspended by admin' });
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Failed to suspend user' });
      return;
    }
    set((s) => ({
      selectedUser: s.selectedUser?.id === userId ? { ...s.selectedUser, accountStatus: 'suspended' } : s.selectedUser,
      users: s.users.map((u) => u.id === userId ? { ...u, accountStatus: 'suspended' as const } : u),
      isActionLoading: false,
    }));
    useNotificationStore.getState().emit(
      'system',
      'Account suspended',
      `Account for ${user?.name ?? 'user'} has been suspended by admin.`,
      '/dashboard/admin/users'
    );
  },

  reactivateUser: async (userId) => {
    set({ isActionLoading: true });
    const user = useAdminDashboardStore.getState().users.find((u) => u.id === userId);
    try {
      if (USE_API) {
        // apidocs: PATCH /api/v1/admin/users/{id}/reactivate
        await apiPatch(`/api/admin/users/${userId}/reactivate`);
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Failed to reactivate user' });
      return;
    }
    set((s) => ({
      selectedUser: s.selectedUser?.id === userId ? { ...s.selectedUser, accountStatus: 'active' } : s.selectedUser,
      users: s.users.map((u) => u.id === userId ? { ...u, accountStatus: 'active' as const } : u),
      isActionLoading: false,
    }));
    useNotificationStore.getState().emit(
      'system',
      'Account reactivated',
      `Account for ${user?.name ?? 'user'} has been reactivated.`,
      '/dashboard/admin/users'
    );
  },

  // ── Properties ──────────────────────────────────────────────────────

  fetchProperties: async () => {
    set({ isLoading: true, error: null });
    if (USE_API) {
      try { const d = await apiGet<{ properties: AdminProperty[] }>('/api/admin/properties'); set({ properties: d.properties, isLoading: false }); return; }
      catch (err) { set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false }); return; }
    }
    await new Promise((r) => setTimeout(r, 500));
    set({ properties: MOCK_PROPERTIES, isLoading: false });
  },

  approveProperty: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set((s) => ({
      properties: s.properties.map((p) => p.id === id ? { ...p, moderationStatus: 'Verified' as const } : p),
      isActionLoading: false,
    }));
    // Also approve in the unified property store
    usePropertyStore.getState().approveProperty(id);
  },

  rejectProperty: async (id, reason = 'Rejected by admin') => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set((s) => ({
      properties: s.properties.map((p) => p.id === id ? { ...p, moderationStatus: 'Rejected' as const } : p),
      isActionLoading: false,
    }));
    usePropertyStore.getState().rejectProperty(id, reason);
  },

  flagProperty: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set((s) => ({
      properties: s.properties.map((p) => p.id === id ? { ...p, moderationStatus: 'Flagged' as const } : p),
      isActionLoading: false,
    }));
    usePropertyStore.getState().flagProperty(id);
  },

  // ── Transactions ────────────────────────────────────────────────────

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    if (USE_API) {
      try {
        // Use the documented GET /api/property-transactions endpoint
        await usePropertyTransactionsStore.getState().fetchTransactions();
        const transactions = usePropertyTransactionsStore.getState().transactions.map(pt => mapBackendTxToAdmin(pt.raw));
        set({ transactions, isLoading: false });
        return;
      } catch (err) { set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false }); return; }
    }
    await new Promise((r) => setTimeout(r, 500));
    set({ transactions: MOCK_TRANSACTIONS, isLoading: false });
  },

  fetchTransactionById: async (id) => {
    set({ isLoading: true, error: null });
    if (USE_API) {
      try {
        const raw = await apiGet<BackendPropertyTransaction>(`/api/property-transactions/${id}`);
        const pt = mapBackendTransaction(raw);
        const tx = mapBackendTxToAdmin(raw);
        set({
          selectedTransaction: {
            ...tx,
            escrowAmount: pt.escrowAmount,
            netToParties: pt.amount,
            partyAAvatar: pt.buyerAvatar,
            partyBAvatar: pt.sellerAvatar,
            auditLog: [
              { timestamp: formatDate(raw.createdAt), action: 'Transaction created', by: 'System' },
              ...(raw.acceptedAt ? [{ timestamp: formatDate(raw.acceptedAt), action: 'Transaction accepted', by: pt.sellerName }] : []),
              ...(raw.declinedAt ? [{ timestamp: formatDate(raw.declinedAt), action: 'Transaction declined', by: pt.sellerName }] : []),
              ...(raw.completedAt ? [{ timestamp: formatDate(raw.completedAt), action: 'Transaction completed', by: 'System' }] : []),
            ],
          },
          isLoading: false,
        });
        return;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
        return;
      }
    }
    await new Promise((r) => setTimeout(r, 400));
    const tx = MOCK_TRANSACTIONS.find((t) => t.id === id) ?? MOCK_TRANSACTIONS[0];
    set({
      selectedTransaction: {
        ...tx,
        escrowAmount: tx.amount,
        netToParties: tx.amount - tx.irealtyFee,
        partyAAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        partyBAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        auditLog: [
          { timestamp: '28 Aug 2025, 10:00 AM', action: 'Transaction created', by: 'System' },
          { timestamp: '28 Aug 2025, 10:01 AM', action: 'Escrow funded', by: tx.partyA },
          ...(tx.status !== 'Pending' ? [{ timestamp: '28 Aug 2025, 2:30 PM', action: `Status changed to ${tx.status}`, by: tx.partyB }] : []),
        ],
      },
      isLoading: false,
    });
  },

  // ── Finance ─────────────────────────────────────────────────────────

  fetchFinance: async () => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 500));
    // Merge static payouts with any real payout requests from walletStore
    const { useWalletStore } = await import('./useWalletStore');
    const realPayouts = useWalletStore.getState().payoutRequests.map((p, i) => ({
      id: p.id,
      userId: `user_${i}`,
      userName: 'Platform User',
      role: 'Agent' as UserRole,
      amount: p.amount,
      method: (p.method === 'Fiat' ? 'Bank' : 'Crypto') as 'Bank' | 'Crypto',
      bankName: p.bankDetails?.bankName,
      accountNumber: p.bankDetails?.accountNumber,
      cryptoCurrency: p.cryptoDetails?.network,
      cryptoAddress: p.cryptoDetails?.address,
      requestDate: p.requestedAt.split('T')[0],
      status: p.status as PayoutStatus,
    }));

    // Build escrow from transaction ledger
    const ledgerEscrow = useTransactionLedger.getState().getEscrowEntries().map((e) => ({
      id: `ESC_${e.id}`,
      transactionId: e.id,
      parties: `${e.payerName} ↔ ${e.payeeName}`,
      amount: e.amount,
      dateDeposited: e.createdAt.split('T')[0],
      expectedRelease: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Held' as EscrowItemStatus,
      ageDays: Math.floor((Date.now() - new Date(e.createdAt).getTime()) / 86400000),
    }));

    set({
      revenueBreakdown: [
        { category: 'Inspection Fees', amount: 11250000, count: 450 },
        { category: 'Sales Commission', amount: 85000000, count: 85 },
        { category: 'Rental Commission', amount: 18375000, count: 210 },
        { category: 'Developer Fees', amount: 24300000, count: 45 },
        { category: 'Diaspora Services', amount: 18750000, count: 30 },
      ],
      escrowItems: ledgerEscrow.length > 0 ? ledgerEscrow : MOCK_ESCROW,
      payouts: [...realPayouts, ...MOCK_PAYOUTS],
      isLoading: false,
    });
  },

  approvePayout: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    const payout = useAdminDashboardStore.getState().payouts.find((p) => p.id === id);
    set((s) => ({
      payouts: s.payouts.map((p) => p.id === id ? { ...p, status: 'Approved' as const } : p),
      isActionLoading: false,
    }));
    if (payout) {
      useNotificationStore.getState().emit(
        'payment',
        'Payout approved',
        `Your withdrawal request of ₦${payout.amount.toLocaleString()} has been approved and is being processed.`,
        '/dashboard/agent/wallet'
      );
    }
  },

  rejectPayout: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    const payout = useAdminDashboardStore.getState().payouts.find((p) => p.id === id);
    set((s) => ({
      payouts: s.payouts.map((p) => p.id === id ? { ...p, status: 'Rejected' as const } : p),
      isActionLoading: false,
    }));
    if (payout) {
      useNotificationStore.getState().emit(
        'payment',
        'Payout rejected',
        `Your withdrawal request of ₦${payout.amount.toLocaleString()} was rejected. Contact support for details.`,
        '/dashboard/agent/wallet'
      );
    }
  },

  flagTransaction: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set((s) => ({
      selectedTransaction: s.selectedTransaction?.id === id
        ? {
            ...s.selectedTransaction,
            auditLog: [...s.selectedTransaction.auditLog, { timestamp: new Date().toLocaleString('en-NG'), action: 'Flagged for review', by: 'Admin' }],
          }
        : s.selectedTransaction,
      transactions: s.transactions.map((t) => t.id === id ? { ...t, status: 'Pending' as const } : t),
      isActionLoading: false,
    }));
  },

  refundTransaction: async (id) => {
    set({ isActionLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((s) => ({
      selectedTransaction: s.selectedTransaction?.id === id
        ? {
            ...s.selectedTransaction,
            status: 'Declined' as const,
            auditLog: [...s.selectedTransaction.auditLog, { timestamp: new Date().toLocaleString('en-NG'), action: 'Refund initiated', by: 'Admin' }],
          }
        : s.selectedTransaction,
      transactions: s.transactions.map((t) => t.id === id ? { ...t, status: 'Declined' as const } : t),
      isActionLoading: false,
    }));
  },

  submitPlatformFees: async () => {
    if (USE_API) {
      try { await apiPost('/api/admin/platform-fees', get().platformFees); } catch { /* handled upstream */ }
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
  },

  // Backward-compatible aliases
  fetchDashboardDataMock: async () => get().fetchDashboardData(),
  fetchUsersMock: async () => get().fetchUsers(),
  fetchUserByIdMock: async (id) => get().fetchUserById(id),
  approveKycMock: async (userId) => get().approveKyc(userId),
  rejectKycMock: async (userId, reason) => get().rejectKyc(userId, reason ?? 'Rejected by admin'),
  suspendUserMock: async (userId) => get().suspendUser(userId),
  reactivateUserMock: async (userId) => get().reactivateUser(userId),
  fetchPropertiesMock: async () => get().fetchProperties(),
  approvePropertyMock: async (id) => get().approveProperty(id),
  rejectPropertyMock: async (id, reason) => get().rejectProperty(id, reason ?? 'Rejected by admin'),
  flagPropertyMock: async (id) => get().flagProperty(id),
  fetchTransactionsMock: async () => get().fetchTransactions(),
  fetchTransactionByIdMock: async (id) => get().fetchTransactionById(id),
  fetchFinanceMock: async () => get().fetchFinance(),
  approvePayoutMock: async (id) => get().approvePayout(id),
  rejectPayoutMock: async (id) => get().rejectPayout(id),
  flagTransactionMock: async (id) => get().flagTransaction(id),
  refundTransactionMock: async (id) => get().refundTransaction(id),
}));
