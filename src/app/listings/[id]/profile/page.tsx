import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProfileListingsGrid from '@/components/ProfileListingsGrid';

type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  agentId?: number;
  agent?: string;
  tag?: string;
  beds?: number;
  baths?: number;
  area?: string;
};

export default function ListingAgentProfile({ params }: { params: { id: string } }) {
  const listingId = Number(params?.id || 0);

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
  // compute a safe starting id that doesn't collide with existing sampleProperties
  const maxExistingId = Math.max(...sampleProperties.map((s) => s.id), 0);
  let nextId = maxExistingId + 1;
  while (listings.length < 6) {
    const i = listings.length - existingForAgent.length; // index among generated ones
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb / page heading (matches design mock) */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500">
              <Link href={`/listings/${listingId}`} className="text-blue-600 underline">Property Details</Link>
              <span className="px-2">›</span>
              <span className="text-gray-900 font-semibold">Profile</span>
            </div>

            {/* Share controls on the right (stacked) */}
            <div className="flex flex-col items-end gap-2">
              <button aria-label="Share options" className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center">
                <img src="/icons/share.svg" alt="share" className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left profile card (pixel-accurate to mock) */}
            <aside className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-white shadow-sm">
                    <img src="/images/agent-sarah.png" alt={agentName} className="w-full h-full object-cover" />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{agentName}</h2>
                    <img src="/icons/verifiedbadge.svg" alt="verified" className="w-5 h-5" />
                  </div>

                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>(0)</span>
                    <img src="/icons/star-off.svg" alt="stars" className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full border border-gray-200 rounded-lg py-3 text-sm text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50">
                    <img src="/icons/messages.svg" className="w-5 h-5 text-gray-500" alt="msg" />
                    <span className="font-medium">Send a message</span>
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-6 text-gray-400">
                    <img src="/icons/x.svg" className="w-5 h-5" alt="tw" />
                    <img src="/icons/instagram.svg" className="w-5 h-5" alt="ig" />
                    <img src="/icons/linkedin.svg" className="w-5 h-5" alt="li" />
                    <img src="/icons/fb.svg" className="w-5 h-5" alt="fb" />
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

              {/* Listings grid (profile) - uses client component for interactive features */}
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
                    <img src="/images/agent-sarah.png" className="w-10 h-10 rounded-full" alt="reviewer" />
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
