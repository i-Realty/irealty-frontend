
import Hero from "@/components/Hero";
import VerifiedFeatures from "@/components/VerifiedFeatures";
import AudienceSection from "@/components/AudienceSection";
import CategoryGrid from "@/components/CategoryGrid";
import RecentProperties from "@/components/RecentProperties";
import AgentDiasporaPromo from "@/components/AgentDiasporaPromo";
import TestimonialSection from "@/components/TestimonialSection";
import FAQSection from "@/components/FAQSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
  <Navbar />
  <Hero />
  <VerifiedFeatures />
  <AudienceSection />
  <CategoryGrid />
  <RecentProperties />
  <AgentDiasporaPromo />
  <TestimonialSection />
  <FAQSection />
  <Footer />
    </>
  );
}
