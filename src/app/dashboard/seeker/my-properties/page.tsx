'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, X, FileText, CreditCard } from 'lucide-react';
import { useSeekerPropertiesStore, SeekerPropertyTab, SeekerProperty } from '@/lib/store/useSeekerPropertiesStore';
import SeekerPropertyCard from '@/components/dashboard/seeker/SeekerPropertyCard';

const TABS: SeekerPropertyTab[] = ['All', 'Owned', 'Rented'];
const ITEMS_PER_PAGE = 6;

function formatNGN(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
    .format(amount)
    .replace('NGN', '₦');
}

// ── Lease Details Modal ────────────────────────────────────────────────
function LeaseDetailsModal({ property: p, onClose }: { property: SeekerProperty; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Lease Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            <h3 className="font-semibold text-gray-900 text-[15px]">{p.title}</h3>
            <p className="text-gray-500">{p.location}</p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Lease Period', value: `${p.leaseStart} – ${p.leaseEnd}` },
              { label: 'Months Remaining', value: `${p.monthsLeft} months` },
              { label: 'Yearly Rent', value: formatNGN(p.yearlyRent ?? 0) },
              ...(p.securityDeposit != null
                ? [{ label: 'Security Deposit', value: formatNGN(p.securityDeposit) }]
                : []),
              { label: 'Total Paid', value: formatNGN(p.totalPaid ?? 0) },
              { label: 'Status', value: p.status },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Pay Rent Modal ─────────────────────────────────────────────────────
function PayRentModal({ property: p, onClose }: { property: SeekerProperty; onClose: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Pay Rent</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Payment Initiated</h3>
            <p className="text-sm text-gray-500">Your rent payment of {formatNGN(p.yearlyRent ?? 0)} has been sent to escrow and is awaiting processing.</p>
            <button onClick={onClose} className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="bg-blue-50/60 rounded-xl p-4 mb-4 space-y-2.5 text-sm">
              <h3 className="font-semibold text-gray-900">{p.title}</h3>
              <p className="text-gray-500">{p.location}</p>
              <div className="flex justify-between pt-1 border-t border-blue-100">
                <span className="text-gray-500">Amount Due</span>
                <span className="font-bold text-blue-700 text-base">{formatNGN(p.yearlyRent ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lease Period</span>
                <span className="font-medium text-gray-900">{p.leaseStart} – {p.leaseEnd}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4 text-center">
              Payment will be held in escrow until confirmed by your landlord/agent.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : 'Confirm Payment'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function SeekerMyPropertiesPage() {
  const router = useRouter();
  const { properties, isLoading, activeTab, setActiveTab, fetchPropertiesMock } = useSeekerPropertiesStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [leaseModal, setLeaseModal] = useState<SeekerProperty | null>(null);
  const [payRentModal, setPayRentModal] = useState<SeekerProperty | null>(null);

  useEffect(() => {
    fetchPropertiesMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activeTab === 'All'
    ? properties
    : properties.filter((p) => p.propertyType === activeTab);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when tab changes
  const handleTabChange = (tab: SeekerPropertyTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Yet</h3>
        <p className="text-gray-500 text-sm text-center mb-6 max-w-xs">
          Start your journey today — explore listings, rent, or buy your dream property.
        </p>
        <Link
          href="/dashboard/seeker/search"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 w-full overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginated.map((p) => (
          <SeekerPropertyCard
            key={p.id}
            property={p}
            onLeaseDetails={() => setLeaseModal(p)}
            onPayRent={() => setPayRentModal(p)}
            onViewDetails={() => router.push(`/listings`)}
            onContactAgent={() => router.push('/dashboard/seeker/messages')}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 text-sm"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'border border-blue-600 bg-blue-50 text-blue-600'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 text-sm"
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {leaseModal && <LeaseDetailsModal property={leaseModal} onClose={() => setLeaseModal(null)} />}
      {payRentModal && <PayRentModal property={payRentModal} onClose={() => setPayRentModal(null)} />}
    </div>
  );
}
