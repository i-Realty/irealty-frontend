"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "How do I know if a property is legit?",
    answer:
      "All properties listed on i-Realty go through a verification process. We work only with vetted agents and landlords, and every listing includes ownership documentation and optional inspection reports.",
  },
  {
    question: "What is the escrow system, and how does it work?",
    answer:
      "Our escrow system securely holds funds until all parties have fulfilled their obligations, ensuring a safe and transparent transaction for buyers, sellers, and agents.",
  },
  {
    question: "Can I invest in Nigerian property from abroad?",
    answer:
      "Yes! i-Realty is designed for diaspora investors. You can browse verified listings, connect with trusted agents, and complete transactions securely from anywhere in the world.",
  },
  {
    question: "What types of listings can I find on i-Realty?",
    answer:
      "You can find residential, commercial, land, and shortlet properties for sale or rent, all verified and listed by trusted agents and landlords.",
  },
  {
    question: "How do agents join the platform?",
    answer:
      "Agents can apply to join i-Realty by submitting their credentials for verification. Once approved, they gain access to powerful tools and a trusted network.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No hidden fees. All charges are transparent and clearly communicated before any transaction is completed.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="w-full bg-white" style={{ padding: "96px 0 0 0" }}>
      <div className="mx-auto flex" style={{ width: 1440, minHeight: 480 }}>
        {/* Left: Heading (top aligned, exact replica) */}
        <div className="flex flex-col" style={{ width: 400, paddingLeft: 64, paddingTop: 64 }}>
          <h2 style={{ fontSize: 32, lineHeight: "40px", fontWeight: 700, fontFamily: "Lato", color: "#090202", marginBottom: 0 }}>
            Frequently Asked<br />Questions
          </h2>
        </div>
        {/* Right: FAQ List */}
        <div className="flex-1 flex flex-col" style={{ paddingLeft: 64, paddingRight: 64, paddingTop: 64 }}>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#E5E7EB] last:border-b-0">
              <button
                className="w-full flex items-center justify-between text-left"
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  fontFamily: "Lato",
                  paddingTop: 32,
                  paddingBottom: 32,
                  marginBottom: openIdx === i ? -24 : 0 
                }}
                onClick={() => setOpenIdx(i === openIdx ? -1 : i)}
              >
                <span style={{ fontWeight: 700, fontSize: 16, color: "#090202" }}>{faq.question}</span>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
                  {openIdx === i ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="11" width="14" height="2" rx="1" fill="#8E98A8" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="11" width="14" height="2" rx="1" fill="#8E98A8" />
                      <rect x="11" y="5" width="2" height="14" rx="1" fill="#8E98A8" />
                    </svg>
                  )}
                </span>
              </button>
              {openIdx === i && (
                <div style={{ 
                  color: "#8E98A8", 
                  fontSize: 14, 
                  lineHeight: "20px", 
                  fontFamily: "Lato",
                  paddingBottom: 32
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
