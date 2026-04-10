'use client';

import { useCreateProjectStore } from '@/lib/store/useCreateProjectStore';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop',
];

export default function Step4MediaUpload() {
  const { media, addMedia, removeMedia, setField, prevStep, nextStep } = useCreateProjectStore();

  const handleUploadClick = () => {
    if (media.length < 10) {
      const nextImage = PLACEHOLDER_IMAGES[media.length % PLACEHOLDER_IMAGES.length];
      addMedia(nextImage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Upload Photos & Media Upload Of Your Listing</h2>
        <p className="text-sm text-gray-500 mt-1">Upload one or more pictures of your listings & drag them to reorder</p>
      </div>

      {/* Upload Zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleUploadClick}
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-3">
          <UploadCloud className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">
          Drop your Images & Videos here, or <span className="text-blue-600 font-medium">click to upload</span>
        </p>
      </div>

      {/* Uploaded Thumbnails */}
      {media.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {media.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image src={url} alt={`Upload ${index + 1}`} fill className="object-cover" />
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Virtual Tour */}
      <div className="border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">360</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Virtual Tour</h3>
            <p className="text-xs text-gray-500">360° property walkthrough</p>
          </div>
        </div>
        <button
          className="border border-blue-200 text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={() => setField('virtualTourUrl', 'https://example.com/tour')}
        >
          Add Virtual Tour
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button onClick={prevStep} className="text-gray-600 font-medium py-3 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={media.length === 0}
          className={`font-medium py-3 px-8 rounded-lg transition-colors ${
            media.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-300 text-white cursor-not-allowed'
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
