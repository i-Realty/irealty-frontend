'use client';

import Image from 'next/image';
import { SeekerProperty } from '@/lib/store/useSeekerPropertiesStore';

function formatNGN(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
    .format(amount)
    .replace('NGN', '₦');
}

const STATUS_COLOR: Record<string, string> = {
  Active:    'bg-green-500 text-white',
  Expired:   'bg-red-500 text-white',
  Completed: 'bg-blue-500 text-white',
};

interface SeekerPropertyCardProps {
  property: SeekerProperty;
  onLeaseDetails?: () => void;
  onPayRent?: () => void;
  onViewDetails?: () => void;
  onContactAgent?: () => void;
}

export default function SeekerPropertyCard({
  property: p,
  onLeaseDetails,
  onPayRent,
  onViewDetails,
  onContactAgent,
}: SeekerPropertyCardProps) {
  const isRented = p.propertyType === 'Rented';
  const isOwned  = p.propertyType === 'Owned';

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image src={p.image} alt={p.title} fill className="object-cover" />

        {/* Type badge — top left */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-md ${
          isRented ? 'bg-gray-800/80 text-white' : 'bg-blue-600 text-white'
        }`}>
          {p.propertyType}
        </span>

        {/* Status badge — top right */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-md ${STATUS_COLOR[p.status] ?? 'bg-gray-400 text-white'}`}>
          {p.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-[15px] mb-0.5">{p.title}</h3>
        <p className="text-gray-400 text-xs mb-1">{p.location}</p>
        <p className="text-xs text-gray-500 mb-3">{p.beds} beds • {p.baths} baths • {p.sqm} sqm</p>

        {/* Rented details */}
        {isRented && (
          <>
            <div className="bg-blue-50/70 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs text-gray-500">Lease: {p.leaseStart} – {p.leaseEnd}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-semibold text-blue-700">
                  Yearly Rent: {formatNGN(p.yearlyRent ?? 0)}
                </span>
                <span className="text-xs text-gray-400">{p.monthsLeft} months left</span>
              </div>
            </div>
            <div className="space-y-1.5 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Yearly Rent</span>
                <span className="font-medium text-gray-900">{formatNGN(p.yearlyRent ?? 0)}</span>
              </div>
              {p.securityDeposit != null && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Security Deposit</span>
                  <span className="font-medium text-gray-900">{formatNGN(p.securityDeposit)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Total Paid</span>
                <span className="font-medium text-gray-900">{formatNGN(p.totalPaid ?? 0)}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={onLeaseDetails}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Lease Details
              </button>
              <button
                onClick={onPayRent}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Pay Rent
              </button>
            </div>
          </>
        )}

        {/* Owned details */}
        {isOwned && (
          <>
            {p.documents && p.documents.length > 0 && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs text-gray-400 mb-1">Documents</p>
                <p className="text-xs text-gray-700 font-medium">{p.documents.join(' • ')}</p>
              </div>
            )}
            <div className="space-y-1.5 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Purchase Price</span>
                <span className="font-medium text-gray-900">{formatNGN(p.purchasePrice ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Purchase Date</span>
                <span className="font-medium text-gray-900">{p.purchaseDate}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={onViewDetails}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={onContactAgent}
                className="flex-1 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
              >
                Contact Agent/Seller
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
