"use client";

import React, { useEffect, useState } from "react";
import { getFavorites, toggleFavorite as toggleFavLocal } from "@/lib/favorites";
import PropertyCard from "@/components/shared/PropertyCard";
import type { Property } from "@/lib/types";

export default function ProfileListingsGrid({ sampleProperties }: { sampleProperties: Property[] }) {
  const [likedIds, setLikedIds] = useState<Set<number>>(() => new Set(getFavorites()));

  function toggleLike(id: number) {
    toggleFavLocal(id);
    setLikedIds(new Set(getFavorites()));
  }

  useEffect(() => {
    function onChange() {
      setLikedIds(new Set(getFavorites()));
    }
    window.addEventListener("favorites-changed", onChange as EventListener);
    window.addEventListener("storage", onChange as EventListener);
    return () => {
      window.removeEventListener("favorites-changed", onChange as EventListener);
      window.removeEventListener("storage", onChange as EventListener);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleProperties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          likedIds={likedIds}
          onToggleLike={toggleLike}
        />
      ))}
    </div>
  );
}
