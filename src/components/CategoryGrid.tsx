"use client";

import React from "react";
import { useRouter } from 'next/navigation';

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
    <section className="w-full bg-white" style={{ padding: "72px 0" }}>
      <div className="mx-auto" style={{ width: 1440 }}>
        <div style={{ padding: "0 112px" }} className="mx-auto">
          <div style={{ width: 1216 }} className="mx-auto">
            <h2 style={{ fontFamily: 'Lato', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Explore Property by Category</h2>
            <div className="grid grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    const type = mapTitleToType(cat.title);
                    if (type) router.push(`/listings?propertyType=${encodeURIComponent(type)}`);
                    else router.push('/listings');
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const type = mapTitleToType(cat.title); if (type) router.push(`/listings?propertyType=${encodeURIComponent(type)}`); else router.push('/listings'); } }}
                  className="relative rounded-lg overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  style={{ height: 250 }}
                >
                  <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div style={{ background: 'rgba(4,12,16,0.6)' }} className="absolute inset-0" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div style={{ color: '#FFFFFF', fontFamily: 'Lato', fontSize: 14 }}>{cat.title}</div>
                      <div style={{ background: '#FFFFFF', color: '#111827', borderRadius: 9999, padding: '6px 10px', fontWeight: 700, fontFamily: 'Lato', fontSize: 12 }}>{cat.count}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
