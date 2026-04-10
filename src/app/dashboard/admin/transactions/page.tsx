'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdminDashboardStore, TransactionStatus } from '@/lib/store/useAdminDashboardStore';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import BulkActionBar from '@/components/dashboard/admin/BulkActionBar';
import AuditTrailExport from '@/components/dashboard/admin/AuditTrailExport';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'Inspection', label: 'Inspections' },
  { key: 'Sale', label: 'Sales' },
  { key: 'Rental', label: 'Rentals' },
  { key: 'Developer Milestone', label: 'Developer' },
  { key: 'Diaspora Service', label: 'Diaspora' },
];

const STATUS_FILTERS: ('all' | TransactionStatus)[] = ['all', 'Pending', 'In-progress', 'Completed', 'Declined'];
const PAGE_SIZE = 10;

export default function AdminTransactionsPage() {
  const { transactions, isLoading, isActionLoading, fetchTransactionsMock, transactionFilters, setTransactionFilters, flagTransactionMock, refundTransactionMock } = useAdminDashboardStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) return new Set();
      return new Set(ids);
    });
  }, []);

  const handleBulkAction = useCallback(async (action: 'flag' | 'reject') => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      if (action === 'flag') await flagTransactionMock(id);
      else if (action === 'reject') await refundTransactionMock(id);
    }
    setSelectedIds(new Set());
  }, [selectedIds, flagTransactionMock, refundTransactionMock]);

  useEffect(() => {
    fetchTransactionsMock();
  }, [fetchTransactionsMock]);

  const filtered = useMemo(() => {
    let result = transactions;
    if (transactionFilters.tab !== 'all') result = result.filter((t) => t.type === transactionFilters.tab);
    if (transactionFilters.status !== 'all') result = result.filter((t) => t.status === transactionFilters.status);
    if (transactionFilters.search.trim()) {
      const q = transactionFilters.search.toLowerCase();
      result = result.filter((t) => t.id.toLowerCase().includes(q) || t.partyA.toLowerCase().includes(q) || t.partyB.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, transactionFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((transactionFilters.page - 1) * PAGE_SIZE, transactionFilters.page * PAGE_SIZE);

  const getStatusStyle = (status: TransactionStatus) => {
    switch (status) { case 'Pending': return 'text-amber-600'; case 'Completed': return 'text-green-600'; case 'Declined': return 'text-red-500'; case 'In-progress': return 'text-blue-600'; default: return 'text-gray-600'; }
  };

  if (isLoading && transactions.length === 0) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setTransactionFilters({ tab: tab.key })} className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${transactionFilters.tab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        isLoading={isActionLoading}
        actions={[
          { type: 'flag', label: 'Flag for Review', onAction: () => handleBulkAction('flag') },
          { type: 'reject', label: 'Initiate Refund', onAction: () => handleBulkAction('reject') },
        ]}
      />

      {/* Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {STATUS_FILTERS.map((sf) => (
          <button key={sf} onClick={() => setTransactionFilters({ status: sf })} className={`whitespace-nowrap px-4 py-2 text-sm rounded-full border font-medium transition-colors ${transactionFilters.status === sf ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {sf === 'all' ? 'All' : sf}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Search + Export */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by ID or party name" value={transactionFilters.search} onChange={(e) => setTransactionFilters({ search: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <AuditTrailExport
              type="transactions"
              data={filtered as unknown as Record<string, unknown>[]}
              columns={[
                { key: 'id', label: 'Transaction ID' },
                { key: 'date', label: 'Date' },
                { key: 'type', label: 'Type' },
                { key: 'partyA', label: 'Party A' },
                { key: 'partyB', label: 'Party B' },
                { key: 'amount', label: 'Amount (NGN)' },
                { key: 'irealtyFee', label: 'i-Realty Fee (NGN)' },
                { key: 'status', label: 'Status' },
              ]}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-3.5 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && paginated.every((tx) => selectedIds.has(tx.id))}
                    onChange={() => toggleSelectAll(paginated.map((tx) => tx.id))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-6 font-medium">Transaction ID</th>
                <th className="py-3.5 px-6 font-medium">Date</th>
                <th className="py-3.5 px-6 font-medium">Type</th>
                <th className="py-3.5 px-6 font-medium">Parties</th>
                <th className="py-3.5 px-6 font-medium">Amount</th>
                <th className="py-3.5 px-6 font-medium">i-Realty Fee</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="py-16 text-center text-gray-400">No transactions found</td></tr>
              ) : paginated.map((tx) => (
                <tr key={tx.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selectedIds.has(tx.id) ? 'bg-blue-50/50' : ''}`}>
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tx.id)}
                      onChange={() => toggleSelect(tx.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                  <td className="py-4 px-6 text-gray-500">{tx.date}</td>
                  <td className="py-4 px-6 text-gray-600">{tx.type}</td>
                  <td className="py-4 px-6 text-gray-900">{tx.partyA} <span className="text-gray-400">↔</span> {tx.partyB}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">₦{tx.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-green-600 font-medium">₦{tx.irealtyFee.toLocaleString()}</td>
                  <td className="py-4 px-6"><span className={`text-sm font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span></td>
                  <td className="py-4 px-6">
                    <Link href={`/dashboard/admin/transactions/${tx.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No transactions found</div>
          ) : paginated.map((tx) => (
            <div key={tx.id} className="border border-gray-200 rounded-xl p-4 space-y-2">
              {[
                { label: 'ID', value: tx.id },
                { label: 'Type', value: tx.type },
                { label: 'Parties', value: `${tx.partyA} ↔ ${tx.partyB}` },
                { label: 'Amount', value: `₦${tx.amount.toLocaleString()}` },
                { label: 'Fee', value: `₦${tx.irealtyFee.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">{label}</span>
                  <span className="text-sm text-gray-900 font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-gray-400 font-medium">Status</span>
                <span className={`text-sm font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
              </div>
              <Link href={`/dashboard/admin/transactions/${tx.id}`} className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-2">
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
            <span>Page {transactionFilters.page} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} onClick={() => setTransactionFilters({ page: pg })} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${transactionFilters.page === pg ? 'border border-blue-500 text-gray-900 bg-white' : 'text-gray-400 hover:text-gray-600'}`}>{pg}</button>
              ))}
              <div className="flex items-center ml-3">
                <button onClick={() => setTransactionFilters({ page: Math.max(1, transactionFilters.page - 1) })} disabled={transactionFilters.page === 1} className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <div className="w-px h-8 bg-blue-700" />
                <button onClick={() => setTransactionFilters({ page: Math.min(totalPages, transactionFilters.page + 1) })} disabled={transactionFilters.page === totalPages} className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
