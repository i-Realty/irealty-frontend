"use client";

import React from "react";
import Link from "next/link";
import { sampleProperties } from "@/lib/data/properties";
import PropertyCard from "@/components/shared/PropertyCard";

export default function RecentProperties() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6" style={{ fontFamily: "Lato" }}>
            Explore Recent Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sampleProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/listings"
              className="px-6 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] font-bold inline-flex items-center"
              style={{ fontFamily: "Lato", fontSize: 14 }}
            >
              View More Properties <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
