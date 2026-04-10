'use client';

'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDeveloperTransactionsStore } from '@/lib/store/useDeveloperTransactionsStore';
import DeveloperTransactionTimeline from '@/components/dashboard/developer/transactions/DeveloperTransactionTimeline';
import { ArrowLeft, MessageCircle, Flag, CheckCircle2, BedDouble, Bath, Maximize2, X } from 'lucide-react';

const REPORT_REASONS = [
  'Non-performance by buyer',
  'Payment dispute',
  'Property misrepresentation',
  'Milestone not completed',
  'Other',
];

function ReportModal({ txId, onClose }: { txId: string; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><Flag className="w-4 h-4 text-red-500" /></div>
            <h2 className="text-lg font-bold text-gray-900">Report Transaction</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        {done ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-bold text-gray-900">Report Submitted</h3>
            <p className="text-sm text-gray-500">Your report for <span className="font-semibold">{txId}</span> has been received.</p>
            <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Done</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Transaction: <span className="font-semibold text-gray-900">{txId}</span></p>
            <div className="space-y-3 mb-4">
              {REPORT_REASONS.map((r) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-blue-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">{r}</span>
                </label>
              ))}
            </div>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Additional details..." rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300 mb-4" />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={!reason || isSubmitting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</> : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DeveloperTransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);
  const {
    selectedTransaction: tx,
    isLoading,
    isActionLoading,
    fetchTransactionByIdMock,
    acceptTransactionMock,
    declineTransactionMock,
    uploadMilestoneDocsMock,
  } = useDeveloperTransactionsStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    fetchTransactionByIdMock(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !tx) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':     return 'text-amber-600';
      case 'Completed':   return 'text-green-600';
      case 'Declined':    return 'text-red-600';
      case 'In-progress': return 'text-blue-600';
      default:            return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back */}
      <Link href="/dashboard/developer/transactions" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      {/* Title + Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{tx.id}</h1>
        <span className={`text-sm font-bold ${getStatusStyle(tx.status)}`}>{tx.status}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'overview' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Overview
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t" />}
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'details' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Details
          {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t" />}
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Timeline (3/5) */}
          <div className="lg:col-span-3">
            <DeveloperTransactionTimeline
              transaction={tx}
              onAccept={() => acceptTransactionMock(tx.id)}
              onDecline={() => declineTransactionMock(tx.id)}
              onUploadDocs={(index) => uploadMilestoneDocsMock(tx.id, index)}
              isActionLoading={isActionLoading}
            />
          </div>

          {/* Sidebar (2/5) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Summary Card */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-gray-900">Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Funded( Escrow Protection)</span>
                <span className="font-bold text-gray-900">&#8358;{tx.escrowAmount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Property price</span>
                <span className="font-bold text-gray-900">&#8358;{tx.propertyPrice.toLocaleString()}.00</span>
              </div>
            </div>

            {/* Client Card */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Client</h4>
              <div className="flex flex-col items-center text-center">
                <Image
                  src={tx.buyerAvatar}
                  alt={tx.buyerName}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border border-gray-100"
                />
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm font-bold text-gray-900">{tx.buyerName.replace('John', 'Sarah').replace('Doe', 'Homes')}</span>
                  {tx.buyerVerified && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <button
                  onClick={() => router.push('/dashboard/developer/messages')}
                  className="mt-3 w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Chat Client
                </button>
              </div>
            </div>

            {/* Report */}
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 text-red-500 font-medium text-sm hover:text-red-600 transition-colors w-full justify-start px-1"
            >
              <Flag className="w-4 h-4" /> Report Transaction
              <ArrowLeft className="w-4 h-4 ml-auto rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Details Tab */
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex gap-6">
            <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={tx.propertyImage} alt={tx.projectName} fill className="object-cover" />
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">{tx.tag}</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">{tx.projectName}</h3>
              <p className="text-sm text-gray-500">{tx.propertyLocation}</p>
              <p className="text-lg font-bold text-gray-900">&#8358; {tx.escrowAmount.toLocaleString()}.00</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> {tx.beds} beds</span>
                <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {tx.baths} baths</span>
                <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" /> {tx.sqm} sqm</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {reportOpen && <ReportModal txId={tx.id} onClose={() => setReportOpen(false)} />}
    </div>
  );
}
