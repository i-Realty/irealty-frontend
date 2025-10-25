"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

export default function ReserveModal({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ?? '';
  const [addVerify, setAddVerify] = useState(false);
  const VERIFY_PRICE = 250000;
  const PROPERTY_PRICE = 20000000;
  const AGENT_FEE = 500000;
  const VAT = 100000;
  const total = PROPERTY_PRICE + (addVerify ? VERIFY_PRICE : 0) + AGENT_FEE + VAT;

  function proceed() {
    // navigate to payment step
    router.push(`/listings/${id}?reservePayment=1`);
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => (onClose ? onClose() : router.back())} />

      <div className="relative bg-white rounded-2xl w-md max-w-xl mx-4 p-6 shadow-xl">
        <div className="flex items-start justify-between px-2">
          <div>
            <div className="text-xs text-gray-400 pt-2">Step 1/2</div>
            <h3 className="text-lg font-extrabold pt-3">i-Verify Service <span className="ml-2 inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full">Recommended</span></h3>
          </div>
          <button aria-label="Close" onClick={() => (onClose ? onClose() : router.back())} className="text-gray-400 hover:text-gray-600 pt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="mt-4 text-sm font-extrabold px-2">Professional Property Document Verification</div>
        <div className="mt-4 text-sm text-gray-700 px-2">Let our legal experts verify all property documents on your behalf to ensure a secure and legitimate purchase. Protect your investment with comprehensive document verification.</div>

        <div className="mt-4 border border-gray-100 rounded-lg p-4 bg-white flex flex-col items-center justify-between">
          <div className="flex items-center justify-between w-full p-1">
          <div>
            <div className="text-sm font-bold">Add i-Verify Service <span className="text-xs text-gray-400">(Optional)</span></div>
            <div className="text-xs text-gray-500">₦{VERIFY_PRICE.toLocaleString()}</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={addVerify} onChange={(e) => setAddVerify(e.target.checked)} className="sr-only" />
            <span className={`w-11 h-6 flex items-center  rounded-full p-1 ${addVerify ? 'justify-end bg-blue-600' : 'justify-start bg-gray-200'}`}>
              <span className={`w-4 h-4 bg-white rounded-full shadow`} />
            </span>
          </label>
          </div>
          {/* processing note box */}
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
          Processing Time: 5-7 business days for complete verification report
        </div>
        </div>

        

        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm">
          <div className="flex items-center justify-between text-gray-500"><span>Property Price</span><span className="font-semibold">₦{PROPERTY_PRICE.toLocaleString()}</span></div>
          <div className="flex items-center justify-between text-gray-500 mt-2"><span>Agent Fee</span><span className="font-semibold">₦{AGENT_FEE.toLocaleString()}</span></div>
          <div className="flex items-center justify-between text-gray-500 mt-2"><span>i-Verify Service</span><span className="font-semibold">₦{addVerify ? VERIFY_PRICE.toLocaleString() : '0.00'}</span></div>
          <div className="flex items-center justify-between text-gray-500 mt-2"><span>Vat</span><span className="font-semibold">₦{VAT.toLocaleString()}</span></div>
          <div className="flex items-center justify-between text-gray-900 mt-3 text-lg font-bold"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
        </div>

        <div className="mt-6">
          <button onClick={proceed} className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm flex items-center justify-center gap-2">
            Proceed To Payment
            <Image src="/icons/arrowOblique.svg" alt="proceed" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
