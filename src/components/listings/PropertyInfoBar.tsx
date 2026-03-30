import React from "react";
import type { PropertyWithCoords } from "@/lib/types";

interface PropertyInfoBarProps {
  property: PropertyWithCoords;
}

/**
 * Horizontal info strip showing property type, area, beds, and date added.
 */
export default function PropertyInfoBar({ property }: PropertyInfoBarProps) {
  const dateFormatted = property.listedAt
    ? new Date(property.listedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
    : 'N/A';

  return (
    <div className="mt-6">
      <div className="bg-gray-50 rounded-xl shadow-sm p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-0 text-center sm:divide-x divide-gray-200">
          <div className="px-2 sm:px-4">
            <div className="font-semibold text-sm sm:text-base mt-1 capitalize">{property.category || 'Property'}</div>
            <div className="text-xs text-gray-500">Property Type</div>
          </div>
          <div className="px-2 sm:px-4">
            <div className="font-semibold text-sm sm:text-base mt-1">{property.area || 'N/A'}</div>
            <div className="text-xs text-gray-500">Total Area</div>
          </div>
          <div className="px-2 sm:px-4">
            <div className="font-semibold text-sm sm:text-base mt-1">{property.beds || 0}</div>
            <div className="text-xs text-gray-500">Beds</div>
          </div>
          <div className="px-2 sm:px-4">
            <div className="font-semibold text-sm sm:text-base mt-1">{dateFormatted}</div>
            <div className="text-xs text-gray-500">Date Added</div>
          </div>
        </div>
      </div>
    </div>
  );
}
