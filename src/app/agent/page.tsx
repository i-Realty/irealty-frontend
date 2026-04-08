import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Real Estate Agents | i-Realty', description: 'Find verified real estate agents in Nigeria or join i-Realty as an agent.' };

export default function AgentPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Real Estate Agents</h1>
          <p className="text-lg text-gray-500 mb-10">Find a trusted, verified agent to help you buy, sell, or rent — or join i-Realty as a licensed agent to grow your business.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            <div className="border border-gray-200 rounded-xl p-6 text-left">
              <h2 className="font-bold text-lg mb-2">Find an Agent</h2>
              <p className="text-sm text-gray-500 mb-4">Browse verified agents in your area and book a consultation.</p>
              <Link href="/listings" className="text-blue-600 font-medium text-sm hover:underline">Browse Listings →</Link>
            </div>
            <div className="border border-blue-200 bg-blue-50 rounded-xl p-6 text-left">
              <h2 className="font-bold text-lg mb-2">Become an Agent</h2>
              <p className="text-sm text-gray-500 mb-4">Sign up, complete KYC verification, and start listing properties.</p>
              <Link href="/auth/signup?role=real-estate-agent" className="text-blue-600 font-medium text-sm hover:underline">Register Now →</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
