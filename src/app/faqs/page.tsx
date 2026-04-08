import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'FAQs | i-Realty', description: 'Frequently asked questions about buying, renting, and listing properties on i-Realty.' };

const FAQS = [
  { q: 'How do I list a property on i-Realty?', a: 'Create an account as a Property Owner or Real Estate Agent, complete KYC verification, then use your dashboard to add new listings.' },
  { q: 'Is there a fee to list a property?', a: 'Basic listing is free. Premium placement and featured listings are available on paid plans — details are in your agent dashboard under Subscription Plans.' },
  { q: 'How does escrow payment work?', a: 'When a buyer pays for a property, funds are held securely in escrow until both parties complete their obligations. We release funds only after confirmation from both sides.' },
  { q: 'What is i-Verify?', a: 'i-Verify is our optional document verification service. Our legal team checks ownership certificates, survey plans, and other property documents to confirm authenticity.' },
  { q: 'How do I book a property tour?', a: 'On any listing page, click "Book A Tour", select a time slot, and complete the inspection fee payment. The agent will confirm your booking.' },
  { q: 'Can diaspora investors use i-Realty?', a: 'Yes. We offer dedicated services for Nigerians abroad, including escrow-backed transactions, property management support, and remote viewing options.' },
  { q: 'How do I contact support?', a: 'Use the Help Center in your dashboard, or visit our Contact page to reach our team directly.' },
];

export default function FaqsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-500 mb-10">Everything you need to know about i-Realty.</p>
          <div className="space-y-6">
            {FAQS.map((item) => (
              <div key={item.q} className="border-b border-gray-100 pb-6">
                <h2 className="font-semibold text-gray-900 mb-2">{item.q}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
