'use client';

import Image from 'next/image';
import { X, GitCompareArrows } from 'lucide-react';
import { useComparisonStore } from '@/lib/store/useComparisonStore';

export default function ComparisonBar() {
  const { items, removeItem, clearAll, openModal } = useComparisonStore();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg px-4 py-3 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 min-w-0 shrink-0"
            >
              <Image
                src={p.image ?? '/images/property1.png'}
                alt={p.title}
                width={40}
                height={30}
                className="w-10 h-8 rounded object-cover"
              />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                {p.title}
              </span>
              <button
                onClick={() => removeItem(p.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {items.length < 3 && (
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              Add {3 - items.length} more to compare
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium px-3 py-2"
          >
            Clear
          </button>
          <button
            onClick={openModal}
            disabled={items.length < 2}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            <GitCompareArrows className="w-4 h-4" />
            Compare ({items.length})
          </button>
        </div>
      </div>
    </div>
  );
}
