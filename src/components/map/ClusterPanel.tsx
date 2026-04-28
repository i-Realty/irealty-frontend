"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMapStore } from "@/lib/store/useMapStore";

interface ClusterPanelProps {
  listingHrefPrefix?: string;
}

export default function ClusterPanel({ listingHrefPrefix = "/listings" }: ClusterPanelProps) {
  const { clusterPanelOpen, clusterProperties, closeClusterPanel } = useMapStore();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Swipe down to dismiss on mobile
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || !clusterPanelOpen) return;

    let startY = 0;
    let currentY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      currentY = startY;
    };
    const onTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const dy = currentY - startY;
      if (dy > 0) el.style.transform = `translateY(${dy}px)`;
    };
    const onTouchEnd = () => {
      if (currentY - startY > 80) {
        closeClusterPanel();
      }
      el.style.transform = "";
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [clusterPanelOpen, closeClusterPanel]);

  if (!clusterPanelOpen || !clusterProperties.length) return null;

  return (
    <>
      {/* Desktop: right side panel */}
      <div
        className="hidden md:flex absolute top-0 right-0 h-full w-72 bg-white shadow-xl z-20 flex-col border-l border-gray-200"
        style={{ borderRadius: "0 12px 12px 0" }}
      >
        <PanelHeader count={clusterProperties.length} onClose={closeClusterPanel} />
        <PropertyList properties={clusterProperties} hrefPrefix={listingHrefPrefix} />
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden fixed inset-0 z-40 bg-black/20" onClick={closeClusterPanel} />
      <div
        ref={sheetRef}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl"
        style={{ maxHeight: "50vh", transition: "transform .3s ease-out" }}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-1" />
        <PanelHeader count={clusterProperties.length} onClose={closeClusterPanel} />
        <PropertyList properties={clusterProperties} hrefPrefix={listingHrefPrefix} />
      </div>
    </>
  );
}

function PanelHeader({ count, onClose }: { count: number; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <span className="font-semibold text-sm text-gray-800">
        {count} properties in this area
      </span>
      <button
        onClick={onClose}
        aria-label="Close cluster panel"
        className="text-gray-400 hover:text-gray-700 text-xl leading-none"
      >
        ×
      </button>
    </div>
  );
}

function PropertyList({ properties, hrefPrefix }: { properties: import("@/lib/types").PropertyWithCoords[]; hrefPrefix: string }) {
  return (
    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
      {properties.map((p) => (
        <Link
          key={p.id}
          href={`${hrefPrefix}/${p.id}`}
          className="flex gap-3 p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative bg-gray-100">
            <Image
              src={p.thumbnail ?? p.image ?? "/images/property1.png"}
              alt={p.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="text-xs font-semibold text-gray-800 truncate">{p.title}</div>
            <div className="text-xs text-gray-500 truncate">{p.neighbourhood ?? p.location}</div>
            <div className="text-sm font-bold text-blue-600 mt-1">
              {p.priceReduced && (
                <span className="line-through text-gray-400 text-xs mr-1">{p.originalPrice}</span>
              )}
              {p.priceLabel ?? p.price}
            </div>
            <div className="flex gap-2 text-xs text-gray-400 mt-0.5">
              {p.beds && <span>🛏 {p.beds}</span>}
              {p.baths && <span>🚿 {p.baths}</span>}
              {p.sizeSqm && <span>📐 {p.sizeSqm}m²</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
