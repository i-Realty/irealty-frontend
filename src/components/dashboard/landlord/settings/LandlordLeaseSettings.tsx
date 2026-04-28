'use client';

import { Loader2 } from 'lucide-react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

type RenewalOption = 'Automatic' | 'Manual' | 'Notify Only';
type NoticePeriod = '30 days' | '60 days' | '90 days';

export default function LandlordLeaseSettings() {
  const { landlordLease, updateLandlordLease, submitLandlordLease, isSaving } = useSettingsStore();

  const {
    renewalPolicy, noticePeriod, rentIncreaseEnabled, rentIncreasePercent,
    latePaymentFee, gracePeriodDays, tenantAlerts, expiryAlerts,
  } = landlordLease;

  return (
    <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex flex-col">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Lease Management</h2>
        <p className="text-[13px] font-medium text-gray-400">
          Configure how leases renew, rent increases, and late payment policies.
        </p>
      </div>

      {/* Renewal Policy */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-5">
        <h3 className="text-[15px] font-bold text-gray-900">Renewal Policy</h3>
        <div className="space-y-2">
          {(['Automatic', 'Manual', 'Notify Only'] as RenewalOption[]).map((opt) => (
            <label key={opt} className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${renewalPolicy === opt ? 'border-blue-200 bg-blue-50/40' : 'border-gray-100 hover:border-gray-200'}`}>
              <input type="radio" name="renewal" checked={renewalPolicy === opt} onChange={() => updateLandlordLease({ renewalPolicy: opt })} className="accent-blue-600 w-4 h-4 mt-0.5" />
              <div>
                <p className="text-[14px] font-semibold text-gray-900">{opt}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {opt === 'Automatic' && 'Leases auto-renew on expiry under the same terms.'}
                  {opt === 'Manual' && 'You must manually renew each lease before it expires.'}
                  {opt === 'Notify Only' && 'You receive an alert before expiry; no automatic action taken.'}
                </p>
              </div>
            </label>
          ))}
        </div>
        <div>
          <label className="text-[12px] font-bold text-gray-900 ml-1 block mb-2">Notice Period Before Expiry</label>
          <div className="flex gap-2 flex-wrap">
            {(['30 days', '60 days', '90 days'] as NoticePeriod[]).map((n) => (
              <button key={n} type="button" onClick={() => updateLandlordLease({ noticePeriod: n })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${noticePeriod === n ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rent Increase */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-bold text-gray-900">Annual Rent Increase</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Automatically apply a rent increase on renewal.</p>
          </div>
          <button type="button" onClick={() => updateLandlordLease({ rentIncreaseEnabled: !rentIncreaseEnabled })}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${rentIncreaseEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${rentIncreaseEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        {rentIncreaseEnabled && (
          <div>
            <label className="text-[12px] font-bold text-gray-900 ml-1 block mb-2">Increase Percentage (%)</label>
            <input type="number" min="1" max="50" value={rentIncreasePercent}
              onChange={(e) => updateLandlordLease({ rentIncreasePercent: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium focus:outline-none focus:border-blue-500 shadow-sm transition-colors" />
          </div>
        )}
      </div>

      {/* Late Payment */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-4">
        <h3 className="text-[15px] font-bold text-gray-900">Late Payment Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[12px] font-bold text-gray-900 ml-1 block mb-2">Late Fee (₦)</label>
            <input type="number" value={latePaymentFee} onChange={(e) => updateLandlordLease({ latePaymentFee: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium focus:outline-none focus:border-blue-500 shadow-sm transition-colors" />
          </div>
          <div>
            <label className="text-[12px] font-bold text-gray-900 ml-1 block mb-2">Grace Period (days)</label>
            <input type="number" min="0" max="30" value={gracePeriodDays} onChange={(e) => updateLandlordLease({ gracePeriodDays: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium focus:outline-none focus:border-blue-500 shadow-sm transition-colors" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-3">
        <h3 className="text-[15px] font-bold text-gray-900">Lease Alerts</h3>
        <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100">
          <div>
            <p className="text-[14px] font-semibold text-gray-900">Tenant payment reminders</p>
            <p className="text-xs text-gray-400 mt-0.5">Notify tenants before rent is due.</p>
          </div>
          <button type="button" onClick={() => updateLandlordLease({ tenantAlerts: !tenantAlerts })}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${tenantAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${tenantAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="flex items-start justify-between gap-4 py-2">
          <div>
            <p className="text-[14px] font-semibold text-gray-900">Lease expiry alerts</p>
            <p className="text-xs text-gray-400 mt-0.5">Alert me {noticePeriod} before a lease expires.</p>
          </div>
          <button type="button" onClick={() => updateLandlordLease({ expiryAlerts: !expiryAlerts })}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${expiryAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${expiryAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button onClick={submitLandlordLease} disabled={isSaving}
          className="min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
