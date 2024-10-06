import Header from "@/components/header";
import Footer from "@/components/footer";
import SquaresBackground from "@/components/squares-background";
import HeroSection from "@/components/sections/hero-section";
import CrimeDataSection from "@/components/sections/crime-data-section";
import FeaturesSection from "@/components/sections/features-section";
import AchievementsSection from "@/components/sections/achievements-section";
import TestimonialsSection from "@/components/sections/testimonials-sections";

export default function Home() {
  return (
    <>
      <SquaresBackground />
      <Header />
      <main>
        <HeroSection />
        <CrimeDataSection />
        <FeaturesSection />
        <AchievementsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
