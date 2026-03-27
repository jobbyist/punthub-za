import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import CTASection from "@/components/landing/CTASection";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <HeroSection />
      <HowItWorks />
      <FeaturesGrid />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Index;
