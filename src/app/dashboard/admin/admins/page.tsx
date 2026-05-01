'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAdminDashboardStore, type AdminUser } from '@/lib/store/useAdminDashboardStore';
import { Search, Plus, CheckCircle2, Clock, ShieldOff, X, Loader2 } from 'lucide-react';

// ── Invite modal ──────────────────────────────────────────────────────────────
function InviteAdminModal({ onClose }: { onClose: () => void }) {
  const { createAdmin, isActionLoading } = useAdminDashboardStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    await createAdmin({ ...form, username: form.username || undefined });
    setDone(true);
    setTimeout(() => { setDone(false); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-1">Invite New Admin</h3>
        <p className="text-[12px] text-gray-400 mb-5">Create a new admin account. They&apos;ll need approval before access is granted.</p>

        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="font-bold text-gray-900 dark:text-gray-100">Admin created</p>
            <p className="text-sm text-gray-400 mt-1">Pending approval</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && <div className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">First Name *</label>
                <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">Last Name *</label>
                <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">Temporary Password *</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">Username (optional)</label>
              <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400" />
            </div>
            <div className="flex gap-3 mt-1">
              <button type="button" onClick={onClose}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isActionLoading}
                className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Admin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminsPage() {
  const {
    admins, pendingAdmins, isLoading, isActionLoading,
    fetchAdmins, fetchPendingAdmins, approveAdmin, suspendAdmin, revokeAdmin,
  } = useAdminDashboardStore();

  const [tab, setTab] = useState<'all' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; name: string; action: 'suspend' | 'revoke' } | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  useEffect(() => {
    fetchAdmins();
    fetchPendingAdmins();
  }, [fetchAdmins, fetchPendingAdmins]);

  const handleApprove = useCallback(async (id: string) => {
    await approveAdmin(id);
  }, [approveAdmin]);

  const handleConfirmAction = useCallback(async () => {
    if (!confirmAction) return;
    const reason = reasonInput.trim() || `${confirmAction.action === 'suspend' ? 'Suspended' : 'Revoked'} by admin`;
    if (confirmAction.action === 'suspend') await suspendAdmin(confirmAction.id, reason);
    else await revokeAdmin(confirmAction.id, reason);
    setConfirmAction(null);
    setReasonInput('');
    fetchAdmins();
  }, [confirmAction, reasonInput, suspendAdmin, revokeAdmin, fetchAdmins]);

  const filteredAll = admins.filter((a: AdminUser) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPending = pendingAdmins.filter((a: AdminUser) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">Active</span>;
    return <span className="text-xs font-medium text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full capitalize">{status}</span>;
  };

  return (
    <div className="space-y-5 pb-12">
      {showInvite && <InviteAdminModal onClose={() => { setShowInvite(false); fetchAdmins(); fetchPendingAdmins(); }} />}

      {/* Confirm action modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 capitalize">{confirmAction.action} Admin</h3>
            <p className="text-sm text-gray-500 mb-4">
              {confirmAction.action === 'suspend' ? 'Suspend' : 'Permanently revoke'} access for <strong>{confirmAction.name}</strong>?
            </p>
            <input
              value={reasonInput} onChange={e => setReasonInput(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm mb-4 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400"
            />
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={handleConfirmAction} disabled={isActionLoading}
                className={`flex-1 text-white text-sm font-medium py-2.5 rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2 ${confirmAction.action === 'revoke' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}`}>
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Admin Accounts</h3>
            <button onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Invite Admin
            </button>
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              {(['all', 'pending'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t === 'all' ? <><ShieldOff className="w-3.5 h-3.5" />All Admins</> : <><Clock className="w-3.5 h-3.5" />Pending {pendingAdmins.length > 0 && <span className="bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5 text-[10px] font-bold">{pendingAdmins.length}</span>}</>}
                </button>
              ))}
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>
        </div>

        {isLoading && admins.length === 0 && pendingAdmins.length === 0 ? (
          <div className="py-16 text-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading admins…</p>
          </div>
        ) : (
          <>
            {/* All Admins tab */}
            {tab === 'all' && (
              <>
                {filteredAll.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <ShieldOff className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{search ? 'No admins match your search' : 'No admin accounts yet'}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 font-medium">
                          <th className="py-3.5 px-6">Name</th>
                          <th className="py-3.5 px-6">Email</th>
                          <th className="py-3.5 px-6">Joined</th>
                          <th className="py-3.5 px-6">Status</th>
                          <th className="py-3.5 px-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAll.map(a => (
                          <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6 font-medium text-gray-900">{a.name}</td>
                            <td className="py-4 px-6 text-gray-500">{a.email}</td>
                            <td className="py-4 px-6 text-gray-500">{a.joinDate}</td>
                            <td className="py-4 px-6">{getStatusBadge(a.accountStatus)}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {a.accountStatus === 'active' ? (
                                  <button onClick={() => setConfirmAction({ id: a.id, name: a.name, action: 'suspend' })}
                                    className="text-xs text-amber-600 hover:text-amber-800 font-medium border border-amber-200 hover:border-amber-400 px-2.5 py-1 rounded-lg transition-colors">
                                    Suspend
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400">Suspended</span>
                                )}
                                <button onClick={() => setConfirmAction({ id: a.id, name: a.name, action: 'revoke' })}
                                  className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 px-2.5 py-1 rounded-lg transition-colors">
                                  Revoke
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Pending tab */}
            {tab === 'pending' && (
              <>
                {filteredPending.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No pending admin approvals</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 font-medium">
                          <th className="py-3.5 px-6">Name</th>
                          <th className="py-3.5 px-6">Email</th>
                          <th className="py-3.5 px-6">Requested</th>
                          <th className="py-3.5 px-6">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPending.map(a => (
                          <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6 font-medium text-gray-900">{a.name}</td>
                            <td className="py-4 px-6 text-gray-500">{a.email}</td>
                            <td className="py-4 px-6 text-gray-500">{a.joinDate}</td>
                            <td className="py-4 px-6">
                              <button onClick={() => handleApprove(a.id)} disabled={isActionLoading}
                                className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-800 font-medium border border-green-200 hover:border-green-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                                {isActionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Approve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
