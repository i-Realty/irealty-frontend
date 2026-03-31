import { useState } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { X, Edit3, Loader2 } from 'lucide-react';

export default function WithdrawModal() {
  const { 
    walletBalance, 
    setActiveModal, 
    currentWithdrawMethod, 
    fiatDetails, 
    cryptoDetails,
    isProcessingAction,
    processWithdrawalMock
  } = useWalletStore();

  const [amount, setAmount] = useState('');

  const formatCurrency = (val: number) => {
    return `₦${val.toLocaleString('en-US')}`;
  };

  const handleWithdraw = async () => {
     if (!amount) return;
     await processWithdrawalMock(Number(amount));
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in overflow-hidden">
       <div className="bg-white w-full h-full md:max-w-md md:h-auto md:max-h-[85vh] md:rounded-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200">
          
          <div className="p-6 md:p-8 flex items-center justify-between z-10 w-full bg-white relative">
             <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
               Withdrawal
             </h2>
             <button 
               onClick={() => setActiveModal(null)}
               className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 -mr-2 rounded-full transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-8 pb-8 flex flex-col items-center">
              
              <div className="w-full bg-gray-50/50 rounded-2xl py-6 flex flex-col items-center justify-center mb-6 border border-gray-100/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)]">
                 <span className="text-[13px] font-medium text-gray-400 mb-2">Wallet balance</span>
                 <h3 className="text-[24px] font-bold text-gray-900 tracking-tight">{formatCurrency(walletBalance)}</h3>
              </div>

              <input 
                 type="number"
                 placeholder="Enter amount"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-6 placeholder:text-gray-400"
              />

              <div className="w-full bg-gray-50/60 border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <span className="font-bold text-[14px] text-gray-900">Bank details</span>
                     <button 
                       onClick={() => setActiveModal('editBank')}
                       className="text-gray-500 hover:text-gray-700 font-medium text-[13px] flex items-center gap-1.5 transition-colors bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200"
                     >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                     </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     {currentWithdrawMethod === 'Fiat' ? (
                        <>
                           <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                               <span className="text-red-600 font-bold italic tracking-tighter text-[15px]">Z</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-[14px] text-gray-900 tracking-tight">{fiatDetails.bankName}</span>
                              <span className="font-medium text-[13px] text-gray-400">{fiatDetails.accountNumber}</span>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="w-9 h-9 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0 shadow-sm">
                               <span className="text-white font-bold text-[15px]">T</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-[14px] text-gray-900 tracking-tight">{cryptoDetails.network}</span>
                              <span className="font-medium text-[13px] text-gray-400 tracking-wider font-mono">{cryptoDetails.address}</span>
                           </div>
                        </>
                     )}
                  </div>
              </div>

              <button 
                onClick={() => setActiveModal('changeMethod')}
                className="self-start text-blue-600 hover:text-blue-700 font-semibold text-[13px] hover:underline underline-offset-4 mb-8"
              >
                 Change withdrawal method
              </button>

              <button 
                onClick={handleWithdraw}
                disabled={isProcessingAction || !amount}
                className="w-full bg-blue-600 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-medium text-[15px] py-3.5 rounded-xl transition-colors shadow-sm mt-auto relative"
              >
                  {isProcessingAction ? (
                     <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                     "Withdraw"
                  )}
              </button>
          </div>
       </div>
    </div>
  );
}
