'use client';

import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { Home, Compass, Building, DoorOpen, BedDouble, ChevronDown } from 'lucide-react';

const PROPERTY_CATEGORIES = [
  { id: 'Residential', label: 'Residential', icon: Home, desc: 'Apartments, duplexes, bungalows' },
  { id: 'Commercial', label: 'Commercial', icon: Building, desc: 'Offices, shops, plazas' },
  { id: 'Plots/Lands', label: 'Land', icon: Compass, desc: 'Empty plots, agriculture' },
  { id: 'Service Apartments & Short Lets', label: 'Short-let', icon: DoorOpen, desc: 'Nightly & weekly rentals' },
  { id: 'PG/Hostel', label: 'PG / Hostel', icon: BedDouble, desc: 'Shared student spaces' },
];

export default function Step1PropertyType() {
  const { 
    propertyType, listingType, propertyStatus, 
    setField, nextStep 
  } = useCreatePropertyStore();

  const isComplete = propertyType && listingType && propertyStatus;

  return (
    <div className="max-w-3xl mx-auto flex flex-col pt-6 pb-20">
      
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Property Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PROPERTY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = propertyType === cat.id;
            return (
              <label 
                key={cat.id} 
                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border transition-all ${
                  isSelected ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="propertyType" 
                  value={cat.id}
                  checked={isSelected}
                  onChange={() => setField('propertyType', cat.id as any)}
                  className="sr-only"
                />
                <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className={`font-semibold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{cat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
                
                {isSelected && (
                   <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-600 border-[3px] border-white shadow-sm"></div>
                )}
              </label>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-800 mb-2">Listing Type</label>
          <div className="relative">
            <select 
              onChange={(e) => setField('listingType', e.target.value as any)}
              className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="" disabled>Select Listing Type</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-800 mb-2">Property Status</label>
          <div className="relative">
            <select 
              onChange={(e) => setField('propertyStatus', e.target.value as any)}
              className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="" disabled>Select Status</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Ready">Ready / Built</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-auto">
        <button 
          onClick={nextStep}
          disabled={!isComplete}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            isComplete ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Proceed to Next Step
        </button>
      </div>
    </div>
  );
}
