"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useTourBookingStore } from '@/lib/store/useTourBookingStore';
import { usePropertyStore } from '@/lib/store/usePropertyStore';
import { calculateFees } from '@/lib/utils/calculateFees';
import type { TourType } from '@/lib/store/useTourBookingStore';

type Props = {
  onClose?: () => void;
};

export default function BookTourModal({ onClose }: Props) {
  const router = useRouter();
  const params = useParams();
  const propertyId = (params?.id as string) ?? '';

  const [tab, setTab] = useState<TourType>('in-person');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { stageDraft } = useTourBookingStore();
  const property = usePropertyStore((s) => s.getPropertyById(propertyId));

  const inspectionFee = 25000;
  const { fee } = calculateFees(inspectionFee, 'inspection');
  const netToAgent = inspectionFee - fee;

  // Generate 4 upcoming slots starting from the next Sunday
  const slots = React.useMemo(() => {
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const TIMES = ['11:00 AM - 1:00 PM', '1:00 PM - 3:00 PM', '3:00 PM - 5:00 PM', '5:00 PM - 7:00 PM'];
    const today = new Date();
    const daysToSunday = (7 - today.getDay()) % 7 || 7;
    const base = new Date(today);
    base.setDate(today.getDate() + daysToSunday);
    return TIMES.map((time, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()} — ${time}`;
    });
  }, []);

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

  function handleProceed() {
    if (!selectedSlot) return;

    // Stage the draft so the payment page can finalise booking
    stageDraft({
      propertyId,
      propertyTitle: property?.title ?? `Property ${propertyId}`,
      propertyImage: property?.media?.[0] ?? '/images/property1.png',
      propertyLocation: property ? `${property.city}, ${property.state}` : '',
      agentId: property?.ownerId ?? 'agent-unknown',
      agentName: property?.ownerName ?? 'Agent',
      slot: selectedSlot,
      type: tab,
      inspectionFee,
    });

    router.push(`/listings/${propertyId}?bookTourPayment=1`);
  }

  const propertyImage = property?.media?.[0] ?? '/images/property1.png';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Book a tour">
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
            <div className="text-xs text-gray-500 mt-1">
              Go on a personalized tour of this property by connecting with a local agent who advertises on i-Realty
            </div>
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

        {/* Tabs */}
        <div className="mt-4 flex gap-3 bg-gray-100 rounded-full p-1.5 items-center">
          <button
            onClick={() => setTab('in-person')}
            className={`w-full text-center px-5 py-2 rounded-full text-sm ${tab === 'in-person' ? 'bg-white shadow text-black font-semibold' : 'text-gray-400'}`}
            aria-pressed={tab === 'in-person'}
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
          <div className="text-xs font-medium text-gray-700 mb-2">Select date &amp; time</div>
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
          <div className="relative w-full h-36 border border-gray-100 rounded-lg overflow-hidden">
            <Image src={propertyImage} alt="preview" fill className="object-cover" />
          </div>

          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600">Inspection Fee</div>
            <div className="text-lg font-semibold">₦{inspectionFee.toLocaleString()}.00</div>
            <div className="text-xs text-gray-500 mt-1">
              Platform fee: ₦{fee.toLocaleString()} — Agent receives: ₦{netToAgent.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Proceed button */}
        <div className="mt-5">
          <button
            disabled={!selectedSlot}
            onClick={handleProceed}
            className={`w-full py-2 rounded-lg text-white font-medium ${selectedSlot ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-200 cursor-not-allowed'}`}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
