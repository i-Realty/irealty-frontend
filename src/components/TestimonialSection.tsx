"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRef } from "react";

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
  const CARD_WIDTH = 600 + 24; // card width + gap
  const totalCards = testimonials.length;
  const DUPLICATE_COUNT = 2; // duplicate cards for seamless scroll
  const allCards = Array(DUPLICATE_COUNT).fill(testimonials).flat();
  const totalScrollWidth = allCards.length * CARD_WIDTH;
  const [x, setX] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const requestRef = useRef<number | null>(null);

  React.useEffect(() => {
    function animate() {
      if (!paused) {
        setX(prev => {
      const next = prev - 1.2;
    const idx = Math.round(Math.abs(next) / CARD_WIDTH) % totalCards;
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
  }, [totalScrollWidth, paused]);

  // Dot click: scroll to selected testimonial and pause
  const handleDotDown = (i: number) => {
    setPaused(true);
    setActiveIdx(i);
    setX(-i * CARD_WIDTH);
  };
  const handleDotUp = () => {
    setPaused(false);
  };

  return (
    <section className="w-full bg-white" style={{ padding: "96px 0 0 0" }}>
      <div className="mx-auto" style={{ width: 1440 }}>
        <div style={{ padding: "0 112px" }} className="mx-auto">
          <div style={{ width: 1216 }} className="mx-auto">
            {/* Heading block */}
            <div className="flex flex-col items-center justify-center gap-4" style={{ marginBottom: 48 }}>
              <h2 className="text-center" style={{ fontSize: 40, lineHeight: "52px", fontWeight: 700, fontFamily: "Lato", color: "#090202" }}>Don’t Just Take Our Word For It</h2>
              <p className="mt-2 text-center" style={{ fontSize: 16, lineHeight: "24px", color: "#8E98A8", width: 600 }}>From first-time buyers to seasoned agents and diaspora investors — see how i-Realty is transforming real estate experiences across Nigeria and beyond.</p>
            </div>
            {/* Carousel */}
            <div className="relative flex flex-col items-center justify-center" style={{ height: 360 }}>
              {/* Cards Row: seamless infinite scroll */}
              <div className="w-full overflow-hidden flex items-center justify-center" style={{ height: 320, position: 'relative' }}>
                <motion.div
                  style={{ display: 'flex', gap: 24, x }}
                >
                  {allCards.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between"
                      style={{
                        minWidth: 600,
                        maxWidth: 600,
                        height: 320,
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
                      <div className="flex flex-col justify-between h-full p-10">
                        <div>
                          <p className="text-lg font-bold" style={{ fontFamily: "Lato", lineHeight: "32px" }}>{t.text}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-8">
                          <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%" }} />
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
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: i === activeIdx ? "#2563EB" : "#D1D5DB", // lighter gray for inactive
                      border: "none",
                      cursor: 'pointer',
                      opacity: i === activeIdx ? 1 : 0.6 // lighter dot
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              {/* Dots */}
              {/* Dots removed for infinite scroll */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
