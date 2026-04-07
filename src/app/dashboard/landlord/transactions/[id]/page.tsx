'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Flag, Download,
} from 'lucide-react';
import {
  useLandlordDashboardStore,
  LandlordTransactionStatus,
} from '@/lib/store/useLandlordDashboardStore';

// ── Status Badge ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LandlordTransactionStatus }) {
  const config: Record<string, { bg: string; text: string }> = {
    Pending:   { bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-600' },
    Completed: { bg: 'bg-green-50 border-green-200',  text: 'text-green-600' },
    Failed:    { bg: 'bg-red-50 border-red-200',      text: 'text-red-500' },
  };
  const c = config[status] ?? config.Pending;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
}

// ── Summary Card ───────────────────────────────────────────────────────

function SummaryCard({ amount, type, status }: {
  amount: number; type: string; status: LandlordTransactionStatus;
}) {
  const fmt = (n: number) => `\u20A6${n.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  const isPending = status === 'Pending';
  return (
    <div className={`rounded-xl p-5 space-y-3.5 ${isPending ? 'bg-blue-50/60 border border-blue-200' : 'bg-gray-50 border border-gray-100'}`}>
      <h4 className="text-sm font-bold text-gray-900">Summary</h4>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Amount</span>
        <span className="text-sm font-bold text-gray-900">{fmt(amount)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Type</span>
        <span className="text-sm font-bold text-gray-900">{type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Status</span>
        <span className="text-sm font-bold text-gray-900">{status}</span>
      </div>
    </div>
  );
}

// ── Tenant Card ────────────────────────────────────────────────────────

function TenantCard({ tenantName }: { tenantName: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 flex flex-col items-center text-center shadow-sm">
      <h4 className="text-sm font-bold text-gray-900 mb-3">Tenant</h4>
      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-2">
        <span className="text-blue-600 font-bold text-lg">
          {tenantName !== '-' ? tenantName.charAt(0) : '?'}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-3">{tenantName}</p>
      {tenantName !== '-' && (
        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Message Tenant
        </button>
      )}
    </div>
  );
}

// ── Timeline ───────────────────────────────────────────────────────────

function TransactionTimeline({ status }: { status: LandlordTransactionStatus }) {
  const steps = [
    { label: 'Transaction Initiated' },
    { label: 'Processing' },
    { label: status === 'Failed' ? 'Failed' : 'Completed' },
  ];

  const currentStep = status === 'Completed' ? 3 : status === 'Failed' ? 3 : status === 'Pending' ? 1 : 1;

  const getState = (idx: number) => {
    if (status === 'Completed') return 'completed';
    if (status === 'Failed' && idx < 2) return 'completed';
    if (status === 'Failed' && idx === 2) return 'failed';
    if (idx < currentStep) return 'completed';
    if (idx === currentStep) return 'active';
    return 'future';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>
      <div className="flex flex-col">
        {steps.map((step, idx) => {
          const state = getState(idx);
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  state === 'completed' ? 'bg-green-500' :
                  state === 'failed' ? 'bg-red-500' :
                  state === 'active' ? 'bg-green-500' :
                  'bg-gray-200'
                }`}>
                  {state === 'completed' ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : state === 'failed' ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : state === 'active' ? (
                    <div className="w-3 h-3 bg-white rotate-45" />
                  ) : (
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${
                    state === 'completed' ? 'bg-green-500' :
                    state === 'failed' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`} />
                )}
              </div>
              <div className={`flex-1 ${!isLast ? 'pb-6' : 'pb-0'}`}>
                <p className={`font-semibold text-[15px] ${
                  state === 'future' ? 'text-gray-400' :
                  state === 'failed' ? 'text-red-500' :
                  'text-gray-900'
                }`}>
                  {step.label}
                </p>
                {state === 'active' && (
                  <p className="mt-1 text-sm text-gray-500">This transaction is currently being processed.</p>
                )}
                {state === 'failed' && (
                  <p className="mt-1 text-sm text-red-400">This transaction could not be completed. Please try again or contact support.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function LandlordTransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const {
    selectedTransaction: tx,
    transactionsLoading,
    fetchTransactionByIdMock,
  } = useLandlordDashboardStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    if (id) fetchTransactionByIdMock(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (transactionsLoading || !tx) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12 w-full animate-in fade-in duration-300">
      {/* Back */}
      <button
        onClick={() => router.push('/dashboard/landlord/transactions')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{tx.id}</h1>
        <StatusBadge status={tx.status} />
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200">
        {(['overview', 'details'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`py-3 px-5 text-sm font-medium border-b-2 capitalize transition-colors ${
              activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in duration-200">
          {/* Timeline */}
          <div className="lg:col-span-3">
            <TransactionTimeline status={tx.status} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <SummaryCard
              amount={tx.amount}
              type={tx.type}
              status={tx.status}
            />

            <TenantCard tenantName={tx.tenantName} />

            {/* Download Receipt */}
            <button className="flex items-center justify-between w-full group py-2 px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Download className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  Download Receipt
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Report Transaction */}
            <button className="flex items-center justify-between w-full group py-2 px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm font-semibold text-red-500 group-hover:text-red-600 transition-colors">
                  Report Transaction
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Details */}
      {activeTab === 'details' && (
        <div className="animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Transaction ID', value: tx.id },
                { label: 'Date', value: tx.date },
                { label: 'Property', value: tx.propertyName },
                { label: 'Tenant', value: tx.tenantName },
                { label: 'Amount', value: `\u20A6${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` },
                { label: 'Type', value: tx.type },
                { label: 'Status', value: tx.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium mb-1">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
