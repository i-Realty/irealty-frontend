'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useComparisonStore } from '@/lib/store/useComparisonStore';

const ROWS: { label: string; key: string }[] = [
  { label: 'Price', key: 'price' },
  { label: 'Location', key: 'location' },
  { label: 'Bedrooms', key: 'beds' },
  { label: 'Bathrooms', key: 'baths' },
  { label: 'Area', key: 'area' },
  { label: 'Listing Type', key: 'tag' },
  { label: 'Agent', key: 'agent' },
];

export default function ComparisonModal() {
  const { items, isModalOpen, closeModal, removeItem } = useComparisonStore();

  if (!isModalOpen || items.length < 2) return null;

  const getValue = (property: (typeof items)[0], key: string): string => {
    const val = (property as Record<string, unknown>)[key];
    if (val === undefined || val === null) return '-';
    return String(val);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Compare Properties ({items.length})
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property images & titles */}
          <div className={`grid gap-4 mb-6 ${items.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {items.map((p) => (
              <div key={p.id} className="relative">
                <button
                  onClick={() => removeItem(p.id)}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="relative h-[160px] rounded-xl overflow-hidden">
                  <Image
                    src={p.image ?? '/images/property1.png'}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                  {p.tag && (
                    <span
                      className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                        p.tag?.toLowerCase().includes('sale')
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600'
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                </div>
                <Link
                  href={`/listings/${p.id}`}
                  className="block mt-3 text-sm font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {p.title}
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
            {ROWS.map((row, ri) => (
              <div
                key={row.key}
                className={`grid ${items.length === 2 ? 'grid-cols-[140px_1fr_1fr]' : 'grid-cols-[140px_1fr_1fr_1fr]'} ${
                  ri % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700">
                  {row.label}
                </div>
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium border-r border-gray-100 dark:border-gray-700 last:border-r-0"
                  >
                    {getValue(p, row.key)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
