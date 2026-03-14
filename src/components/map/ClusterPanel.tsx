"use client";

import React from "react";
import Link from "next/link";
import { useMapStore } from "@/lib/store/useMapStore";
import type { PropertyWithCoords } from "@/lib/types";

interface ClusterPanelProps {
  listingHrefPrefix?: string;
}

export default function ClusterPanel({ listingHrefPrefix = "/listings" }: ClusterPanelProps) {
  const { clusterPanelOpen, clusterProperties, closeClusterPanel } = useMapStore();

  if (!clusterPanelOpen || !clusterProperties.length) return null;

  return (
    <div
      className="absolute top-0 right-0 h-full w-72 bg-white shadow-xl z-20 flex flex-col border-l border-gray-200"
      style={{ borderRadius: "0 12px 12px 0" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-sm text-gray-800">
          {clusterProperties.length} properties in this area
        </span>
        <button
          onClick={closeClusterPanel}
          aria-label="Close cluster panel"
          className="text-gray-400 hover:text-gray-700 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Property list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {clusterProperties.map((p) => (
          <Link
            key={p.id}
            href={`${listingHrefPrefix}/${p.id}`}
            className="flex gap-3 p-3 hover:bg-gray-50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={p.thumbnail ?? p.image ?? "/images/property1.png"}
                alt={p.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
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
    </div>
  );
}
