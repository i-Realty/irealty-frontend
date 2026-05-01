'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';
import { Search, RefreshCw, Loader2, ClipboardList } from 'lucide-react';

type AuditLog = { id: string; timestamp: string; action: string; actor: string; details?: string };

export default function AuditLogsPage() {
  const { auditLogs, isLoading, fetchAuditLogs } = useAdminDashboardStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filtered = useMemo(() => {
    if (!search.trim()) return auditLogs;
    const q = search.toLowerCase();
    return auditLogs.filter((l: AuditLog) =>
      l.action.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      (l.details ?? '').toLowerCase().includes(q)
    );
  }, [auditLogs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // action colour coding
  const getActionStyle = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('suspend') || a.includes('revoke') || a.includes('reject') || a.includes('flag'))
      return 'text-red-600 bg-red-50 border-red-100';
    if (a.includes('approve') || a.includes('verify') || a.includes('activate') || a.includes('reactivate'))
      return 'text-green-600 bg-green-50 border-green-100';
    if (a.includes('update') || a.includes('edit') || a.includes('change'))
      return 'text-blue-600 bg-blue-50 border-blue-100';
    if (a.includes('create') || a.includes('add') || a.includes('register'))
      return 'text-purple-600 bg-purple-50 border-purple-100';
    return 'text-gray-600 bg-gray-50 border-gray-100';
  };

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Audit Logs</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                {auditLogs.length > 0 ? `${auditLogs.length} entries` : 'System activity trail'}
              </p>
            </div>
            <button
              onClick={() => fetchAuditLogs()}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by action, actor, or details…"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {isLoading && auditLogs.length === 0 ? (
          <div className="py-20 text-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading audit logs…</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <ClipboardList className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{search ? 'No entries match your search' : 'No audit log entries yet'}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3.5 px-6 w-40">Timestamp</th>
                    <th className="py-3.5 px-6">Action</th>
                    <th className="py-3.5 px-6">Actor</th>
                    <th className="py-3.5 px-6">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log: AuditLog) => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                      <td className="py-3.5 px-6 text-gray-400 whitespace-nowrap font-mono text-[12px]">{log.timestamp}</td>
                      <td className="py-3.5 px-6">
                        <span className={`text-xs font-medium border px-2.5 py-1 rounded-full ${getActionStyle(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-gray-700">{log.actor}</td>
                      <td className="py-3.5 px-6 text-gray-500 max-w-xs truncate">{log.details ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden p-4 space-y-3">
              {paginated.map((log: AuditLog) => (
                <div key={log.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-medium border px-2.5 py-1 rounded-full ${getActionStyle(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono whitespace-nowrap">{log.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{log.actor}</p>
                  {log.details && <p className="text-xs text-gray-500">{log.details}</p>}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
                <span>Page {page} of {totalPages} ({filtered.length} entries)</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors text-gray-600">
                    Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${page === p ? 'border border-blue-500 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors text-gray-600">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
