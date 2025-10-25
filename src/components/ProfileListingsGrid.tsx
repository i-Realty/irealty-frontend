"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFavorites, toggleFavorite as toggleFavLocal } from '@/lib/favorites';

type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  tag?: string;
  beds?: number;
  baths?: number;
  area?: string;
  agent?: string;
};

export default function ProfileListingsGrid({ sampleProperties }: { sampleProperties: Property[] }) {
  const [likedIds, setLikedIds] = useState<Set<number>>(() => new Set(getFavorites()));

  function toggleLike(id: number) {
    // persist via shared helper so other pages/components stay in sync
    toggleFavLocal(id);
    setLikedIds(new Set(getFavorites()));
  }

  useEffect(() => {
    function onChange() {
      setLikedIds(new Set(getFavorites()));
    }
    window.addEventListener('favorites-changed', onChange as EventListener);
    window.addEventListener('storage', onChange as EventListener);
    return () => {
      window.removeEventListener('favorites-changed', onChange as EventListener);
      window.removeEventListener('storage', onChange as EventListener);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleProperties.map((p) => (
        <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#F1F1F1] relative">
          <div className="relative" style={{ height: 200 }}>
            <Image src={p.image} alt={p.title} fill className="object-cover" />
            <div className={`absolute left-4 top-4 text-xs font-bold px-3 py-1 rounded-full ${p.tag && p.tag.toLowerCase().includes('sale') ? 'bg-[#2563EB] text-white' : 'bg-white text-[#2563EB]'}`}>{p.tag}</div>
            <button
              onClick={() => toggleLike(p.id)}
              aria-pressed={likedIds.has(p.id)}
              className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#160B0B]/80 p-1 z-30"
            >
              <Image src={likedIds.has(p.id) ? '/icons/favorite-filled.svg' : '/icons/favorite.svg'} alt="fav" width={20} height={20} className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="font-bold text-sm">{p.title}</div>
            <div className="text-xs text-gray-500 mb-2">{p.location}</div>
            <div className="font-bold text-lg">{p.price}</div>
            <div className="text-xs text-gray-500 mt-2">{p.beds ?? '-'} beds • {p.baths ?? '-'} baths • {p.area ?? '-'}</div>
            <div className="flex items-center mt-3">
              <Image src="/images/agent-sarah.png" alt={p.agent ?? 'Agent'} width={24} height={24} className="rounded-full mr-2" />
              <div className="text-xs text-gray-600">{p.agent} <Image src="/icons/verifiedbadge.svg" alt="verified" width={16} height={16} className="inline w-4 h-4 ml-2" /></div>
            </div>
          </div>
          {/* overlay link so clicking the card opens details (favorite remains clickable due to z-30) */}
          <Link href={`/listings/${p.id}`} className="absolute inset-0 z-10" aria-label={`View property ${p.id}`} />
        </div>
      ))}
    </div>
  );
}
