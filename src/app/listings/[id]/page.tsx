"use client";

import React, { useState, useEffect } from 'react';
import { isFavorited, toggleFavorite as toggleFavLocal, getFavorites } from '@/lib/favorites';
import Link from 'next/link';
import BookTourModal from '@/components/BookTourModal';
import PaymentOptionsModal from '@/components/PaymentOptionsModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import MapModal from '@/components/MapModal';
import ReserveModal from '@/components/ReserveModal';
import ReservePaymentModal from '@/components/ReservePaymentModal';
import ReserveConfirmationModal from '@/components/ReserveConfirmationModal';
import { useSearchParams } from 'next/navigation';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  tag?: "For Rent" | "For Sale";
  image?: string;
  agent?: string;
  agentId?: number;
};

// replicate the same sample data shape from listings page (static for now)
const agentNames = ['Sarah Homes', 'Kelly Williams', 'John Ade'];

const sampleProperties: Property[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: 'Residential Plot - GRA Enugu',
  location: 'Independence Layout, Enugu',
  price: '₦ 20,000,000.00',
  beds: 3,
  baths: 2,
  area: '120 sqm',
  tag: i % 2 === 0 ? 'For Rent' : 'For Sale',
  image: i % 2 === 0 ? '/images/property1.png' : '/images/property2.png',
  agent: agentNames[i % agentNames.length],
  agentId: (i % agentNames.length) + 1,
}));

export default function PropertyDetails() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id || 0);
  const prop = sampleProperties.find((p) => p.id === id);

  // derive propId from the route id so hooks can be defined unconditionally
  const propId = id;

  // Hooks must be called at the top level (before any early returns)
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'description'|'amenities'|'documents'|'landmarks'>('description');
  // description expand toggle
  const [showFullDesc, setShowFullDesc] = useState(false);

  // liked ids for similar properties
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  // derive modal states from URL so navigation (and browser Back) works naturally
  const searchParams = useSearchParams();
  const showBookTour = Boolean(searchParams?.get('bookTour'));
  const showPayment = Boolean(searchParams?.get('bookTourPayment'));
  const showSuccess = Boolean(searchParams?.get('bookTourSuccess'));
  const showMap = Boolean(searchParams?.get('viewMap'));
  const showReserve = Boolean(searchParams?.get('reserve'));
  const showReservePayment = Boolean(searchParams?.get('reservePayment'));
  const showReserveSuccess = Boolean(searchParams?.get('reserveSuccess'));

  // Hook: initialize favorites set and subscribe to changes (must run unconditionally)
  useEffect(() => {
    setLikedIds(new Set(getFavorites()));
    function onFavChange() {
      setLikedIds(new Set(getFavorites()));
    }
    window.addEventListener('favorites-changed', onFavChange as EventListener);
    return () => window.removeEventListener('favorites-changed', onFavChange as EventListener);
  }, []);

  // Hook: track liked state for the current property (must run unconditionally)
  useEffect(() => {
    setLiked(isFavorited(propId));
    function onChange() {
      setLiked(isFavorited(propId));
    }
    window.addEventListener('favorites-changed', onChange as EventListener);
    return () => window.removeEventListener('favorites-changed', onChange as EventListener);
  }, [propId]);

  if (!prop) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-12">Property not found</div>
        <Footer />
      </div>
    );
  }
  const fullDescription = [
    "This residential project is designed to offer residents a high level of luxury and comfort in their daily living. Key features include premium amenities such as a fully equipped fitness center, landscaped outdoor areas, a swimming pool, and communal spaces for recreation and social activities.",
    "The apartments feature spacious floor plans with modern interiors, incorporating high-quality finishes like durable flooring, efficient cabinetry, and contemporary fixtures. Open layouts include large windows and balconies to facilitate natural ventilation and daylight, which contribute to energy efficiency and a healthier indoor environment.",
    "The property is situated in a strategically accessible location, providing convenient connections to major transportation routes, commercial centers, educational institutions, and medical facilities. Modern infrastructure is integrated throughout the development, including smart home technologies for lighting, temperature control, and security systems. Sustainable practices, such as energy-efficient appliances and water conservation measures, are incorporated to reduce environmental impact.",
  ];

  const features = [
    'Fully equipped fitness center',
    'Swimming pool',
    'Landscaped outdoor areas',
    '24/7 security',
    'Backup power',
    'Ample parking',
  ];

  const previewDescription = fullDescription[0].length > 220 ? fullDescription[0].slice(0, 220) + '...' : fullDescription[0];

  

  function toggleLike(arg?: React.MouseEvent | number) {
    // If called with a number, toggle that property's favorite
    if (typeof arg === 'number') {
      const id = arg;
      const newVal = toggleFavLocal(id);
      setLikedIds((prev) => {
        const s = new Set(prev);
        if (newVal) s.add(id); else s.delete(id);
        return s;
      });
      return;
    }

    // Called as event for main property
    const e = arg as React.MouseEvent | undefined;
    e?.stopPropagation();
    const newVal = toggleFavLocal(propId);
    setLiked(newVal);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
      <div className={`max-w-7xl mx-auto px-4 py-8 ${(showBookTour || showPayment || showSuccess || showMap || showReserve || showReservePayment || showReserveSuccess) ? 'filter blur-sm' : ''}`}>
          <div className="flex items-center justify-between mb-4">
           <nav className="text-sm text-gray-500 mb-4">
            <button
              onClick={() => {
                try { router.back(); } catch { router.push('/listings'); }
              }}
              className="text-blue-600 mr-2 underline"
            >
              All Properties
            </button>
            &gt; <span className="text-gray-800 font-semibold">Property Details</span>
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <button type="button" className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shadow-sm" aria-label="share">
                  <img src="/icons/share.svg" alt="share" className="w-5 h-5" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-full px-3 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                  Share
                </div>
              </div>
              <button type="button" onClick={toggleLike} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shadow-sm" aria-pressed={liked} aria-label={liked ? 'Unfavorite' : 'Favorite'}>
                <img src={liked ? '/icons/favorite-filled.svg' : '/icons/favorite-dark.svg'} alt={liked ? 'favorited' : 'favorite'} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {/* Gallery */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 row-span-2 rounded-lg overflow-hidden relative">
                  <img src={prop.image} alt={prop.title} className="w-full h-[420px] object-cover" />
                  <div className="absolute top-4 left-4 flex gap-3">
                    <button type="button" onClick={() => router.push(`/listings/${id}/virtual-tour?start=0`)} className="bg-white/90 px-3 py-2 rounded-lg flex items-center gap-2 border"><div className='w-4 h-4 bg-red-300 flex items-center justify-center rounded-[50%]'><img src="/icons/virtualtouricon.svg" className="w-2 h-2 " alt="vt"/></div> <span className="text-xs font-extrabold">Virtual Tour</span></button>
                    <button onClick={() => router.push(`/listings/${id}?viewMap=1`)} className="bg-white/90 px-3 py-2 rounded-lg flex items-center gap-2 border"><img src="/icons/viewonmap.svg" className="w-4 h-4" alt="map"/> <span className="text-xs font-extrabold">View On Map</span></button>
                  </div>
                  {prop.tag && (
                    <div className="absolute bottom-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold  ${prop.tag === 'For Sale' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} aria-label={`Property ${prop.tag}`}>
                        {prop.tag}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-lg overflow-hidden">
                  <img src={prop.image} alt="thumb" className="w-full h-[205px] object-cover" />
                </div>
                <div className="rounded-lg overflow-hidden relative">
                  <img src={prop.image} alt="thumb" className="w-full h-[205px] object-cover" />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold">+9</div>
                </div>
              </div>

              {/* title + price */}
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{prop.title}</h1>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2"><img src="/icons/locationblue.svg" className="w-4 h-4 mt-0.5"/> {prop.location}</div>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-gray-900">{prop.price}</div>
              </div>

              {/* info row */}
              <div className="mt-6">
                <div className="bg-gray-50 rounded-xl shadow-sm p-4">
                  <div className="flex text-center divide-x divide-gray-200">
                    <div className="flex-1 px-4">
                      <div className="font-semibold mt-2">Land</div>
                      <div className="text-xs text-gray-500">Property Type</div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="font-semibold mt-2">350 sqm</div>
                      <div className="text-xs text-gray-500">Total Area</div> 
                    </div>
                    <div className="flex-1 px-4">
                      <div className="font-semibold mt-2">{prop.beds}</div>
                      <div className="text-xs text-gray-500">Beds</div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="font-semibold mt-2">02-May-2024</div>
                      <div className="text-xs text-gray-500">Date Added</div>  
                    </div>
                  </div>
                </div>
              </div>

              {/* tabs */}
              <div className="mt-6">
                {/* tabs row - selected pill is elevated */}
                <div className="relative" role="tablist" aria-label="Property details tabs">
                  <div className="flex items-start gap-6">
                    <button
                      id="tab-description"
                      role="tab"
                      aria-selected={activeTab === 'description'}
                      aria-controls="panel-description"
                      onClick={() => setActiveTab('description')}
                      className={
                        activeTab === 'description'
                          ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                          : 'px-6 py-3 text-sm text-gray-400'
                      }
                    >
                      Description
                    </button>

                    <button
                      id="tab-amenities"
                      role="tab"
                      aria-selected={activeTab === 'amenities'}
                      aria-controls="panel-amenities"
                      onClick={() => setActiveTab('amenities')}
                      className={
                        activeTab === 'amenities'
                          ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                          : 'px-6 py-3 text-sm text-gray-400'
                      }
                    >
                      Amenities
                    </button>

                    <button
                      id="tab-documents"
                      role="tab"
                      aria-selected={activeTab === 'documents'}
                      aria-controls="panel-documents"
                      onClick={() => setActiveTab('documents')}
                      className={
                        activeTab === 'documents'
                          ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                          : 'px-6 py-3 text-sm text-gray-400'
                      }
                    >
                      Documents
                    </button>

                    <button
                      id="tab-landmarks"
                      role="tab"
                      aria-selected={activeTab === 'landmarks'}
                      aria-controls="panel-landmarks"
                      onClick={() => setActiveTab('landmarks')}
                      className={
                        activeTab === 'landmarks'
                          ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                          : 'px-6 py-3 text-sm text-gray-400'
                      }
                    >
                      Landmarks
                    </button>
                  </div>
                </div>

                {/* tab panels */}
                <div className="mt-6">
                  <div
                    id="panel-description"
                    role="tabpanel"
                    aria-labelledby="tab-description"
                    hidden={activeTab !== 'description'}
                    className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'description' ? 'hidden' : ''}`}
                  >
                    {!showFullDesc ? (
                      <>
                        <p className="leading-relaxed">{previewDescription}</p>
                        <button
                          type="button"
                          onClick={() => setShowFullDesc(true)}
                          className="mt-2 text-blue-600 font-medium"
                          aria-expanded={showFullDesc}
                        >
                          Read More
                        </button>
                      </>
                    ) : (
                      <>
                        {fullDescription.map((p, i) => (
                          <p key={i} className="leading-relaxed mb-4">{p}</p>
                        ))}

                        <div className="mt-2">
                          <div className="font-medium mb-2">Key features</div>
                          <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                            {features.map((f) => (
                              <li key={f}>{f}</li>
                            ))}
                          </ul>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowFullDesc(false)}
                          className="mt-4 text-blue-600 font-medium"
                          aria-expanded={showFullDesc}
                        >
                          Show Less
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    id="panel-amenities"
                    role="tabpanel"
                    aria-labelledby="tab-amenities"
                    hidden={activeTab !== 'amenities'}
                    className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'amenities' ? 'hidden' : ''}`}
                  >
                    {/* Tiled amenities layout (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'electricity', label: 'Electricity', note: 'Backup available' },
                        { key: 'water', label: 'Water', note: 'Borehole + municipal' },
                        { key: 'gated', label: 'Gated Community', note: 'Controlled access' },
                        { key: 'parking', label: 'Parking', note: 'Ample space' },
                        { key: 'pool', label: 'Swimming Pool', note: 'Adult & kids' },
                        { key: 'security', label: '24/7 Security', note: 'Patrols & CCTV' },
                      ].map((a) => (
                        <div key={a.key} className="flex items-start gap-3 p-3 border border-[#E4E4E4] rounded-lg bg-gray-20">
                          <div className="flex-none w-9 h-9 rounded-full bg-white border border-[#E4E4E4] flex items-center justify-center shadow-sm">
                            <img src="/icons/check.svg" alt="included" className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{a.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{a.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    id="panel-documents"
                    role="tabpanel"
                    aria-labelledby="tab-documents"
                    hidden={activeTab !== 'documents'}
                    className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'documents' ? 'hidden' : ''}`}
                  >
                    {/* Documents tiled layout (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'c_of_o', title: 'Certificate of Occupancy', file: 'certOfOccupancy.pdf', size: '1.2 MB' },
                        { key: 'survey', title: 'Survey Plan', file: 'surveyPlan.pdf', size: '860 KB' },
                        { key: 'title_deed', title: 'Title Deed', file: 'titleDeed.pdf', size: '2.4 MB' },
                        { key: 'building_plan', title: 'Building Plan', file: 'buildingPlan.pdf', size: '980 KB' },
                        { key: 'receipt', title: 'Payment Receipts', file: 'paymentReceipts.pdf', size: '420 KB' },
                        { key: 'compliance', title: 'Compliance / NDC', file: 'compliance.pdf', size: '320 KB' },
                      ].map((d) => (
                        <div key={d.key} className="flex items-center justify-between gap-3 p-3 border border-[#E4E4E4] rounded-lg bg-white">
                          <div className="flex items-start gap-3">
                            <div className="flex-none w-10 h-10 rounded-full bg-gray-50 border border-[#E4E4E4] flex items-center justify-center">
                              <img src="/icons/document.svg" alt="doc" className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{d.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{d.file} • {d.size}</div>
                            </div>
                          </div>
                          <a
                            href={`/documents/${d.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 font-medium hover:underline"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

              
                  <div
                    id="panel-landmarks"
                    role="tabpanel"
                    aria-labelledby="tab-landmarks"
                    hidden={activeTab !== 'landmarks'}
                    className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'landmarks' ? 'hidden' : ''}`}
                  >
                    {/* Landmarks tiled layout (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'school', label: "St. Mary's Primary School", dist: '0.4 km' },
                        { key: 'hospital', label: 'City General Hospital', dist: '1.2 km' },
                        { key: 'mall', label: 'Central Mall', dist: '2.0 km' },
                        { key: 'park', label: 'Riverside Park', dist: '0.8 km' },
                        { key: 'station', label: 'Main Bus Terminal', dist: '1.5 km' },
                        { key: 'airport', label: 'Enugu Airport', dist: '15 km' },
                      ].map((l) => (
                        <div key={l.key} className="flex items-center justify-between gap-3 p-3 border border-[#E4E4E4] rounded-lg bg-white">
                          <div className="flex gap-3">
                            <div className="flex-none w-10 h-10 rounded-full bg-gray-50 border border-[#E4E4E4] flex items-center justify-center">
                              <img src="/icons/locationicon.svg" alt="location" className="w-4 h-4" />
                            </div>
                            <div className='flex items-center justify-center'>
                              <div className="font-medium text-sm">{l.label}</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">{l.dist}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                  
        
                </div>
              </div>

              

              {/* similar properties removed from here to render full-bleed below */}
            </div>

            {/* sidebar card (pixel-accurate) */}
            <aside className="lg:col-span-4 ">
              <div className="space-y-4 ">
                <div className="bg-white rounded-xl h-[353px] border border-[#8E98A8] p-4 shadow-sm  flex flex-col justify-between">
                  <div className="rounded-lg p-4 pt-2 text-center">
                    <div className="text-sm font-semibold text-gray-900">Agent</div>
                    <img src="/images/agent-sarah.png" className="w-14 h-14 rounded-full mx-auto mt-2" alt="agent" />
                    <div className="mt-2 font-medium text-gray-600 flex items-center justify-center gap-1 text-sm">
                      <span>{prop.agent}</span>
                      <img src="/icons/verifiedbadge.svg" className="w-4 h-4" alt="verified" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">(0) <img src="/icons/star-off.svg" className="inline ml-0.5 w-3 h-3 mt-[-2.5px]" alt="stars"/></div>
                    <Link href={`/listings/${propId}/profile`} className="text-sm text-blue-600 mt-2 inline-block underline">View Profile</Link>
                  </div>

                  <div className="mt-2 ml-2 mr-2">
                      <button className="w-full bg-white border border-[#8E98A8] rounded-lg py-2 text-[#8E98A8] text-sm flex items-center justify-center gap-2"><img src="/icons/messages.svg" className="w-4 h-4" alt="chat"/> Chat Agent</button>
                      <button onClick={() => router.push(`/listings/${propId}?bookTour=1`)} className="w-full mt-2 border border-indigo-600 text-blue-600 rounded-lg py-2 text-sm flex items-center justify-center gap-2"><img src="/icons/calender.svg" className="w-4 h-4" alt="book"/> Book A Tour</button>
                      <button onClick={() => router.push(`/listings/${propId}?reserve=1`)} className="w-full mt-2 bg-blue-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2">Reserve Now <img src="/icons/arrowOblique.svg" className="w-5 h-5" alt="reserve"/></button>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-[#8E98A8] p-4 text-sm text-gray-600  flex items-center justify-between">
                  <div className="flex ml-2 items-center gap-3 text-red-600">
                    <img src="/icons/flag.svg" className="w-5 h-5" alt="flag"/>
                    <span className="font-medium text-red-600">Report Listing</span>
                  </div>
                  <img src="/icons/redArrowLeft.svg" className="w-4 h-4 mr-2 text-gray-400" alt="arrow"/>
                </div>
              </div>
            </aside>
          </div>
        </div>   

  {/* Full-bleed Similar Properties (spans device width) */}
        <section className="w-full bg-white">
          <div className="px-40 py-10">
            <h3 className="text-lg font-semibold mb-6 max-w-7xl mx-auto px-4">Similar Properties</h3>
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProperties.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#F1F1F1] relative">
                    <div className="relative" style={{ height: 200 }}>
                      <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className={`absolute left-4 top-4 text-xs font-bold px-3 py-1 rounded-full ${p.tag && p.tag.toLowerCase().includes('sale') ? 'bg-[#2563EB] text-white' : 'bg-white text-[#2563EB]'}`}>{p.tag}</div>
                      <button
                        onClick={() => toggleLike(p.id)}
                        aria-pressed={likedIds.has(p.id)}
                        className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#160B0B]/80 p-1 z-30"
                      >
                        <img src={likedIds.has(p.id) ? '/icons/favorite-filled.svg' : '/icons/favorite.svg'} alt="fav" className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-sm">{p.title}</div>
                      <div className="text-xs text-gray-500 mb-2">{p.location}</div>
                      <div className="font-bold text-lg">{p.price}</div>
                      <div className="text-xs text-gray-500 mt-2">{p.beds} beds • {p.baths} baths • {p.area}</div>
                      <div className="flex items-center mt-3">
                        <img src="/images/agent-sarah.png" alt={p.agent} className="w-6 h-6 rounded-full mr-2" />
                        <div className="text-xs text-gray-600">{p.agent} <img src="/icons/verifiedbadge.svg" alt="verified" className="inline w-4 h-4 ml-2" /></div>
                      </div>
                    </div>
                    <Link href={`/listings/${p.id}`} className="absolute inset-0 z-10" aria-label={`View property ${p.id}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Render modal overlay inline so background can be blurred */}
        {showBookTour && (
          // onClose should go back in history so Back button works
          <BookTourModal onClose={() => router.back()} />
        )}

        {showPayment && (
          <PaymentOptionsModal onClose={() => router.back()} />
        )}

        {showSuccess && (
          <BookingConfirmationModal onClose={() => router.back()} />
        )}

        {showMap && (
          <MapModal onClose={() => router.back()} />
        )}

        {showReserve && (
          <ReserveModal onClose={() => router.back()} />
        )}

        {showReservePayment && (
          <ReservePaymentModal onClose={() => router.back()} />
        )}

        {showReserveSuccess && (
          <ReserveConfirmationModal onClose={() => router.back()} />
        )}

      </main>
      <Footer />
    </>
  );
}
