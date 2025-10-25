"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';

const properties = [
  {
    id: 1,
    image: "/images/property1.png",
    status: "For Rent",
    title: "Modern Duplex in Enugu For Rent Modern Family...",
    location: "Independence Layout, Enugu",
    price: "₦ 20,000,000.00",
    priceSuffix: "",
    beds: 3,
    baths: 2,
    area: "120 sqm",
    agent: "Sarah Homes",
    agentAvatar: "/images/agent-sarah.png"
  },
  {
    id: 2,
    image: "/images/property2.png",
    status: "For Sale",
    title: "Modern Duplex in Enugu For Sale Modern Family...",
    location: "Independence Layout, Enugu",
    price: "₦ 20,000,000.00",
    priceSuffix: "/Year",
    beds: 3,
    baths: 2,
    area: "120 sqm",
    agent: "Sarah Homes",
    agentAvatar: "/images/agent-sarah.png"
  },
  {
    id: 3,
    image: "/images/property1.png",
    status: "For Rent",
    title: "Modern Duplex in Enugu For Rent Modern Family...",
    location: "Independence Layout, Enugu",
    price: "₦ 20,000,000.00",
    priceSuffix: "",
    beds: 3,
    baths: 2,
    area: "120 sqm",
    agent: "Sarah Homes",
    agentAvatar: "/images/agent-sarah.png"
  },
  {
    id: 4,
    image: "/images/property2.png",
    status: "For Rent",
    title: "Modern Duplex in Enugu For Rent Modern Family...",
    location: "Independence Layout, Enugu",
    price: "₦ 20,000,000.00",
    priceSuffix: "",
    beds: 3,
    baths: 2,
    area: "120 sqm",
    agent: "Sarah Homes",
    agentAvatar: "/images/agent-sarah.png"
  },
  {
    id: 5,
    image: "/images/property1.png",
    status: "For Sale",
    title: "Modern Duplex in Enugu For Sale Modern Family...",
    location: "Independence Layout, Enugu",
    price: "₦ 20,000,000.00",
    priceSuffix: "/Year",
    beds: 3,
    baths: 2,
    area: "120 sqm",
    agent: "Sarah Homes",
    agentAvatar: "/images/agent-sarah.png"
  },
  {
    id: 6,
    image: "/images/property2.png",
    status: "For Rent",
    title: "Modern Duplex in Enugu For Rent Modern Family...",
    location: "Independence Layout, Enugu",
    price: "₦ 20,000,000.00",
    priceSuffix: "",
    beds: 3,
    baths: 2,
    area: "120 sqm",
    agent: "Sarah Homes",
    agentAvatar: "/images/agent-sarah.png"
  }
];


export default function RecentProperties() {
  // Unused local UI state removed to satisfy lint rules. If you need tabs/search later,
  // reintroduce them when implementing the interactive behavior.
  // const [activeTab, setActiveTab] = useState(0);
  // const [search, setSearch] = useState("");
  // const [selectedType, setSelectedType] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  function toggleLike(id: number) {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <section className="w-full bg-white" style={{ padding: "72px 0" }}>
      <div className="mx-auto" style={{ width: 1440 }}>
        <div style={{ padding: "0 112px" }} className="mx-auto">
          <div style={{ width: 1216 }} className="mx-auto">
            <h2 style={{ fontFamily: 'Lato', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Explore Recent Properties</h2>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {properties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#F1F1F1] transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg relative">
                  <div className="relative" style={{ height: 312 }}>
                    <Image src={prop.image} alt={prop.title} fill className="rounded-lg object-cover" />
                    <div
                      className={`absolute left-4 top-4 text-xs font-bold px-4 py-1 rounded-full ${prop.status && prop.status.toLowerCase().includes('sale') ? 'bg-[#2563EB] text-white' : 'bg-white text-[#2563EB]'}`}
                      style={{ fontFamily: 'Lato', fontSize: 14 }}
                    >
                      {prop.status}
                    </div>
                    <button
                      onClick={() => toggleLike(prop.id)}
                      aria-pressed={likedIds.has(prop.id)}
                      className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#160B0B]/80 p-1"
                    >
                      <Image
                        src={likedIds.has(prop.id) ? "/icons/favorite-filled.svg" : "/icons/favorite.svg"}
                        alt={likedIds.has(prop.id) ? 'Unfavorite' : 'Favorite'}
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-[#090202] text-base" style={{ fontFamily: 'Lato', marginBottom: 2 }}>{prop.title}</div>
                    <div className="text-xs text-[#8E98A8] mb-2" style={{ fontFamily: 'Lato' }}>{prop.location}</div>
                    <div className="font-bold text-lg text-[#090202]" style={{ fontFamily: 'Lato', marginBottom: 2 }}>{prop.price}<span className="text-xs text-[#8E98A8] font-normal">{prop.priceSuffix}</span></div>
                    <div className="text-xs text-[#8E98A8] mb-2" style={{ fontFamily: 'Lato' }}>{prop.beds} beds • {prop.baths} baths • {prop.area}</div>
                    <div className="flex items-center mt-2">
                      <Image src={prop.agentAvatar} alt={prop.agent} width={24} height={24} className="w-6 h-6 rounded-full mr-2" />
                      <span className="text-xs text-[#8E98A8] flex items-center" style={{ fontFamily: 'Lato' }}>
                        {prop.agent}
                        <Image src="/icons/verifiedbadge.svg" alt="Verified" width={16} height={16} className="w-4 h-4 ml-2" />
                      </span>
                    </div>
                  </div>
                  {/* clickable overlay (preserve favorite button by placing it above via z-index) */}
                  <Link href={`/listings/${prop.id}`} className="absolute inset-0 z-20" aria-label={`View property ${prop.id}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/listings" className="px-6 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] font-bold inline-flex items-center" style={{ fontFamily: 'Lato', fontSize: 14 }}>
                View More Properties <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
