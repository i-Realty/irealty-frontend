'use client';

import Image from 'next/image';
import { LandlordProperty } from '@/lib/store/useLandlordDashboardStore';

function formatNGN(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
    .format(amount)
    .replace('NGN', '\u20A6');
}

const STATUS_COLOR: Record<string, string> = {
  Occupied:    'bg-green-500 text-white',
  Vacant:      'bg-amber-500 text-white',
  Maintenance: 'bg-red-500 text-white',
};

export default function LandlordPropertyCard({ property: p }: { property: LandlordProperty }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image src={p.image} alt={p.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />

        {/* Type badge -- top left */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-800/80 text-white">
          {p.type}
        </span>

        {/* Status badge -- top right */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-md ${STATUS_COLOR[p.status] ?? 'bg-gray-400 text-white'}`}>
          {p.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-[15px] mb-0.5">{p.title}</h3>
        <p className="text-gray-400 text-xs mb-3">{p.location}</p>

        {/* Rent & Tenant Info */}
        <div className="bg-blue-50/70 rounded-lg px-3 py-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blue-700">
              Monthly Rent: {formatNGN(p.monthlyRent)}
            </span>
          </div>
          {p.tenant && (
            <p className="text-xs text-gray-500 mt-1">Tenant: {p.tenant}</p>
          )}
          {p.leaseEnd && (
            <p className="text-xs text-gray-400 mt-0.5">Lease ends: {p.leaseEnd}</p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Monthly Rent</span>
            <span className="font-medium text-gray-900">{formatNGN(p.monthlyRent)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="font-medium text-gray-900">{p.status}</span>
          </div>
          {p.tenant && (
            <div className="flex justify-between">
              <span className="text-gray-400">Tenant</span>
              <span className="font-medium text-gray-900">{p.tenant}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            View Details
          </button>
          {p.status === 'Occupied' ? (
            <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Message Tenant
            </button>
          ) : p.status === 'Vacant' ? (
            <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              List Property
            </button>
          ) : (
            <button className="flex-1 py-2 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-sm font-medium transition-colors">
              Track Repairs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
