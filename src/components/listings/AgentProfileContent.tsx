import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProfileListingsGrid from '@/components/ProfileListingsGrid';
import type { Property } from '@/lib/types';
import Image from 'next/image';

interface AgentProfilePageProps {
  listingId: number;
  /** Base path for breadcrumb back-link, e.g. "/listings" or "/listings/developers" */
  basePath: string;
}

export default function AgentProfileContent({ listingId, basePath }: AgentProfilePageProps) {
  // reproduce the same sampleProperties logic used on the listing page so we can derive agent info
  const agentNames = ['Sarah Homes', 'Kelly Williams', 'John Ade'];

  const sampleProperties: Property[] = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: 'Modern Duplex in EnuguFor Sale Modern Family Duplex',
    location: 'Independence Layout, Enugu',
    price: '₦ 20,000,000.00',
    image: i % 2 === 0 ? '/images/property1.png' : '/images/property2.png',
    agent: agentNames[i % agentNames.length],
    agentId: (i % agentNames.length) + 1,
    tag: i % 2 === 0 ? 'For Rent' : 'For Sale',
    beds: 3 + (i % 3),
    baths: 2 + (i % 2),
    area: `${80 + i * 10} sqm`,
  }));

  // find the listing and then determine its agent
  const listing = sampleProperties.find((p) => p.id === listingId) ?? sampleProperties[0];
  const agentId = listing.agentId ?? 1;
  const agentName = listing.agent ?? agentNames[0];

  // include existing sampleProperties for this agent (preserve IDs so favorites sync),
  // then append generated properties to reach exactly 6 items
  const existingForAgent = sampleProperties.filter((p) => p.agentId === agentId);
  const listings: Property[] = [...existingForAgent];
  const maxExistingId = Math.max(...sampleProperties.map((s) => s.id), 0);
  let nextId = maxExistingId + 1;
  while (listings.length < 6) {
    listings.push({
      id: nextId++,
      title: `Modern Duplex — Unit ${listings.length + 1}`,
      location: 'Independence Layout, Enugu',
      price: `₦ ${18_000_000 + listings.length * 1_000_000}`,
      image: listings.length % 2 === 0 ? '/images/property1.png' : '/images/property2.png',
      agent: agentName,
      agentId: agentId,
      tag: listings.length % 2 === 0 ? 'For Rent' : 'For Sale',
      beds: 2 + (listings.length % 3),
      baths: 1 + (listings.length % 2),
      area: `${80 + listings.length * 12} sqm`,
    });
  }
  const agentListings = listings;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500">
              <Link href={`${basePath}/${listingId}`} className="text-blue-600 underline">Property Details</Link>
              <span className="px-2">›</span>
              <span className="text-gray-900 font-semibold">Profile</span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button aria-label="Share options" className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center">
                <Image src="/icons/share.svg" alt="share" className="w-5 h-5 text-gray-600"  width={20} height={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left profile card */}
            <aside className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-white shadow-sm">
                    <Image src="/images/agent-sarah.png" alt={agentName} className="w-full h-full object-cover"  width={800} height={600} />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{agentName}</h2>
                    <Image src="/icons/verifiedbadge.svg" alt="verified" className="w-5 h-5"  width={20} height={20} />
                  </div>

                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>(0)</span>
                    <Image src="/icons/star-off.svg" alt="stars" className="w-4 h-4"  width={16} height={16} />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full border border-gray-200 rounded-lg py-3 text-sm text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50">
                    <Image src="/icons/messages.svg" className="w-5 h-5 text-gray-500" alt="msg"  width={20} height={20} />
                    <span className="font-medium">Send a message</span>
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-6 text-gray-400">
                    <Image src="/icons/x.svg" className="w-5 h-5" alt="tw"  width={20} height={20} />
                    <Image src="/icons/instagram.svg" className="w-5 h-5" alt="ig"  width={20} height={20} />
                    <Image src="/icons/linkedin.svg" className="w-5 h-5" alt="li"  width={20} height={20} />
                    <Image src="/icons/fb.svg" className="w-5 h-5" alt="fb"  width={20} height={20} />
                  </div>
                </div>
              </div>
            </aside>

            {/* Right content */}
            <section className="lg:col-span-9">
              {/* About box */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
                <div className="text-sm font-semibold text-gray-700">About</div>
                <div className="text-sm text-gray-600 mt-2">Trusted real estate agent helping clients buy, sell, and rent properties with ease and transparency</div>
              </div>

              {/* Listings header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Listings</h3>
              </div>

              <ProfileListingsGrid sampleProperties={agentListings} />

              {/* Latest reviews */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Latest reviews</h4>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded bg-white border flex items-center justify-center">◀</button>
                    <button className="w-8 h-8 rounded bg-white border flex items-center justify-center">▶</button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Image src="/images/agent-sarah.png" className="w-10 h-10 rounded-full" alt="reviewer"  width={40} height={40} />
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-medium">Kelly Williams</div>
                        <div className="text-xs text-yellow-500">★★★★★</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Everything went as it should. You can therefore safely rent out your equipment to Fantom Film.</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
