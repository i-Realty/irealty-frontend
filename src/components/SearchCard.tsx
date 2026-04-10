"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

type TabName = "buy" | "rent" | "shortlet";

export default function SearchCard() {
  const [activeTab, setActiveTab] = useState<TabName>("buy");
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<string>('fullhouse');
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    const opts = getOptionsForTab(activeTab);
    setSelected(opts.length > 0 ? opts[0].id : '');
  }, [activeTab]);

  const tabClass = (tab: TabName) =>
    `flex flex-row justify-center items-center px-4 h-10 gap-2 text-[14px] leading-5 tracking-[0.25px] ${
      activeTab === tab
        ? "border-b-4 border-[#2563EB] font-manrope font-bold text-[#2563EB]"
        : "font-manrope font-semibold text-[#8E98A8] dark:text-gray-400"
    }`;

  return (
    <section
      className="w-full max-w-[572px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg mx-auto flex flex-col items-center px-4 py-3"
    >
      {/* Tabs */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full border-b border-[#F1F1F1] dark:border-gray-700" style={{ minHeight: 52 }}>
        <button
          className={tabClass("buy")}
          aria-pressed={activeTab === "buy"}
          onClick={() => setActiveTab("buy")}
        >
          {t('search.buy')}
        </button>
        <button
          className={tabClass("rent")}
          aria-pressed={activeTab === "rent"}
          onClick={() => setActiveTab("rent")}
        >
          {t('search.rent')}
        </button>
        <button
          className={tabClass("shortlet")}
          aria-pressed={activeTab === "shortlet"}
          onClick={() => setActiveTab("shortlet")}
        >
          {t('search.shortlet')}
        </button>
      </div>

      {/* Search Input */}
      <div className="flex flex-row justify-between items-center w-full bg-[#F5F5F5] dark:bg-gray-700 rounded-xl mt-4 px-3 sm:px-4" style={{ minHeight: 56 }}>
        <div className="flex flex-row items-center gap-2" style={{ flex: 1 }}>
          {/* Location Icon from public folder */}
          <Image src="/icons/locationIcon.svg" alt="Location" width={20} height={20} className="object-contain" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('listings.searchByLocation')}
            className="text-[#8E98A8] dark:text-gray-300 dark:placeholder:text-gray-500 font-lato text-[14px] leading-5 bg-transparent outline-none w-full"
            aria-label="Search by location"
          />
        </div>
        <button
          onClick={() => {
            // map selected radio to listing property type
            const mapSelectedToType = (id: string) => {
              if (id === 'fullhouse') return 'Residential';
              if (id === 'commercial') return 'Commercial';
              if (id === 'landplot') return 'Plots/Land';
              if (id === 'pghostel') return 'PG/Hostel';
              return '';
            };
            // if shortlet tab, force Service Apartments & Short Lets property type
            let propertyType = '';
            if (activeTab === 'shortlet') {
              propertyType = 'Service Apartments & Short Lets';
            } else {
              propertyType = mapSelectedToType(selected);
            }
            // treat both 'rent' and 'shortlet' as rental purpose so Listings selects For Rent
            const purpose = activeTab === 'buy' ? 'sale' : 'rent';
            const params = new URLSearchParams();
            if (propertyType) params.set('propertyType', propertyType);
            if (purpose) params.set('purpose', purpose);
            if (search && search.trim()) params.set('q', search.trim());
            router.push(`/listings?${params.toString()}`);
          }}
          className="flex justify-center items-center bg-[#2563EB] rounded-full ml-3"
          style={{ width: 44, height: 44 }}
          aria-label="Search listings"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="1.5" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Property Type Radio (conditional) */}
      {activeTab !== "shortlet" && (
        <PropertyTypeRadios activeTab={activeTab} selected={selected} setSelected={setSelected} />
      )}
    </section>
  );
}

function PropertyTypeRadios({ activeTab, selected, setSelected }: { activeTab: TabName; selected: string; setSelected: (s: string) => void }) {
  const options = getOptionsForTab(activeTab);

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full mt-3">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
            <span className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
              <input
                type="radio"
                name="propertyType"
                value={opt.id}
                checked={isSelected}
                onChange={() => setSelected(opt.id)}
                className={`appearance-none w-6 h-6 rounded-full border ${isSelected ? 'border-[#2563EB]' : 'border-[#CBD5E1]'} bg-transparent`}
              />
                <span className={`absolute w-3 h-3 rounded-full ${selected === opt.id ? (opt.primary ? 'border border-[#2563EB]' : 'border border-[#2563EB]') : 'hidden'}`} style={{ background: selected === opt.id ? '#fff' : 'transparent' }} />
            </span>
            <span className={`${isSelected ? 'text-[#2563EB]' : 'text-[#8E98A8] dark:text-gray-400'} font-lato text-[14px] leading-5`}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function getOptionsForTab(tab: TabName) {
  if (tab === "buy") {
    return [
      { id: "fullhouse", label: "Full House", primary: true },
      { id: "commercial", label: "Commercial", primary: false },
      { id: "landplot", label: "Land/Plot", primary: false },
    ];
  }
  if (tab === "rent") {
    return [
      { id: "fullhouse", label: "Full House", primary: true },
      { id: "commercial", label: "Commercial", primary: false },
      { id: "pghostel", label: "PG/Hostel", primary: false },
    ];
  }
  return [];
}
