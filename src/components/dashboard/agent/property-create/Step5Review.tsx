'use client';

import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { useAgentPropertiesStore } from '@/lib/store/useAgentPropertiesStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';

export default function Step5Review() {
  const router = useRouter();
  const store = useCreatePropertyStore();
  
  const {
    title, address, media,
    listingType, propertyType,
    salePrice, rentPrice, rentPriceType,
    bedrooms, bathrooms, sizeSqm, landSizeSqm,
    isLoading, isEditMode, editingPropertyId,
    submitProperty, prevStep, closeWizard
  } = store;

  const { addPropertyLocally, updatePropertyLocally } = useAgentPropertiesStore();

  const handleSubmit = async () => {
    const wasEditMode = isEditMode;
    const property = await submitProperty();
    if (property) {
      if (wasEditMode) {
        updatePropertyLocally(property);
      } else {
        addPropertyLocally(property);
      }
      router.push('/dashboard/agent/properties');
    }
  };

  const priceToFormat = listingType === 'For Sale' ? Number(salePrice) : Number(rentPrice);
  const isSale = listingType === 'For Sale';
  
  const formatPrice = (price: number) => {
    if (isNaN(price)) return '₦ 0.00';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(price).replace('NGN', '₦');
  };

  // Preview formatting
  const stats = [
    bedrooms ? `${bedrooms} beds` : null,
    bathrooms ? `${bathrooms} baths` : null,
    propertyType === 'Plots/Lands' ? `${landSizeSqm} sqm` : (sizeSqm ? `${sizeSqm} sqm` : null),
  ].filter(Boolean).join(' • ');

  return (
    <div className="max-w-xl mx-auto flex flex-col pt-6 pb-12">
      <div className="flex flex-col items-center text-center mb-8">
         <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
         </div>
         <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Summary</h3>
         <p className="text-sm text-gray-500">Ensure all details are correct before publishing your listing.</p>
      </div>
      
      {/* Preview Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div className="relative h-48 w-full bg-gray-100">
           {media.length > 0 ? (
              <Image src={media[0]} alt="Preview Cover" fill className="object-cover" />
           ) : (
             <div className="flex items-center justify-center w-full h-full text-gray-400">No Image Uploaded</div>
           )}
           <div className="absolute top-3 left-3 z-10">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${isSale ? 'bg-blue-600' : 'bg-green-600'}`}>
                {listingType}
              </span>
           </div>
        </div>

        <div className="p-5">
           <h4 className="font-bold text-gray-900 text-lg mb-1">{title || 'Untitled Property'}</h4>
           <p className="flex items-center text-sm text-gray-500 mb-4">
             <MapPin className="w-4 h-4 mr-1shrink-0 text-blue-500" />
             {address || 'No address provided'}
           </p>
           
           <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-baseline gap-1">
                 <span className="text-xl font-bold text-gray-900">{formatPrice(priceToFormat)}</span>
                 {!isSale && rentPriceType && <span className="text-xs text-gray-500">/ {rentPriceType.replace('Per ', '')}</span>}
              </div>
              <div className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full">
                 {stats || propertyType}
              </div>
           </div>
        </div>
      </div>

      {store.error && (
         <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {store.error}
         </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button 
          onClick={prevStep}
          disabled={isLoading}
          className="flex items-center justify-center px-6 py-3 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center px-8 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               {isEditMode ? 'Saving...' : 'Publishing...'}
             </span>
          ) : (
             isEditMode ? 'Save Changes' : 'Proceed to Publish'
          )}
        </button>
      </div>
    </div>
  );
}
