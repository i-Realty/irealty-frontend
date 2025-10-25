"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

type Props = {
  onClose?: () => void;
};

export default function BookTourModal({ onClose }: Props) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ?? '';
  const [tab, setTab] = useState<'inperson' | 'video'>('inperson');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = [
    'Sun, Jul 2 — 11:00 AM - 1:00 PM',
    'Sun, Jul 2 — 1:00 PM - 3:00 PM',
    'Sun, Jul 2 — 3:00 PM - 5:00 PM',
    'Sun, Jul 2 — 5:00 PM - 7:00 PM',
  ];

  // close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose ? onClose() : router.back();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden
        onClick={() => (onClose ? onClose() : router.back())}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-gray-400">Step 1/2</div>
            <h2 className="text-lg font-semibold">Book A Tour</h2>
            <div className="text-xs text-gray-500 mt-1">Go on a personalized tour of this property by connecting with a local agent who advertises on i-Realty</div>
          </div>
          <button
            aria-label="Close"
            onClick={() => (onClose ? onClose() : router.back())}
            className="text-gray-500 hover:text-gray-700 ml-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs (styled as rounded track with elevated white pill for active) */}
        <div className="mt-4 flex gap-3 bg-gray-100 rounded-full p-1.5 items-center">
          <button
            onClick={() => setTab('inperson')}
            className={`w-full text-center px-5 py-2 rounded-full text-sm ${tab === 'inperson' ? 'bg-white shadow text-black font-semibold' : 'text-gray-400'}`}
            aria-pressed={tab === 'inperson'}
          >
            In-person
          </button>
          <button
            onClick={() => setTab('video')}
            className={`w-full text-center px-5 py-2 rounded-full text-sm ${tab === 'video' ? 'bg-white shadow text-black font-semibold' : 'text-gray-400'}`}
            aria-pressed={tab === 'video'}
          >
            Video chat
          </button>
        </div>

        {/* Slots grid */}
        <div className="mt-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Select date & time</div>
          <div className="grid grid-cols-2 gap-3">
            {slots.map((s) => {
              const active = selectedSlot === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSlot(s)}
                  className={`text-left p-3 rounded-lg border ${active ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="text-sm font-semibold">{s.split('—')[0].trim()}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.split('—')[1]?.trim()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Image preview & fee */}
          <div className="mt-4">
          <div className="w-full h-36 relative">
            <Image src="/images/property1.png" alt="preview" fill className="object-cover rounded-lg" />
          </div>

          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600">Inspection Fee</div>
            <div className="text-lg font-semibold">₦200,000.00</div>
            <div className="text-xs text-gray-500 mt-1">One-time fee for a professional property tour</div>
          </div>
        </div>

        {/* Proceed button */}
        <div className="mt-5">
          <button
            disabled={!selectedSlot}
            onClick={() => {
              // navigate to same listing route with a query param so the page can render the payment overlay
              // do NOT call onClose() first — we want a history entry for the bookTour state so Back navigates correctly
              router.push(`/listings/${id}?bookTourPayment=1`);
            }}
            className={`w-full py-2 rounded-lg text-white font-medium ${selectedSlot ? 'bg-blue-600' : 'bg-blue-200 cursor-not-allowed'}`}
          >
            Proceed
          </button>
        </div>
      </div>
      {/* Payment is handled on its own route: /listings/{id}/book-tour/payment */}
    </div>
  );
}
