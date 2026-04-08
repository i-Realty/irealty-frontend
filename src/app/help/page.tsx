import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Help Center | i-Realty', description: 'Get help with your i-Realty account, listings, payments, and more.' };

const TOPICS = [
  { title: 'Getting Started', desc: 'Account setup, KYC verification, and profile settings.', href: '/faqs' },
  { title: 'Listings & Properties', desc: 'How to create, edit, and manage property listings.', href: '/faqs' },
  { title: 'Payments & Escrow', desc: 'Wallet top-up, withdrawal, and escrow transactions.', href: '/escrow' },
  { title: 'Booking Tours', desc: 'Schedule and manage property inspections.', href: '/faqs' },
  { title: 'Legal & Documents', desc: 'Lease agreements, sale agreements, and i-Verify.', href: '/legal-support' },
  { title: 'Contact Support', desc: 'Reach our team directly for urgent issues.', href: '/contact' },
];

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-500 mb-10">How can we help you today?</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {TOPICS.map((t) => (
              <Link key={t.title} href={t.href} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                <h2 className="font-semibold text-gray-900 mb-1">{t.title}</h2>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
