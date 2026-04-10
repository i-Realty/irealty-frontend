'use client';

import { useState, useMemo } from 'react';
import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { ChevronDown, X, Plus } from 'lucide-react';
import AmenitiesModal from './AmenitiesModal';
import { propertyStep2Schema, extractErrors } from '@/lib/validations/wizard';
import { getStateNames, getLGAsForState } from '@/lib/data/nigeriaLocations';

export default function Step2PropertyDetails() {
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [landmarkInput, setLandmarkInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const {
    propertyType,
    title, description, stateGeo, lga, city, address,
    bedrooms, bathrooms, sizeSqm, landmarks,
    unitsFloors, parkingCapacity, floorAreaSqm,
    documentTypes, zoningType, landSizeSqm,
    shortLetRateType, pgRoomType, pgUtilitiesIncluded,
    amenities,
    setField, prevStep, nextStep,
    addLandmark, removeLandmark, toggleDocumentType,
    removeAmenity
  } = useCreatePropertyStore();

  const allStates = useMemo(() => getStateNames(), []);
  const lgasForState = useMemo(() => stateGeo ? getLGAsForState(stateGeo) : [], [stateGeo]);

  // Clear LGA when state changes
  const handleStateChange = (newState: string) => {
    setField('stateGeo' as any, newState);
    setField('lga' as any, '');
  };

  const handleLandmarkAdd = () => {
    if (landmarkInput.trim()) {
      addLandmark(landmarkInput);
      setLandmarkInput('');
    }
  };

  const renderSelect = (label: string, fieldKey: string, value: string, options: string[]) => (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-semibold text-gray-800 mb-2">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => setField(fieldKey as any, e.target.value)}
          className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="" disabled>Select</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  const renderInput = (label: string, fieldKey: string, value: string, placeholder: string = '') => (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-semibold text-gray-800 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => { setField(fieldKey as any, e.target.value); setErrors((prev) => { const next = { ...prev }; delete next[fieldKey]; return next; }); }}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white border rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 ${errors[fieldKey] ? 'border-red-300' : 'border-gray-200'}`}
      />
      {errors[fieldKey] && <p className="text-red-500 text-xs mt-1">{errors[fieldKey]}</p>}
    </div>
  );

  const isLand = propertyType === 'Plots/Lands';

  return (
    <div className="max-w-2xl mx-auto flex flex-col pt-6 pb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Basic Property Information</h3>
      
      <div className="space-y-6">
        {/* Title */}
        {renderInput('Property Title', 'title', title, 'e.g Residential Plot - GRA Enugu')}
        
        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-800 mb-2">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Describe your property, highlighting key features and amenities..."
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Location Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-sm font-semibold text-gray-800 mb-2">State</label>
            <div className="relative">
              <select
                value={stateGeo}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="" disabled>Select State</option>
                {allStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm font-semibold text-gray-800 mb-2">LGA</label>
            <div className="relative">
              <select
                value={lga}
                onChange={(e) => setField('lga', e.target.value)}
                disabled={!stateGeo}
                className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">{stateGeo ? 'Select LGA' : 'Select state first'}</option>
                {lgasForState.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {renderInput('City / Area', 'city', city, 'e.g. Lekki Phase 1, GRA, Bodija')}</div>
        
        {renderInput('Full Address', 'address', address, 'Enter Complete Property Address')}

        {/* Dynamic Fields Array based on propertyType */}
        {!isLand ? (
          <div className="flex flex-col sm:flex-row gap-4">
             {propertyType !== 'Commercial' && renderSelect('Bedrooms', 'bedrooms', bedrooms, ['1', '2', '3', '4', '5', '6+'])}
             {propertyType !== 'Commercial' && renderSelect('Bathroom', 'bathrooms', bathrooms, ['1', '2', '3', '4', '5+'])}
             {renderInput('Size (sqm)', 'sizeSqm', sizeSqm, 'e.g 120')}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
             {renderSelect('Zoning Type', 'zoningType', zoningType, ['Residential', 'Commercial', 'Mixed Use', 'Agricultural'])}
             {renderInput('Land Size (sqm)', 'landSizeSqm', landSizeSqm, 'e.g 600')}
          </div>
        )}

        {isLand && (
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-800 mb-3">Document Type</label>
            <div className="flex flex-wrap gap-3">
              {['C of O', 'Survey Plan', 'Deed of Assignment', 'Excision', 'Gazette'].map(doc => {
                 const isChecked = documentTypes.includes(doc);
                 return (
                   <button 
                      key={doc}
                      onClick={() => toggleDocumentType(doc)}
                      className={`px-4 py-2 text-sm rounded-full border transition-colors ${isChecked ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}
                   >
                     {doc}
                   </button>
                 );
              })}
            </div>
          </div>
        )}

        {/* Amenities Tagger */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-800 mb-3">Amenities</label>
          <div className="bg-gray-50/50 p-4 border border-dashed border-gray-200 rounded-xl min-h-[80px] flex flex-wrap gap-2 items-center">
             {amenities.map(am => (
               <div key={am} className="flex items-center gap-1 bg-blue-600 text-white pl-3 pr-1 py-1 rounded-full text-xs font-medium">
                 {am}
                 <button onClick={() => removeAmenity(am)} className="p-0.5 hover:bg-white/20 rounded-full transition-colors">
                   <X className="w-3.5 h-3.5" />
                 </button>
               </div>
             ))}
             <button 
               onClick={() => setIsAmenitiesOpen(true)}
               className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 flex items-center gap-1 bg-white shadow-sm"
             >
               + Choose
             </button>
          </div>
        </div>

        {/* Landmarks */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-800 mb-2">Landmark</label>
          <div className="space-y-3">
            {landmarks.map((lm, idx) => (
              <div key={idx} className="flex relative">
                 <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">{lm}</div>
                 <button onClick={() => removeLandmark(idx)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                   <X className="w-4 h-4" />
                 </button>
              </div>
            ))}
            
            <div className="flex relative">
              <input 
                type="text" 
                value={landmarkInput}
                onChange={(e) => setLandmarkInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleLandmarkAdd(); } }}
                placeholder="Enter Landmark"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
              />
            </div>
            
            <button 
              onClick={handleLandmarkAdd}
              disabled={!landmarkInput.trim()}
              className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add Another
            </button>
          </div>
        </div>
        
      </div>

      <div className="flex items-center justify-between pt-10 mt-auto border-t border-gray-100">
        <button 
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
        >
          Back
        </button>
        <button
          onClick={() => {
            const result = propertyStep2Schema.safeParse({ title, stateGeo, city, address });
            if (!result.success) { setErrors(extractErrors(result.error)); return; }
            setErrors({});
            nextStep();
          }}
          className="px-8 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all"
        >
          Proceed
        </button>
      </div>

      {isAmenitiesOpen && <AmenitiesModal onClose={() => setIsAmenitiesOpen(false)} />}
    </div>
  );
}
