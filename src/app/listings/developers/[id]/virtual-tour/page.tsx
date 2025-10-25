"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isFavorited, toggleFavorite } from '@/lib/favorites';

export default function VirtualTourModal() {
  const router = useRouter();
  const search = useSearchParams();
  const start = Number(search?.get('start') || 0);
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const pid = Number(typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : 0);

  const images = Array.from({ length: 9 }).map((_, i) => `/images/property${(i % 2) + 1}.png`);

  const [index, setIndex] = useState(Math.max(0, Math.min(start, images.length - 1)));
  // avoid reading localStorage during server render/hydration — initialize on mount
  const [fav, setFav] = useState(false);
  const prevIndexRef = useRef(index);

  // animation state drives an initial offset -> to-zero transition
  const [anim, setAnim] = useState<{ active: boolean; dir: number; initial: boolean }>({ active: false, dir: 0, initial: false });
  const animTimerRef = useRef<number | null>(null);
  const wheelThrottleRef = useRef(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') router.back();
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(images.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
    }
    document.addEventListener('keydown', onKey);
    // initialize favorite state on mount (client-only)
    setFav(isFavorited(pid));
    function onFavChange() { setFav(isFavorited(pid)); }
    window.addEventListener('favorites-changed', onFavChange as EventListener);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('favorites-changed', onFavChange as EventListener);
    };
  }, [router, images.length, pid]);

  // trigger animation when index changes
  useEffect(() => {
    const prev = prevIndexRef.current;
    const dir = index > prev ? 1 : index < prev ? -1 : 0;
    if (dir !== 0) {
      // start animation with initial offset
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
      setAnim({ active: true, dir, initial: true });
      // drop the initial offset on the next frame so CSS transition animates to center
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim((s) => ({ ...s, initial: false }))));
      // clear animation after transition duration (shorter, seamless feel)
      animTimerRef.current = window.setTimeout(() => setAnim({ active: false, dir: 0, initial: false }), 360);
    }
    prevIndexRef.current = index;
  }, [index]);

  function close() { try { router.back(); } catch { router.push('/listings'); } }
  function next() { setIndex((i) => Math.min(images.length - 1, i + 1)); }
  function prev() { setIndex((i) => Math.max(0, i - 1)); }
  function toggleFav() { toggleFavorite(pid); setFav(isFavorited(pid)); }

  // wheel handler: vertical scroll to switch slides (throttled)
  const onWheel = useCallback((e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelThrottleRef.current < 300) return; // responsiveness
    if (Math.abs(e.deltaY) < 12) return;
    wheelThrottleRef.current = now;
    if (e.deltaY > 0) {
      setIndex((i) => Math.min(images.length - 1, i + 1));
    } else {
      setIndex((i) => Math.max(0, i - 1));
    }
  }, [images.length]);

  const progressPercent = Math.round(((index + 1) / images.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        {/* left: title + location + small action icons */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-sm tracking-tight text-white font-semibold">Residential Plot - GRA Enugu</div>
            <div className="text-xs text-gray-400 mt-1">Independence Layout, Enugu</div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"><img src="/icons/share.svg" className="w-6 h-6" alt="share"/></button>
            <button onClick={toggleFav} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"><img src={fav ? '/icons/favorite-filled.svg' : '/icons/favorite-dark.svg'} className="w-4 h-4" alt="fav"/></button>
          </div>
        </div>

        {/* right: progress indicator, chat pill, close */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-300">{index + 1}/{images.length}</div>
            <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <button className="bg-blue-600 text-white text-[13px] px-3 py-1 rounded-md flex items-center gap-2">
            <img src="/icons/messages2.svg" className="w-4 h-4" alt="messages" />
            Chat Agent
          </button>

          <button onClick={close} aria-label="close" className="w-8 h-8 rounded-full bg-black/0 border border-white/20 flex items-center justify-center text-sm">✕</button>
        </div>
      </div>

      <div onWheel={onWheel} className="h-full w-full flex items-center justify-center">
        <div className="w-full  flex items-center gap-6">
            <button onClick={prev} aria-label="previous" className="bg-black/30 w-10 h-10 z-60 ml-10 rounded-full flex items-center justify-center"><img src="/icons/scrollback.svg" className="w-5 h-5" alt="prev"/></button>

          <div className="flex-1 grid grid-cols-[1fr_3fr_1fr] gap-6 items-center w-full">
            {/* left panel */}
            <div
              className={`rounded-lg h-[220px] bg-cover bg-center opacity-40`}
              style={{
                backgroundImage: `url('${images[(index - 1 + images.length) % images.length]}')`,
                transform: 'translateX(0px) scale(1)'
              }}
            />

            {/* center panel */}
            <div
              className={`rounded-lg h-[460px] bg-cover bg-center relative shadow-lg`}
              style={{
                backgroundImage: `url('${images[index]}')`,
                transform: 'translateX(0px) scale(1)',
                opacity: 1
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                    <img src="/icons/play.svg" className="w-6 h-6" alt="play" />
                  </button>
              </div>
            </div>

            {/* right panel */}
            <div
              className={`rounded-lg h-[220px] bg-cover bg-center opacity-40`}
              style={{
                backgroundImage: `url('${images[(index + 1) % images.length]}')`,
                transform: 'translateX(0px) scale(1)'
              }}
            />
          </div>

            <button onClick={next} aria-label="next" className="bg-black/30 w-10 h-10 mr-10 z-60 rounded-full flex items-center justify-center"><img src="/icons/scrollforward.svg" className="w-5 h-5" alt="next"/></button>
        </div>
      </div>
    </div>
  );
}
