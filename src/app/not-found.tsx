"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';


export default function NotFoundPage() {
  const pathname = usePathname() || '';
  const params = useParams() || {};
  const router = useRouter();
  const [q, setQ] = useState('');

  // pick a human-friendly label: prefer a route param (id/name), fall back to last path segment
  const paramValues = Object.values(params).filter(Boolean) as string[];
  const raw = paramValues[0] || pathname.split('/').filter(Boolean).slice(-1)[0] || 'page';
  // clean and presentable (remove dashes, underscores)
  const lastSegment = decodeURIComponent(String(raw)).replace(/[-_]/g, ' ');

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/listings?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-4xl w-full bg-white shadow-md rounded-2xl p-8 md:p-12 flex gap-8 items-center">
         

          <div className="flex-1 items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Whoops — we can't find <span className="text-blue-600">{lastSegment}</span></h1>

            <p className="mt-4 text-gray-600 text-base">It looks like the page you were trying to reach doesn't exist (anymore) or the link is broken. Don't worry — here's how you can continue:</p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm ">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">•</span>
                <div>
                  <div className="font-medium">Search listings</div>
                  <div className="text-gray-500">Quickly look for properties by location, type or name.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">•</span>
                <div>
                  <div className="font-medium">Browse categories</div>
                  <div className="text-gray-500">Check the latest for sale and for rent listings.</div>
                </div>
              </li>
            </ul>

            <form onSubmit={onSearch} className="mt-6 flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search properties (e.g. Enugu, 3-bedroom)"
                className="flex-1 border rounded-lg px-4 py-3"
                aria-label="Search listings"
              />
              <button type="submit" className="bg-[#2563EB] hover:bg-blue-600 transition-colors text-white px-4 py-3 rounded-lg">Search</button>
            </form>

            <div className="mt-6 flex text-white flex-wrap gap-3 items-center justify-center">
              <Link href="/" className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 transition-colors">Home</Link>
              <Link href="/listings" className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 transition-colors">Listings</Link>
              <Link href="/sell" className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 transition-colors">Sell Your Property</Link>
              <Link href="/auth/signup?role=real-estate-agent" className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 transition-colors">Become An Agent</Link>
            </div>

            <div className="mt-6 text-sm text-gray-500">If this was a link from our site, please <Link href="/contact" className="text-blue-600 underline">report it</Link> so we can fix it.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
