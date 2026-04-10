'use client';

import { useState } from 'react';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';
import { platformFeeSchema, extractErrors } from '@/lib/validations/settings';
import { Loader2, Percent, Info } from 'lucide-react';

const FEE_DESCRIPTIONS: Record<string, { label: string; description: string; unit: string }> = {
  inspection: {
    label: 'Inspection Fee',
    description: 'Percentage charged per property inspection booking',
    unit: '%',
  },
  sale: {
    label: 'Sales Commission',
    description: 'Commission charged on completed property sales',
    unit: '%',
  },
  rental: {
    label: 'Rental Commission',
    description: 'Commission charged on rental agreements',
    unit: '%',
  },
  developer: {
    label: 'Developer Fee',
    description: 'Fee charged on developer milestone payments',
    unit: '%',
  },
  diaspora: {
    label: 'Diaspora Service Fee',
    description: 'Flat fee percentage for diaspora concierge services',
    unit: '%',
  },
};

export default function AdminPlatformFees() {
  const { platformFees, updatePlatformFees } = useAdminDashboardStore();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = platformFeeSchema.safeParse(platformFees);
    if (!result.success) {
      setErrors(extractErrors(result.error));
      return;
    }
    setErrors({});
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const feeKeys = Object.keys(FEE_DESCRIPTIONS) as (keyof typeof platformFees)[];

  return (
    <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
      
      <div className="flex flex-col">
        <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Platform Fees</h2>
        <p className="text-[13px] font-medium text-gray-400">
          Configure the fee percentages applied to transactions across the platform
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-blue-800">Fee changes take effect immediately</p>
          <p className="text-[12px] text-blue-600/80 mt-0.5">
            Updated fees will apply to all new transactions. Existing in-progress transactions retain their original fee rates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        
        {feeKeys.map((key) => {
          const meta = FEE_DESCRIPTIONS[key];
          const value = platformFees[key];

          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl md:rounded-[24px] p-5 md:p-6 shadow-sm dark:shadow-none flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all hover:shadow-md"
            >
              {/* Left: Label & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Percent className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{meta.label}</h3>
                </div>
                <p className="text-[12px] font-medium text-gray-400 ml-10">
                  {meta.description}
                </p>
              </div>

              {/* Right: Input */}
              <div className="flex flex-col gap-1 md:w-40 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={value}
                      onChange={(e) =>
                        updatePlatformFees({ [key]: e.target.value ? Number(e.target.value) : 0 })
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-[15px] font-bold text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:border-blue-500 shadow-sm dark:shadow-none transition-colors text-right"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[14px]">
                      {meta.unit}
                    </span>
                  </div>
                </div>
                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
              </div>
            </div>
          );
        })}

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-[24px] p-6 text-white shadow-lg mt-2">
          <h3 className="text-[14px] font-bold text-white/60 uppercase tracking-widest mb-4">Current Fee Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {feeKeys.map((key) => {
              const meta = FEE_DESCRIPTIONS[key];
              return (
                <div key={key} className="flex flex-col items-center text-center">
                  <span className="text-2xl font-bold text-white">
                    {platformFees[key]}{meta.unit}
                  </span>
                  <span className="text-[11px] font-medium text-white/50 mt-1 leading-tight">
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full flex items-center justify-between mt-2">
          {saved && (
            <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Fee configuration saved successfully.
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-4 md:py-3.5 px-8 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Fee Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
