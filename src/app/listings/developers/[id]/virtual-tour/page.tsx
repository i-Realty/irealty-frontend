"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useFavouritesStore } from '@/lib/store/useFavouritesStore';
import Image from 'next/image';
import VirtualTourViewer from '@/components/listings/VirtualTourViewer';

const MOCK_SCENES = [
  {
    id: 'exterior',
    label: 'Exterior View',
    image: '/images/property2.png',
    hotspots: [
      { id: 'h1', label: 'Enter Lobby', yaw: 90, pitch: -5, targetScene: 1 },
    ],
  },
  {
    id: 'lobby',
    label: 'Building Lobby',
    image: '/images/property1.png',
    hotspots: [
      { id: 'h2', label: 'Back to Exterior', yaw: 180, pitch: 0, targetScene: 0 },
      { id: 'h3', label: 'View Show Unit', yaw: 60, pitch: 0, targetScene: 2 },
    ],
  },
  {
    id: 'show-unit',
    label: 'Show Unit - Living Room',
    image: '/images/property2.png',
    hotspots: [
      { id: 'h4', label: 'Back to Lobby', yaw: 180, pitch: 0, targetScene: 1 },
      { id: 'h5', label: 'View Amenities', yaw: 270, pitch: 0, targetScene: 3 },
    ],
  },
  {
    id: 'amenities',
    label: 'Amenities - Pool & Gym',
    image: '/images/property1.png',
    hotspots: [
      { id: 'h6', label: 'Back to Show Unit', yaw: 180, pitch: 0, targetScene: 2 },
    ],
  },
];

function VirtualTourContent() {
  const router = useRouter();
  const pid = typeof window !== 'undefined' ? Number(window.location.pathname.split('/')[3]) : 0;
  const { likedIds, toggleLike } = useFavouritesStore();
  const fav = likedIds.has(String(pid));

  function close() {
    try { router.back(); } catch { router.push('/listings/developers'); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="text-sm tracking-tight text-white font-semibold">Virtual Tour</div>
              <div className="text-xs text-gray-400 mt-0.5">Developer Project - Interactive 360</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                <Image src="/icons/share.svg" width={24} height={24} alt="share" />
              </button>
              <button onClick={() => toggleLike(String(pid))} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                <Image src={fav ? '/icons/favorite-filled.svg' : '/icons/favorite-dark.svg'} width={16} height={16} alt="fav" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white text-[13px] px-3 py-1 rounded-md flex items-center gap-2">
              <Image src="/icons/messages2.svg" width={16} height={16} alt="messages" />
              Chat Agent
            </button>
            <button onClick={close} aria-label="close" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm hover:bg-white/10 transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>
      <VirtualTourViewer scenes={MOCK_SCENES} onClose={close} />
    </div>
  );
}

export default function VirtualTourModal() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
      <VirtualTourContent />
    </Suspense>
  );
}
