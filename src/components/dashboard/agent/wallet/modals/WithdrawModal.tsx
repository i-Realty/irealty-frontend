import { useState, useCallback } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { withdrawAmountSchema, extractErrors } from '@/lib/validations/settings';
import { X, Edit3, Loader2 } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

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

  const closeModal = useCallback(() => setActiveModal(null), [setActiveModal]);
  useEscapeKey(closeModal);
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (val: number) => `₦${val.toLocaleString('en-US')}`;

  const numericAmount = Number(amount);
  const exceedsBalance = !!amount && numericAmount > walletBalance;
  const isInvalid = exceedsBalance || !amount || numericAmount <= 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    // Clear error as user types so it only shows on real-time exceed
    if (errors.amount) setErrors({});
  };

  const handleWithdraw = async () => {
    if (!amount) return;
    const result = withdrawAmountSchema.safeParse({ amount: numericAmount, balance: walletBalance });
    if (!result.success) {
      setErrors(extractErrors(result.error));
      return;
    }
    setErrors({});
    await processWithdrawalMock(numericAmount);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in overflow-hidden" role="dialog" aria-modal="true" aria-label="Withdrawal">
       <div className="bg-white w-full h-full md:h-auto md:max-w-md md:max-h-[85vh] md:rounded-2xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200 md:border md:border-gray-200 overflow-hidden">

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

              <div className="w-full relative">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className={`w-full bg-white border rounded-xl px-4 py-3.5 pr-16 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400 ${
                    exceedsBalance ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => { setAmount(String(walletBalance)); setErrors({}); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                >
                  Max
                </button>
              </div>
              {(exceedsBalance || errors.amount) && (
                <p className="text-red-500 text-xs mt-1 self-start">
                  {exceedsBalance ? `Exceeds available balance (${formatCurrency(walletBalance)})` : errors.amount}
                </p>
              )}
              <div className="mb-6" />

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
                disabled={isProcessingAction || isInvalid}
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
