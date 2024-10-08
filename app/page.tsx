import Header from "@/components/header";
import Footer from "@/components/footer";
import SquaresBackground from "@/components/squares-background";
import HeroSection from "@/components/sections/hero-section";
import ThreatSection from "@/components/sections/threat-section";
import FeaturesSection from "@/components/sections/features-section";
import AchievementsSection from "@/components/sections/achievements-section";
import TestimonialsSection from "@/components/sections/testimonials-sections";

// This combines all the sections to create the home page
export default function Home() {
  return (
    <>
      <SquaresBackground />
      <Header />
      <main>
        <HeroSection />
        <ThreatSection />
        <FeaturesSection />
        <AchievementsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
