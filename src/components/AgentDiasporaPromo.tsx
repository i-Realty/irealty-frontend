"use client";

import React from "react";

export default function AgentDiasporaPromo() {
  return (
    <section className="w-full" style={{ padding: "56px 0" }}>
      <div className="mx-auto flex gap-8" style={{ width: 1440, padding: "0 64px" }}>
        {/* Agent Card */}
        <div
          className="flex-1 rounded-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#DBEAFE]"
          style={{ background: "#FFF7ED", padding: 40, minWidth: 0 }}
          tabIndex={0}
          role="button"
        >
          <div className="mb-2">
            <span className="uppercase font-bold text-xs px-3 py-1 rounded-full" style={{ background: "#FDE68A", color: "#B45309", fontFamily: 'Lato', letterSpacing: '0.08em' }}>Agent</span>
          </div>
          <h3 style={{ fontFamily: 'Lato', fontWeight: 700, fontSize: 24, color: '#090202', marginBottom: 12 }}>Become a Verified Agent. Build Trust, Close Deals.</h3>
          <p style={{ fontFamily: 'Lato', fontSize: 15, color: '#8E98A8', marginBottom: 24, lineHeight: '24px' }}>
            Join i-Realty to access verified clients, manage listings with ease, and grow your real estate business on a trusted platform.
          </p>
          <a href="#" style={{ fontFamily: 'Lato', fontWeight: 700, color: '#B45309', fontSize: 15, textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>
            Join As A Verified Agent <span style={{ marginLeft: 6, fontSize: 18 }}>→</span>
          </a>
          <div className="mt-2 flex justify-center">
            <img src="/images/agent-illustration.png" alt="Agent illustration" style={{ width: 517, height: 386, objectFit: 'contain' }} />
          </div>
        </div>
        {/* Diaspora Investors Card */}
        <div
          className="flex-1 rounded-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#DBEAFE]"
          style={{ background: "#F3F6FF", padding: 40, minWidth: 0 }}
          tabIndex={0}
          role="button"
        >
          <div className="mb-2">
            <span className="uppercase font-bold text-xs px-3 py-1 rounded-full" style={{ background: "#DBEAFE", color: "#2563EB", fontFamily: 'Lato', letterSpacing: '0.08em' }}>Diaspora Investors</span>
          </div>
          <h3 style={{ fontFamily: 'Lato', fontWeight: 700, fontSize: 24, color: '#090202', marginBottom: 12 }}>Invest From Anywhere, With Confidence</h3>
          <p style={{ fontFamily: 'Lato', fontSize: 15, color: '#8E98A8', marginBottom: 24, lineHeight: '24px' }}>
            Browse trusted listings, track ROI, and transact securely—wherever you are in the world.
          </p>
          <a href="#" style={{ fontFamily: 'Lato', fontWeight: 700, color: '#2563EB', fontSize: 15, textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>
            Explore Verified Listings <span style={{ marginLeft: 6, fontSize: 18 }}>→</span>
          </a>
          <div className="mt-2 flex justify-center">
            <img src="/images/diaspora-illustration.png" alt="Diaspora illustration" style={{ width: 517, height: 386, objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
