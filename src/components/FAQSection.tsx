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
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full bg-white dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Heading */}
          <div className="md:pr-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight" style={{ fontFamily: 'Lato' }}>
              Frequently Asked
              <br />Questions
            </h2>
          </div>

          {/* Right: FAQ List (span 2 cols on md+) */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-200 last:border-b-0">
                  <button
                    className="w-full flex items-center justify-between text-left py-6 md:py-8 focus:outline-none"
                    style={{ fontFamily: 'Lato' }}
                    onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                    aria-expanded={openIdx === i}
                    aria-controls={`faq-panel-${i}`}
                  >
                    <span className="font-semibold text-base text-gray-900">{faq.question}</span>
                    <span className="flex items-center justify-center w-6 h-6 text-gray-400">
                      {openIdx === i ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="5" y="11" width="14" height="2" rx="1" fill="#8E98A8" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="5" y="11" width="14" height="2" rx="1" fill="#8E98A8" />
                          <rect x="11" y="5" width="2" height="14" rx="1" fill="#8E98A8" />
                        </svg>
                      )}
                    </span>
                  </button>

                  {openIdx === i && (
                    <div id={`faq-panel-${i}`} className="pb-6 text-sm text-gray-600" style={{ lineHeight: '1.6', fontFamily: 'Lato' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
