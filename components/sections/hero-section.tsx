import WalletSearch from "@/components/wallet-search";
import BrainGraph from "@/components/brain-graph";

export default function HeroSection() {
  return (
    <section className="spacing-section lg:gap-24 gap-12 flex lg:flex-row flex-col lg:items-center">
      <div className="w-full lg:w-2/5">
        <h1 className="font-bold text-3xl md:text-5xl xl:text-6xl">
          Effortlessly uncover every transaction.
        </h1>
        <div className="mt-4 md:mt-6 bg-primary h-2.5 md:h-3 w-14 md:w-20"></div>
        <p className="mt-6 lg:mt-9 mb-12 lg:mb-16 lg:text-xl max-w-screen-md text-muted-foreground">
          Trace and visualize transactions on the blockchain with ease. Gain
          insights and discover patterns with powerful analytics.
        </p>
        <WalletSearch variant="full" />
      </div>
      <BrainGraph className="aspect-[7/6] lg:ml-auto mx-auto w-[350px] md:w-[490px] max-w-full lg:w-[630px]" />
    </section>
  );
}
