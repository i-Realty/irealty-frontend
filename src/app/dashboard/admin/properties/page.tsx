'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminDashboardStore, ModerationStatus } from '@/lib/store/useAdminDashboardStore';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'Pending Review', label: 'Pending Review' },
  { key: 'Verified', label: 'Verified' },
  { key: 'Flagged', label: 'Flagged' },
  { key: 'Rejected', label: 'Rejected' },
];

const PAGE_SIZE = 10;

export default function AdminPropertiesPage() {
  const { properties, isLoading, isActionLoading, fetchPropertiesMock, approvePropertyMock, rejectPropertyMock, flagPropertyMock, propertyFilters, setPropertyFilters } = useAdminDashboardStore();

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
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
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
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
                          <button onClick={() => rejectPropertyMock(p.id)} disabled={isActionLoading} className="text-red-500 hover:text-red-700 font-medium text-xs disabled:opacity-50">Reject</button>
                        </>
                      )}
                      {p.moderationStatus === 'Verified' && (
                        <button onClick={() => flagPropertyMock(p.id)} disabled={isActionLoading} className="text-orange-600 hover:text-orange-800 font-medium text-xs disabled:opacity-50">Flag</button>
                      )}
                      {p.moderationStatus === 'Flagged' && (
                        <>
                          <button onClick={() => approvePropertyMock(p.id)} disabled={isActionLoading} className="text-green-600 hover:text-green-800 font-medium text-xs disabled:opacity-50">Approve</button>
                          <button onClick={() => rejectPropertyMock(p.id)} disabled={isActionLoading} className="text-red-500 hover:text-red-700 font-medium text-xs disabled:opacity-50">Reject</button>
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
                  <button onClick={() => rejectPropertyMock(p.id)} disabled={isActionLoading} className="flex-1 border border-red-200 text-red-600 text-sm font-medium py-2 rounded-lg hover:bg-red-50 disabled:opacity-50">Reject</button>
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
    </div>
  );
}
