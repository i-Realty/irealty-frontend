
import Image from "next/image";
import SearchCard from "@/components/SearchCard";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px] w-full overflow-hidden pt-8 pb-12 md:pt-16 md:pb-24">
      {/* Background Image (dimmed directly) */}
      <Image
        src="/images/hero-bg.png"
        alt="Cityscape background"
        fill
        className="object-cover object-center z-0 filter brightness-30"
        priority
      />
  {/* Bottom shadow layer to separate hero from following content */}
  <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-black/40 blur-lg pointer-events-none z-30" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-4 md:px-0">
        <h1 className="text-white text-center font-bold text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-[1.1] mt-8 md:mt-0">
          Revolutionizing Real<br className="hidden md:block" /> Estate in Nigeria
        </h1>
        <p className="text-white text-center text-base md:text-lg font-normal mt-4 max-w-2xl">
          Buy, rent, or sell with verified agents, secure escrow payments, & smart tools built for locals and the diaspora.
        </p>
        {/* Pixel-perfect Search Card */}
        <div className="mt-8">
          <SearchCard />
        </div>
        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-28 h-px bg-white/40" />
            <p className="text-white text-sm md:text-base text-center">Are You A Property Owner Or An Agent?</p>
            <div className="hidden sm:block w-28 h-px bg-white/40" />
          </div>

          <div className="flex gap-4 mt-2">
            <button className="bg-[#2563EB] hover:bg-[#1e4fcf] transition-colors text-white font-bold rounded-lg px-6 py-3 text-sm md:text-base shadow-lg">Post Free Property Ads</button>
            <button className="bg-transparent border border-white/40 text-white font-bold rounded-lg px-6 py-3 text-sm md:text-base hover:bg-white/10 transition-colors">Become An Agent</button>
          </div>
        </div>
      </div>
    </section>
  );
}
