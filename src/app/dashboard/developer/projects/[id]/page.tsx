'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, MapPin, BedDouble, Bath, Maximize2, Calendar, CheckCircle2, FileText, Download, MapPinned } from 'lucide-react';
import MapModal from '@/components/MapModal';

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

const MOCK_PROJECT = {
  id: 'proj-1',
  projectName: 'Residential Plot \u2013 GRA Enugu',
  fullAddress: 'Independence Layout, Enugu',
  price: 20000000,
  propertyType: 'Land',
  plotSizeSqm: '350',
  bedrooms: '4',
  expectedStartDate: '02-May-2024',
  expectedCompletionDate: '02-May-2024',
  description: 'The project aims to provide a luxurious and comfortable lifestyle for its residents. The apartments are thoughtfully designed with stylish interiors and open spaces to let in fresh air and natural light, located in a well-connected and pleasant area, OUI West Park offers a peaceful environment with a modern touch.',
  milestones: [
    { name: 'Initial Deposit', percentage: 20, amount: 19000000 },
    { name: 'Foundation/Lock-Up', percentage: 30, amount: 19000000 },
    { name: 'Roofing/Structure', percentage: 30, amount: 19000000 },
    { name: 'Handover/Finishing', percentage: 20, amount: 19000000 },
  ],
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop',
  ],
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = MOCK_PROJECT;

  const tabs = ['Description', 'Amenities', 'Documents', 'Landmarks'];
  const [activeTab, setActiveTab] = useState('Description');
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Back */}
      <Link href="/dashboard/developer/projects" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <h1 className="text-xl font-bold text-gray-900">Project Details</h1>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 gap-3 rounded-xl overflow-hidden">
        <div className="relative col-span-1 row-span-2 h-80">
          <Image src={project.images[0]} alt="Main" fill className="object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            <button className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1">
              <Play className="w-3 h-3" /> Virtual Tour
            </button>
            <button onClick={() => setShowMapModal(true)} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1">
              <MapPin className="w-3 h-3" /> View On Map
            </button>
          </div>
          <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">For Sale</span>
        </div>
        <div className="relative h-[152px]">
          <Image src={project.images[1]} alt="Gallery 1" fill className="object-cover" />
        </div>
        <div className="relative h-[152px]">
          <Image src={project.images[2]} alt="Gallery 2" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">+9</span>
          </div>
        </div>
      </div>

      {/* Title + Price */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{project.projectName}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" /> {project.fullAddress}
          </p>
        </div>
        <p className="text-xl font-bold text-gray-900">&#8358; {project.price.toLocaleString()}.00</p>
      </div>

      {/* Specs Ribbon */}
      <div className="flex gap-6 border-y border-gray-100 py-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{project.propertyType}</p>
          <p className="text-xs text-gray-400">Property Type</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{project.plotSizeSqm} sqm</p>
          <p className="text-xs text-gray-400">Total Area</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{project.bedrooms} Beds</p>
          <p className="text-xs text-gray-400">Beds</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{project.expectedStartDate}</p>
          <p className="text-xs text-gray-400">Expected Start Date</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{project.expectedCompletionDate}</p>
          <p className="text-xs text-gray-400">Expected Completion Date</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              tab === activeTab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {tab === activeTab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {/* Description Tab */}
      {activeTab === 'Description' && (
        <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
      )}

      {/* Amenities Tab */}
      {activeTab === 'Amenities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEFAULT_AMENITIES.map((amenity) => (
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
                <button
                  onClick={() => {
                    const content = `Document: ${doc.name}\nFormat: ${doc.format}\nSize: ${doc.size}\nProject: ${project.projectName}`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `${doc.name}.txt`;
                    document.body.appendChild(a); a.click();
                    document.body.removeChild(a); URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
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

      {/* Payment Milestone Plan */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Milestone Plan</h3>
        <div className="space-y-3">
          {project.milestones.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-400">Available for payment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">&#8358;{(m.amount / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-400">{m.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <MapModal lat={6.45} lng={3.42} onClose={() => setShowMapModal(false)} />
      )}
    </div>
  );
}
