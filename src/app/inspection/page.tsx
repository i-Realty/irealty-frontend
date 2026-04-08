import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Property Inspection | i-Realty', description: 'Book professional property inspections through i-Realty before you buy or rent.' };

const HOW = [
  { n: '1', title: 'Find a property', desc: 'Browse listings and select the property you want to inspect.' },
  { n: '2', title: 'Book a tour', desc: 'Click "Book A Tour" on the listing, choose a time slot, and pay the inspection fee.' },
  { n: '3', title: 'Meet the agent', desc: 'The verified agent will guide you through the property in person or via video.' },
  { n: '4', title: 'Get a report', desc: 'After the inspection, receive a property condition summary from the agent.' },
];

export default function InspectionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Inspection</h1>
          <p className="text-gray-500 mb-10">Never buy or rent a property unseen. Our verified agents conduct professional property tours to give you full confidence.</p>

          <div className="space-y-6 mb-12">
            {HOW.map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{s.n}</div>
                <div>
                  <h2 className="font-semibold text-gray-900">{s.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/listings" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Browse Properties
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
