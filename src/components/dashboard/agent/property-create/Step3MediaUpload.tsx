'use client';

import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { UploadCloud, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function Step3MediaUpload() {
  const { 
    media, virtualTourUrl, 
    setField, addMedia, removeMedia,
    prevStep, nextStep 
  } = useCreatePropertyStore();

  const handleMockUpload = () => {
    // In reality, this would open a file picker and upload to S3/Cloudinary.
    // For now we just push a placeholder unsplash image.
    const mockImages = [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ];
    if (media.length < 5) {
       addMedia(mockImages[media.length % mockImages.length]);
    } else {
       alert("Max 5 images allowed for demo.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col pt-6 pb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">Media Information</h3>
      <p className="text-sm text-gray-500 mb-8">Upload clear, high-quality media highlighting the best angles of the property.</p>
      
      <div className="space-y-8">
        
        {/* Drag and drop zone */}
        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 block">Upload Images</label>
          <div 
             onClick={handleMockUpload}
             className="w-full border border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
             <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
               <UploadCloud className="w-8 h-8 text-blue-500" />
             </div>
             <p className="text-sm font-medium text-blue-600 mb-1">Click to Upload or Drag and Drop here</p>
             <p className="text-xs text-gray-500">Supports JPG, PNG (Max 5MB)</p>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((url, idx) => (
               <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image src={url} alt={`Upload ${idx}`} fill className="object-cover" />
                  <button 
                    onClick={() => removeMedia(idx)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
               </div>
            ))}
          </div>
        )}

        {/* Video / Virtual Tour Link */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-semibold text-gray-800 mb-3 block">Virtual Tour Link (Optional)</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon className="w-4 h-4 text-gray-400" />
             </div>
             <input 
               type="url"
               value={virtualTourUrl}
               onChange={(e) => setField('virtualTourUrl', e.target.value)}
               placeholder="Youtube / Matterport Link (e.g https://youtube.com/watch...)"
               className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500"
             />
          </div>
        </div>

      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-10 mt-auto border-t border-gray-100">
        <button 
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={media.length === 0}
          className="px-8 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
