import { useState, useCallback } from 'react';
import { useWalletStore, WithdrawalMethod } from '@/lib/store/useWalletStore';
import { X, ArrowLeft } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

export default function ChangeWithdrawMethodModal() {
  const { setActiveModal, currentWithdrawMethod, setWithdrawMethod, fiatDetails, cryptoDetails } = useWalletStore();
  const closeModal = useCallback(() => setActiveModal(null), [setActiveModal]);
  useEscapeKey(closeModal);
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>(currentWithdrawMethod);

  const handleSave = () => {
     setWithdrawMethod(selectedMethod);
     setActiveModal('withdraw');
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in overflow-hidden" role="dialog" aria-modal="true" aria-label="Change withdrawal method">
       <div className="bg-white w-full h-full md:h-auto md:max-w-md md:max-h-[85vh] md:rounded-2xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200 md:border md:border-gray-200 overflow-hidden">

          <div className="p-6 md:p-8 flex items-center justify-between z-10 w-full bg-white relative border-b border-gray-100">
             <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModal('withdraw')}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight leading-tight">
                  Change Withdrawal Method
                </h2>
             </div>
             <button 
               onClick={() => setActiveModal(null)}
               className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 -mr-2 rounded-full transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-8 py-8 flex flex-col items-center gap-4">
              
              <button 
                onClick={() => setSelectedMethod('Fiat')}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${selectedMethod === 'Fiat' ? 'border-blue-500 bg-blue-50/20 shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200'}`}
              >
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                         <span className="text-red-600 font-bold italic tracking-tighter text-[16px]">Z</span>
                      </div>
                      <div className="flex flex-col text-left">
                         <span className="font-bold text-[15px] text-gray-900">{fiatDetails.bankName}</span>
                         <span className="font-medium text-[13px] text-gray-400">{fiatDetails.accountNumber}</span>
                      </div>
                  </div>

                  {/* Radio Visual */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedMethod === 'Fiat' ? 'border-blue-600' : 'border-gray-300'}`}>
                      {selectedMethod === 'Fiat' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                  </div>
              </button>

              <button 
                onClick={() => setSelectedMethod('Crypto')}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${selectedMethod === 'Crypto' ? 'border-blue-500 bg-blue-50/20 shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200'}`}
              >
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#16a34a] shadow-sm flex items-center justify-center shrink-0">
                         <span className="text-white font-bold text-[16px]">T</span>
                      </div>
                      <div className="flex flex-col text-left">
                         <span className="font-bold text-[15px] text-gray-900">{cryptoDetails.network}</span>
                         <span className="font-medium text-[12px] text-gray-400 font-mono tracking-wider">{cryptoDetails.address}</span>
                      </div>
                  </div>

                  {/* Radio Visual */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedMethod === 'Crypto' ? 'border-blue-600' : 'border-gray-300'}`}>
                      {selectedMethod === 'Crypto' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                  </div>
              </button>

              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-[15px] py-4 rounded-xl transition-colors shadow-sm mt-6"
              >
                 Save Changes
              </button>
          </div>
       </div>
    </div>
  );
}
