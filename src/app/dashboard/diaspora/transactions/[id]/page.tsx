'use client';

'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Circle, Diamond, CheckCircle2, MessageCircle } from 'lucide-react';
import {
  useDiasporaDashboardStore,
  DiasporaTimelineStep,
} from '@/lib/store/useDiasporaDashboardStore';

// ── Status Badge ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    Pending:       { bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-600' },
    'In-progress': { bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-600' },
    Completed:     { bg: 'bg-green-50 border-green-200',  text: 'text-green-600' },
    Declined:      { bg: 'bg-red-50 border-red-200',      text: 'text-red-500' },
  };
  const c = config[status] ?? config.Pending;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
}

// ── Timeline Step Icon ────────────────────────────────────────────────

function StepIcon({ status }: { status: DiasporaTimelineStep['status'] }) {
  if (status === 'completed') {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 z-10">
        <Check className="w-4 h-4 text-white stroke-[3]" />
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 z-10">
        <Diamond className="w-4 h-4 text-white" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 z-10">
      <Circle className="w-3 h-3 text-gray-400" />
    </div>
  );
}

// ── Plan Features (Details Tab) ───────────────────────────────────────

const PLAN_FEATURES: Record<string, { pricing: string; pricingSub: string; features: string[] }> = {
  Basic: {
    pricing: '₦200K - ₦350K',
    pricingSub: 'OR 1.5-2% of property value',
    features: ['Curated property shortlist (up to 3 options)', 'Virtual inspection (video tours)', 'Basic document verification', 'Escrow payment processing'],
  },
  Standard: {
    pricing: '2.5% - 3%',
    pricingSub: 'of property value',
    features: ['Everything in Basic Plan', 'Full legal due diligence & title perfection', 'Physical inspection by i-Realty team', 'Seller/agent verification', 'Secure handover of documents & keys'],
  },
  Premium: {
    pricing: '3% - 4%',
    pricingSub: 'of property value + management fees',
    features: ['Everything in Standard Plan', 'ROI analysis & investment report', 'Negotiation & price review', 'End-to-end project supervision', 'Tenant placement or short-let setup'],
  },
  Concierge: {
    pricing: 'Monthly/Yearly',
    pricingSub: 'Retainer subscription model',
    features: ['Everything in Premium Plan', 'Personal relationship manager', 'Ongoing property management & rent collection', 'Family liaison services', 'Annual property health reports'],
  },
};

// ── Page ───────────────────────────────────────────────────────────────

export default function DiasporaTransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const {
    selectedTransaction: tx,
    isLoading,
    fetchTransactionByIdMock,
    fetchDashboardDataMock,
    advanceTimelineStepMock,
  } = useDiasporaDashboardStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    fetchDashboardDataMock();
    fetchTransactionByIdMock(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !tx) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const plan = PLAN_FEATURES[tx.planTier] ?? PLAN_FEATURES.Premium;

  return (
    <div className="space-y-5 pb-12 w-full animate-in fade-in duration-300">
      {/* Back */}
      <button
        onClick={() => router.push('/dashboard/diaspora/transactions')}
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

      {/* ── Overview Tab ──────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in duration-200">
          {/* Timeline (3/5) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>
              <div className="flex flex-col">
                {tx.timeline.map((step, idx) => {
                  const isLast = idx === tx.timeline.length - 1;
                  return (
                    <div key={idx} className="flex gap-4">
                      {/* Icon + Connector */}
                      <div className="flex flex-col items-center">
                        <StepIcon status={step.status} />
                        {!isLast && (
                          <div className={`w-0.5 flex-1 min-h-[24px] ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
                        <p className={`font-semibold text-[15px] ${step.status === 'future' ? 'text-gray-400' : 'text-gray-900'}`}>
                          {step.label}
                        </p>

                        {step.status === 'active' && step.actionLabel && (
                          <div className="mt-3 space-y-3">
                            {step.label === 'Site Inspection' && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                We are inspecting the site on your behalf. Upload Photos will be released from us, which
                                is released on completion and approved by you.
                              </p>
                            )}
                            {step.label === 'Legal Verification & Title Check' && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                We have applied for the C-of-O to legal & title check on your behalf, and it looks like
                                that a current owner&apos;s ownership documents are complete.
                              </p>
                            )}
                            {step.label === 'Purchase Agreement & Payment Release' && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                Please review and sign the purchase agreement. Once signed and all parties have confirmed,
                                the Escrow protected funds will be released from the Plan.
                              </p>
                            )}
                            {step.label === 'Construction / Project Supervision' && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                i-Realty is currently supervising the construction. Status will be provided via app. Updates on time will be provided
                                at each milestone & completion certificate.
                              </p>
                            )}
                            {step.label === 'Final Handover' && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                The project is complete! Once both sides have signed the completion agreement,
                                you may confirm the handover, copy a completion certificate.
                              </p>
                            )}
                            <button
                              onClick={() => advanceTimelineStepMock(tx.id, idx)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                            >
                              {step.actionLabel}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar (2/5) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Summary */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3.5">
              <h4 className="text-sm font-bold text-gray-900">Summary</h4>
              {[
                { label: 'Transaction Date', value: tx.transactionDate },
                { label: 'Amount', value: `₦${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` },
                { label: 'Service Type', value: tx.serviceType },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-bold text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            {/* Your Service Rep */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Your Service Rep</h4>
              <div className="flex flex-col items-center text-center">
                <Image
                  src={tx.repAvatar}
                  alt={tx.repName}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 mb-2"
                />
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-sm font-bold text-gray-900">{tx.repName}</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => router.push('/dashboard/diaspora/messages')}
                    className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat
                  </button>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`Hi ${tx.repName}! I have a question about transaction ${tx.id}.`);
                      window.open(`https://wa.me/?text=${msg}`, '_blank');
                    }}
                    className="flex-1 border border-green-200 rounded-lg py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Details Tab ───────────────────────────────────────── */}
      {activeTab === 'details' && (
        <div className="animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm max-w-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{tx.planTier} Plan</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                {tx.planTier === 'Premium' ? '"Investor Pack" - ROI focused' :
                 tx.planTier === 'Basic' ? '"Search & Secure" - First-time buyers' :
                 tx.planTier === 'Standard' ? '"Verified Purchase" - Full due diligence' :
                 '"End-to-End Management" - Hands-off'}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-3">{plan.pricing}</p>
              <p className="text-xs text-gray-400 mt-1">{plan.pricingSub}</p>
            </div>
            <div className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
