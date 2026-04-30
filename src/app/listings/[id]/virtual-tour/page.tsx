"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useFavouritesStore } from '@/lib/store/useFavouritesStore';
import Image from 'next/image';
import VirtualTourViewer from '@/components/listings/VirtualTourViewer';

// Mock scenes data — in production, these would come from the property API
const MOCK_SCENES = [
  {
    id: 'living-room',
    label: 'Living Room',
    image: '/images/property1.png',
    hotspots: [
      { id: 'h1', label: 'Go to Kitchen', yaw: 120, pitch: 0, targetScene: 1 },
      { id: 'h2', label: 'Go to Bedroom', yaw: 240, pitch: 0, targetScene: 2 },
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    image: '/images/property2.png',
    hotspots: [
      { id: 'h3', label: 'Back to Living Room', yaw: 180, pitch: 0, targetScene: 0 },
      { id: 'h4', label: 'Go to Dining Area', yaw: 60, pitch: -10, targetScene: 3 },
    ],
  },
  {
    id: 'bedroom',
    label: 'Master Bedroom',
    image: '/images/property1.png',
    hotspots: [
      { id: 'h5', label: 'Back to Living Room', yaw: 180, pitch: 0, targetScene: 0 },
      { id: 'h6', label: 'Go to Bathroom', yaw: 90, pitch: 0, targetScene: 4 },
    ],
  },
  {
    id: 'dining',
    label: 'Dining Area',
    image: '/images/property2.png',
    hotspots: [
      { id: 'h7', label: 'Back to Kitchen', yaw: 200, pitch: 0, targetScene: 1 },
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    image: '/images/property1.png',
    hotspots: [
      { id: 'h8', label: 'Back to Bedroom', yaw: 180, pitch: 0, targetScene: 2 },
    ],
  },
];

function VirtualTourContent() {
  const router = useRouter();
  const pid = typeof window !== 'undefined' ? Number(window.location.pathname.split('/')[2]) : 0;
  const { likedIds, toggleLike } = useFavouritesStore();
  const fav = likedIds.has(String(pid));

  function close() {
    try { router.back(); } catch { router.push('/listings'); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="text-sm tracking-tight text-white font-semibold">Virtual Tour</div>
              <div className="text-xs text-gray-400 mt-0.5">Interactive 360 Experience</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                <Image src="/icons/share.svg" width={24} height={24} alt="share" />
              </button>
              <button onClick={() => toggleLike(pid)} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
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

      {/* Virtual Tour Viewer */}
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
