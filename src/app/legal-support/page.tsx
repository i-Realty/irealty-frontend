import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Legal Support | i-Realty', description: 'i-Realty legal support — property document verification, lease agreements, and legal guidance.' };

const SERVICES = [
  { title: 'Document Verification (i-Verify)', desc: 'We verify Certificates of Occupancy, survey plans, deeds of assignment, and other title documents to protect your investment.' },
  { title: 'Lease Agreement Generation', desc: 'Tenants and landlords can generate legally compliant rental agreements directly from the documents dashboard.' },
  { title: 'Sale Agreement Generation', desc: 'Structured property sale agreements covering all key terms, reviewed for compliance with Nigerian property law.' },
  { title: 'Legal Consultation', desc: 'Connect with a qualified property lawyer through our platform for bespoke advice on your transaction.' },
];

export default function LegalSupportPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Support</h1>
          <p className="text-gray-500 mb-10">Protecting your interests at every stage of a property transaction.</p>

          <div className="space-y-5 mb-12">
            {SERVICES.map((s) => (
              <div key={s.title} className="border border-gray-200 rounded-xl p-5">
                <h2 className="font-semibold text-gray-900 mb-1">{s.title}</h2>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Get Legal Help
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
