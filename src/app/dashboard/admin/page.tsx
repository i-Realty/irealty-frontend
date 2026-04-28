'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';
import {
  Users, Home, ShieldCheck, Coins, Wallet, CreditCard,
  ChevronDown, ArrowUpRight,
} from 'lucide-react';

type ChartPeriod = 'This week' | 'This month' | 'This year' | 'All time';
const CHART_PERIODS: ChartPeriod[] = ['This week', 'This month', 'This year', 'All time'];
const PERIOD_MAP: Record<ChartPeriod, string> = { 'This week': 'week', 'This month': 'month', 'This year': 'year', 'All time': 'all' };
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const DONUT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function AdminDashboardPage() {
  const {
    stats, revenueData, transactionVolumeData,
    recentTransactions, pendingKycUsers,
    isLoading, fetchDashboardDataMock, setPeriod,
  } = useAdminDashboardStore();

  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('This week');
  const [showChartDropdown, setShowChartDropdown] = useState(false);
  const chartDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (chartDropdownRef.current && !chartDropdownRef.current.contains(e.target as Node)) setShowChartDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDashboardDataMock();
  }, [fetchDashboardDataMock]);

  if (isLoading && stats.totalUsers === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, bg: 'bg-blue-50', color: 'text-blue-600', href: '/dashboard/admin/users' },
    { label: 'Active Listings', value: stats.activeListings.toLocaleString(), icon: Home, bg: 'bg-green-50', color: 'text-green-600', href: '/dashboard/admin/properties' },
    { label: 'Pending KYC', value: stats.pendingKyc.toString(), icon: ShieldCheck, bg: 'bg-amber-50', color: 'text-amber-600', href: '/dashboard/admin/users' },
    { label: 'Total Revenue', value: `₦${(stats.totalRevenue / 1000000).toFixed(0)}M`, icon: Coins, bg: 'bg-purple-50', color: 'text-purple-600', href: '/dashboard/admin/finance' },
    { label: 'Escrow Balance', value: `₦${(stats.escrowBalance / 1000000).toFixed(0)}M`, icon: Wallet, bg: 'bg-indigo-50', color: 'text-indigo-600', href: '/dashboard/admin/finance' },
    { label: 'Pending Payouts', value: stats.pendingPayouts.toString(), icon: CreditCard, bg: 'bg-red-50', color: 'text-red-500', href: '/dashboard/admin/finance' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':     return 'text-amber-600';
      case 'Completed':   return 'text-green-600';
      case 'Declined':    return 'text-red-500';
      case 'In-progress': return 'text-blue-600';
      default:            return 'text-gray-600';
    }
  };

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'verified':    return 'bg-green-50 text-green-600 border-green-100';
      default:            return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className={`w-9 h-9 ${card.bg} rounded-full flex items-center justify-center mb-2`}>
                <Icon className={`w-4.5 h-4.5 ${card.color}`} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (2/3) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">₦{(stats.totalRevenue / 1000000).toFixed(0)}M</p>
            </div>
            <div className="relative" ref={chartDropdownRef}>
              <button onClick={() => setShowChartDropdown((v) => !v)}
                className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                {chartPeriod} <ChevronDown className={`w-4 h-4 transition-transform ${showChartDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showChartDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 shadow-lg rounded-xl py-1.5 w-36 z-20 animate-in fade-in slide-in-from-top-2">
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
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Volume Donut (1/3) */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction Volume</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={transactionVolumeData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="count" stroke="none">
                  {transactionVolumeData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} transactions`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-lg font-bold text-gray-900">{transactionVolumeData.reduce((a, b) => a + b.count, 0)}</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {transactionVolumeData.map((item, i) => (
              <div key={item.category} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i] }} />
                  <span className="text-xs text-gray-600">{item.category}</span>
                </div>
                <span className="text-xs font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
            <Link href="/dashboard/admin/transactions" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="py-3 px-5 font-medium">ID</th>
                  <th className="py-3 px-5 font-medium">Type</th>
                  <th className="py-3 px-5 font-medium">Amount</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-5 text-gray-900 font-medium">{tx.id}</td>
                    <td className="py-3 px-5 text-gray-500">{tx.type}</td>
                    <td className="py-3 px-5 text-gray-900 font-medium">₦{tx.amount.toLocaleString()}</td>
                    <td className="py-3 px-5"><span className={`font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending KYC */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-900">Pending KYC Verification</h3>
            <Link href="/dashboard/admin/users" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="py-3 px-5 font-medium">Name</th>
                  <th className="py-3 px-5 font-medium">Role</th>
                  <th className="py-3 px-5 font-medium">KYC Status</th>
                  <th className="py-3 px-5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingKycUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-5 text-gray-900 font-medium">{user.name}</td>
                    <td className="py-3 px-5 text-gray-500">{user.role}</td>
                    <td className="py-3 px-5">
                      <span className={`text-xs py-1 px-2.5 rounded-full font-medium border ${getKycBadge(user.kycStatus)}`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <Link href={`/dashboard/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
