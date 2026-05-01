'use client';

import { useEffect, useState } from 'react';
import { useDirectDebitStore, type DirectDebitMandate } from '@/lib/store/useDirectDebitStore';
import { usePaystackStore } from '@/lib/store/usePaystackStore';
import { RefreshCw, Plus, Loader2, CheckCircle2, AlertCircle, Clock, XCircle, RotateCcw, Trash2, X } from 'lucide-react';

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DirectDebitMandate['status'] }) {
  const config = {
    ACTIVE:      { label: 'Active',      cls: 'bg-green-50 text-green-600 border-green-100',  icon: CheckCircle2 },
    CREATED:     { label: 'Created',     cls: 'bg-blue-50 text-blue-600 border-blue-100',     icon: CheckCircle2 },
    PENDING:     { label: 'Pending',     cls: 'bg-amber-50 text-amber-600 border-amber-100',  icon: Clock },
    FAILED:      { label: 'Failed',      cls: 'bg-red-50 text-red-500 border-red-100',        icon: AlertCircle },
    DEACTIVATED: { label: 'Deactivated', cls: 'bg-gray-100 text-gray-500 border-gray-200',   icon: XCircle },
  }[status] ?? { label: status, cls: 'bg-gray-100 text-gray-500 border-gray-200', icon: Clock };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium border px-2.5 py-1 rounded-full ${config.cls}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// ── Initialize modal ──────────────────────────────────────────────────────────
function InitializeMandateModal({ onClose }: { onClose: () => void }) {
  const { initializeMandate, isActionLoading } = useDirectDebitStore();
  const { banks, isLoadingBanks, fetchBanks, resolveBankAccount } = usePaystackStore();
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [resolvedName, setResolvedName] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (banks.length === 0) fetchBanks(); }, [banks.length, fetchBanks]);

  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      setIsResolving(true);
      resolveBankAccount(accountNumber, bankCode).then(name => {
        setResolvedName(name ?? '');
        setIsResolving(false);
      });
    } else {
      setResolvedName('');
    }
  }, [accountNumber, bankCode, resolveBankAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !bankCode) { setError('Please fill in all fields.'); return; }
    setError('');
    const result = await initializeMandate({
      account: { number: accountNumber, bankCode },
      callbackUrl: typeof window !== 'undefined' ? `${window.location.origin}/dashboard/agent/wallet` : undefined,
    });
    if (result?.redirectUrl) {
      window.location.href = result.redirectUrl;
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[16px] mb-1">Set Up Direct Debit</h3>
        <p className="text-[12px] text-gray-400 mb-5">Authorize automatic debits from your bank account for payments on i-Realty.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Bank</label>
            <select value={bankCode} onChange={e => setBankCode(e.target.value)} disabled={isLoadingBanks}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400">
              <option value="">{isLoadingBanks ? 'Loading banks…' : 'Select bank'}</option>
              {banks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Account Number</label>
            <input type="text" maxLength={10} value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="0123456789"
              className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-blue-400" />
            {isResolving && <p className="text-[11px] text-blue-500 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Resolving…</p>}
            {resolvedName && <p className="text-[11px] text-green-600 mt-1 font-medium">{resolvedName}</p>}
          </div>

          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={isActionLoading || !accountNumber || !bankCode}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Authorize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DirectDebitMandates() {
  const { mandates, isLoading, isActionLoading, fetchMandates, retryActivation, deactivateMandate } = useDirectDebitStore();
  const [showInit, setShowInit] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState<string | null>(null);

  useEffect(() => { fetchMandates(); }, [fetchMandates]);

  const activeMandates = mandates.filter(m => m.status !== 'DEACTIVATED');

  return (
    <>
      {showInit && <InitializeMandateModal onClose={() => { setShowInit(false); fetchMandates(); }} />}

      {confirmDeactivate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDeactivate(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm mx-4 p-5 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Deactivate Mandate?</h3>
            <p className="text-sm text-gray-500 mb-4">This will revoke automatic debit authorization. You can set up a new mandate at any time.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeactivate(null)} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2.5 rounded-xl transition-colors hover:bg-gray-50">Cancel</button>
              <button onClick={async () => { await deactivateMandate(confirmDeactivate); setConfirmDeactivate(null); }}
                disabled={isActionLoading}
                className="flex-1 bg-red-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mt-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Direct Debit Mandates</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Authorized bank accounts for automatic payments</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchMandates()} disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowInit(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" />Add Mandate
            </button>
          </div>
        </div>

        {isLoading && mandates.length === 0 ? (
          <div className="py-10 text-center"><Loader2 className="w-5 h-5 text-blue-500 animate-spin mx-auto mb-2" /><p className="text-sm text-gray-400">Loading mandates…</p></div>
        ) : activeMandates.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3"><Plus className="w-5 h-5" /></div>
            <p className="text-sm font-medium">No active mandates</p>
            <p className="text-xs mt-1">Set up a direct debit mandate to enable automatic payments.</p>
            <button onClick={() => setShowInit(true)} className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium">Set up now →</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {activeMandates.map(m => (
              <div key={m.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{m.accountName || 'Bank Account'}</p>
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {m.bank}{m.last4 ? ` •••• ${m.last4}` : ''}{m.activatedAt ? ` · Activated ${new Date(m.activatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {m.status === 'FAILED' && (
                    <button onClick={() => retryActivation(m.id)} disabled={isActionLoading}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                      <RotateCcw className="w-3 h-3" />Retry
                    </button>
                  )}
                  <button onClick={() => setConfirmDeactivate(m.id)} disabled={isActionLoading}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
