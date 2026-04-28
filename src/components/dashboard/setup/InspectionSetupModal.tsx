'use client';

import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

interface InspectionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InspectionSetupModal({ isOpen, onClose }: InspectionSetupModalProps) {
  useEscapeKey(onClose);
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  // Step 1 State
  const [feeType, setFeeType] = useState('percentage'); // 'percentage' | 'amount'
  const [percentage, setPercentage] = useState('');
  const [amount, setAmount] = useState('');

  // Step 2 State
  const [availabilities, setAvailabilities] = useState([
    { id: 1, date: '', from: '', to: '' }
  ]);

  if (!isOpen) return null;

  const handleAddDate = () => {
    setAvailabilities([...availabilities, { id: Date.now(), date: '', from: '', to: '' }]);
  };

  const handleRemoveDate = (id: number) => {
    setAvailabilities(availabilities.filter(a => a.id !== id));
  };

  const handleUpdateAvailability = (id: number, field: string, value: string) => {
    setAvailabilities(availabilities.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const isStep1Valid = (feeType === 'percentage' && percentage !== '') || (feeType === 'amount' && amount !== '');

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden my-auto h-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span className="w-6 h-6 border border-blue-600 border-t-transparent rounded-full block"></span>
            i-REALTY
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto w-full p-6">
          <div className="mb-6">
             <span className="text-sm font-medium text-gray-400 block mb-1">
               Step {step}/{totalSteps}
             </span>
             <h2 className="text-2xl font-bold text-gray-900">
               {step === 1 ? 'Set Up Your Inspection Fee' : 'Set Up Your Availability'}
             </h2>
          </div>

          {step === 1 && (
            <div className="space-y-6">
               <div className="flex items-center gap-6 p-1">
                 <label className="flex items-center gap-3 cursor-pointer">
                   <div className="relative flex items-center justify-center">
                     <input 
                       type="radio" 
                       name="feetype"
                       className="peer sr-only"
                       checked={feeType === 'percentage'}
                       onChange={() => setFeeType('percentage')}
                     />
                     <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-blue-600 flex items-center justify-center transition-colors">
                       <div className="w-2.5 h-2.5 rounded-full bg-blue-600 transition-transform scale-0 peer-checked:scale-100"></div>
                     </div>
                   </div>
                   <span className={`font-medium ${feeType === 'percentage' ? 'text-gray-900' : 'text-gray-500'}`}>Percentage</span>
                 </label>
                 
                 <label className="flex items-center gap-3 cursor-pointer">
                   <div className="relative flex items-center justify-center">
                     <input 
                       type="radio" 
                       name="feetype"
                       className="peer sr-only"
                       checked={feeType === 'amount'}
                       onChange={() => setFeeType('amount')}
                     />
                     <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-blue-600 flex items-center justify-center transition-colors">
                       <div className="w-2.5 h-2.5 rounded-full bg-blue-600 transition-transform scale-0 peer-checked:scale-100"></div>
                     </div>
                   </div>
                   <span className={`font-medium ${feeType === 'amount' ? 'text-gray-900' : 'text-gray-500'}`}>Amount</span>
                 </label>
               </div>

               <div>
                 {feeType === 'percentage' ? (
                   <>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Percentage</label>
                     <div className="relative">
                       <input 
                         type="number" 
                         placeholder="Eg. 0-100%" 
                         className="w-full border border-gray-200 rounded-lg pl-4 pr-8 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                         value={percentage}
                         onChange={(e) => setPercentage(e.target.value)}
                       />
                       <span className="absolute text-gray-500 right-4 top-1/2 -translate-y-1/2 font-medium">%</span>
                     </div>
                   </>
                 ) : (
                   <>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                     <div className="relative">
                       <span className="absolute text-gray-500 left-4 top-1/2 -translate-y-1/2 font-medium">₦</span>
                       <input 
                         type="number" 
                         placeholder="Enter Amount" 
                         className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                       />
                     </div>
                   </>
                 )}
               </div>

               <div className="pt-2">
                 <button 
                   onClick={() => setStep(2)}
                   disabled={!isStep1Valid}
                   className={`w-full py-3 rounded-lg font-medium transition-colors ${
                     isStep1Valid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-300 text-white cursor-not-allowed'
                   }`}
                 >
                   Set Up Commission Fee
                 </button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
               <div className="flex justify-between items-center bg-[#FFF9E9] p-4 rounded-lg border border-[#FDEBBA]">
                  <span className="font-bold text-[#D08B1F] text-sm">Amount Set</span>
                  <span className="font-bold text-[#D08B1F] bg-white px-3 py-1 rounded-md text-sm">
                    {feeType === 'percentage' ? `${percentage}%` : `₦${amount}`}
                  </span>
               </div>

               <div className="space-y-4">
                 {availabilities.map((avail, index) => (
                   <div key={avail.id} className="p-4 border border-gray-100 bg-gray-50 rounded-xl relative group">
                     <p className="font-medium text-gray-900 mb-4 text-sm">Day {index + 1}</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> Date</label>
                          <input 
                            type="date" 
                            className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                            value={avail.date}
                            onChange={(e) => handleUpdateAvailability(avail.id, 'date', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> From</label>
                            <input 
                              type="time" 
                              className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                              value={avail.from}
                              onChange={(e) => handleUpdateAvailability(avail.id, 'from', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> To</label>
                            <input 
                              type="time" 
                              className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                              value={avail.to}
                              onChange={(e) => handleUpdateAvailability(avail.id, 'to', e.target.value)}
                            />
                          </div>
                        </div>
                     </div>

                     {index > 0 && (
                       <button 
                         onClick={() => handleRemoveDate(avail.id)}
                         className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                       >
                          <Trash2 className="w-5 h-5" />
                       </button>
                     )}
                   </div>
                 ))}
               </div>

               <button 
                 onClick={handleAddDate}
                 className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors py-2"
               >
                 <Plus className="w-5 h-5 bg-blue-50 rounded p-1" />
                 Add Another Date
               </button>

               <div className="pt-4 flex gap-3">
                 <button 
                   onClick={() => setStep(1)}
                   className="flex-1 py-3 rounded-lg font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                 >
                   Back
                 </button>
                 <button 
                   onClick={onClose}
                   className="flex-[2] bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                 >
                   Complete Set Up
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
