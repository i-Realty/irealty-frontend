"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

export default function ReserveConfirmationModal({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  useEscapeKey(() => (onClose ? onClose() : router.back()));
  const params = useParams();
  const id = params?.id ?? '';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Reservation confirmed">
      <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => (onClose ? onClose() : router.back())} />

      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-8 shadow-xl text-center">
        <button aria-label="Close" onClick={() => (onClose ? onClose() : router.back())} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#F4F6F5] flex items-center justify-center mb-4">
            <div className="w-15 h-15 rounded-full bg-[#BDE3CD] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#40B773] flex items-center justify-center text-white">
                <Image src="/icons/confirmed.svg" alt="confirmed" width={20} height={20} />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold">Reservation Confirmed!</h3>
          <p className="text-sm text-gray-500 mt-2">Your reservation request has been successfully submitted and payment confirmed.</p>

          <div className="mt-6 bg-[#FFF2C7] border border-yellow-200 rounded-lg p-4 text-left text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <Image src="/icons/info.svg" alt="info" width={20} height={20} className="pt-0.5" />
              <div>We will hold the reservation and notify the agent. Please check your messages for next steps.</div>
            </div>
          </div>

          <div className="mt-6 w-full flex gap-3">
            <button onClick={() => {
              const now = new Date();
              const start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              const end = new Date(start.getTime() + 60 * 60 * 1000);
              const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
              const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Property Reservation – i-Realty')}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent('Property reservation via i-Realty. Check your messages for next steps.')}`;
              window.open(url, '_blank');
            }} className="flex-1 border border-blue-200 rounded-lg py-2 text-sm text-blue-600 flex items-center justify-center gap-2">
              <Image src="/icons/calender.svg" alt="calendar" width={16} height={16} />
              <span>Add To Calendar</span>
            </button>
            <button onClick={() => router.push(`/listings/${id}`)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2">
              <Image src="/icons/messages2.svg" alt="chat" width={16} height={16} />
              <span>Chat Agent</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
