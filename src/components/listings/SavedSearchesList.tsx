'use client';

import { Bookmark, Trash2 } from 'lucide-react';
import { useSavedSearchesStore, type SavedSearch } from '@/lib/store/useSavedSearchesStore';

interface Props {
  onApply: (filters: SavedSearch['filters']) => void;
}

export default function SavedSearchesList({ onApply }: Props) {
  const { searches, deleteSearch } = useSavedSearchesStore();

  if (searches.length === 0) return null;

  return (
    <div className="mt-4 mb-2">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Bookmark className="w-3.5 h-3.5" />
        Saved Searches
      </h4>
      <div className="space-y-1.5">
        {searches.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 group"
          >
            <button
              onClick={() => onApply(s.filters)}
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium truncate flex-1 text-left transition-colors"
            >
              {s.name}
            </button>
            <button
              onClick={() => deleteSearch(s.id)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
