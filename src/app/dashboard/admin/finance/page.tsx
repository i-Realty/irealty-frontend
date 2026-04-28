'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';
import { Coins, Wallet, CreditCard, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ChartPeriod = 'This week' | 'This month' | 'This year' | 'All time';
const CHART_PERIODS: ChartPeriod[] = ['This week', 'This month', 'This year', 'All time'];

const PERIOD_MAP: Record<ChartPeriod, string> = {
  'This week': 'week',
  'This month': 'month',
  'This year': 'year',
  'All time': 'all',
};

type FinanceTab = 'revenue' | 'escrow' | 'payouts';

export default function AdminFinancePage() {
  const {
    revenueBreakdown, revenueData, escrowItems, payouts,
    isLoading, isActionLoading, fetchFinanceMock, fetchDashboardDataMock,
    approvePayoutMock, rejectPayoutMock, payoutFilter, setPayoutFilter,
    setPeriod,
  } = useAdminDashboardStore();

  const [activeTab, setActiveTab] = useState<FinanceTab>('revenue');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('This week');
  const [showChartDropdown, setShowChartDropdown] = useState(false);
  const [payoutToast, setPayoutToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const chartDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (chartDropdownRef.current && !chartDropdownRef.current.contains(e.target as Node)) setShowChartDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setPayoutToast({ msg, type });
    setTimeout(() => setPayoutToast(null), 3000);
  };

  const handleApprovePayout = async (id: string) => {
    await approvePayoutMock(id);
    showToast('Payout approved successfully.');
  };

  const handleRejectPayout = async (id: string) => {
    await rejectPayoutMock(id);
    showToast('Payout rejected.', 'error');
  };

  useEffect(() => {
    fetchFinanceMock();
    fetchDashboardDataMock();
  }, [fetchFinanceMock, fetchDashboardDataMock]);

  const totalRevenue = revenueBreakdown.reduce((s, r) => s + r.amount, 0);
  const totalEscrow = escrowItems.filter((e) => e.status === 'Held').reduce((s, e) => s + e.amount, 0);
  const pendingPayoutTotal = payouts.filter((p) => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  const filteredPayouts = useMemo(() => {
    if (payoutFilter === 'all') return payouts;
    return payouts.filter((p) => p.status === payoutFilter);
  }, [payouts, payoutFilter]);

  const getEscrowStyle = (status: string) => {
    switch (status) { case 'Held': return 'text-amber-600'; case 'Releasing': return 'text-blue-600'; case 'Released': return 'text-green-600'; default: return 'text-gray-600'; }
  };

  const getPayoutStyle = (status: string) => {
    switch (status) { case 'Pending': return 'text-amber-600'; case 'Approved': return 'text-green-600'; case 'Processing': return 'text-blue-600'; case 'Rejected': return 'text-red-500'; default: return 'text-gray-600'; }
  };

  if (isLoading && revenueBreakdown.length === 0) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <>
    <div className="space-y-6 pb-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₦${(totalRevenue / 1000000).toFixed(0)}M`, icon: Coins, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Escrow Balance', value: `₦${(totalEscrow / 1000000).toFixed(0)}M`, icon: Wallet, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Pending Payouts', value: `₦${(pendingPayoutTotal / 1000000).toFixed(1)}M`, icon: CreditCard, bg: 'bg-amber-50', color: 'text-amber-600' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-none">
              <div className={`w-10 h-10 ${card.bg} rounded-full flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {([
          { key: 'revenue' as FinanceTab, label: 'Revenue' },
          { key: 'escrow' as FinanceTab, label: 'Escrow' },
          { key: 'payouts' as FinanceTab, label: 'Payouts' },
        ]).map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Revenue Tab ──────────────────────────────────── */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Revenue Trend</h3>
              <div className="relative" ref={chartDropdownRef}>
                <button onClick={() => setShowChartDropdown((v) => !v)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  {chartPeriod} <ChevronDown className={`w-4 h-4 transition-transform ${showChartDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showChartDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 shadow-lg rounded-xl py-1.5 w-40 z-20 animate-in fade-in slide-in-from-top-2">
                    {CHART_PERIODS.map((opt) => (
                      <button key={opt} onClick={() => { setChartPeriod(opt); setShowChartDropdown(false); setPeriod(PERIOD_MAP[opt]); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${chartPeriod === opt ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-none overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Revenue by Category</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <th className="py-3 px-6 font-medium">Category</th>
                  <th className="py-3 px-6 font-medium">Transactions</th>
                  <th className="py-3 px-6 font-medium">Revenue</th>
                  <th className="py-3 px-6 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {revenueBreakdown.map((r) => (
                  <tr key={r.category} className="border-b border-gray-50 dark:border-gray-700">
                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">{r.category}</td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{r.count}</td>
                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">₦{r.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-blue-600 font-medium">{totalRevenue > 0 ? ((r.amount / totalRevenue) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Escrow Tab ───────────────────────────────────── */}
      {activeTab === 'escrow' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-none overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Active Escrow Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <th className="py-3 px-6 font-medium">Transaction</th>
                  <th className="py-3 px-6 font-medium">Parties</th>
                  <th className="py-3 px-6 font-medium">Amount</th>
                  <th className="py-3 px-6 font-medium">Deposited</th>
                  <th className="py-3 px-6 font-medium">Expected Release</th>
                  <th className="py-3 px-6 font-medium">Age</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {escrowItems.map((e) => (
                  <tr key={e.id} className={`border-b border-gray-50 ${e.ageDays > 90 ? 'bg-red-50/30' : ''}`}>
                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">{e.transactionId}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{e.parties}</td>
                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">₦{e.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{e.dateDeposited}</td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{e.expectedRelease}</td>
                    <td className="py-4 px-6"><span className={`font-medium ${e.ageDays > 60 ? 'text-red-500' : e.ageDays > 30 ? 'text-amber-600' : 'text-gray-600'}`}>{e.ageDays}d</span></td>
                    <td className="py-4 px-6"><span className={`text-sm font-medium ${getEscrowStyle(e.status)}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Payouts Tab ──────────────────────────────────── */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['all', 'Pending', 'Processing', 'Approved', 'Rejected'].map((f) => (
              <button key={f} onClick={() => setPayoutFilter(f)} className={`whitespace-nowrap px-4 py-2 text-sm rounded-full border font-medium transition-colors ${payoutFilter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                    <th className="py-3 px-6 font-medium">User</th>
                    <th className="py-3 px-6 font-medium">Role</th>
                    <th className="py-3 px-6 font-medium">Amount</th>
                    <th className="py-3 px-6 font-medium">Method</th>
                    <th className="py-3 px-6 font-medium">Requested</th>
                    <th className="py-3 px-6 font-medium">Status</th>
                    <th className="py-3 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayouts.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center text-gray-400">No payouts found</td></tr>
                  ) : filteredPayouts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">{p.userName}</td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{p.role}</td>
                      <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">₦{p.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                        {p.method === 'Bank' ? `${p.bankName} - ${p.accountNumber}` : `${p.cryptoCurrency} - ${p.cryptoAddress}`}
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{p.requestDate}</td>
                      <td className="py-4 px-6"><span className={`text-sm font-medium ${getPayoutStyle(p.status)}`}>{p.status}</span></td>
                      <td className="py-4 px-6">
                        {p.status === 'Pending' && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleApprovePayout(p.id)} disabled={isActionLoading} className="text-green-600 hover:text-green-800 disabled:opacity-50"><CheckCircle2 className="w-5 h-5" /></button>
                            <button onClick={() => handleRejectPayout(p.id)} disabled={isActionLoading} className="text-red-500 hover:text-red-700 disabled:opacity-50"><XCircle className="w-5 h-5" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Toast */}
    {payoutToast && (
      <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in fade-in slide-in-from-bottom-2 ${payoutToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
        {payoutToast.msg}
      </div>
    )}
    </>
  );
}
