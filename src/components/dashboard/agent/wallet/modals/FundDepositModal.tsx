'use client';

import { useCallback, useState } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { X, Copy, ChevronRight, Check } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

const ACCOUNT_NUMBER = '12222223321';

export default function FundDepositModal() {
  const { setActiveModal } = useWalletStore();
  const closeModal = useCallback(() => setActiveModal(null), [setActiveModal]);
  useEscapeKey(closeModal);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = ACCOUNT_NUMBER;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6 transition-all duration-200 fade-in overflow-hidden" role="dialog" aria-modal="true" aria-label="Fund deposit">
       <div className="bg-white w-full h-full md:max-w-[500px] md:h-auto md:max-h-[85vh] md:rounded-2xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 pb-4 flex items-center justify-between z-10 w-full bg-white relative border-b border-gray-100/0">
              <h2 className="text-[20px] font-bold text-gray-900 tracking-tight leading-tight">
                Fund deposit
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
               >
                 <X className="w-5 h-5" />
              </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-8 flex flex-col items-center">
             
             <p className="text-[13px] font-medium text-gray-400 text-center mb-6">
                Transfer money to your <span className="text-gray-500">i-Realty</span> account
             </p>

             {/* Static Bank Source Logic */}
             <div className="w-full bg-gray-50/50 rounded-xl p-5 mb-6 flex flex-col gap-5 border border-gray-100/60 shadow-sm">
                
                <div className="flex flex-col gap-1">
                   <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">Bank name</span>
                   <p className="text-[14px] font-bold text-gray-900">Noma Bank</p>
                </div>
                
                <div className="flex flex-col gap-1">
                   <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">Account number</span>
                   <div className="flex items-center justify-between">
                       <p className="text-[14px] font-bold text-gray-900 tracking-wide">{ACCOUNT_NUMBER}</p>
                       <button
                         onClick={handleCopy}
                         className={`font-bold text-[13px] flex items-center gap-1.5 transition-colors ${copied ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'}`}
                       >
                          {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                       </button>
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">Account name</span>
                   <p className="text-[14px] font-bold text-gray-900">i-Realty-Oyakhilome Einstein</p>
                </div>
             </div>

             {/* Semantic Divider */}
             <div className="flex items-center w-full my-1">
                 <div className="flex-1 h-px bg-gray-100"></div>
                 <span className="px-4 text-[12px] font-semibold text-gray-400">OR</span>
                 <div className="flex-1 h-px bg-gray-100"></div>
             </div>

             {/* Amount Input */}
             <div className="w-full flex flex-col mt-6 mb-4">
                 <span className="text-[13px] font-medium text-gray-400 mb-1.5">Amount</span>
                 <input 
                    type="number"
                    placeholder="Enter amount"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-gray-300 shadow-sm transition-colors placeholder:text-gray-400 font-medium"
                 />
             </div>

             {/* Gateway Lists */}
             <div className="w-full flex flex-col gap-2 mt-2 border-t border-gray-100 pt-6">

                 <button
                   onClick={() => alert('Flutterwave integration coming soon.')}
                   className="w-full flex items-center justify-between bg-white hover:bg-gray-50/50 p-4 border border-gray-100 rounded-xl transition-all shadow-sm group"
                 >
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <span className="text-[#3b82f6] text-[15px] font-black italic tracking-tighter">f</span>
                         </div>
                         <span className="font-bold text-gray-900 text-[14px]">Fund with flutterwave</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                 </button>

                 <button
                   onClick={() => alert('Paystack integration coming soon.')}
                   className="w-full flex items-center justify-between bg-white hover:bg-gray-50/50 p-4 border border-gray-100 rounded-xl transition-all shadow-sm group"
                 >
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                         </div>
                         <span className="font-bold text-gray-900 text-[14px]">Fund with paystack</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                 </button>

             </div>

          </div>
       </div>
    </div>
  );
}
