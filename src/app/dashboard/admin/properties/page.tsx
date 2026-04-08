'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminDashboardStore, ModerationStatus } from '@/lib/store/useAdminDashboardStore';
import { Search, ChevronDown, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';
import BulkActionBar from '@/components/dashboard/admin/BulkActionBar';

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'Pending Review', label: 'Pending Review' },
  { key: 'Verified', label: 'Verified' },
  { key: 'Flagged', label: 'Flagged' },
  { key: 'Rejected', label: 'Rejected' },
];

const PAGE_SIZE = 10;

function RejectReasonModal({ propertyId, propertyTitle, onClose }: { propertyId: string; propertyTitle: string; onClose: () => void }) {
  const { rejectPropertyMock, isActionLoading } = useAdminDashboardStore();
  const [reason, setReason] = useState('');

  const handleReject = async () => {
    await rejectPropertyMock(propertyId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-900">Reject Property</h3>
            <p className="text-[12px] text-gray-400 truncate max-w-[280px]">{propertyTitle}</p>
          </div>
        </div>
        <div className="mb-5">
          <label className="text-[12px] font-bold text-gray-900 block mb-2">Reason for rejection</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this listing is being rejected..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:border-red-400 min-h-[100px] resize-y placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleReject} disabled={isActionLoading || !reason.trim()} className="flex-1 bg-red-600 text-white font-medium text-sm py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">
            {isActionLoading ? 'Rejecting...' : 'Reject Property'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPropertiesPage() {
  const { properties, isLoading, isActionLoading, fetchPropertiesMock, approvePropertyMock, rejectPropertyMock, flagPropertyMock, propertyFilters, setPropertyFilters } = useAdminDashboardStore();
  const [rejectTarget, setRejectTarget] = useState<{ id: string; title: string } | null>(null);
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

  const handleBulkAction = useCallback(async (action: 'approve' | 'reject' | 'flag') => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      if (action === 'approve') await approvePropertyMock(id);
      else if (action === 'reject') await rejectPropertyMock(id);
      else if (action === 'flag') await flagPropertyMock(id);
    }
    setSelectedIds(new Set());
  }, [selectedIds, approvePropertyMock, rejectPropertyMock, flagPropertyMock]);

  useEffect(() => {
    fetchPropertiesMock();
  }, [fetchPropertiesMock]);

  const filtered = useMemo(() => {
    let result = properties;
    if (propertyFilters.tab !== 'all') result = result.filter((p) => p.moderationStatus === propertyFilters.tab);
    if (propertyFilters.category !== 'all') result = result.filter((p) => p.category === propertyFilters.category);
    if (propertyFilters.search.trim()) {
      const q = propertyFilters.search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.ownerName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return result;
  }, [properties, propertyFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((propertyFilters.page - 1) * PAGE_SIZE, propertyFilters.page * PAGE_SIZE);

  const getModStyle = (status: ModerationStatus) => {
    switch (status) {
      case 'Verified':       return 'bg-green-50 text-green-600 border-green-100';
      case 'Pending Review': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Flagged':        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Rejected':       return 'bg-red-50 text-red-500 border-red-100';
      default:               return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (isLoading && properties.length === 0) {
    return (
      <div className="space-y-5 pb-12">
        <div className="animate-pulse flex gap-4 border-b border-gray-200 pb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded h-4 w-20" />
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-full" />
          </div>
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 py-4 px-6">
                <div className="bg-gray-200 rounded-md h-9 w-12" />
                <div className="bg-gray-200 rounded-md h-4 w-32" />
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 rounded-md h-4 w-28" />
                <div className="bg-gray-200 rounded-md h-4 w-24" />
                <div className="bg-gray-200 rounded-full h-5 w-20" />
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
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setPropertyFilters({ tab: tab.key })} className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${propertyFilters.tab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        isLoading={isActionLoading}
        actions={[
          { type: 'approve', label: 'Approve', onAction: () => handleBulkAction('approve') },
          { type: 'reject', label: 'Reject', onAction: () => handleBulkAction('reject') },
          { type: 'flag', label: 'Flag', onAction: () => handleBulkAction('flag') },
        ]}
      />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Search + Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by title, owner, or ID" value={propertyFilters.search} onChange={(e) => setPropertyFilters({ search: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="relative">
              <select value={propertyFilters.category} onChange={(e) => setPropertyFilters({ category: e.target.value })} className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm bg-white cursor-pointer focus:outline-none">
                <option value="all">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Off-Plan">Off-Plan</option>
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
                    checked={paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id))}
                    onChange={() => toggleSelectAll(paginated.map((p) => p.id))}
                    className="w-[18px] h-[18px] rounded-md border-2 border-gray-300 dark:border-gray-500 text-blue-600 accent-blue-600 cursor-pointer transition-colors hover:border-blue-400"
                  />
                </th>
                <th className="py-3.5 px-6 font-medium">Property</th>
                <th className="py-3.5 px-6 font-medium">Type</th>
                <th className="py-3.5 px-6 font-medium">Owner</th>
                <th className="py-3.5 px-6 font-medium">Category</th>
                <th className="py-3.5 px-6 font-medium">Price</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-gray-400">No properties found</td></tr>
              ) : paginated.map((p) => (
                <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors ${selectedIds.has(p.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="w-[18px] h-[18px] rounded-md border-2 border-gray-300 dark:border-gray-500 text-blue-600 accent-blue-600 cursor-pointer transition-colors hover:border-blue-400"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Image src={p.image} alt={p.title} width={48} height={36} className="w-12 h-9 rounded-md object-cover" />
                      <div>
                        <p className="text-gray-900 font-medium">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{p.type}</td>
                  <td className="py-4 px-6 text-gray-900">{p.ownerName} <span className="text-xs text-gray-400">({p.ownerRole})</span></td>
                  <td className="py-4 px-6 text-gray-500">{p.category}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">₦{p.price.toLocaleString()}</td>
                  <td className="py-4 px-6"><span className={`text-xs py-1 px-2.5 rounded-full font-medium border ${getModStyle(p.moderationStatus)}`}>{p.moderationStatus}</span></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {p.moderationStatus === 'Pending Review' && (
                        <>
                          <button onClick={() => approvePropertyMock(p.id)} disabled={isActionLoading} className="text-green-600 hover:text-green-800 font-medium text-xs disabled:opacity-50">Approve</button>
                          <button onClick={() => setRejectTarget({ id: p.id, title: p.title })} disabled={isActionLoading} className="text-red-500 hover:text-red-700 font-medium text-xs disabled:opacity-50">Reject</button>
                        </>
                      )}
                      {p.moderationStatus === 'Verified' && (
                        <button onClick={() => flagPropertyMock(p.id)} disabled={isActionLoading} className="text-orange-600 hover:text-orange-800 font-medium text-xs disabled:opacity-50">Flag</button>
                      )}
                      {p.moderationStatus === 'Flagged' && (
                        <>
                          <button onClick={() => approvePropertyMock(p.id)} disabled={isActionLoading} className="text-green-600 hover:text-green-800 font-medium text-xs disabled:opacity-50">Approve</button>
                          <button onClick={() => setRejectTarget({ id: p.id, title: p.title })} disabled={isActionLoading} className="text-red-500 hover:text-red-700 font-medium text-xs disabled:opacity-50">Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No properties found</div>
          ) : paginated.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <Image src={p.image} alt={p.title} width={56} height={42} className="w-14 h-10 rounded-md object-cover" />
                <div>
                  <p className="text-sm text-gray-900 font-medium">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.location}</p>
                </div>
              </div>
              {[
                { label: 'Owner', value: `${p.ownerName} (${p.ownerRole})` },
                { label: 'Price', value: `₦${p.price.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">{label}</span>
                  <span className="text-sm text-gray-900 font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-gray-400 font-medium">Status</span>
                <span className={`text-xs py-1 px-2.5 rounded-full font-medium border ${getModStyle(p.moderationStatus)}`}>{p.moderationStatus}</span>
              </div>
              {(p.moderationStatus === 'Pending Review' || p.moderationStatus === 'Flagged') && (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => approvePropertyMock(p.id)} disabled={isActionLoading} className="flex-1 bg-green-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">Approve</button>
                  <button onClick={() => setRejectTarget({ id: p.id, title: p.title })} disabled={isActionLoading} className="flex-1 border border-red-200 text-red-600 text-sm font-medium py-2 rounded-lg hover:bg-red-50 disabled:opacity-50">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
            <span>Page {propertyFilters.page} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((pg) => (
                <button key={pg} onClick={() => setPropertyFilters({ page: pg })} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${propertyFilters.page === pg ? 'border border-blue-500 text-gray-900 bg-white' : 'text-gray-400 hover:text-gray-600'}`}>{pg}</button>
              ))}
              <div className="flex items-center ml-3">
                <button onClick={() => setPropertyFilters({ page: Math.max(1, propertyFilters.page - 1) })} disabled={propertyFilters.page === 1} className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <div className="w-px h-8 bg-blue-700" />
                <button onClick={() => setPropertyFilters({ page: Math.min(totalPages, propertyFilters.page + 1) })} disabled={propertyFilters.page === totalPages} className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject reason modal */}
      {rejectTarget && (
        <RejectReasonModal
          propertyId={rejectTarget.id}
          propertyTitle={rejectTarget.title}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}
