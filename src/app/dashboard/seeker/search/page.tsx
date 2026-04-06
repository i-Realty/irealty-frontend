'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import ClientListingsContent from '@/components/listings/ClientListingsContent';
import { useListingsStore } from '@/lib/store/useListingsStore';
import { standardProperties } from '@/lib/data/properties';

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Plots/Land', 'Service Apartments & Short Lets', 'PG/Hostel'];

function SeekerSearchContent() {
  return (
    <div className="w-full pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/seeker" className="hover:text-gray-900 transition-colors">
          Dashboard
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">Search Properties</span>
      </div>

      <ClientListingsContent
        config={{
          useStore: useListingsStore,
          propertyTypes: PROPERTY_TYPES,
          hrefPrefix: '/listings',
          resultsLabel: 'properties',
          properties: standardProperties,
        }}
      />
    </div>
  );
}

export default function SeekerSearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <SeekerSearchContent />
    </Suspense>
  );
}
