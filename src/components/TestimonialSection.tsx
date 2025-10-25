"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';

const testimonials = [
  {
    text: "Listing my properties on i-Realty has completely changed my business. The escrow system gives my clients peace of mind, and I’ve closed more deals in the last 3 months than the entire year before!",
    name: "Chuka E.",
    role: "Verified Agent in Enugu",
    avatar: "/images/testimonial-chuka.png"
  },
  {
    text: "i-Realty made buying my first home easy and stress-free. I felt safe every step of the way. The support team was always available to answer my questions and guide me through the process.",
    name: "Ada O.",
    role: "First-time Buyer in Lagos",
    avatar: "/images/testimonial-ada.png"
  },
  {
    text: "As a landlord, I found great tenants quickly. The platform is simple and effective. I appreciate the transparency and the quality of tenants I was able to connect with.",
    name: "Mr. Bello",
    role: "Landlord in Abuja",
    avatar: "/images/testimonial-bello.png"
  },
  {
    text: "Investing from abroad was seamless. I trust i-Realty for all my property needs. The escrow system made me feel secure and confident in every transaction.",
    name: "Ngozi U.",
    role: "Diaspora Investor, UK",
    avatar: "/images/testimonial-ngozi.png"
  },
  {
    text: "Our development projects reached more buyers thanks to i-Realty’s verified network. The exposure and credibility we gained have been invaluable for our business.",
    name: "Emeka D.",
    role: "Developer in PH",
    avatar: "/images/testimonial-emeka.png"
  }
];

export default function TestimonialSection() {
  // Infinite scroll animation (seamless, no flicker)
  const totalCards = testimonials.length;
  const DUPLICATE_COUNT = 2; // duplicate cards for seamless scroll
  const allCards = Array(DUPLICATE_COUNT).fill(testimonials).flat();

  const GAP = 24;
  const [cardWidth, setCardWidth] = useState<number>(600);
  const [cardHeight, setCardHeight] = useState<number>(320);
  const [x, setX] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    function updateSizes() {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      if (w < 640) {
        setCardWidth(300);
        setCardHeight(220);
      } else if (w < 1024) {
        setCardWidth(420);
        setCardHeight(280);
      } else {
        setCardWidth(600);
        setCardHeight(320);
      }
    }
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  const totalScrollWidth = allCards.length * (cardWidth + GAP);

  React.useEffect(() => {
    function animate() {
      if (!paused) {
        setX((prev) => {
          const speed = cardWidth > 500 ? 1.2 : 0.8;
          const next = prev - speed;
          const idx = Math.round(Math.abs(next) / (cardWidth + GAP)) % totalCards;
          setActiveIdx(idx);
          if (Math.abs(next) >= totalScrollWidth / DUPLICATE_COUNT) {
            return 0;
          }
          return next;
        });
      }
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [totalScrollWidth, paused, cardWidth]);

  // Dot click: scroll to selected testimonial and pause
  const handleDotDown = (i: number) => {
    setPaused(true);
    setActiveIdx(i);
    setX(-i * (cardWidth + GAP));
  };
  const handleDotUp = () => {
    setPaused(false);
  };

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: 'Lato' }}>Don’t Just Take Our Word For It</h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 mx-auto" style={{ maxWidth: 720 }}>
              From first-time buyers to seasoned agents and diaspora investors — see how i-Realty is transforming real estate experiences across Nigeria and beyond.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-full overflow-hidden flex items-center justify-center" style={{ height: cardHeight, position: 'relative' }}>
              <motion.div style={{ display: 'flex', gap: GAP, x }}>
                {allCards.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between"
                    style={{
                      minWidth: cardWidth,
                      maxWidth: cardWidth,
                      height: cardHeight,
                      background: "#090202",
                      borderRadius: 16,
                      color: "#fff",
                      opacity: 1,
                      boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
                      display: "flex"
                    }}
                    onMouseDown={() => { setPaused(true); }}
                    onMouseUp={() => { setPaused(false); }}
                    onMouseLeave={() => { setPaused(false); }}
                  >
                    <div className="flex flex-col justify-between h-full p-6 sm:p-8 lg:p-10">
                      <div>
                        <p className="text-sm sm:text-lg font-bold" style={{ fontFamily: "Lato", lineHeight: "28px" }}>{t.text}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-6">
                        <Image src={t.avatar} alt={t.name} width={cardWidth < 400 ? 36 : 40} height={cardWidth < 400 ? 36 : 40} className="rounded-full" />
                        <div>
                          <div className="font-bold" style={{ fontFamily: "Lato", fontSize: 16 }}>{t.name}</div>
                          <div className="text-sm" style={{ color: "#8E98A8", fontFamily: "Lato" }}>{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dots for navigation */}
            <div className="mt-8 flex gap-2 justify-center items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleDotDown(i)}
                  onMouseUp={handleDotUp}
                  onMouseLeave={handleDotUp}
                  className={`w-2.5 h-2.5 rounded-full ${i === activeIdx ? 'bg-blue-600 opacity-100' : 'bg-gray-300 opacity-60'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
