"use client";

import React from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import type { Property } from "@/lib/types";

// Favourites state is owned by useFavouritesStore inside PropertyCard — no local state needed here.
export default function ProfileListingsGrid({ sampleProperties }: { sampleProperties: Property[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleProperties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
