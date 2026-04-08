import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Diaspora Services | i-Realty', description: 'Invest in Nigerian real estate from anywhere in the world with i-Realty diaspora services.' };

const FEATURES = [
  { title: 'Remote Property Viewing', desc: 'Book virtual tours and video walkthroughs without being in Nigeria.' },
  { title: 'Escrow-Backed Transactions', desc: 'Your funds are protected in escrow until all conditions are met.' },
  { title: 'Care Manager Assigned', desc: 'A dedicated care manager guides you through every step of the process.' },
  { title: 'Document Verification (i-Verify)', desc: 'Our legal team verifies all property documents on your behalf.' },
  { title: 'Property Management', desc: 'We can manage your property, collect rent, and handle maintenance.' },
  { title: 'FX-Friendly Payments', desc: 'Pay in USD, GBP, EUR or other currencies — we handle the conversion.' },
];

export default function DiasporaServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diaspora Services</h1>
          <p className="text-gray-500 mb-10">Invest in Nigerian real estate from anywhere in the world — safely, transparently, and with expert support at every step.</p>

          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {FEATURES.map((f) => (
              <div key={f.title} className="border border-gray-200 rounded-xl p-5">
                <h2 className="font-semibold text-gray-900 mb-1">{f.title}</h2>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/auth/signup?role=diaspora-investors" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Open Diaspora Account
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
