"use client";

import React, { useState } from "react";
import Image from 'next/image';
import {
  fullDescription,
  features,
  amenitiesData,
  documentsData,
  landmarksData,
} from "@/lib/data/propertyDetails";

export default function PropertyTabs() {
  const [activeTab, setActiveTab] = useState<'description'|'amenities'|'documents'|'landmarks'>('description');
  const [showFullDesc, setShowFullDesc] = useState(false);

  const previewDescription = fullDescription[0].length > 220 ? fullDescription[0].slice(0, 220) + '...' : fullDescription[0];

  return (
    <div className="mt-6">
      {/* tabs row - selected pill is elevated */}
      <div className="relative overflow-x-auto" role="tablist" aria-label="Property details tabs">
        <div className="flex items-start gap-2 sm:gap-4 lg:gap-6 min-w-max">
          <button
            id="tab-description"
            role="tab"
            aria-selected={activeTab === 'description'}
            aria-controls="panel-description"
            onClick={() => setActiveTab('description')}
            className={
              activeTab === 'description'
                ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                : 'px-6 py-3 text-sm text-gray-400'
            }
          >
            Description
          </button>

          <button
            id="tab-amenities"
            role="tab"
            aria-selected={activeTab === 'amenities'}
            aria-controls="panel-amenities"
            onClick={() => setActiveTab('amenities')}
            className={
              activeTab === 'amenities'
                ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                : 'px-6 py-3 text-sm text-gray-400'
            }
          >
            Amenities
          </button>

          <button
            id="tab-documents"
            role="tab"
            aria-selected={activeTab === 'documents'}
            aria-controls="panel-documents"
            onClick={() => setActiveTab('documents')}
            className={
              activeTab === 'documents'
                ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                : 'px-6 py-3 text-sm text-gray-400'
            }
          >
            Documents
          </button>

          <button
            id="tab-landmarks"
            role="tab"
            aria-selected={activeTab === 'landmarks'}
            aria-controls="panel-landmarks"
            onClick={() => setActiveTab('landmarks')}
            className={
              activeTab === 'landmarks'
                ? 'px-6 py-3 bg-white rounded-md text-sm font-semibold text-blue-600 shadow-md -mb-4'
                : 'px-6 py-3 text-sm text-gray-400'
            }
          >
            Landmarks
          </button>
        </div>
      </div>

      {/* tab panels */}
      <div className="mt-6">
        <div
          id="panel-description"
          role="tabpanel"
          aria-labelledby="tab-description"
          hidden={activeTab !== 'description'}
          className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'description' ? 'hidden' : ''}`}
        >
          {!showFullDesc ? (
            <>
              <p className="leading-relaxed">{previewDescription}</p>
              <button
                type="button"
                onClick={() => setShowFullDesc(true)}
                className="mt-2 text-blue-600 font-medium"
                aria-expanded={showFullDesc}
              >
                Read More
              </button>
            </>
          ) : (
            <>
              {fullDescription.map((p, i) => (
                <p key={i} className="leading-relaxed mb-4">{p}</p>
              ))}

              <div className="mt-2">
                <div className="font-medium mb-2">Key features</div>
                <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setShowFullDesc(false)}
                className="mt-4 text-blue-600 font-medium"
                aria-expanded={showFullDesc}
              >
                Show Less
              </button>
            </>
          )}
        </div>

        <div
          id="panel-amenities"
          role="tabpanel"
          aria-labelledby="tab-amenities"
          hidden={activeTab !== 'amenities'}
          className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'amenities' ? 'hidden' : ''}`}
        >
          {/* Tiled amenities layout (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenitiesData.map((a) => (
              <div key={a.key} className="flex items-start gap-3 p-3 border border-[#E4E4E4] rounded-lg bg-gray-50">
                <div className="flex-none w-9 h-9 rounded-full bg-white border border-[#E4E4E4] flex items-center justify-center shadow-sm">
                  <Image src="/icons/check.svg" alt="included" className="w-4 h-4"  width={16} height={16} />
                </div>
                <div>
                  <div className="font-medium text-sm">{a.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{a.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="panel-documents"
          role="tabpanel"
          aria-labelledby="tab-documents"
          hidden={activeTab !== 'documents'}
          className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'documents' ? 'hidden' : ''}`}
        >
          {/* Documents tiled layout (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documentsData.map((d) => (
              <div key={d.key} className="flex items-center justify-between gap-3 p-3 border border-[#E4E4E4] rounded-lg bg-white">
                <div className="flex items-start gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-gray-50 border border-[#E4E4E4] flex items-center justify-center">
                    <Image src="/icons/document.svg" alt="doc" className="w-4 h-4"  width={16} height={16} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{d.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{d.file} • {d.size}</div>
                  </div>
                </div>
                <a
                  href={`/documents/${d.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>

        <div
          id="panel-landmarks"
          role="tabpanel"
          aria-labelledby="tab-landmarks"
          hidden={activeTab !== 'landmarks'}
          className={`bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-sm ${activeTab !== 'landmarks' ? 'hidden' : ''}`}
        >
          {/* Landmarks tiled layout (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {landmarksData.map((l) => (
              <div key={l.key} className="flex items-center justify-between gap-3 p-3 border border-[#E4E4E4] rounded-lg bg-white">
                <div className="flex gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-gray-50 border border-[#E4E4E4] flex items-center justify-center">
                    <Image src="/icons/locationIcon.svg" alt="location" className="w-4 h-4"  width={16} height={16} />
                  </div>
                  <div className='flex items-center justify-center'>
                    <div className="font-medium text-sm">{l.label}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{l.dist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
