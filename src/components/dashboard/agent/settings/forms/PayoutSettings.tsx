import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { Loader2, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function PayoutSettings() {
  const { payout, updatePayoutMethod, updateBankPayout, updateCryptoPayout, submitPayoutMock, isSaving } = useSettingsStore();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPayoutMock();
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in slide-in-from-right-4 fade-in duration-300">
       
       <div className="flex flex-col">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Payout method</h2>
          <p className="text-[13px] font-medium text-gray-400">Choose your preferred payout method</p>
       </div>

       {/* Method Selector */}
       <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <button 
                 type="button"
                 onClick={() => updatePayoutMethod('Bank')}
                 className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                    payout.activeMethod === 'Bank' 
                    ? 'border-blue-500 bg-blue-50/20' 
                    : 'border-gray-200 hover:border-blue-200'
                 }`}
              >
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    payout.activeMethod === 'Bank' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                 }`}>
                    {payout.activeMethod === 'Bank' && <div className="w-2 h-2 rounded-full bg-white" />}
                 </div>
                 <div className="flex flex-col items-start gap-1">
                    <span className={`text-[15px] font-bold ${payout.activeMethod === 'Bank' ? 'text-blue-900' : 'text-gray-900'}`}>Bank Account/Card</span>
                 </div>
              </button>

              <button 
                 type="button"
                 onClick={() => updatePayoutMethod('Crypto')}
                 className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                    payout.activeMethod === 'Crypto' 
                    ? 'border-blue-500 bg-blue-50/20' 
                    : 'border-gray-200 hover:border-blue-200'
                 }`}
              >
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    payout.activeMethod === 'Crypto' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                 }`}>
                    {payout.activeMethod === 'Crypto' && <div className="w-2 h-2 rounded-full bg-white" />}
                 </div>
                 <div className="flex flex-col items-start gap-1">
                    <span className={`text-[15px] font-bold ${payout.activeMethod === 'Crypto' ? 'text-blue-900' : 'text-gray-900'}`}>Cryptocurrency Wallet</span>
                 </div>
              </button>

           </div>
       </div>

       {/* Dynamic Form Area */}
       <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm">
          
          <h3 className="text-[16px] font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
             {payout.activeMethod === 'Bank' ? 'Bank Account' : 'Cryptocurrency Wallet'}
          </h3>

          {payout.activeMethod === 'Bank' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Bank Name</label>
                    <div className="relative">
                       <select 
                          value={payout.bank.bankName}
                          onChange={(e) => updateBankPayout({ bankName: e.target.value })}
                          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors bg-white cursor-pointer"
                       >
                          <option value="">Select Bank Name</option>
                          <option value="GTBank">Guaranty Trust Bank</option>
                          <option value="AccessBank">Access Bank</option>
                          <option value="ZenithBank">Zenith Bank</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Account Name</label>
                    <input 
                       type="text"
                       placeholder="Enter Account Name"
                       value={payout.bank.accountName}
                       onChange={(e) => updateBankPayout({ accountName: e.target.value })}
                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    />
                 </div>

                 <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Account Number</label>
                    <input 
                       type="text"
                       placeholder="0233485743"
                       value={payout.bank.accountNumber}
                       onChange={(e) => updateBankPayout({ accountNumber: e.target.value })}
                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    />
                 </div>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Cryptocurrency</label>
                    <div className="relative">
                       <select 
                          value={payout.crypto.currency}
                          onChange={(e) => updateCryptoPayout({ currency: e.target.value as any })}
                          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors bg-white cursor-pointer"
                       >
                          <option value="USDT">USDT (Tether)</option>
                          <option value="BTC">BTC (Bitcoin)</option>
                          <option value="ETH">ETH (Ethereum)</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                 </div>

                 <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Wallet Address</label>
                    <input 
                       type="text"
                       placeholder="Enter wallet address"
                       value={payout.crypto.address}
                       onChange={(e) => updateCryptoPayout({ address: e.target.value })}
                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    />
                 </div>
             </div>
          )}

          <div className="w-full flex">
             <button 
               type="submit"
               disabled={isSaving}
               className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-[14px] py-4 md:py-3.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
             >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (payout.activeMethod === 'Bank' ? 'Link Bank Account' : 'Link Crypto Wallet')}
             </button>
          </div>
       </form>

    </div>
  );
}
