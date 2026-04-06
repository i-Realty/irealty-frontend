'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useDiasporaDashboardStore,
  DiasporaInvoice,
  DiasporaPayment,
  InvoiceStatus,
  PaymentStatus,
} from '@/lib/store/useDiasporaDashboardStore';

type MainTab = 'invoices' | 'payments';
type InvoiceFilter = 'All' | InvoiceStatus;
type PaymentFilter = 'All' | PaymentStatus;

const INVOICE_FILTERS: InvoiceFilter[] = ['All', 'Pending', 'Paid', 'Overdue', 'Failed'];
const PAYMENT_FILTERS: PaymentFilter[] = ['All', 'Pending', 'In-progress', 'Completed', 'Declined'];

const ITEMS_PER_PAGE = 10;

function getInvoiceStatusStyle(status: InvoiceStatus) {
  switch (status) {
    case 'Pending':  return 'text-amber-600';
    case 'Paid':     return 'text-green-600';
    case 'Overdue':  return 'text-red-500';
    case 'Failed':   return 'text-red-500';
    default:         return 'text-gray-600';
  }
}

function getPaymentStatusStyle(status: PaymentStatus) {
  switch (status) {
    case 'Pending':      return 'text-amber-600';
    case 'In-progress':  return 'text-blue-600';
    case 'Completed':    return 'text-green-600';
    case 'Declined':     return 'text-red-500';
    default:             return 'text-gray-600';
  }
}

export default function DiasporaTransactionsPage() {
  const { invoices, payments, isLoading, fetchDashboardDataMock, setSelectedInvoice } = useDiasporaDashboardStore();

  const [mainTab, setMainTab] = useState<MainTab>('invoices');
  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>('All');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDashboardDataMock();
  }, [fetchDashboardDataMock]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    let result: DiasporaInvoice[] = invoices;
    if (invoiceFilter !== 'All') result = result.filter((i) => i.status === invoiceFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) => i.id.toLowerCase().includes(q) || i.serviceType.toLowerCase().includes(q));
    }
    return result;
  }, [invoices, invoiceFilter, searchQuery]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    let result: DiasporaPayment[] = payments;
    if (paymentFilter !== 'All') result = result.filter((p) => p.status === paymentFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.id.toLowerCase().includes(q) || p.serviceType.toLowerCase().includes(q));
    }
    return result;
  }, [payments, paymentFilter, searchQuery]);

  const activeList = mainTab === 'invoices' ? filteredInvoices : filteredPayments;
  const totalPages = Math.max(1, Math.ceil(activeList.length / ITEMS_PER_PAGE));
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab: MainTab) => {
    setMainTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const filters = mainTab === 'invoices' ? INVOICE_FILTERS : PAYMENT_FILTERS;
  const activeFilter = mainTab === 'invoices' ? invoiceFilter : paymentFilter;
  const setFilter = (f: string) => {
    if (mainTab === 'invoices') setInvoiceFilter(f as InvoiceFilter);
    else setPaymentFilter(f as PaymentFilter);
    setCurrentPage(1);
  };

  if (isLoading && invoices.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12 w-full">
      {/* Main Tabs */}
      <div className="flex border-b border-gray-200 w-full">
        {([
          { key: 'invoices' as MainTab, label: 'Invoices' },
          { key: 'payments' as MainTab, label: 'Payments' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              mainTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors border font-medium ${
              activeFilter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {mainTab === 'invoices' ? 'All Invoices' : 'All Transactions'}
          </h3>
        </div>

        {/* Search */}
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* ── Invoices Tab ─────────────────────────────────────── */}
        {mainTab === 'invoices' && (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 text-sm text-gray-500 font-medium">
                    <th className="py-3.5 px-6 font-medium">Invoice ID</th>
                    <th className="py-3.5 px-6 font-medium">Date Issued</th>
                    <th className="py-3.5 px-6 font-medium">Service Type</th>
                    <th className="py-3.5 px-6 font-medium">Amount Due</th>
                    <th className="py-3.5 px-6 font-medium">Status</th>
                    <th className="py-3.5 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {paginatedInvoices.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center text-gray-400">No invoices found</td></tr>
                  ) : paginatedInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-medium">{inv.id}</td>
                      <td className="py-4 px-6 text-gray-500">{inv.dateIssued}</td>
                      <td className="py-4 px-6 text-gray-900">{inv.serviceType}</td>
                      <td className="py-4 px-6 text-gray-900 font-medium">₦{inv.amountDue.toLocaleString()}</td>
                      <td className="py-4 px-6"><span className={`text-sm font-medium ${getInvoiceStatusStyle(inv.status)}`}>{inv.status}</span></td>
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
            <div className="lg:hidden p-4 space-y-4">
              {paginatedInvoices.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No invoices found</div>
              ) : paginatedInvoices.map((inv) => (
                <div key={inv.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  {[
                    { label: 'Invoice ID', value: inv.id },
                    { label: 'Date Issued', value: inv.dateIssued },
                    { label: 'Service Type', value: inv.serviceType },
                    { label: 'Amount Due', value: `₦${inv.amountDue.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-400 font-medium">{label}</span>
                      <span className="text-sm text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm text-gray-400 font-medium">Status</span>
                    <span className={`text-sm font-medium ${getInvoiceStatusStyle(inv.status)}`}>{inv.status}</span>
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
          </>
        )}

        {/* ── Payments Tab ─────────────────────────────────────── */}
        {mainTab === 'payments' && (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 text-sm text-gray-500 font-medium">
                    <th className="py-3.5 px-6 font-medium">Transaction ID</th>
                    <th className="py-3.5 px-6 font-medium">Date</th>
                    <th className="py-3.5 px-6 font-medium">Service Type</th>
                    <th className="py-3.5 px-6 font-medium">Amount</th>
                    <th className="py-3.5 px-6 font-medium">Status</th>
                    <th className="py-3.5 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {paginatedPayments.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center text-gray-400">No transactions found</td></tr>
                  ) : paginatedPayments.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                      <td className="py-4 px-6 text-gray-500">{tx.date}</td>
                      <td className="py-4 px-6 text-gray-900">{tx.serviceType}</td>
                      <td className="py-4 px-6 text-gray-900 font-medium">₦{tx.amount.toLocaleString()}</td>
                      <td className="py-4 px-6"><span className={`text-sm font-medium ${getPaymentStatusStyle(tx.status)}`}>{tx.status}</span></td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/dashboard/diaspora/transactions/${tx.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          See Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:hidden p-4 space-y-4">
              {paginatedPayments.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No transactions found</div>
              ) : paginatedPayments.map((tx) => (
                <div key={tx.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  {[
                    { label: 'Transaction ID', value: tx.id },
                    { label: 'Date', value: tx.date },
                    { label: 'Service Type', value: tx.serviceType },
                    { label: 'Amount', value: `₦${tx.amount.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-400 font-medium">{label}</span>
                      <span className="text-sm text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm text-gray-400 font-medium">Status</span>
                    <span className={`text-sm font-medium ${getPaymentStatusStyle(tx.status)}`}>{tx.status}</span>
                  </div>
                  <Link
                    href={`/dashboard/diaspora/transactions/${tx.id}`}
                    className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    See Details
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {activeList.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    currentPage === page ? 'border border-blue-500 text-gray-900 bg-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <div className="flex items-center ml-3">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-blue-700" />
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 disabled:opacity-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
