import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Sell Your Property | i-Realty', description: 'List your property for sale on i-Realty and connect with verified buyers across Nigeria.' };

export default function SellPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sell Your Property</h1>
          <p className="text-lg text-gray-500 mb-8">List your property on i-Realty and reach thousands of verified buyers. Create an owner account to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?role=property-owner" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Create Owner Account
            </Link>
            <Link href="/listings" className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Browse Listings
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
