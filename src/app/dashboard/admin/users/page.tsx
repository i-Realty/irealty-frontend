'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import BulkActionBar from '@/components/dashboard/admin/BulkActionBar';
import AuditTrailExport from '@/components/dashboard/admin/AuditTrailExport';

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { users, isLoading, isActionLoading, fetchUsersMock, userFilters, setUserFilters, suspendUserMock, reactivateUserMock, approveKycMock } = useAdminDashboardStore();
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

  const handleBulkAction = useCallback(async (action: 'suspend' | 'reactivate' | 'approve') => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      if (action === 'suspend') await suspendUserMock(id);
      else if (action === 'reactivate') await reactivateUserMock(id);
      else if (action === 'approve') await approveKycMock(id);
    }
    setSelectedIds(new Set());
  }, [selectedIds, suspendUserMock, reactivateUserMock, approveKycMock]);

  useEffect(() => {
    fetchUsersMock();
  }, [fetchUsersMock]);

  const filtered = useMemo(() => {
    let result = users;
    if (userFilters.role !== 'all') result = result.filter((u) => u.role === userFilters.role);
    if (userFilters.kycStatus !== 'all') result = result.filter((u) => u.kycStatus === userFilters.kycStatus);
    if (userFilters.accountStatus !== 'all') result = result.filter((u) => u.accountStatus === userFilters.accountStatus);
    if (userFilters.search.trim()) {
      const q = userFilters.search.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
    }
    return result;
  }, [users, userFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((userFilters.page - 1) * PAGE_SIZE, userFilters.page * PAGE_SIZE);

  const getKycStyle = (status: string) => {
    switch (status) {
      case 'verified':    return 'bg-green-50 text-green-600 border-green-100';
      case 'in-progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      default:            return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getAccountStyle = (status: string) =>
    status === 'active' ? 'text-green-600' : 'text-red-500';

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-5 pb-12">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="animate-pulse bg-gray-200 rounded h-6 w-32 mb-4" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-full" />
          </div>
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 py-4 px-6">
                <div className="bg-gray-200 rounded-md h-4 w-28" />
                <div className="bg-gray-200 rounded-md h-4 w-40" />
                <div className="bg-gray-200 rounded-md h-4 w-24" />
                <div className="bg-gray-200 rounded-full h-5 w-16" />
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 rounded-md h-4 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      <BulkActionBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        isLoading={isActionLoading}
        actions={[
          { type: 'approve', label: 'Approve KYC', onAction: () => handleBulkAction('approve') },
          { type: 'suspend', label: 'Suspend', onAction: () => handleBulkAction('suspend') },
          { type: 'reactivate', label: 'Reactivate', onAction: () => handleBulkAction('reactivate') },
        ]}
      />
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">All Users</h3>
            <AuditTrailExport
              type="users"
              data={filtered as unknown as Record<string, unknown>[]}
              columns={[
                { key: 'id', label: 'User ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role' },
                { key: 'kycStatus', label: 'KYC Status' },
                { key: 'joinDate', label: 'Join Date' },
                { key: 'accountStatus', label: 'Account Status' },
                { key: 'totalListings', label: 'Total Listings' },
                { key: 'totalTransactions', label: 'Total Transactions' },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by name, email, or ID" value={userFilters.search} onChange={(e) => setUserFilters({ search: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="relative">
              <select value={userFilters.role} onChange={(e) => setUserFilters({ role: e.target.value })} className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm bg-white cursor-pointer focus:outline-none">
                <option value="all">All Roles</option>
                <option value="Agent">Agent</option>
                <option value="Property Seeker">Property Seeker</option>
                <option value="Developer">Developer</option>
                <option value="Diaspora">Diaspora</option>
                <option value="Landlord">Landlord</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={userFilters.kycStatus} onChange={(e) => setUserFilters({ kycStatus: e.target.value })} className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm bg-white cursor-pointer focus:outline-none">
                <option value="all">KYC Status</option>
                <option value="verified">Verified</option>
                <option value="in-progress">In Progress</option>
                <option value="unverified">Unverified</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={userFilters.accountStatus} onChange={(e) => setUserFilters({ accountStatus: e.target.value })} className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm bg-white cursor-pointer focus:outline-none">
                <option value="all">Account Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
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
                    checked={paginated.length > 0 && paginated.every((u) => selectedIds.has(u.id))}
                    onChange={() => toggleSelectAll(paginated.map((u) => u.id))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-6 font-medium">Name</th>
                <th className="py-3.5 px-6 font-medium">Email</th>
                <th className="py-3.5 px-6 font-medium">Role</th>
                <th className="py-3.5 px-6 font-medium">KYC</th>
                <th className="py-3.5 px-6 font-medium">Joined</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-gray-400">No users found</td></tr>
              ) : paginated.map((u) => (
                <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selectedIds.has(u.id) ? 'bg-blue-50/50' : ''}`}>
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{u.name}</td>
                  <td className="py-4 px-6 text-gray-500">{u.email}</td>
                  <td className="py-4 px-6 text-gray-600">{u.role}</td>
                  <td className="py-4 px-6"><span className={`text-xs py-1 px-2.5 rounded-full font-medium border ${getKycStyle(u.kycStatus)}`}>{u.kycStatus}</span></td>
                  <td className="py-4 px-6 text-gray-500">{u.joinDate}</td>
                  <td className="py-4 px-6"><span className={`text-sm font-medium capitalize ${getAccountStyle(u.accountStatus)}`}>{u.accountStatus}</span></td>
                  <td className="py-4 px-6">
                    <Link href={`/dashboard/admin/users/${u.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No users found</div>
          ) : paginated.map((u) => (
            <div key={u.id} className="border border-gray-200 rounded-xl p-4 space-y-2">
              {[
                { label: 'Name', value: u.name },
                { label: 'Email', value: u.email },
                { label: 'Role', value: u.role },
                { label: 'Joined', value: u.joinDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">{label}</span>
                  <span className="text-sm text-gray-900 font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-gray-400 font-medium">KYC</span>
                <span className={`text-xs py-1 px-2.5 rounded-full font-medium border ${getKycStyle(u.kycStatus)}`}>{u.kycStatus}</span>
              </div>
              <Link href={`/dashboard/admin/users/${u.id}`} className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-2">
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
            <span>Page {userFilters.page} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setUserFilters({ page: p })} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${userFilters.page === p ? 'border border-blue-500 text-gray-900 bg-white' : 'text-gray-400 hover:text-gray-600'}`}>{p}</button>
              ))}
              <div className="flex items-center ml-3">
                <button onClick={() => setUserFilters({ page: Math.max(1, userFilters.page - 1) })} disabled={userFilters.page === 1} className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <div className="w-px h-8 bg-blue-700" />
                <button onClick={() => setUserFilters({ page: Math.min(totalPages, userFilters.page + 1) })} disabled={userFilters.page === totalPages} className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
