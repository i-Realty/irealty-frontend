"use client";

import React from 'react';
import { useFavouritesStore } from '@/lib/store/useFavouritesStore';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { standardProperties, developerProperties } from '@/lib/data/properties';
import { usePropertyStore } from '@/lib/store/usePropertyStore';
import { unifiedToListingProperty } from '@/lib/utils/propertyAdapter';
import { usePropertyModals } from '@/lib/hooks/usePropertyModals';

// Extracted sub-components
import PropertyGallery from '@/components/listings/PropertyGallery';
import PropertyInfoBar from '@/components/listings/PropertyInfoBar';
import PropertyTabs from '@/components/listings/PropertyTabs';
import SimilarProperties from '@/components/listings/SimilarProperties';
import DeveloperSidebar from '@/components/listings/DeveloperSidebar';

// Modals
import BookTourModal from '@/components/BookTourModal';
import PaymentOptionsModal from '@/components/PaymentOptionsModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import MapModal from '@/components/MapModal';
import ReserveModal from '@/components/ReserveModal';
import ReservePaymentModal from '@/components/ReservePaymentModal';
import ReserveConfirmationModal from '@/components/ReserveConfirmationModal';
import ChatModal from '@/components/ChatModal';

const BASE_PATH = '/listings/developers';

export default function PropertyDetails() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id || 0);

  // Search all property sources: developer, standard, and property store
  const { getVerifiedProperties } = usePropertyStore();
  const storeProps = getVerifiedProperties().map((p, i) => unifiedToListingProperty(p, i));
  const allProperties = [...developerProperties, ...standardProperties, ...storeProps];
  const prop = allProperties.find((p) => p.id === id);
  const propId = id;

  const { likedIds, toggleLike: toggleStoreLike } = useFavouritesStore();
  const liked = likedIds.has(String(propId));
  const modals = usePropertyModals();

  if (!prop) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-12">Property not found</div>
        <Footer />
      </div>
    );
  }

  function toggleLike(arg?: React.MouseEvent | number) {
    if (typeof arg === 'number') {
      toggleStoreLike(arg);
      return;
    }
    const e = arg as React.MouseEvent | undefined;
    e?.stopPropagation();
    toggleStoreLike(propId);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className={`max-w-7xl mx-auto px-4 py-8 ${modals.anyOpen ? 'filter blur-sm' : ''}`}>
          {/* Breadcrumb + actions */}
          <div className="flex items-center justify-between mb-4">
            <nav className="text-sm text-gray-500 mb-4">
              <button
                onClick={() => { try { router.back(); } catch { router.push(BASE_PATH); } }}
                className="text-blue-600 mr-2 underline"
              >
                Developer Listings
              </button>
              &gt; <span className="text-gray-800 font-semibold">Property Details</span>
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <button type="button" className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shadow-sm" aria-label="share">
                  <Image src="/icons/share.svg" alt="share" width={20} height={20} />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-full px-3 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                  Share
                </div>
              </div>
              <button type="button" onClick={toggleLike} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shadow-sm" aria-pressed={liked} aria-label={liked ? 'Unfavorite' : 'Favorite'}>
                <Image src={liked ? '/icons/favorite-filled.svg' : '/icons/favorite-dark.svg'} alt={liked ? 'favorited' : 'favorite'} width={20} height={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {/* Gallery */}
              <PropertyGallery
                property={prop}
                basePath={BASE_PATH}
                onViewMap={() => router.push(`${BASE_PATH}/${id}?viewMap=1`)}
              />

              {/* Title + Price */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{prop.title}</h1>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <Image src="/icons/locationblue.svg" alt="location" width={16} height={16} /> {prop.location}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-gray-900">{prop.price}</div>
              </div>

              {/* Info Bar */}
              <PropertyInfoBar property={prop} />

              {/* Tabs */}
              <PropertyTabs lat={prop.lat} lng={prop.lng} />
            </div>

            {/* Developer Sidebar with Payment Milestones */}
            <DeveloperSidebar property={prop} basePath={BASE_PATH} />
          </div>
        </div>

        {/* Full-bleed Similar Properties */}
        <SimilarProperties
          properties={developerProperties}
          hrefPrefix={BASE_PATH}
        />

        {/* Modal overlays */}
        {modals.showBookTour && <BookTourModal onClose={() => router.back()} />}
        {modals.showPayment && <PaymentOptionsModal onClose={() => router.back()} />}
        {modals.showSuccess && <BookingConfirmationModal onClose={() => router.back()} />}
        {modals.showMap && <MapModal lat={prop.lat} lng={prop.lng} onClose={() => router.back()} />}
        {modals.showChat && <ChatModal onClose={() => router.back()} />}
        {modals.showReserve && <ReserveModal onClose={() => router.back()} />}
        {modals.showReservePayment && <ReservePaymentModal onClose={() => router.back()} />}
        {modals.showReserveSuccess && <ReserveConfirmationModal onClose={() => router.back()} />}
      </main>
      <Footer />
    </>
  );
}
