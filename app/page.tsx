import Header from "@/components/header";
import Footer from "@/components/footer";
import SquaresBackground from "@/components/squares-background";
import HeroSection from "@/components/sections/hero-section";
import StatisticsSection from "@/components/sections/statistics-section";
import TestimonialsSection from "@/components/sections/testimonials-sections";

export default function Home() {
  return (
    <>
      <SquaresBackground />
      <Header />
      <main>
        <HeroSection />
        <StatisticsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
