"use client";

import React, { useState } from "react";

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
    ctaHref: "/search",
    bgPosition: "center top",
    bgSize: "cover"
  },
  {
    title: "For Sellers & Landlords",
    subtitle: "Connect with serious, verified clients.",
    cta: "Post Free Property Ads",
    bg: "/images/audience-sellers.png",
    ctaHref: "/post",
    bgPosition: "center top",
    bgSize: "cover"
  },
  {
    title: "For Agents",
    subtitle: "Grow your business with powerful tools & a trusted brand.",
    cta: "Join As A Verified Agent",
    bg: "/images/audience-agents.png",
    ctaHref: "/become-agent",
    bgPosition: "center",
    bgSize: "cover"
  },
  {
    title: "For Diaspora Investors",
    subtitle: "Invest in Nigerian property securely from anywhere in the world.",
    cta: "Explore Verified Listings",
    bg: "/images/audience-diaspora.png",
    ctaHref: "/listings",
    bgPosition: "center",
    bgSize: "cover"
  },
  {
    title: "For Developers",
    subtitle: "Showcase your projects and reach verified buyers and investors.",
    cta: "Contact Our Sales Team",
    bg: "/images/audience-devs.png",
    ctaHref: "/contact",
    bgPosition: "center",
    bgSize: "cover"
  },
];

export default function AudienceSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-white" style={{ padding: "96px 0" }}>
      <div className="mx-auto" style={{ width: 1440 }}>
        <div style={{ padding: "0 112px" }} className="mx-auto">
          <div style={{ width: 1216 }} className="mx-auto">
            {/* Heading block */}
            <div style={{ height: 208 }} className="flex flex-col items-center justify-center gap-10">
              <div style={{ width: 1216, height: 116 }} className="flex flex-col items-center justify-center">
                <h2 className="text-center" style={{ width: 1216, height: 52, fontSize: 40, lineHeight: "52px", fontWeight: 700, fontFamily: "Lato", color: "#090202" }}>Made for Everyone in Real Estate</h2>
                <p className="mt-4 text-center" style={{ width: 580, height: 48, fontSize: 16, lineHeight: "24px", color: "#8E98A8" }}>Whether you&apos;re buying, renting, selling, or investing from abroad — we give you the tools and trust you need to succeed.</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ width: 1100 }} className="mx-auto border-b border-[#F1F1F1]">
              <nav className="grid grid-cols-5 items-center" style={{ height: 52 }}>
                {tabs.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setActive(i)}
                    className={`flex items-center justify-center px-4 py-4 w-full ${i === active ? 'border-b-4 border-[#2563EB]' : ''}`}
                    style={{ background: 'transparent' }}
                  >
                    <span className="whitespace-nowrap" style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Lato', color: i === active ? '#2563EB' : '#8E98A8' }}>{t.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Banner area (changes with active tab) */}
            {(() => {
              const b = banners[active] || banners[0];
              return (
                <div style={{ width: 1216, height: 536 }} className="mx-auto mt-16 relative">
                  {/* relatively positioned background image container (image larger than the banner) */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div
                      style={{
                        width: 1130,
                        height: 530,
                        backgroundImage: `url('${b.bg}')`,
                        backgroundSize: b.bgSize,
                        backgroundPosition: b.bgPosition,
                        transform: 'translateY(-4%) scale(1.08)',
                        borderRadius: '18px',
                      }}
                      className="filter brightness-90 z-0"
                    />

                    {/* banner absolutely centered on top of the image */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-[1104px] h-[424px] rounded-[16px] overflow-hidden flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[rgba(4,12,16,0.8)]" />

                        <div style={{ width: 531, height: 172 }} className="relative z-30 flex flex-col items-center justify-center gap-6">
                          <h3 className="md:whitespace-nowrap" style={{ fontSize: 57, lineHeight: '64px', fontWeight: 700, textAlign: 'center', color: '#FFFFFF', fontFamily: 'Lato' }}>{b.title}</h3>
                          <p className="md:whitespace-nowrap" style={{ fontSize: 16, lineHeight: '24px', color: '#FFFFFF', textAlign: 'center', width: 414 }}>{b.subtitle}</p>
                          <a href={b.ctaHref} className="flex items-center justify-center bg-[#2563EB] text-white font-bold rounded-lg" style={{ padding: '16px 24px', width: 244, height: 52 }}>
                            <span className="md:whitespace-nowrap" style={{ fontSize: 14, fontWeight: 700 }}>{b.cta}</span>
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
      </div>
    </section>
  );
}
