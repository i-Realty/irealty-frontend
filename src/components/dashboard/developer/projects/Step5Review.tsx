'use client';

import { useCreateProjectStore } from '@/lib/store/useCreateProjectStore';
import Image from 'next/image';
import { CheckCircle2, MapPin } from 'lucide-react';

export default function Step5Review() {
  const store = useCreateProjectStore();

  const handleSubmit = async () => {
    await store.submitProject();
  };

  const previewImage = store.media[0] || '/images/property-placeholder.jpg';

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
          <CheckCircle2 className="w-7 h-7 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-sm text-gray-500 mt-1">Review your listing, hit submit, and you&apos;re done!</p>
      </div>

      {/* Preview Card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="relative h-48">
          <Image src={previewImage} alt="Preview" fill className="object-cover" />
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">
            For Sale
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900">{store.projectName || 'Untitled Project'}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {store.fullAddress || 'Independence Layout, Enugu'}
          </p>
          <p className="text-base font-bold text-gray-900 mt-3">
            &#8358; 20,000,000.00
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {store.bedrooms || '3'} beds &bull; {store.bathrooms || '2'} baths &bull; {store.plotSizeSqm || '120'} sqm
          </p>
        </div>
      </div>

      {/* Milestones Summary */}
      {store.milestones.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">Payment Milestones</h3>
          <div className="space-y-2">
            {store.milestones.map((m, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-600">{m.name || `Milestone ${i + 1}`}</span>
                <span className="font-bold text-gray-900">{m.percentageOfTotal}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button onClick={store.prevStep} className="text-gray-600 font-medium py-3 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={store.isLoading}
          className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {store.isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
          {store.isEditMode ? (store.isLoading ? 'Saving...' : 'Save Changes') : (store.isLoading ? 'Submitting...' : 'Submit')}
        </button>
      </div>
    </div>
  );
}
