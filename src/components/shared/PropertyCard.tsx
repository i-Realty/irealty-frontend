"use client";

import React from "react";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { useFavouritesStore } from "@/lib/store/useFavouritesStore";

type Props = {
  property: Property;
  /** Override the link href. Defaults to /listings/{id} */
  href?: string;
};

/**
 * Shared property card used across:
 * - RecentProperties (homepage)
 * - listings/ClientListingsContent
 * - listings/developers/ClientListingsContent
 * - ProfileListingsGrid
 *
 * Favourites state is read directly from useFavouritesStore — no props needed.
 */
export default function PropertyCard({ property: p, href }: Props) {
  const { likedIds, toggleLike } = useFavouritesStore();
  const isLiked = likedIds.has(p.id);
  const isForSale = p.tag?.toLowerCase().includes("sale");
  const linkHref = href ?? `/listings/${p.id}`;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#F1F1F1] relative">
      <div className="relative" style={{ height: 200 }}>
        <img
          src={p.image}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {p.tag && (
          <div
            className={`absolute left-4 top-4 text-xs font-bold px-3 py-1 rounded-full ${
              isForSale ? "bg-[#2563EB] text-white" : "bg-white text-[#2563EB]"
            }`}
          >
            {p.tag}
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleLike(p.id); }}
          aria-pressed={isLiked}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#160B0B]/80 p-1 z-30"
          aria-label={isLiked ? "Unfavorite" : "Favorite"}
        >
          <img
            src={isLiked ? "/icons/favorite-filled.svg" : "/icons/favorite.svg"}
            alt=""
            className="w-5 h-5"
          />
        </button>
      </div>

      <div className="p-4">
        <div className="font-bold text-sm text-[#090202]">{p.title}</div>
        <div className="text-xs text-gray-500 mb-2">{p.location}</div>
        <div className="font-bold text-lg text-[#090202]">{p.price}</div>
        <div className="text-xs text-gray-500 mt-2">
          {p.beds} beds • {p.baths} baths • {p.area}
        </div>
        {p.agent && (
          <div className="flex items-center mt-3">
            <img
              src="/images/agent-sarah.png"
              alt={p.agent}
              className="w-6 h-6 rounded-full mr-2"
            />
            <div className="text-xs text-gray-600">
              {p.agent}{" "}
              <img
                src="/icons/verifiedbadge.svg"
                alt="Verified"
                className="inline w-4 h-4 ml-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Full-card clickable overlay; favorite button stays above via z-30 */}
      <Link
        href={linkHref}
        className="absolute inset-0 z-10"
        aria-label={`View ${p.title}`}
      />
    </div>
  );
}
