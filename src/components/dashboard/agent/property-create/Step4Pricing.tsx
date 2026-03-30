'use client';

import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { ChevronDown } from 'lucide-react';

export default function Step4Pricing() {
  const { 
    listingType, 
    salePrice, rentPrice, rentPriceType,
    securityDeposit, agencyFee, legalFee, cautionFee,
    setField, prevStep, nextStep 
  } = useCreatePropertyStore();

  const isSale = listingType === 'For Sale';
  
  const isComplete = isSale ? !!salePrice : !!rentPrice;

  return (
    <div className="max-w-2xl mx-auto flex flex-col pt-6 pb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">
         Pricing Information
      </h3>
      <p className="text-sm text-gray-500 mb-8">
         {isSale ? 'Set the asking price for this property.' : 'Set up the rental structure and accompanying fees.'}
      </p>
      
      <div className="space-y-6">
        {isSale ? (
           // Sale Layout
           <div className="flex flex-col">
             <label className="text-sm font-semibold text-gray-800 mb-2">Asking Price (Sale)</label>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">₦</span>
                <input 
                  type="number" 
                  value={salePrice}
                  onChange={(e) => setField('salePrice', e.target.value)}
                  placeholder="e.g 20,000,000"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
                />
             </div>
           </div>
        ) : (
           // Rent Layout
           <>
             <div className="flex flex-col sm:flex-row gap-4">
               <div className="flex flex-col flex-1">
                 <label className="text-sm font-semibold text-gray-800 mb-2">Rent Price</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">₦</span>
                    <input 
                      type="number" 
                      value={rentPrice}
                      onChange={(e) => setField('rentPrice', e.target.value)}
                      placeholder="e.g 2,500,000"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
                    />
                 </div>
               </div>

               <div className="flex flex-col flex-1">
                  <label className="text-sm font-semibold text-gray-800 mb-2">Duration</label>
                  <div className="relative">
                    <select 
                      value={rentPriceType || ''}
                      onChange={(e) => setField('rentPriceType', e.target.value as any)}
                      className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="" disabled>Select Duration</option>
                      <option value="Per Month">Monthly</option>
                      <option value="Every 6 Months">Every 6 Months</option>
                      <option value="Per Year">Annually</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
               <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-800 mb-2">Security Deposit (Optional)</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">₦</span>
                    <input 
                      type="number" 
                      value={securityDeposit}
                      onChange={(e) => setField('securityDeposit', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
                    />
                 </div>
               </div>

               <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-800 mb-2">Agency Fee (Optional)</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">₦</span>
                    <input 
                      type="number" 
                      value={agencyFee}
                      onChange={(e) => setField('agencyFee', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
                    />
                 </div>
               </div>

               <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-800 mb-2">Legal Fee (Optional)</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">₦</span>
                    <input 
                      type="number" 
                      value={legalFee}
                      onChange={(e) => setField('legalFee', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
                    />
                 </div>
               </div>

               <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-800 mb-2">Caution Fee (Optional)</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">₦</span>
                    <input 
                      type="number" 
                      value={cautionFee}
                      onChange={(e) => setField('cautionFee', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
                    />
                 </div>
               </div>
             </div>
           </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-10 mt-auto border-t border-gray-100">
        <button 
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={!isComplete}
          className="px-8 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          Proceed to Review
        </button>
      </div>
    </div>
  );
}
