"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

type Props = {
  onClose?: () => void;
};

export default function MapModal({ onClose }: Props) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ?? '';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => (onClose ? onClose() : router.back())} />

      <div className="relative bg-white rounded-2xl w-full max-w-3xl mx-4 p-4 shadow-xl">
        <button aria-label="Close" onClick={() => (onClose ? onClose() : router.back())} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex flex-col">
          <div className="mb-3 text-sm text-gray-500">Map</div>
          <div className="w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden relative">
            {/* Simulated map image */}
            <Image src="/images/detailsmap.png" alt="map" fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
