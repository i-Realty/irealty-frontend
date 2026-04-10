'use client';

'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';
import { ArrowLeft, MessageCircle, Flag, Clock } from 'lucide-react';

export default function AdminTransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { selectedTransaction: tx, isLoading, isActionLoading, fetchTransactionByIdMock, flagTransactionMock, refundTransactionMock } = useAdminDashboardStore();
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  useEffect(() => {
    fetchTransactionByIdMock(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !tx) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  const getStatusStyle = (status: string) => {
    switch (status) { case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200'; case 'Completed': return 'bg-green-50 text-green-600 border-green-200'; case 'Declined': return 'bg-red-50 text-red-500 border-red-200'; case 'In-progress': return 'bg-blue-50 text-blue-600 border-blue-200'; default: return 'bg-gray-50 text-gray-600 border-gray-200'; }
  };

  return (
    <>
    <div className="space-y-6 pb-12">
      <button onClick={() => router.push('/dashboard/admin/transactions')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{tx.id}</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(tx.status)}`}>{tx.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">Financial Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Amount', value: `₦${tx.amount.toLocaleString()}`, color: 'text-gray-900 dark:text-gray-100' },
                { label: 'Escrow Amount', value: `₦${tx.escrowAmount.toLocaleString()}`, color: 'text-blue-600' },
                { label: 'i-Realty Fee', value: `₦${tx.irealtyFee.toLocaleString()}`, color: 'text-green-600' },
                { label: 'Net to Parties', value: `₦${tx.netToParties.toLocaleString()}`, color: 'text-gray-900 dark:text-gray-100' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
                  <p className={`text-lg font-bold mt-1 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Transaction Details</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Transaction ID', value: tx.id },
                { label: 'Date', value: tx.date },
                { label: 'Type', value: tx.type },
                { label: 'Status', value: tx.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Audit Log</h3>
            <div className="space-y-4">
              {tx.auditLog.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    {i < tx.auditLog.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 min-h-[16px]" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{entry.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">by {entry.by} - {entry.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parties Sidebar */}
        <div className="space-y-5">
          {/* Party A */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none flex flex-col items-center text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Buyer / Client</p>
            <Image src={tx.partyAAvatar} alt={tx.partyA} width={48} height={48} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 mb-2" />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">{tx.partyA}</p>
            <button
              onClick={() => router.push('/dashboard/admin/messages')}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Message
            </button>
          </div>

          {/* Party B */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none flex flex-col items-center text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Seller / Agent</p>
            <Image src={tx.partyBAvatar} alt={tx.partyB} width={48} height={48} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 mb-2" />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">{tx.partyB}</p>
            <button
              onClick={() => router.push('/dashboard/admin/messages')}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Message
            </button>
          </div>

          {/* Admin Actions */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Admin Actions</h4>
            <button
              onClick={async () => { await flagTransactionMock(tx.id); showToast('Transaction flagged for review.'); }}
              disabled={isActionLoading}
              className="w-full flex items-center justify-center gap-2 border border-orange-200 text-orange-600 rounded-lg py-2.5 text-sm font-medium hover:bg-orange-50 transition-colors disabled:opacity-50"
            >
              <Flag className="w-4 h-4" /> {isActionLoading ? 'Flagging...' : 'Flag for Review'}
            </button>
            {tx.status === 'Pending' && (
              <button
                onClick={async () => { await refundTransactionMock(tx.id); showToast('Refund initiated successfully.'); }}
                disabled={isActionLoading}
                className="w-full bg-red-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isActionLoading ? 'Processing...' : 'Initiate Refund'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    {toast && (
      <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-green-600 animate-in fade-in slide-in-from-bottom-2">
        {toast}
      </div>
    )}
    </>
  );
}
