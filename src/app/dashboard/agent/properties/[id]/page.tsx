'use client';

import { use, useEffect, useState } from 'react';
import { useAgentPropertiesStore } from '@/lib/store/useAgentPropertiesStore';
import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import { ArrowLeft, Trash2, Edit3, MapPin, Play, Map, CheckCircle2, FileText, Download, MapPinned } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MapModal from '@/components/MapModal';
import CreatePropertyModal from '@/components/dashboard/agent/property-create/CreatePropertyModal';

const DEFAULT_AMENITIES = [
  'Swimming Pool', 'Gym', 'Parking', '24/7 Security',
  'Generator', 'CCTV', 'Air Conditioning', 'Garden',
  'Elevator', 'Children Playground', 'Laundry Room', 'Wi-Fi',
];

const MOCK_DOCUMENTS = [
  { name: 'Title Deed', size: '2.4 MB', format: 'PDF' },
  { name: 'Survey Plan', size: '1.8 MB', format: 'PDF' },
  { name: 'Building Permit', size: '3.1 MB', format: 'PDF' },
];

const MOCK_LANDMARKS = [
  { name: 'Lekki Toll Gate', distance: '2.5 km' },
  { name: 'Victoria Island Mall', distance: '1.2 km' },
  { name: 'Third Mainland Bridge', distance: '4.0 km' },
  { name: 'Murtala Muhammed Airport', distance: '8.3 km' },
  { name: 'Lagos University Teaching Hospital', distance: '5.7 km' },
];

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { properties, fetchProperties, deleteProperty } = useAgentPropertiesStore();
  const loadPropertyForEdit = useCreatePropertyStore((s) => s.loadPropertyForEdit);
  
  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  const [activeTab, setActiveTab] = useState('Description');
  const [showMapModal, setShowMapModal] = useState(false);
  const property = properties.find(p => p.id === id);

  if (!property) return <div className="p-8">Loading property details...</div>;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(price).replace('NGN', '₦');
  };

  const isSale = property.listingType === 'For Sale';
  const amenities = (property as unknown as Record<string, unknown>).amenities as string[] | undefined ?? DEFAULT_AMENITIES;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(property.id);
      router.push('/dashboard/agent/properties');
    }
  };

  return (
    <div className="flex flex-col space-y-6 pb-12 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agent/properties" className="text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            My Properties <span className="text-sm font-normal text-gray-500 ml-3 bg-gray-100 px-2 py-0.5 rounded">Property Details</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={() => loadPropertyForEdit(property)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
             <Edit3 className="w-4 h-4" />
           </button>
           <button onClick={handleDelete} className="w-10 h-10 rounded-full border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] relative rounded-2xl overflow-hidden">
        {/* Main Image */}
        <div className="relative w-full h-full">
           <Image src={property.media[0] || '/images/house1.jpg'} alt="Main" fill className="object-cover" />
           <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${isSale ? 'bg-blue-600' : 'bg-green-600'}`}>
                {property.listingType}
              </span>
           </div>
           
           <div className="absolute top-4 right-4 flex gap-2">
             <button className="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center gap-2 transition-colors">
               <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Virtual Tour
             </button>
             <button onClick={() => setShowMapModal(true)} className="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center gap-2 transition-colors">
               <Map className="w-4 h-4" /> View On Map
             </button>
           </div>
        </div>

        {/* Side Stack */}
        <div className="hidden md:flex flex-col gap-4 h-full relative">
          <div className="relative w-full h-1/2 rounded-xl overflow-hidden">
             <Image src={property.media[1] || property.media[0] || '/images/house1.jpg'} alt="Side 1" fill className="object-cover" />
          </div>
          <div className="relative w-full h-1/2 rounded-xl overflow-hidden">
             <Image src={property.media[2] || property.media[0] || '/images/house1.jpg'} alt="Side 2" fill className="object-cover" />
             {property.media.length > 3 && (
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-medium">
                 +{property.media.length - 3}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Title & Price Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
           <p className="flex items-center text-gray-500 text-sm">
             <MapPin className="w-4 h-4 mr-1 text-blue-500" />
             {property.address}
           </p>
        </div>
        <div className="flex flex-col md:items-end">
           <div className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</div>
           {property.priceType && <span className="text-sm text-gray-500">/ {property.priceType}</span>}
        </div>
      </div>

      {/* High Level Stats Ribbon */}
      <div className="flex w-full items-center justify-between border-y border-gray-100 py-6 my-4 bg-gray-50/50 px-4 rounded-xl">
         <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <span className="font-bold text-gray-900 text-lg">{property.propertyCategory}</span>
            <span className="text-xs text-gray-500">Property Type</span>
         </div>
         <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <span className="font-bold text-gray-900 text-lg">{property.sizeSqm || '-'} sqm</span>
            <span className="text-xs text-gray-500">Total Area</span>
         </div>
         <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <span className="font-bold text-gray-900 text-lg">{property.bedrooms || '-'} Beds</span>
            <span className="text-xs text-gray-500">Beds</span>
         </div>
         <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <span className="font-bold text-gray-900 text-lg">
              {new Date(property.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs text-gray-500">Date Added</span>
         </div>
      </div>

      {/* Detail Tabs Area */}
      <div className="border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm">
         <div className="flex w-full border-b border-gray-100">
           {['Description', 'Amenities', 'Documents', 'Landmarks'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               {tab}
             </button>
           ))}
         </div>
         <div className="p-6">
            {/* Description Tab */}
            {activeTab === 'Description' && (
              <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
                {property.description}
              </p>
            )}

            {/* Amenities Tab */}
            {activeTab === 'Amenities' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{amenity}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'Documents' && (
              <div className="space-y-3">
                {MOCK_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between px-4 py-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {doc.format}
                      </span>
                      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Landmarks Tab */}
            {activeTab === 'Landmarks' && (
              <div className="space-y-3">
                {MOCK_LANDMARKS.map((landmark) => (
                  <div
                    key={landmark.name}
                    className="flex items-center justify-between px-4 py-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <MapPinned className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{landmark.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{landmark.distance}</span>
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>

      <CreatePropertyModal />

      {/* Map Modal */}
      {showMapModal && (
        <MapModal lat={6.45} lng={3.42} onClose={() => setShowMapModal(false)} />
      )}
    </div>
  );
}
