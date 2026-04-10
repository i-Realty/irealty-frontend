"use client";

import React from "react";
import Image from 'next/image';

export default function AgentDiasporaPromo() {
  return (
    <section className="w-full py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Agent Card */}
          <div
            className="w-full rounded-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#DBEAFE] flex flex-col dark:bg-gray-800"
            style={{ background: "#FFF7ED" }}
            tabIndex={0}
            role="button"
          >
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col h-full">
              <div className="mb-3">
                <span className="uppercase font-bold text-xs px-3 py-1 rounded-full" style={{ background: "#FDE68A", color: "#B45309", fontFamily: 'Lato', letterSpacing: '0.08em' }}>Agent</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white" style={{ fontFamily: 'Lato', marginBottom: 8 }}>Become a Verified Agent. Build Trust, Close Deals.</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4" style={{ fontFamily: 'Lato', lineHeight: '1.6' }}>
                Join i-Realty to access verified clients, manage listings with ease, and grow your real estate business on a trusted platform.
              </p>
              <a href="/auth/signup?role=real-estate-agent" className="inline-block font-semibold mb-4" style={{ color: '#B45309', fontFamily: 'Lato' }}>
                Join As A Verified Agent <span className="ml-2 text-lg">→</span>
              </a>

              <div className="mt-auto flex justify-center">
                <div className="w-full max-w-[420px]">
                  <Image src="/images/agent-illustration.png" alt="Agent illustration" width={517} height={386} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Diaspora Investors Card */}
          <div
            className="w-full rounded-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#DBEAFE] flex flex-col dark:bg-gray-800"
            style={{ background: "#F3F6FF" }}
            tabIndex={0}
            role="button"
          >
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col h-full">
              <div className="mb-3">
                <span className="uppercase font-bold text-xs px-3 py-1 rounded-full" style={{ background: "#DBEAFE", color: "#2563EB", fontFamily: 'Lato', letterSpacing: '0.08em' }}>Diaspora Investors</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white" style={{ fontFamily: 'Lato', marginBottom: 8 }}>Invest From Anywhere, With Confidence</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4" style={{ fontFamily: 'Lato', lineHeight: '1.6' }}>
                Browse trusted listings, track ROI, and transact securely—wherever you are in the world.
              </p>
              <a href="/auth/signup?role=diaspora-investors" className="inline-block font-semibold mb-4" style={{ color: '#2563EB', fontFamily: 'Lato' }}>
                Explore Verified Listings <span className="ml-2 text-lg">→</span>
              </a>

              <div className="mt-auto flex justify-center">
                <div className="w-full max-w-[420px]">
                  <Image src="/images/diaspora-illustration.png" alt="Diaspora illustration" width={517} height={386} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
