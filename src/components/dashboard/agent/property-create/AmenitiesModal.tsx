'use client';

import { useEffect, useState } from 'react';
import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { useMarketplaceStore } from '@/lib/store/useMarketplaceStore';
import { X } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

const AMENITIES_MAP: Record<string, string[]> = {
  'Residential': [
    'POP Ceiling', 'Kitchen-Fitted', 'En-suite', 'Security Access / CCTV',
    'Swimming Pool', 'Gym Facility', 'Balcony', 'Boys Quarters'
  ],
  'Commercial': [
    'Office Rooms / Workspaces', 'Conference Room', 'Reception Area',
    'Storage / Warehouse Space', 'Parking Space (Staff & Visitors)',
    'Security Access / CCTV', 'Elevator / Escalator', 'Power Backup (Inverter / Generator)',
    'Internet & Networking Infrastructure', 'Fire Safety (Alarms, Extinguishers)',
    'Air Conditioning / Ventilation', 'Loading Bay / Delivery Access', 'Restrooms'
  ],
  'Plots/Lands': [
    'Road Access', 'Fenced / Gated', 'Drainage System', 'Electricity Supply Access',
    'Water Supply Access', 'Dry Soil', 'Swampy Soil', 'Rocky Soil',
    'Sloped Topography', 'Flat Topography', 'Secure Neighborhood'
  ],
  'Service Apartments & Short Lets': [
    'Furnished Living Room', 'Equipped Kitchen', 'Wi-Fi', 'Smart TV / Cable TV',
    'Housekeeping / Cleaning Service', 'Towels & Linens', 'Air Conditioning',
    'Swimming Pool', 'Gym / Fitness Center', 'Parking Space', 'Security (24/7, CCTV)',
    'Elevator Access', 'Balcony with View'
  ],
  'PG/Hostel': [
    'Shared Rooms / Private Rooms', 'Shared Bathrooms', 'Study / Reading Area',
    'Shared Kitchen', 'Common Lounge / TV Room', 'Laundry Facilities',
    'Wi-Fi Access', 'Power Backup', 'Security (Gate, CCTV)', 'Parking for Residents',
    'Mess / Cafeteria', 'Elevator Access', 'Balcony with View'
  ],
  'fallback': ['Wi-Fi', 'Parking', 'Security']
};

export default function AmenitiesModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const { propertyType, amenities, addAmenity, removeAmenity } = useCreatePropertyStore();
  const fetchAmenities = useMarketplaceStore((s) => s.fetchAmenities);
  const [apiAmenities, setApiAmenities] = useState<string[] | null>(null);

  // Try fetching amenities from the backend; fall back to local map on failure
  useEffect(() => {
    if (!propertyType) return;
    let cancelled = false;
    fetchAmenities(propertyType).then((result) => {
      if (!cancelled && result.length > 0) setApiAmenities(result);
    });
    return () => { cancelled = true; };
  }, [propertyType, fetchAmenities]);

  const localOptions = propertyType && AMENITIES_MAP[propertyType]
    ? AMENITIES_MAP[propertyType]
    : AMENITIES_MAP['fallback'];
  const options = apiAmenities ?? localOptions;

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Select amenities">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="pt-8 pb-4 px-6 text-center relative border-b border-gray-100">
           <button 
             onClick={onClose}
             className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
           <h3 className="text-2xl font-bold text-gray-900 mb-1">Select Amenities</h3>
           <p className="text-sm text-blue-400">You can select more than one:</p>
        </div>
        
        <div className="p-8 overflow-y-auto w-full flex-1">
           <div className="flex flex-wrap justify-center gap-3">
             {options.map(opt => {
               const isSelected = amenities.includes(opt);
               return (
                 <button
                   key={opt}
                   onClick={() => isSelected ? removeAmenity(opt) : addAmenity(opt)}
                   className={`px-4 py-2 text-[13px] font-medium rounded-full border transition-all ${
                     isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                   }`}
                 >
                   {opt}
                 </button>
               )
             })}
           </div>
        </div>

        <div className="p-6 text-center bg-gray-50 border-t border-gray-100 flex justify-center">
            <button 
              onClick={onClose}
              className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-12 py-2.5 rounded-lg transition-colors w-full max-w-[200px]"
            >
               Continue
            </button>
        </div>
      </div>
    </div>
  );
}
