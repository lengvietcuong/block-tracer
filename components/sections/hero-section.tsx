import WalletSearch from "@/components/wallet-search";
import BrainGraph from "@/components/graphs/brain-graph";

export default function HeroSection() {
  return (
    <section className="spacing-section lg:gap-16 gap-12 flex lg:flex-row flex-col lg:items-center">
      <div className="w-full lg:w-1/2">
        <h1 className="font-bold text-3xl md:text-5xl xl:text-6xl">
          Effortlessly uncover every transaction.
        </h1>
        <div className="mt-4 md:mt-6 bg-primary h-2.5 md:h-3 w-14 md:w-20"></div>
        <p className="mt-6 lg:mt-9 mb-12 lg:mb-16 lg:text-xl max-w-screen-md text-muted-foreground">
          Trace and visualize transactions on the blockchain with ease. Gain
          insights and discover patterns with powerful analytics.
        </p>
        <WalletSearch className="w-full h-10 md:w-[440px] lg:h-12 bg-background text-sm shadow-[0_0_10px_3px_hsl(var(--muted-foreground)/0.5)] lg:shadow-[0_0_20px_5px_hsl(var(--muted-foreground)/0.5)]" />
      </div>
      <BrainGraph className="w-[360px] h-[300px] max-w-full md:w-[480px] md:h-[400px] lg:w-[600px] lg:h-[500px] mx-auto" />
    </section>
  );
}
