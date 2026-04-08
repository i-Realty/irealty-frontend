"use client";

import React from "react";
import type { PropertyWithCoords } from "@/lib/types";
import Image from 'next/image';

interface PropertyGalleryProps {
  property: PropertyWithCoords;
  /** Base path for links, e.g. "/listings" or "/listings/developers" */
  basePath: string;
  onViewMap: () => void;
}

/**
 * Image grid with virtual-tour and view-on-map overlay buttons.
 * Shows a main image (2×2 span), two thumbnails, and a "+9" overlay.
 */
export default function PropertyGallery({ property, basePath, onViewMap }: PropertyGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="sm:col-span-2 sm:row-span-2 rounded-lg overflow-hidden relative">
        <Image src={property.image ?? '/images/property1.png'} alt={property.title} className="w-full h-[240px] sm:h-[320px] lg:h-[420px] object-cover"  width={800} height={500} />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2 sm:gap-3">
          <a href={`${basePath}/${property.id}/virtual-tour?start=0`} className="bg-white/90 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 border">
            <div className="w-4 h-4 bg-red-300 flex items-center justify-center rounded-[50%]">
              <Image src="/icons/virtualtouricon.svg" className="w-2 h-2" alt="vt"  width={8} height={8} />
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold">Virtual Tour</span>
          </a>
          <button onClick={onViewMap} className="bg-white/90 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 border">
            <Image src="/icons/viewonmap.svg" className="w-4 h-4" alt="map"  width={16} height={16} />
            <span className="text-[10px] sm:text-xs font-extrabold">View On Map</span>
          </button>
        </div>
        {property.tag && (
          <div className="absolute bottom-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${property.tag === 'For Sale' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} aria-label={`Property ${property.tag}`}>
              {property.tag}
            </span>
          </div>
        )}
      </div>

      <div className="hidden sm:block rounded-lg overflow-hidden">
        <Image src={property.image ?? '/images/property1.png'} alt="thumb" className="w-full h-[155px] lg:h-[205px] object-cover"  width={800} height={500} />
      </div>
      <div className="hidden sm:block rounded-lg overflow-hidden">
        <Image src={property.image ?? '/images/property1.png'} alt="thumb" className="w-full h-[155px] lg:h-[205px] object-cover"  width={800} height={500} />
      </div>
    </div>
  );
}
