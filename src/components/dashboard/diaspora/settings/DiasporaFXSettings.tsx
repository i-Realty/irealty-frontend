'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const CURRENCIES = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'NGN'];
const FX_PROVIDERS = ['i-Realty Rate', 'CBN Official Rate', 'Black Market Rate'];

export default function DiasporaFXSettings() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [displayCurrency, setDisplayCurrency] = useState('NGN');
  const [fxProvider, setFxProvider] = useState('i-Realty Rate');
  const [autoConvert, setAutoConvert] = useState(true);
  const [rateAlerts, setRateAlerts] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('5');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex flex-col">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">FX & Currency Preferences</h2>
        <p className="text-[13px] font-medium text-gray-400">
          Configure how property prices and payments are displayed and converted for diaspora investors.
        </p>
      </div>

      {/* Currency Settings */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-5">
        <h3 className="text-[15px] font-bold text-gray-900">Currency Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-gray-900 ml-1">Your Home Currency</label>
            <select
              value={baseCurrency}
              onChange={(e) => { setBaseCurrency(e.target.value); setSaved(false); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors bg-white"
            >
              {CURRENCIES.filter((c) => c !== 'NGN').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 ml-1">The currency you use for sending funds from abroad.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-gray-900 ml-1">Display Currency</label>
            <select
              value={displayCurrency}
              onChange={(e) => { setDisplayCurrency(e.target.value); setSaved(false); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors bg-white"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 ml-1">How prices are shown in the dashboard.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-gray-900 ml-1">FX Rate Provider</label>
          <div className="space-y-2">
            {FX_PROVIDERS.map((p) => (
              <label key={p} className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
                <input
                  type="radio"
                  name="fxProvider"
                  checked={fxProvider === p}
                  onChange={() => { setFxProvider(p); setSaved(false); }}
                  className="accent-blue-600 w-4 h-4"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{p}</span>
                  {p === 'i-Realty Rate' && <p className="text-xs text-gray-400">Competitive rate negotiated for our users</p>}
                  {p === 'CBN Official Rate' && <p className="text-xs text-gray-400">Central Bank of Nigeria official exchange rate</p>}
                  {p === 'Black Market Rate' && <p className="text-xs text-gray-400">Parallel market rate (for reference only)</p>}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion & Alerts */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-4">
        <h3 className="text-[15px] font-bold text-gray-900">Auto-Conversion & Alerts</h3>

        <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100">
          <div>
            <p className="text-[14px] font-semibold text-gray-900">Auto-convert prices to home currency</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Automatically show property prices in {baseCurrency}.</p>
          </div>
          <button
            type="button"
            onClick={() => { setAutoConvert((v) => !v); setSaved(false); }}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${autoConvert ? 'bg-blue-600' : 'bg-gray-200'}`}
            role="switch" aria-checked={autoConvert}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${autoConvert ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 py-2">
          <div>
            <p className="text-[14px] font-semibold text-gray-900">Rate change alerts</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Notify me when the exchange rate changes significantly.</p>
          </div>
          <button
            type="button"
            onClick={() => { setRateAlerts((v) => !v); setSaved(false); }}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${rateAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}
            role="switch" aria-checked={rateAlerts}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${rateAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {rateAlerts && (
          <div className="flex flex-col gap-2 pt-1">
            <label className="text-[12px] font-bold text-gray-900 ml-1">Alert threshold (%)</label>
            <input
              type="number"
              min="1" max="50"
              value={alertThreshold}
              onChange={(e) => { setAlertThreshold(e.target.value); setSaved(false); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
            />
            <p className="text-xs text-gray-400 ml-1">
              Alert me when the rate moves more than {alertThreshold}% in either direction.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {saved && <p className="text-sm text-green-600 font-medium">Preferences saved.</p>}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
