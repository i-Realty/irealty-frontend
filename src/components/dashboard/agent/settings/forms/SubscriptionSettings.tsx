'use client';

import { useState } from 'react';
import { Info, Check, Hexagon, X, Loader2 } from 'lucide-react';

function ConfirmModal({ planName, price, onConfirm, onClose }: { planName: string; price: string; onConfirm: () => void; onClose: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setDone(true);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Confirm Subscription</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {done ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-600">You are now subscribed to the <span className="font-semibold">{planName}</span>.</p>
            <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Done</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">You are about to subscribe to:</p>
            <div className="bg-blue-50/60 rounded-xl p-4 mb-4 text-sm">
              <p className="font-semibold text-gray-900">{planName}</p>
              <p className="text-blue-700 font-medium mt-1">{price}/Month</p>
            </div>
            <p className="text-xs text-gray-400 mb-4">Payment processing integration coming soon. This is a preview of the subscription flow.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirm} disabled={isProcessing} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</> : 'Subscribe'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionSettings() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState('free');

  const PLANS = [
     {
        id: 'free',
        name: 'Free',
        price: 'NGN 0',
        period: '/Month',
        isCurrent: true,
        features: [
           'Basic access',
           'Create up to 5 listings',
           'Standard analytics',
           'Email support'
        ]
     },
     {
        id: 'standard',
        name: 'Standard',
        price: 'NGN 5,000',
        period: '/Month',
        isCurrent: false,
        isPopular: true,
        features: [
           'Advanced access',
           'Create up to 25 listings',
           'Advanced analytics',
           'Priority support',
           'Featured tags'
        ]
     },
     {
        id: 'premium',
        name: 'Premium',
        price: 'NGN 10,000',
        period: '/Month',
        isCurrent: false,
        features: [
           'Unlimited access',
           'Unlimited listings',
           'Enterprise analytics',
           '24/7 Phone support',
           'Premium tags & Custom domain',
           'API access'
        ]
     }
  ];

  const selectedPlanData = PLANS.find((p) => p.id === selectedPlan);

  return (
    <>
    <div className="flex flex-col gap-6 w-full animate-in slide-in-from-right-4 fade-in duration-300">
       
       <div className="flex flex-col">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Subscription Plans</h2>
          <p className="text-[13px] font-medium text-gray-400">Manage and view your active subscription packages</p>
       </div>

       {/* Warning/Active Banner */}
       <div className="w-full bg-[#FFF9E6] border border-[#FFEAB8] rounded-xl flex items-center justify-between p-4 px-5">
           <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[#F5B000]" />
              <span className="text-[14px] font-bold text-[#b88c00]">Your free subscription plan is active for 29 days</span>
           </div>
           {/* Close hint - optional */}
           {/* <button className="text-[#F5B000]/70 hover:text-[#F5B000]"><X className="w-4 h-4" /></button> */}
       </div>

       {/* Price Grids */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          {PLANS.map((plan) => (
             <div 
                key={plan.id}
                className={`relative bg-white rounded-3xl p-6 flex flex-col border-2 transition-transform shadow-sm ${
                   plan.isPopular ? 'border-blue-600 shadow-blue-100' : 'border-gray-100 hover:border-gray-200'
                }`}
             >
                {/* Popular Badge */}
                {plan.isPopular && (
                   <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                      Most Popular
                   </div>
                )}

                {/* Plan Header */}
                <div className="flex flex-col mb-6 mt-2">
                   <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${plan.isPopular ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                         <Hexagon className="w-5 h-5" />
                      </div>
                      <span className="text-[16px] font-bold text-gray-900">{plan.name}</span>
                   </div>
                   <div className="flex items-end gap-1 mt-2">
                      <span className="text-[28px] font-black text-gray-900 leading-none">{plan.price}</span>
                      <span className="text-[14px] font-medium text-gray-400 mb-1">{plan.period}</span>
                   </div>
                </div>

                {/* Action Button */}
                <button
                   onClick={() => !plan.isCurrent && activePlan !== plan.id && setSelectedPlan(plan.id)}
                   className={`w-full py-3.5 rounded-xl font-bold text-[14px] transition-colors mb-8 ${
                      activePlan === plan.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.isPopular
                         ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                         : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-600 hover:text-blue-600'
                   }`}
                   disabled={activePlan === plan.id}
                >
                   {activePlan === plan.id ? 'Current Plan' : 'Subscribe'}
                </button>

                {/* Features */}
                <div className="flex flex-col gap-4 mt-auto">
                   {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                         <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                         </div>
                         <span className="text-[14px] font-medium text-gray-700">{feat}</span>
                      </div>
                   ))}
                </div>
             </div>
          ))}
       </div>

    </div>

    {selectedPlan && selectedPlanData && (
      <ConfirmModal
        planName={selectedPlanData.name}
        price={selectedPlanData.price}
        onConfirm={() => { setActivePlan(selectedPlan); setSelectedPlan(null); }}
        onClose={() => setSelectedPlan(null)}
      />
    )}
    </>
  );
}
