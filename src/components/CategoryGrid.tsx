"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { standardProperties, developerProperties } from '@/lib/data/properties';

const categoryConfig = [
  { title: "Residential for Sale", image: "/images/cat-residential.png" },
  { title: "Commercial Properties", image: "/images/cat-commercial.png" },
  { title: "Land & Plots", image: "/images/cat-land.png" },
  { title: "Short-Term & Vacation Rentals", image: "/images/cat-shortlet.png" },
  { title: "Off-Plan & New Developments", image: "/images/cat-offplan.png" },
  { title: "Diaspora-Friendly Listings", image: "/images/cat-diaspora.png" },
];

const allProps = [...standardProperties, ...developerProperties];

const getCount = (title: string) => {
  switch (title) {
    case "Residential for Sale":
      return allProps.filter((p) => p.category === 'sale' && !p.title.toLowerCase().match(/commercial|plot|land/)).length;
    case "Commercial Properties":
      return allProps.filter((p) => p.title.toLowerCase().includes('commercial')).length;
    case "Land & Plots":
      return allProps.filter((p) => p.title.toLowerCase().match(/plot|land/)).length;
    case "Short-Term & Vacation Rentals":
      return allProps.filter((p) => p.category === 'shortlet').length;
    case "Off-Plan & New Developments":
      return developerProperties.filter((p) => p.title.toLowerCase().includes('off-plan')).length;
    case "Diaspora-Friendly Listings":
      return developerProperties.length;
    default:
      return 0;
  }
};

const categories = categoryConfig.map(cat => ({
  ...cat,
  count: getCount(cat.title),
}));

export default function CategoryGrid() {
  const router = useRouter();

  const mapTitleToType = (title: string) => {
    if (title.toLowerCase().includes('residential')) return 'Residential';
    if (title.toLowerCase().includes('commercial')) return 'Commercial';
    if (title.toLowerCase().includes('land') || title.toLowerCase().includes('plot')) return 'Plots/Land';
    if (title.toLowerCase().includes('short-term') || title.toLowerCase().includes('short') || title.toLowerCase().includes('vacation')) return 'Service Apartments & Short Lets';
    return '';
  };

  const handleCardClick = (title: string) => {
    if (title === "Diaspora-Friendly Listings") {
      router.push('/listings/developers');
      return;
    }
    if (title === "Off-Plan & New Developments") {
      router.push('/listings/developers?propertyType=Off-Plan');
      return;
    }

    const type = mapTitleToType(title);
    if (type) {
      router.push(`/listings?propertyType=${encodeURIComponent(type)}`);
    } else {
      router.push('/listings');
    }
  };
  return (
    <section className="w-full bg-white dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: 'Lato' }}>Explore Property by Category</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div
                key={cat.title + i}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(cat.title)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(cat.title);
                  }
                }}
                className="relative rounded-lg overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                style={{ height: 220 }}
              >
                <div className="absolute inset-0">
                  <Image src={cat.image} alt={cat.title} fill className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/60 dark:bg-black/20" />
                </div>
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white text-sm" style={{ fontFamily: 'Lato' }}>{cat.title}</div>
                    <div className="bg-white text-[#111827] rounded-full px-3 py-1 font-bold text-sm flex-shrink-0" style={{ fontFamily: 'Lato' }}>{cat.count}</div>
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
