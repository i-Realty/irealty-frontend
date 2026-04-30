"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PropertyWithCoords, Landmark } from "@/lib/types";
import { useFavouritesStore } from "@/lib/store/useFavouritesStore";

function formatDistance(metres: number): string {
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1)}km`
    : `${Math.round(metres)}m`;
}

function formatWalkTime(metres: number): string {
  const minutes = Math.round(metres / 1.4 / 60);
  return `~${minutes} min walk`;
}

interface MobilePropertySheetProps {
  property: PropertyWithCoords | null;
  landmarks: Landmark[];
  hrefPrefix: string;
  onClose: () => void;
}

export default function MobilePropertySheet({
  property,
  landmarks,
  hrefPrefix,
  onClose,
}: MobilePropertySheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { likedIds, toggleLike } = useFavouritesStore();

  // Swipe down to dismiss
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || !property) return;

    let startY = 0;
    let currentY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      currentY = startY;
    };

    const onTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const dy = currentY - startY;
      if (dy > 0) {
        el.style.transform = `translateY(${dy}px)`;
      }
    };

    const onTouchEnd = () => {
      const dy = currentY - startY;
      if (dy > 80) {
        onClose();
      } else {
        el.style.transform = "translateY(0)";
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [property, onClose]);

  if (!property) return null;

  const liked = likedIds.has(String(property.id));
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="irealty-bottom-sheet open"
        style={{ zIndex: 50, transition: "transform .3s ease-out" }}
      >
        {/* Drag handle */}
        <div className="irealty-bottom-sheet-handle" />

        {/* Content */}
        <div className="px-4 pb-6">
          {/* Image */}
          <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3">
            <Image
              src={property.thumbnail ?? property.image ?? "/images/property1.png"}
              alt={property.title}
              fill
              className="object-cover"
            />
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(String(property.id)); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow"
            >
              {liked ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Title & price */}
          <h3 className="font-bold text-base text-gray-900">{property.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{property.neighbourhood ?? property.location}</p>
          <p className="text-lg font-bold text-blue-600 mt-1">{property.price}</p>

          {/* Specs */}
          <div className="flex gap-4 text-xs text-gray-600 mt-2">
            {property.beds && <span>🛏 {property.beds} beds</span>}
            {property.baths && <span>🚿 {property.baths} baths</span>}
            {property.sizeSqm && <span>📐 {property.sizeSqm} sqm</span>}
          </div>

          {/* Landmarks */}
          {landmarks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Nearby</div>
              {landmarks.slice(0, 3).map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <span>{l.icon}</span>
                  <span><b>{l.name}</b> · {formatDistance(l.distance)} ({formatWalkTime(l.distance)})</span>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Link
              href={`${hrefPrefix}/${property.id}`}
              className="flex-1 bg-blue-600 text-white text-center py-3 rounded-xl text-sm font-semibold"
            >
              View Details
            </Link>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-100 text-gray-800 text-center py-3 rounded-xl text-sm font-semibold"
            >
              🧭 Directions
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
