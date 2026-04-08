import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Escrow Payment | i-Realty', description: 'How i-Realty escrow protects buyers and sellers in every transaction.' };

const STEPS = [
  { n: '1', title: 'Buyer initiates payment', desc: 'The buyer deposits the agreed amount into the i-Realty escrow account.' },
  { n: '2', title: 'Funds held securely', desc: 'i-Realty holds the funds until all conditions of the transaction are met.' },
  { n: '3', title: 'Property inspection', desc: 'The buyer inspects the property and confirms it meets the agreed description.' },
  { n: '4', title: 'Documents verified', desc: 'Both parties and our legal team confirm documentation is in order.' },
  { n: '5', title: 'Funds released', desc: 'Once all conditions are satisfied, funds are released to the seller.' },
];

export default function EscrowPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escrow Payment</h1>
          <p className="text-gray-500 mb-10">Every i-Realty transaction is protected by our escrow service — funds are never released until both parties are satisfied.</p>

          <div className="space-y-6 mb-12">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{s.n}</div>
                <div>
                  <h2 className="font-semibold text-gray-900">{s.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-2">Ready to transact safely?</h2>
            <p className="text-sm text-gray-600 mb-4">Sign up or log in to start buying, renting, or listing with full escrow protection.</p>
            <Link href="/auth/signup" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
