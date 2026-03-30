import React from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import type { PropertyWithCoords } from "@/lib/types";

interface SimilarPropertiesProps {
  /** Enables linking to developer subroutes, e.g. "/listings/developers" */
  hrefPrefix?: string;
  /** The dataset to show — typically the same dataset the detail page uses */
  properties: PropertyWithCoords[];
}

export default function SimilarProperties({ hrefPrefix = "/listings", properties }: SimilarPropertiesProps) {
  const data = properties;

  return (
    <section className="w-full bg-white">
      <div className="px-4 py-6 sm:px-8 md:px-16 lg:px-40 sm:py-10">
        <h3 className="text-lg font-semibold mb-6 max-w-7xl mx-auto">Similar Properties</h3>
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.slice(0, 3).map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                href={`${hrefPrefix}/${p.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
