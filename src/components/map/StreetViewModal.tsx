"use client";

import React from "react";
import dynamic from "next/dynamic";

const StreetViewEmbed = dynamic(() => import("./StreetViewEmbed"), { ssr: false });

interface StreetViewModalProps {
  lat: number;
  lng: number;
  onClose: () => void;
}

export default function StreetViewModal({ lat, lng, onClose }: StreetViewModalProps) {
  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Street View">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-4xl mx-4 p-4 shadow-xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-500 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex flex-col">
          <div className="mb-3 text-sm text-gray-500 font-semibold uppercase tracking-wider">
            Street View
          </div>
          <div className="w-full h-[65vh] bg-gray-100 rounded-lg overflow-hidden">
            <StreetViewEmbed lat={lat} lng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
}
