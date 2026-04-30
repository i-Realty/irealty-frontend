'use client';

import { useRef, useState } from 'react';
import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { uploadFile } from '@/lib/services/upload';
import { UploadCloud, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
];

export default function Step3MediaUpload() {
  const {
    media, virtualTourUrl,
    setField, addMedia, removeMedia,
    prevStep, nextStep,
  } = useCreatePropertyStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const MAX_IMAGES = 10;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = MAX_IMAGES - media.length;
    if (remaining <= 0) return;

    setUploadError('');

    if (!USE_API) {
      // Mock mode — use placeholder images
      Array.from(files).slice(0, remaining).forEach((_, i) => {
        addMedia(MOCK_IMAGES[(media.length + i) % MOCK_IMAGES.length]);
      });
      return;
    }

    setUploading(true);
    const toUpload = Array.from(files).slice(0, remaining);
    const errors: string[] = [];

    for (const file of toUpload) {
      try {
        const url = await uploadFile(file);
        addMedia(url);
      } catch {
        errors.push(file.name);
      }
    }

    setUploading(false);
    if (errors.length > 0) {
      setUploadError(`Failed to upload: ${errors.join(', ')}`);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col pt-6 pb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">Media Information</h3>
      <p className="text-sm text-gray-500 mb-8">Upload clear, high-quality media highlighting the best angles of the property.</p>

      <div className="space-y-8">

        {/* Drop zone */}
        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 block">
            Upload Images <span className="text-gray-400 font-normal">({media.length}/{MAX_IMAGES})</span>
          </label>

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`w-full border border-dashed rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/50 transition-colors group
              ${uploading ? 'cursor-wait border-blue-300' : 'cursor-pointer hover:bg-gray-50 border-gray-300'}`}
          >
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              {uploading
                ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                : <UploadCloud className="w-8 h-8 text-blue-500" />}
            </div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              {uploading ? 'Uploading…' : 'Click to Upload or Drag and Drop here'}
            </p>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP (Max 5MB each)</p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {uploadError && (
            <p className="text-xs text-red-500 mt-2">{uploadError}</p>
          )}
        </div>

        {/* Thumbnail grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image src={url} alt={`Upload ${idx + 1}`} fill className="object-cover" />
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

        {/* Virtual tour link */}
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
          disabled={media.length === 0 || uploading}
          className="px-8 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
