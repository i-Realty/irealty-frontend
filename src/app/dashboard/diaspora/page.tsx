'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDiasporaDashboardStore, DiasporaInvoice } from '@/lib/store/useDiasporaDashboardStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Search, SlidersHorizontal, FileText, Phone, X, CheckCircle2, ExternalLink } from 'lucide-react';

// ── Invoice Status Badge ──────────────────────────────────────────────

function InvoiceStatusBadge({ status }: { status: DiasporaInvoice['status'] }) {
  const styles: Record<string, string> = {
    Pending: 'text-amber-600',
    Paid: 'text-green-600',
    Overdue: 'text-red-500',
    Failed: 'text-red-500',
  };
  return <span className={`text-sm font-medium ${styles[status] ?? 'text-gray-600'}`}>{status}</span>;
}

// ── Invoice Detail Modal ──────────────────────────────────────────────

function InvoiceDetailModal() {
  const { selectedInvoice: inv, isInvoiceModalOpen, setInvoiceModalOpen, setSelectedInvoice } = useDiasporaDashboardStore();

  if (!isInvoiceModalOpen || !inv) return null;

  const close = () => {
    setSelectedInvoice(null);
    setInvoiceModalOpen(false);
  };

  const isPending = inv.status === 'Pending';

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
            { label: 'Service Plan', value: inv.serviceType },
            { label: 'Scope of Service', value: inv.scopeOfService },
            { label: 'Amount Due', value: `$${inv.amountDue.toLocaleString()} (10% of construction cost)` },
            { label: 'Invoice ID', value: inv.id },
            { label: 'Issue Date', value: inv.dateIssued },
            { label: 'Due Date', value: inv.dueDate },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-400 font-medium shrink-0">{label}</span>
              <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-medium">Escrow Status</span>
            <InvoiceStatusBadge status={inv.status} />
          </div>
        </div>
        <div className="p-6 pt-2 border-t border-gray-100">
          {isPending ? (
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
              Proceed To Payment
            </button>
          ) : (
            <button className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors">
              View Escrow Timeline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function DiasporaDashboardPage() {
  const {
    activePlan,
    invoices,
    isLoading,
    fetchDashboardDataMock,
    setSelectedInvoice,
  } = useDiasporaDashboardStore();

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchDashboardDataMock();
  }, [fetchDashboardDataMock]);

  if (isLoading && !activePlan && invoices.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.displayName ?? 'Waden'}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">What service(s) do you need?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Card (2/3) */}
        <div className="lg:col-span-2">
          {activePlan ? (
            /* Active Plan Overview */
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Plan Overview</h3>
              {[
                { label: 'Service Plan', value: `${activePlan.tier} Plan` },
                { label: 'Scope of Service', value: activePlan.scopeOfService },
                { label: 'Amount', value: activePlan.amount },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-sm text-gray-400 font-medium shrink-0">{label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 font-medium">Status</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                  {activePlan.status}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center gap-1">
                  View Escrow Timeline <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* No Active Plan */
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[250px]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Plan!</h3>
              <p className="text-gray-500 text-sm text-center mb-5 max-w-sm">
                Choose your service level and book a consultation with our team.
              </p>
              <Link
                href="/dashboard/diaspora/service-catalog"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Explore Plans
              </Link>
            </div>
          )}
        </div>

        {/* Contact Care Manager (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col items-center text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-4">Contact Care Manager</p>
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
              alt="Care Manager"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 mb-2"
            />
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm font-bold text-gray-900">i-Realty Team</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <Link
              href="/dashboard/diaspora/service-catalog"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm mb-3"
            >
              <Phone className="w-4 h-4" /> Book A Free Consultation
            </Link>
            <div className="flex gap-2 w-full">
              <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Chat Client
              </button>
              <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      {invoices.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center min-h-[250px] shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Invoices Yet</h3>
          <p className="text-gray-500 text-sm text-center mb-5 max-w-sm">
            Once you&apos;ve booked a consultation and selected a plan, your invoice will appear here for payment.
          </p>
          <Link
            href="/dashboard/diaspora/service-catalog"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" /> Book A Free Consultation
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Invoice</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500 font-medium">
                  <th className="py-3.5 px-6 font-medium">Invoice ID</th>
                  <th className="py-3.5 px-6 font-medium">Date Issued</th>
                  <th className="py-3.5 px-6 font-medium">Service Type</th>
                  <th className="py-3.5 px-6 font-medium">Amount Due</th>
                  <th className="py-3.5 px-6 font-medium">Status</th>
                  <th className="py-3.5 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-gray-900 font-medium">{inv.id}</td>
                    <td className="py-4 px-6 text-gray-500">{inv.dateIssued}</td>
                    <td className="py-4 px-6 text-gray-900">{inv.serviceType}</td>
                    <td className="py-4 px-6 text-gray-900 font-medium">₦{inv.amountDue.toLocaleString()}</td>
                    <td className="py-4 px-6"><InvoiceStatusBadge status={inv.status} /></td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        See Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {invoices.slice(0, 5).map((inv) => (
              <div key={inv.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                {[
                  { label: 'Invoice ID', value: inv.id },
                  { label: 'Date Issued', value: inv.dateIssued },
                  { label: 'Service Type', value: inv.serviceType },
                  { label: 'Amount', value: `₦${inv.amountDue.toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-400 font-medium">{label}</span>
                    <span className="text-sm text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm text-gray-400 font-medium">Status</span>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
                <button
                  onClick={() => setSelectedInvoice(inv)}
                  className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  See Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
            <span>Page 1 of 30</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    page === 1 ? 'border border-blue-500 text-gray-900 bg-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <InvoiceDetailModal />
    </div>
  );
}
