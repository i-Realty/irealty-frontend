'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CreditCard } from 'lucide-react';
import { useDiasporaDashboardStore, DiasporaInvoice } from '@/lib/store/useDiasporaDashboardStore';

// ── Invoice Status Badge ──────────────────────────────────────────────

export function InvoiceStatusBadge({ status }: { status: DiasporaInvoice['status'] }) {
  const styles: Record<string, string> = {
    Pending: 'text-amber-600',
    Paid:    'text-green-600',
    Overdue: 'text-red-500',
    Failed:  'text-red-500',
  };
  return <span className={`text-sm font-medium ${styles[status] ?? 'text-gray-600'}`}>{status}</span>;
}

// ── Payment Modal ─────────────────────────────────────────────────────

type PaymentMethod = 'Bank Transfer' | 'Card' | 'Crypto';

function PaymentModal({ invoice: inv, onClose }: { invoice: DiasporaInvoice; onClose: () => void }) {
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Proceed To Payment</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Payment Initiated</h3>
            <p className="text-sm text-gray-500">
              Payment for invoice <span className="font-semibold">{inv.id}</span> of{' '}
              <span className="font-semibold">₦{inv.amountDue.toLocaleString()}</span> has been sent to escrow.
            </p>
            <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="bg-blue-50/60 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Invoice ID</span><span className="font-semibold text-gray-900">{inv.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium text-gray-900">{inv.serviceType}</span></div>
              <div className="flex justify-between border-t border-blue-100 pt-2 mt-1">
                <span className="text-gray-500">Amount Due</span>
                <span className="font-bold text-blue-700 text-base">₦{inv.amountDue.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Payment Method</p>
              <div className="space-y-2">
                {(['Bank Transfer', 'Card', 'Crypto'] as PaymentMethod[]).map((m) => (
                  <label key={m} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                    <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="accent-blue-600 w-4 h-4" />
                    <span className="text-sm font-medium text-gray-900">{m}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Funds are held in escrow until services are confirmed complete.
            </p>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                ) : 'Pay Now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Invoice Detail Modal ──────────────────────────────────────────────

export function InvoiceDetailModal() {
  const router = useRouter();
  const { selectedInvoice: inv, isInvoiceModalOpen, setInvoiceModalOpen, setSelectedInvoice } = useDiasporaDashboardStore();
  const [showPayment, setShowPayment] = useState(false);

  if (!isInvoiceModalOpen || !inv) return null;

  const close = () => {
    setSelectedInvoice(null);
    setInvoiceModalOpen(false);
    setShowPayment(false);
  };

  const isPending = inv.status === 'Pending';

  if (showPayment) {
    return <PaymentModal invoice={inv} onClose={close} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Invoice Details</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Service Plan',      value: inv.serviceType },
            { label: 'Scope of Service',  value: inv.scopeOfService },
            { label: 'Amount Due',        value: `₦${inv.amountDue.toLocaleString()} (10% of construction cost)` },
            { label: 'Invoice ID',        value: inv.id },
            { label: 'Issue Date',        value: inv.dateIssued },
            { label: 'Due Date',          value: inv.dueDate },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-400 font-medium shrink-0">{label}</span>
              <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-medium">Status</span>
            <InvoiceStatusBadge status={inv.status} />
          </div>
        </div>
        <div className="p-6 pt-2 border-t border-gray-100">
          {isPending ? (
            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Proceed To Payment
            </button>
          ) : (
            <button
              onClick={() => { close(); router.push('/dashboard/diaspora/transactions'); }}
              className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Escrow Timeline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
