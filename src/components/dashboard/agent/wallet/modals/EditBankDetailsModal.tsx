import { useState, useCallback } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

export default function EditBankDetailsModal() {
  const { setActiveModal, fiatDetails, updateFiatDetailsMock, isProcessingAction } = useWalletStore();
  const closeModal = useCallback(() => setActiveModal(null), [setActiveModal]);
  useEscapeKey(closeModal);

  const [bankName, setBankName] = useState(fiatDetails.bankName);
  const [accountName, setAccountName] = useState(fiatDetails.accountName);
  const [accountNumber, setAccountNumber] = useState(fiatDetails.accountNumber);

  const handleSave = async () => {
     await updateFiatDetailsMock({ bankName, accountName, accountNumber });
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in overflow-hidden" role="dialog" aria-modal="true" aria-label="Edit bank details">
       <div className="bg-white w-full h-full md:h-auto md:max-w-md md:max-h-[85vh] md:rounded-2xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200 md:border md:border-gray-200 overflow-hidden">

          <div className="p-6 md:p-8 flex items-center justify-between z-10 w-full bg-white relative border-b border-gray-100 pb-6">
             <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModal('withdraw')}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight leading-tight">
                  Edit Bank Details
                </h2>
             </div>
             <button 
               onClick={() => setActiveModal(null)}
               className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 -mr-2 rounded-full transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-8 py-8 flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                 <label className="text-[13px] font-medium text-gray-900">Bank Name</label>
                 <div className="relative">
                    <select 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-500 appearance-none focus:outline-none focus:border-blue-500 shadow-sm font-medium"
                    >
                       <option value="Zenith bank">Zenith bank</option>
                       <option value="GTBank">GTBank</option>
                       <option value="Access Bank">Access Bank</option>
                       <option value="First Bank">First Bank</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[13px] font-medium text-gray-900">Account Name</label>
                 <input 
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-400 focus:text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
                 />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[13px] font-medium text-gray-900">Account Number</label>
                 <input 
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-400 focus:text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
                 />
              </div>

              <button 
                onClick={handleSave}
                disabled={isProcessingAction}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-[15px] py-4 rounded-xl transition-colors shadow-sm mt-6 mb-4 flex justify-center items-center"
              >
                 {isProcessingAction ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
              </button>
          </div>

       </div>
    </div>
  );
}
