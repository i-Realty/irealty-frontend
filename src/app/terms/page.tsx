import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Terms of Service | i-Realty', description: 'i-Realty terms of service — the rules governing use of our platform.' };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16 prose prose-sm text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: April 2026</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">1. Acceptance</h2>
          <p>By creating an account or using i-Realty, you agree to these Terms of Service. If you disagree, please do not use the platform.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">2. Eligibility</h2>
          <p>You must be at least 18 years old and legally authorised to enter into contracts in Nigeria to use i-Realty.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">3. Listings & Accuracy</h2>
          <p>All property listings must be accurate and lawfully owned or managed by the lister. Fraudulent listings are prohibited and will result in account suspension.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">4. Payments & Escrow</h2>
          <p>All transactions are processed through our secure escrow system. i-Realty charges a service fee on completed transactions. Refunds are governed by the escrow policy.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">5. KYC Verification</h2>
          <p>Agents, developers, and landlords must complete identity verification before listing. Unverified accounts have limited functionality.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">6. Prohibited Use</h2>
          <p>You may not use i-Realty for money laundering, misrepresentation, or any activity prohibited under Nigerian law.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">7. Contact</h2>
          <p>Legal enquiries: <a href="mailto:legal@irealty.ng" className="text-blue-600">legal@irealty.ng</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
