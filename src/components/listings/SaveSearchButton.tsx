'use client';

import { useState } from 'react';
import { Bookmark, X } from 'lucide-react';
import { useSavedSearchesStore, type SavedSearch } from '@/lib/store/useSavedSearchesStore';

interface Props {
  currentFilters: SavedSearch['filters'];
}

export default function SaveSearchButton({ currentFilters }: Props) {
  const { saveSearch } = useSavedSearchesStore();
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    saveSearch(name.trim(), currentFilters);
    setName('');
    setShowInput(false);
  };

  if (showInput) {
    return (
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Search name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => { setShowInput(false); setName(''); }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="flex items-center gap-2 mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
    >
      <Bookmark className="w-4 h-4" />
      Save this search
    </button>
  );
}
