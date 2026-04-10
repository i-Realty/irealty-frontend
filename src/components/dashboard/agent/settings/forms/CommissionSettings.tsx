import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { commissionSchema, extractErrors } from '@/lib/validations/settings';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function CommissionSettings() {
  const { commission, updateCommission, submitCommissionMock, isSaving } = useSettingsStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = commissionSchema.safeParse({ feeType: commission.feeType, value: Number(commission.value) || 0 });
    if (!result.success) {
      setErrors(extractErrors(result.error));
      return;
    }
    setErrors({});
    await submitCommissionMock();
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in slide-in-from-right-4 fade-in duration-300">
       
       <div className="flex flex-col">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Commissions</h2>
          <p className="text-[13px] font-medium text-gray-400">Set Up Inspection Fee</p>
       </div>

       <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 lg:max-w-xl shadow-sm">
           
           <div className="mb-6">
              <label className="text-[13px] font-bold text-gray-900 mb-3 block">Fee Type</label>
              
              <div className="flex items-center gap-6 mb-4">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                       type="radio"
                       name="feeType"
                       value="Percentage"
                       checked={commission.feeType === 'Percentage'}
                       onChange={() => updateCommission({ feeType: 'Percentage', value: '' })}
                       className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                       commission.feeType === 'Percentage' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-300'
                    }`}>
                       {commission.feeType === 'Percentage' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[14px] font-bold text-gray-900 leading-none">Percentage</span>
                 </label>

                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                       type="radio"
                       name="feeType"
                       value="Amount"
                       checked={commission.feeType === 'Amount'}
                       onChange={() => updateCommission({ feeType: 'Amount', value: '' })}
                       className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                       commission.feeType === 'Amount' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-300'
                    }`}>
                       {commission.feeType === 'Amount' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[14px] font-bold text-gray-900 leading-none">Amount</span>
                 </label>
              </div>

              <p className="text-[12px] font-medium text-gray-400 transition-opacity">
                 {commission.feeType === 'Percentage' 
                    ? "Percentage: A fraction of the property's total price (e.g., 5% of ₦20M = ₦1M)."
                    : "Amount: A flat specific fee regardless of property price (e.g., ₦5,000)."
                 }
              </p>
           </div>

           <div className="flex flex-col gap-2 mb-8">
              <label className="text-[13px] font-bold text-gray-900 ml-1">
                 {commission.feeType === 'Percentage' ? 'Percentage' : 'Amount'}
              </label>
              <div className="relative flex items-center">
                 {commission.feeType === 'Amount' && (
                    <span className="absolute left-4 text-gray-400 font-medium">₦</span>
                 )}
                 <input 
                    type="number"
                    min="0"
                    placeholder={`Enter ${commission.feeType}`}
                    value={commission.value}
                    onChange={(e) => updateCommission({ value: e.target.value ? Number(e.target.value) : '' })}
                    className={`w-full border border-gray-200 rounded-xl py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300 ${
                       commission.feeType === 'Amount' ? 'pl-9 pr-4' : 'px-4'
                    }`}
                 />
                 {commission.feeType === 'Percentage' && (
                    <span className="absolute right-4 text-gray-400 font-medium">%</span>
                 )}
              </div>
              {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
           </div>

           <div className="w-full flex justify-end">
              <button 
                type="submit"
                disabled={isSaving || commission.value === ''}
                className="w-full lg:w-auto min-w-[200px] bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 disabled:opacity-50 text-white font-bold text-[14px] py-4 md:py-3.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set Up Commission Fee'}
              </button>
           </div>
       </form>

    </div>
  );
}
