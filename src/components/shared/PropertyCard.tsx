"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GitCompareArrows } from "lucide-react";
import type { Property } from "@/lib/types";
import { useFavouritesStore } from "@/lib/store/useFavouritesStore";
import { useComparisonStore } from "@/lib/store/useComparisonStore";

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
  const { hasItem, toggleItem } = useComparisonStore();
  const isLiked = likedIds.has(String(p.id));
  const isComparing = hasItem(p.id);
  const isForSale = p.tag?.toLowerCase().includes("sale");
  const linkHref = href ?? `/listings/${p.id}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-[#F1F1F1] dark:border-gray-700 relative">
      <div className="relative h-[200px] w-full">
        <Image
          src={p.image ?? "/images/property1.png"}
          alt={p.title}
          fill
          className="object-cover"
        />
        {p.tag && (
          <div
            className={`absolute z-20 left-4 top-4 text-xs font-bold px-3 py-1 rounded-full ${
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
          <Image
            src={isLiked ? "/icons/favorite-filled.svg" : "/icons/favorite.svg"}
            alt=""
            width={20}
            height={20}
          />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); toggleItem(p); }}
          className={`absolute right-4 top-14 w-8 h-8 flex items-center justify-center rounded-full p-1 z-30 transition-colors ${
            isComparing ? "bg-blue-600" : "bg-[#160B0B]/80 hover:bg-blue-600"
          }`}
          aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
          title={isComparing ? "Remove from comparison" : "Compare"}
        >
          <GitCompareArrows className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="p-4">
        <div className="font-bold text-sm text-[#090202] dark:text-white">{p.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{p.location}</div>
        <div className="font-bold text-lg text-[#090202] dark:text-white">{p.price}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {p.beds} beds • {p.baths} baths • {p.area}
        </div>
        {p.agent && (
          <div className="flex items-center mt-3 gap-2">
            <Image
              src="/images/agent-sarah.png"
              alt={p.agent}
              width={24}
              height={24}
              className="rounded-full"
            />
            <div className="text-xs text-gray-600 flex items-center gap-1">
              {p.agent}
              <Image
                src="/icons/verifiedbadge.svg"
                alt="Verified"
                width={16}
                height={16}
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

