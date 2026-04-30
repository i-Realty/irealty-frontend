import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/api/client';
import { useNotificationStore } from './useNotificationStore';
import { useTransactionLedger } from './useTransactionLedger';
import {
  usePropertyTransactionsStore,
  mapBackendTransaction,
  type BackendPropertyTransaction,
} from './usePropertyTransactionsStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ── Types ──────────────────────────────────────────────────────────────

export type DiasporaPlanTier = 'Basic' | 'Standard' | 'Premium' | 'Concierge';
export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue' | 'Failed';
export type EscrowStatus = 'Pending' | 'Paid' | 'Active' | 'Released';
export type PaymentStatus = 'Pending' | 'In-progress' | 'Completed' | 'Declined';

export interface DiasporaActivePlan {
  tier: DiasporaPlanTier;
  scopeOfService: string;
  amount: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  /** The agent assigned as Care Representative for this diaspora client */
  careRepId?: string;
  careRepName?: string;
  careRepAvatar?: string;
}

export interface DiasporaInvoice {
  id: string;
  dateIssued: string;
  serviceType: string;
  amountDue: number;
  status: InvoiceStatus;
  scopeOfService: string;
  dueDate: string;
  escrowStatus: EscrowStatus;
}

export interface DiasporaPayment {
  id: string;
  date: string;
  serviceType: string;
  amount: number;
  status: PaymentStatus;
}

export type DiasporaTimelineStepStatus = 'completed' | 'active' | 'future';

export interface DiasporaTimelineStep {
  label: string;
  status: DiasporaTimelineStepStatus;
  actionLabel?: string;
}

export interface DiasporaTransactionDetail {
  id: string;
  status: PaymentStatus;
  transactionDate: string;
  amount: number;
  serviceType: string;
  planTier: DiasporaPlanTier;
  timeline: DiasporaTimelineStep[];
  // Care rep
  repName: string;
  repAvatar: string;
}

interface DiasporaDashboardState {
  activePlan: DiasporaActivePlan | null;
  invoices: DiasporaInvoice[];
  payments: DiasporaPayment[];
  selectedInvoice: DiasporaInvoice | null;
  selectedTransaction: DiasporaTransactionDetail | null;

  isLoading: boolean;
  error: string | null;

  isInvoiceModalOpen: boolean;
  setInvoiceModalOpen: (open: boolean) => void;
  setSelectedInvoice: (invoice: DiasporaInvoice | null) => void;

  fetchDashboardData: () => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;
  advanceTimelineStep: (txId: string, stepIndex: number) => Promise<void>;
  /**
   * Diaspora pays a service invoice — creates a ledger entry in escrow and
   * advances the timeline to step 1 (Funds Held In Escrow).
   */
  payInvoice: (invoiceId: string, diasporaUserId: string, diasporaUserName: string) => Promise<void>;

  /** @deprecated Use fetchDashboardData() */
  fetchDashboardDataMock: () => Promise<void>;
  /** @deprecated Use fetchTransactionById() */
  fetchTransactionByIdMock: (id: string) => Promise<void>;
  /** @deprecated Use advanceTimelineStep() */
  advanceTimelineStepMock: (txId: string, stepIndex: number) => Promise<void>;
  /** @deprecated Use payInvoice() */
  payInvoiceMock: (invoiceId: string, diasporaUserId: string, diasporaUserName: string) => Promise<void>;
}

// ── Mock Data ──────────────────────────────────────────────────────────

const MOCK_INVOICES: DiasporaInvoice[] = [
  { id: 'INV-10234', dateIssued: '28 Aug 2025', serviceType: 'Premium Plan', amountDue: 25000, status: 'Pending', scopeOfService: 'Property search, architectural design, contractor management', dueDate: 'Sept 24, 2025', escrowStatus: 'Pending' },
  { id: 'INV-10235', dateIssued: '28 Aug 2025', serviceType: 'Premium Plan', amountDue: 25000, status: 'Paid', scopeOfService: 'Property search, architectural design, contractor management', dueDate: 'Sept 24, 2025', escrowStatus: 'Active' },
  { id: 'INV-10236', dateIssued: '28 Aug 2025', serviceType: 'Premium Plan', amountDue: 25000, status: 'Paid', scopeOfService: 'Property search, architectural design, contractor management', dueDate: 'Sept 24, 2025', escrowStatus: 'Released' },
  { id: 'INV-10237', dateIssued: '28 Aug 2025', serviceType: 'Premium Plan', amountDue: 15000, status: 'Overdue', scopeOfService: 'Property search, architectural design, contractor management', dueDate: 'Sept 24, 2025', escrowStatus: 'Pending' },
  { id: 'INV-10238', dateIssued: '28 Aug 2025', serviceType: 'Premium Plan', amountDue: 25000, status: 'Overdue', scopeOfService: 'Property search, architectural design, contractor management', dueDate: 'Sept 24, 2025', escrowStatus: 'Pending' },
];

const MOCK_PAYMENTS: DiasporaPayment[] = [
  { id: 'TRN-0932', date: '28 Aug 2025', serviceType: 'Premium Plan', amount: 625000, status: 'Pending' },
  { id: 'TRN-0933', date: '28 Aug 2025', serviceType: 'Premium Plan', amount: 625000, status: 'Completed' },
  { id: 'TRN-0934', date: '28 Aug 2025', serviceType: 'Premium Plan', amount: 827000, status: 'Declined' },
  { id: 'TRN-0935', date: '28 Aug 2025', serviceType: 'Premium Plan', amount: 625000, status: 'In-progress' },
  { id: 'TRN-0936', date: '28 Aug 2025', serviceType: 'Premium Plan', amount: 625866, status: 'In-progress' },
];

function buildMockTimeline(activeStep: number): DiasporaTimelineStep[] {
  const steps = [
    { label: 'Funds Held In Escrow', actionLabel: undefined },
    { label: 'Site Inspection', actionLabel: 'Review Inspection Report' },
    { label: 'Legal Verification & Title Check', actionLabel: 'Review Legal Report' },
    { label: 'Purchase Agreement & Payment Release', actionLabel: 'Review & Sign Agreement' },
    { label: 'Construction / Project Supervision', actionLabel: 'Review & Sign Agreement' },
    { label: 'Furnishing & Setup', actionLabel: undefined },
    { label: 'Final Handover', actionLabel: 'Confirm Final Handover' },
  ];
  return steps.map((s, i) => ({
    ...s,
    status: (i < activeStep ? 'completed' : i === activeStep ? 'active' : 'future') as DiasporaTimelineStepStatus,
  }));
}

// ── Store ──────────────────────────────────────────────────────────────

export const useDiasporaDashboardStore = create<DiasporaDashboardState>((set, get) => ({
  activePlan: null,
  invoices: [],
  payments: [],
  selectedInvoice: null,
  selectedTransaction: null,

  isLoading: false,
  error: null,

  isInvoiceModalOpen: false,
  setInvoiceModalOpen: (open) => set({ isInvoiceModalOpen: open }),
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice, isInvoiceModalOpen: !!invoice }),

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ activePlan: DiasporaActivePlan; invoices: DiasporaInvoice[]; payments: DiasporaPayment[] }>('/api/diaspora/dashboard');
        set({ activePlan: data.activePlan, invoices: data.invoices, payments: data.payments, isLoading: false });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        set({
          activePlan: {
            tier: 'Premium',
            scopeOfService: 'Property search, architectural design, contractor management',
            amount: '$15,000 (10% of construction cost)',
            status: 'Active',
            careRepId: 'USR-001',
            careRepName: 'Sarah Homes',
            careRepAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
          },
          invoices: MOCK_INVOICES,
          payments: MOCK_PAYMENTS,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load dashboard', isLoading: false });
    }
  },

  fetchTransactionById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        // Use the unified property-transactions endpoint
        const raw = await apiGet<BackendPropertyTransaction>(`/api/property-transactions/${id}`);
        const pt = mapBackendTransaction(raw);
        const activeStep = pt.status === 'Completed' ? 7 : pt.step;
        const statusMap: Record<string, PaymentStatus> = {
          Pending: 'Pending', 'In-progress': 'In-progress',
          Completed: 'Completed', Declined: 'Declined', Cancelled: 'Declined',
        };
        set({
          selectedTransaction: {
            id:              pt.id,
            status:          statusMap[pt.status] ?? 'Pending',
            transactionDate: pt.date,
            amount:          pt.amount || pt.escrowAmount,
            serviceType:     pt.type === 'inspection' ? 'Inspection' : pt.type === 'rental' ? 'Rental' : 'Purchase',
            planTier:        'Premium',
            timeline:        buildMockTimeline(activeStep),
            repName:         pt.sellerName,
            repAvatar:       pt.sellerAvatar,
          },
          isLoading: false,
        });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const payments = get().payments.length > 0 ? get().payments : MOCK_PAYMENTS;
        const payment = payments.find((p) => p.id === id);
        const activeStep = payment?.status === 'Completed' ? 7 : payment?.status === 'In-progress' ? 2 : 1;
        set({
          selectedTransaction: {
            id,
            status: payment?.status ?? 'Pending',
            transactionDate: 'December 13, 2024',
            amount: payment?.amount ?? 625000,
            serviceType: payment?.serviceType ?? 'Premium Plan',
            planTier: 'Premium',
            timeline: buildMockTimeline(activeStep),
            repName: 'Sarah Homes',
            repAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
          },
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load transaction', isLoading: false });
    }
  },

  payInvoice: async (invoiceId, diasporaUserId, diasporaUserName) => {
    set({ isLoading: true });
    try {
      if (USE_API) {
        await apiPost(`/api/diaspora/invoices/${invoiceId}/pay`, { diasporaUserId, diasporaUserName });
      } else {
        await new Promise((r) => setTimeout(r, 800));
        const invoice = useDiasporaDashboardStore.getState().invoices.find((i) => i.id === invoiceId);
        const plan = useDiasporaDashboardStore.getState().activePlan;

        if (invoice) {
          useTransactionLedger.getState().createEntry({
            type: 'service',
            status: 'in_escrow',
            payerId: diasporaUserId,
            payerName: diasporaUserName,
            payeeId: plan?.careRepId ?? 'agent-unknown',
            payeeName: plan?.careRepName ?? 'Care Representative',
            amount: invoice.amountDue,
            platformFee: invoice.amountDue,
            netAmount: 0,
            propertyId: 'diaspora_service',
            propertyTitle: `Diaspora Service — ${invoice.serviceType}`,
            notes: invoice.scopeOfService,
          });
        }
      }

      const invoice = useDiasporaDashboardStore.getState().invoices.find((i) => i.id === invoiceId);
      const plan = useDiasporaDashboardStore.getState().activePlan;

      set((s) => ({
        invoices: s.invoices.map((i) =>
          i.id === invoiceId ? { ...i, status: 'Paid' as InvoiceStatus, escrowStatus: 'Active' as EscrowStatus } : i
        ),
        isLoading: false,
      }));

      if (invoice) {
        useNotificationStore.getState().emit(
          'payment',
          'Invoice paid — funds held in escrow',
          `₦${invoice.amountDue.toLocaleString()} for "${invoice.serviceType}" is held in escrow. Your Care Rep has been notified.`,
          '/dashboard/diaspora/transactions'
        );
        useNotificationStore.getState().emit(
          'payment',
          'Diaspora client paid invoice',
          `${diasporaUserName} paid ₦${invoice.amountDue.toLocaleString()} for "${invoice.serviceType}". Funds are in escrow.`,
          '/dashboard/agent'
        );
      }

      void plan; // referenced for mock ledger only
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Payment failed', isLoading: false });
    }
  },

  advanceTimelineStep: async (txId, stepIndex) => {
    set({ isLoading: true });
    try {
      if (USE_API) {
        await apiPost(`/api/property-transactions/${txId}/confirm-completion`, { stepIndex });
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }

      set((s) => {
        if (!s.selectedTransaction) return { isLoading: false };
        const timeline = s.selectedTransaction.timeline.map((step, i) => {
          if (i === stepIndex) return { ...step, status: 'completed' as const };
          if (i === stepIndex + 1) return { ...step, status: 'active' as const };
          return step;
        });
        const allDone = timeline.every((t) => t.status === 'completed');
        const completedStep = s.selectedTransaction.timeline[stepIndex];

        useNotificationStore.getState().emit(
          'property',
          `Timeline update: ${completedStep?.label ?? 'Step'} completed`,
          allDone
            ? 'All stages complete — your property is ready for handover!'
            : `Step ${stepIndex + 1} of your acquisition has been completed by your Care Rep.`,
          '/dashboard/diaspora/transactions'
        );

        return {
          selectedTransaction: {
            ...s.selectedTransaction,
            timeline,
            status: allDone ? 'Completed' : s.selectedTransaction.status,
          },
          isLoading: false,
        };
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Action failed', isLoading: false });
    }
  },

  // Backward-compatible aliases
  fetchDashboardDataMock: async () => get().fetchDashboardData(),
  fetchTransactionByIdMock: async (id) => get().fetchTransactionById(id),
  advanceTimelineStepMock: async (txId, stepIndex) => get().advanceTimelineStep(txId, stepIndex),
  payInvoiceMock: async (invoiceId, diasporaUserId, diasporaUserName) => get().payInvoice(invoiceId, diasporaUserId, diasporaUserName),
}));
