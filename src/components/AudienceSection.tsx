"use client";

import React, { useState } from "react";
import Image from 'next/image';

const tabs = [
  { label: "FOR BUYERS & RENTERS", width: "w-[185px]" },
  { label: "FOR SELLERS & LANDLORDS", width: "w-[213px]" },
  { label: "FOR AGENTS", width: "w-[96px]" },
  { label: "FOR DIASPORA INVESTORS", width: "w-[206px]" },
  { label: "FOR DEVELOPERS", width: "w-[99px]" },
];

const banners = [
  {
    title: "For Buyers & Renters",
    subtitle: "Find your dream home / properties with confidence.",
    cta: "Search Available Properties",
    bg: "/images/audience-buyers.png",
    ctaHref: "/listings",
    bgPosition: "center top",
    bgSize: "cover"
  },
  {
    title: "For Sellers & Landlords",
    subtitle: "Connect with serious, verified clients.",
    cta: "Post Free Property Ads",
    bg: "/images/audience-sellers.png",
    ctaHref: "/auth/signup?role=property-owner",
    bgPosition: "center top",
    bgSize: "cover"
  },
  {
    title: "For Agents",
    subtitle: "Grow your business with powerful tools & a trusted brand.",
    cta: "Join As A Verified Agent",
    bg: "/images/audience-agents.png",
    ctaHref: "/auth/signup?role=real-estate-agent",
    bgPosition: "center",
    bgSize: "cover"
  },
  {
    title: "For Diaspora Investors",
    subtitle: "Invest in Nigerian property securely from anywhere in the world.",
    cta: "Explore Verified Listings",
    bg: "/images/audience-diaspora.png",
    ctaHref: "/listings/developers",
    bgPosition: "center",
    bgSize: "cover"
  },
  {
    title: "For Developers",
    subtitle: "Showcase your projects and reach verified buyers and investors.",
    cta: "Contact Our Sales Team",
    bg: "/images/audience-devs.png",
    ctaHref: "/auth/signup?role=developers",
    bgPosition: "center",
    bgSize: "cover"
  },
];

export default function AudienceSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto">
          {/* Heading block */}
          <div className="flex flex-col items-center justify-center gap-6 text-center mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{ fontFamily: 'Lato', color: '#090202' }}>Made for Everyone in Real Estate</h2>
            <p className="text-sm sm:text-base text-[#8E98A8] max-w-2xl">Whether you&apos;re buying, renting, selling, or investing from abroad — we give you the tools and trust you need to succeed.</p>
          </div>

          {/* Tabs - scrollable on small screens */}
          <div className="mx-auto border-b border-[#F1F1F1] overflow-x-auto">
            <nav className="flex gap-2 sm:gap-4 items-center" style={{ height: 52 }}>
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-3 ${i === active ? 'border-b-4 border-[#2563EB]' : ''}`}
                  style={{ background: 'transparent' }}
                >
                  <span className="whitespace-nowrap text-xs sm:text-sm" style={{ lineHeight: '20px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Lato', color: i === active ? '#2563EB' : '#8E98A8' }}>{t.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Banner area (changes with active tab) */}
          {(() => {
            const b = banners[active] || banners[0];
            return (
              <div className="mx-auto mt-8">
                <div className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[520px] flex items-center justify-center">
                  {/* background image using next/image fill */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <Image src={b.bg} alt={b.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-[rgba(4,12,16,0.6)]" />
                  </div>

                  {/* centered banner content */}
                  <div className="relative z-10 mx-4 sm:mx-6 lg:mx-0 w-full max-w-4xl">
                    <div className="bg-[rgba(4,12,16,0.0)] rounded-lg flex items-center justify-center">
                      <div className="text-center px-4 py-8 sm:py-12">
                        <h3 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: 'Lato' }}>{b.title}</h3>
                        <p className="text-sm sm:text-base text-white mb-4 max-w-2xl mx-auto">{b.subtitle}</p>
                        <a href={b.ctaHref} className="inline-block bg-[#2563EB] text-white font-bold rounded-lg px-4 sm:px-6 py-2 sm:py-3">
                          <span className="text-sm sm:text-base" style={{ fontWeight: 700 }}>{b.cta}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
