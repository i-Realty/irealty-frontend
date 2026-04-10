'use client';

import { useState } from 'react';
import { useCreateProjectStore } from '@/lib/store/useCreateProjectStore';
import { ChevronDown, X, Plus } from 'lucide-react';
import { projectStep2Schema, extractErrors } from '@/lib/validations/wizard';

const DOCUMENT_TYPES = [
  'Deed Of Transfer', 'C Of O', 'Survey Plan', 'Purchase Receipt',
  'Power Of Attorney', 'Deed Of Conveyance', 'Deed Of Lease',
];

const AMENITIES_LIST = [
  '24hr Security', 'Swimming Pool', 'Gym', 'Garden', 'Parking Space',
  'Playground', 'BQ/Servant Quarters', 'Smart Home', 'Solar Power',
];

export default function Step2ProjectDetails() {
  const store = useCreateProjectStore();
  const [showAmenities, setShowAmenities] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [extraLandmarks, setExtraLandmarks] = useState<string[]>([]);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Basic Property Information</h2>

      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
        <input
          type="text"
          placeholder="e.g Residential Plot - GRA Enugu"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={store.projectName}
          onChange={(e) => store.setField('projectName', e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          placeholder="Describe your project's unique features and amenities..."
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          value={store.description}
          onChange={(e) => store.setField('description', e.target.value)}
        />
      </div>

      {/* Property Type + Total Units */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <div className="relative">
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={store.propertyTypeDropdown}
              onChange={(e) => store.setField('propertyTypeDropdown', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Detached Duplex">Detached Duplex</option>
              <option value="Semi-Detached Duplex">Semi-Detached Duplex</option>
              <option value="Terrace">Terrace</option>
              <option value="Apartment/Flat">Apartment/Flat</option>
              <option value="Bungalow">Bungalow</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
          <input
            type="text"
            placeholder="e.g. 30"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={store.totalUnits}
            onChange={(e) => store.setField('totalUnits', e.target.value)}
          />
        </div>
      </div>

      {/* Bathrooms, Bedrooms, Toilets */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <input type="text" placeholder="e.g.4" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.bathrooms} onChange={(e) => store.setField('bathrooms', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <input type="text" placeholder="e.g.4" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.bedrooms} onChange={(e) => store.setField('bedrooms', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Toilets</label>
          <input type="text" placeholder="e.g.4" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.toilets} onChange={(e) => store.setField('toilets', e.target.value)} />
        </div>
      </div>

      {/* Plot Size + Built-up Area */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plot Size (sqm)</label>
          <input type="text" placeholder="e.g.500" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.plotSizeSqm} onChange={(e) => store.setField('plotSizeSqm', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Built-up Area (sqm)</label>
          <input type="text" placeholder="e.g. 350" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.builtUpAreaSqm} onChange={(e) => store.setField('builtUpAreaSqm', e.target.value)} />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Start Date</label>
          <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.expectedStartDate} onChange={(e) => store.setField('expectedStartDate', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion Date</label>
          <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.expectedCompletionDate} onChange={(e) => store.setField('expectedCompletionDate', e.target.value)} />
        </div>
      </div>

      {/* State + City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <div className="relative">
            <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none" value={store.stateGeo} onChange={(e) => store.setField('stateGeo', e.target.value)}>
              <option value="">Select</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Enugu">Enugu</option>
              <option value="Rivers">Rivers</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <div className="relative">
            <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none" value={store.city} onChange={(e) => store.setField('city', e.target.value)}>
              <option value="">Select</option>
              <option value="Ikeja">Ikeja</option>
              <option value="Lekki">Lekki</option>
              <option value="Enugu">Enugu</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Full Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
        <input type="text" placeholder="Enter Complete Property Address" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.fullAddress} onChange={(e) => store.setField('fullAddress', e.target.value)} />
      </div>

      {/* Document Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
        <p className="text-xs text-gray-400 mb-2">You can select more than one</p>
        <div className="flex flex-wrap gap-2">
          {DOCUMENT_TYPES.map((doc) => (
            <label key={doc} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={store.documentTypes.includes(doc)}
                onChange={() => store.toggleDocumentType(doc)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{doc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {store.amenities.map((a) => (
            <span key={a} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              {a}
              <button onClick={() => store.removeAmenity(a)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={() => setShowAmenities(true)}
          className="text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
        >
          Choose
        </button>

        {showAmenities && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowAmenities(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Amenities</h3>
                <button onClick={() => setShowAmenities(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-gray-500 mb-4">You can select more than one</p>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((a) => {
                  const isSelected = store.amenities.includes(a);
                  return (
                    <button
                      key={a}
                      onClick={() => isSelected ? store.removeAmenity(a) : store.addAmenity(a)}
                      className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                        isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center mt-6">
                <button onClick={() => setShowAmenities(false)} className="bg-blue-600 text-white font-medium py-2.5 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Landmarks</label>
        <input type="text" placeholder="Enter Landmark" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={store.landmark} onChange={(e) => store.setField('landmark', e.target.value)} />
        <button
          type="button"
          onClick={() => {
            if (store.landmark.trim()) {
              setExtraLandmarks((prev) => [...prev, store.landmark]);
              store.setField('landmark', '');
            }
          }}
          className="text-blue-600 text-sm font-medium mt-2 flex items-center gap-1 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Another
        </button>
        {extraLandmarks.map((lm, i) => (
          <div key={i} className="flex items-center gap-2 mt-2">
            <input type="text" value={lm} readOnly className="flex-1 border border-gray-100 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-700" />
            <button type="button" onClick={() => setExtraLandmarks((prev) => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button onClick={store.prevStep} className="text-gray-600 font-medium py-3 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button
          onClick={() => {
            const result = projectStep2Schema.safeParse({ projectName: store.projectName, stateGeo: store.stateGeo, city: store.city, fullAddress: store.fullAddress });
            if (!result.success) { setErrors(extractErrors(result.error)); return; }
            setErrors({});
            store.nextStep();
          }}
          className="font-medium py-3 px-8 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
        >
          Proceed
        </button>
        {Object.keys(errors).length > 0 && (
          <p className="text-red-500 text-xs mt-2 text-right">{Object.values(errors)[0]}</p>
        )}
      </div>
    </div>
  );
}
