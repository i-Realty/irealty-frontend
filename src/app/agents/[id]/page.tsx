"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Agent = {
  id: number;
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
  listings?: Array<{
    id: number;
    title: string;
    location: string;
    price: string;
    image: string;
  }>;
};

const sampleAgents: Agent[] = [
  {
    id: 1,
    name: 'Sarah Homes',
    title: 'Trusted real estate agent',
    avatar: '/images/agent-sarah.png',
    bio: 'Trusted real estate agent helping clients buy, sell, and rent properties with ease and transparency',
    listings: Array.from({ length: 4 }).map((_, i) => ({
      id: i + 1,
      title: `Modern Duplex in Enugu — Unit ${i + 1}`,
      location: 'Independence Layout, Enugu',
      price: '₦ 20,000,000.00',
      image: i % 2 === 0 ? '/images/property1.png' : '/images/property2.png',
    })),
  },
  {
    id: 2,
    name: 'Kelly Williams',
    title: 'Property consultant',
    avatar: '/images/agent-sarah.png',
    bio: 'Experienced in residential sales and client relations',
    listings: Array.from({ length: 3 }).map((_, i) => ({
      id: i + 10,
      title: `Family Home — ${i + 1}`,
      location: 'Victoria Island, Lagos',
      price: '₦ 35,000,000.00',
      image: '/images/property1.png',
    })),
  },
  {
    id: 3,
    name: 'John Ade',
    title: 'Sales agent',
    avatar: '/images/agent-sarah.png',
    bio: 'Local expert with deep market knowledge',
    listings: Array.from({ length: 2 }).map((_, i) => ({
      id: i + 20,
      title: `Cozy Apartment ${i + 1}`,
      location: 'GRA, Enugu',
      price: '₦ 9,000,000.00',
      image: '/images/property2.png',
    })),
  },
];

export default function AgentProfile() {
  const params = useParams();
  const agentId = Number(params?.id || 0);
  const agent = sampleAgents.find((a) => a.id === agentId) ?? sampleAgents[0];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3">
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <img src={agent.avatar} alt={agent.name} className="w-24 h-24 rounded-full mx-auto" />
                <h2 className="text-center text-lg font-semibold mt-4">{agent.name}</h2>
                <div className="text-center text-xs text-gray-500">{agent.title}</div>
                <div className="mt-4 text-sm text-gray-700">{agent.bio}</div>

                <div className="mt-6">
                  <button className="w-full bg-blue-600 text-white rounded-lg py-2 mb-2">Send a message</button>
                  <div className="flex items-center justify-center gap-3 mt-2 text-gray-500">
                    <img src="/icons/twitter.svg" className="w-5 h-5" alt="tw" />
                    <img src="/icons/linkedin.svg" className="w-5 h-5" alt="li" />
                    <img src="/icons/instagram.svg" className="w-5 h-5" alt="ig" />
                  </div>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Listings</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {agent.listings?.map((l) => (
                  <div key={l.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                    <div className="relative" style={{ height: 180 }}>
                      <img src={l.image} alt={l.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-sm">{l.title}</div>
                      <div className="text-xs text-gray-500 mb-2">{l.location}</div>
                      <div className="font-bold text-lg">{l.price}</div>
                      <div className="flex items-center mt-3">
                        <img src={agent.avatar} alt={agent.name} className="w-6 h-6 rounded-full mr-2" />
                        <div className="text-xs text-gray-600">{agent.name}</div>
                      </div>
                      <Link href={`/listings/${l.id}`} className="inline-block mt-3 text-sm text-blue-600">View property</Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
