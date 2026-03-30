import React from "react";
import Image from "next/image";

export default function VerifiedFeatures() {
  const cards = [
    {
      title: "Secured Escrow\nTransactions",
      desc: "Your money stays protected until the deal is done.",
      bg: "bg-[#EEF8FB]",
  icon: "/icons/escrow.svg",
    },
    {
      title: "Verified Agents\nOnly",
      desc: "No scams — only trusted, verified professionals.",
      bg: "bg-[#EEF2FF]",
  icon: "/icons/verified.svg",
    },
    {
      title: "Built For The\nDiaspora",
      desc: "Buy or invest from anywhere, with full peace of mind.",
      bg: "bg-[#FFF6EE]",
  icon: "/icons/diaspora.svg",
    },
    {
      title: "All-in-One Digital\nPlatform",
      desc: "List, rent, or buy — all in one secure place.",
      bg: "bg-[#FBF0FF]",
  icon: "/icons/platform.svg",
    },
  ];

  return (
    <section className="w-full py-16 ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Verified. Secure. Hassle-Free.</h2>
          <p className="text-sm md:text-base text-slate-500 mt-4 max-w-2xl mx-auto">Secure tools, verified listings, and smart features for buyers, sellers, agents, and investors.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {cards.map((c) => (
            <article key={c.title} className={`${c.bg} rounded-xl p-8 shadow-sm flex flex-col items-center text-center`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/60 mb-4">
                <Image src={c.icon} alt="" width={24} height={24} className="object-contain mx-auto" />
              </div>
              <h3 className="font-bold text-lg mb-2 whitespace-pre-line">{c.title}</h3>
              <p className="text-sm text-slate-500">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
