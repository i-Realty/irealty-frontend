import { useCallback } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { X, Check } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

export default function WithdrawSuccessModal() {
  const { setActiveModal } = useWalletStore();
  const closeModal = useCallback(() => setActiveModal(null), [setActiveModal]);
  useEscapeKey(closeModal);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in overflow-hidden" role="dialog" aria-modal="true" aria-label="Withdrawal successful">
       <div className="bg-white w-full h-full md:h-auto md:max-w-[420px] md:max-h-[85vh] md:rounded-2xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200 md:border md:border-gray-200 overflow-hidden">
          
          <div className="p-6 md:p-6 flex items-center justify-end z-10 w-full bg-white relative">
             <button 
               onClick={() => setActiveModal(null)}
               className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 -mr-2 rounded-full transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10 flex flex-col items-center">
              
              <div className="w-24 h-24 rounded-full bg-green-50 mb-6 flex items-center justify-center relative">
                 <div className="w-16 h-16 rounded-full bg-[#1de07f] flex items-center justify-center inner-shadow">
                    <Check className="w-8 h-8 text-white stroke-[3.5]" />
                 </div>
              </div>

              <h2 className="text-[20px] font-bold text-gray-900 tracking-tight text-center mb-3">
                 Withdrawal Request Successful
              </h2>
              
              <p className="text-[13px] font-medium text-gray-400 text-center px-4 mb-8">
                 Your withdrawals will be processed within the next 48 hours
              </p>

              <button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-[15px] py-4 rounded-xl transition-colors shadow-sm"
              >
                 Back To Dashboard
              </button>
          </div>

       </div>
    </div>
  );
}
