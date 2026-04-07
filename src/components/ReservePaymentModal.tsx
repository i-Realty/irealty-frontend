"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

export default function ReservePaymentModal({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  useEscapeKey(() => (onClose ? onClose() : router.back()));
  const params = useParams();
  const id = params?.id ?? '';

  function choose(option: string) {
    // simulate payment success for reserve
    router.push(`/listings/${id}?reserveSuccess=1`);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => (onClose ? onClose() : router.back())} />

      <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-gray-400">Step 2/2</div>
            <h3 className="text-lg font-semibold">Choose Payment Option</h3>
          </div>
          <button aria-label="Close" onClick={() => (onClose ? onClose() : router.back())} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <button onClick={() => choose('wallet')} className="w-full text-left p-4 border border-[#8E98A8] rounded-lg flex items-center justify-between hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Image src="/icons/wallet.svg" alt="wallet" width={20} height={20} />
              </div>
              <div>
                <div className="font-medium">Wallet</div>
                <div className="text-xs text-gray-500">Balance: ₦200,000,000.00</div>
              </div>
            </div>
            <Image src="/icons/arrow.svg" alt="arrow" width={16} height={16} className="text-gray-300" />
          </button>

          <button onClick={() => choose('paystack')} className="w-full text-left p-4 border border-[#8E98A8] rounded-lg flex items-center justify-between hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Image src="/icons/wallet.svg" alt="paystack" width={20} height={20} />
              </div>
              <div>
                <div className="font-medium">Pay With Paystack</div>
              </div>
            </div>
            <Image src="/icons/arrow.svg" alt="arrow" width={16} height={16} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
