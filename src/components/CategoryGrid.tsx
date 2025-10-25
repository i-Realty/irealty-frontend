"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const categories = [
  { title: "Residential for Sale", count: 543, image: "/images/cat-residential.png" },
  { title: "Commercial Properties", count: 543, image: "/images/cat-commercial.png" },
  { title: "Land & Plots", count: 543, image: "/images/cat-land.png" },
  { title: "Short-Term & Vacation Rentals", count: 90, image: "/images/cat-shortlet.png" },
  { title: "Off-Plan & New Developments", count: 40, image: "/images/cat-offplan.png" },
  { title: "Diaspora-Friendly Listings", count: 543, image: "/images/cat-diaspora.png" },
];

export default function CategoryGrid() {
  const router = useRouter();

  const mapTitleToType = (title: string) => {
    if (title.toLowerCase().includes('residential')) return 'Residential';
    if (title.toLowerCase().includes('commercial')) return 'Commercial';
    if (title.toLowerCase().includes('land') || title.toLowerCase().includes('plot')) return 'Plots/Land';
    if (title.toLowerCase().includes('short-term') || title.toLowerCase().includes('short') || title.toLowerCase().includes('vacation')) return 'Service Apartments & Short Lets';
    return '';
  };
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6" style={{ fontFamily: 'Lato' }}>Explore Property by Category</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div
                key={cat.title + i}
                role="button"
                tabIndex={0}
                onClick={() => {
                  const type = mapTitleToType(cat.title);
                  if (type) router.push(`/listings?propertyType=${encodeURIComponent(type)}`);
                  else router.push('/listings');
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const type = mapTitleToType(cat.title); if (type) router.push(`/listings?propertyType=${encodeURIComponent(type)}`); else router.push('/listings'); } }}
                className="relative rounded-lg overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                style={{ height: 220 }}
              >
                <div className="absolute inset-0">
                  <Image src={cat.image} alt={cat.title} fill className="object-cover w-full h-full" />
                  <div style={{ background: 'rgba(4,12,16,0.6)' }} className="absolute inset-0" />
                </div>
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white text-sm" style={{ fontFamily: 'Lato' }}>{cat.title}</div>
                    <div className="bg-white text-[#111827] rounded-full px-3 py-1 font-bold text-sm" style={{ fontFamily: 'Lato' }}>{cat.count}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
