'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useSettingsStore, type PublicAgentProfile } from '@/lib/store/useSettingsStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

type AgentListing = {
  id: string | number;
  title: string;
  location: string;
  price: string;
  image: string;
};

// Fallback mock data for non-API / error states
const FALLBACK_AGENT: PublicAgentProfile = {
  id: '1',
  name: 'Sarah Homes',
  displayName: 'Sarah Homes',
  avatarUrl: '/images/agent-sarah.png',
  bio: 'Trusted real estate agent helping clients buy, sell, and rent properties with ease and transparency.',
  kycStatus: 'verified',
  socials: { linkedin: '', facebook: '', instagram: '', twitter: '' },
};

const FALLBACK_LISTINGS: AgentListing[] = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  title: `Modern Duplex in Enugu — Unit ${i + 1}`,
  location: 'Independence Layout, Enugu',
  price: '₦ 20,000,000.00',
  image: i % 2 === 0 ? '/images/property1.png' : '/images/property2.png',
}));

export default function AgentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPublicAgentProfile } = useSettingsStore();

  const [agent, setAgent] = useState<PublicAgentProfile | null>(null);
  const [listings, setListings] = useState<AgentListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!USE_API) {
      setAgent(FALLBACK_AGENT);
      setListings(FALLBACK_LISTINGS);
      setIsLoading(false);
      return;
    }

    getPublicAgentProfile(id).then(data => {
      setAgent(data ?? FALLBACK_AGENT);
    }).catch(() => {
      setAgent(FALLBACK_AGENT);
    }).finally(() => setIsLoading(false));

    // Fetch agent listings (best-effort)
    fetch(`/api/agents/${id}/listings`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: any[] = Array.isArray(data) ? data : data?.items ?? data?.listings ?? [];
        setListings(raw.map((l: Record<string, unknown>) => ({
          id:       String(l.id ?? ''),
          title:    String(l.title ?? ''),
          location: [l.city, l.state].filter(Boolean).join(', ') || String(l.location ?? ''),
          price:    l.price ? `₦ ${((Number(l.price)) / 100).toLocaleString('en-NG')}.00` : '',
          image:    (l.images as { url: string }[])?.[0]?.url ?? '/images/property1.png',
        })));
      })
      .catch(() => { /* non-critical — leave listings empty */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const display = agent ?? FALLBACK_AGENT;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3">
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                {isLoading ? (
                  <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse mx-auto" />
                ) : (
                  <Image
                    src={display.avatarUrl || '/images/agent-sarah.png'}
                    alt={display.name}
                    width={96}
                    height={96}
                    className="rounded-full mx-auto object-cover"
                    unoptimized
                  />
                )}

                {isLoading ? (
                  <div className="mt-4 space-y-2">
                    <div className="h-5 bg-gray-100 animate-pulse rounded mx-auto w-32" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded mx-auto w-24" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-center text-lg font-semibold mt-4">{display.displayName || display.name}</h2>
                    {display.kycStatus === 'verified' && (
                      <div className="text-center text-xs text-green-600 font-medium mt-0.5">Verified Agent</div>
                    )}
                    {display.bio && <div className="mt-4 text-sm text-gray-700">{display.bio}</div>}
                  </>
                )}

                <div className="mt-6">
                  <button className="w-full bg-blue-600 text-white rounded-lg py-2 mb-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                    Send a message
                  </button>
                  <div className="flex items-center justify-center gap-3 mt-2 text-gray-500">
                    {display.socials.twitter && (
                      <a href={display.socials.twitter} target="_blank" rel="noopener noreferrer">
                        <Image src="/icons/twitter.svg" width={20} height={20} alt="Twitter" />
                      </a>
                    )}
                    {display.socials.linkedin && (
                      <a href={display.socials.linkedin} target="_blank" rel="noopener noreferrer">
                        <Image src="/icons/linkedin.svg" width={20} height={20} alt="LinkedIn" />
                      </a>
                    )}
                    {display.socials.instagram && (
                      <a href={display.socials.instagram} target="_blank" rel="noopener noreferrer">
                        <Image src="/icons/instagram.svg" width={20} height={20} alt="Instagram" />
                      </a>
                    )}
                    {!display.socials.twitter && !display.socials.linkedin && !display.socials.instagram && (
                      <>
                        <Image src="/icons/twitter.svg" width={20} height={20} alt="tw" />
                        <Image src="/icons/linkedin.svg" width={20} height={20} alt="li" />
                        <Image src="/icons/instagram.svg" width={20} height={20} alt="ig" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Listings</h3>
              </div>

              {listings.length === 0 && !isLoading ? (
                <div className="text-center py-12 text-gray-400 text-sm border rounded-lg">
                  No listings available.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {listings.map((l) => (
                    <div key={l.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                      <div className="relative h-[180px]">
                        <Image src={l.image} alt={l.title} fill className="object-cover" unoptimized />
                      </div>
                      <div className="p-4">
                        <div className="font-bold text-sm">{l.title}</div>
                        <div className="text-xs text-gray-500 mb-2">{l.location}</div>
                        <div className="font-bold text-lg">{l.price}</div>
                        <div className="flex items-center mt-3 gap-2">
                          <Image
                            src={display.avatarUrl || '/images/agent-sarah.png'}
                            alt={display.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                            unoptimized
                          />
                          <div className="text-xs text-gray-600">{display.displayName || display.name}</div>
                        </div>
                        <Link href={`/listings/${l.id}`} className="inline-block mt-3 text-sm text-blue-600">
                          View property
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
