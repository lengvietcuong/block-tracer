import WalletSearch from "@/components/wallet-details/wallet-search";
import BrainGraph from "@/components/brain-graph";

export default function HeroSection() {
  return (
    <section className="spacing-section xl:gap-24 gap-12 flex lg:flex-row flex-col lg:items-center">
      <div className="w-full lg:w-2/5">
        <h1 className="font-bold text-3xl md:text-5xl xl:text-6xl">
          Effortlessly uncover every transaction.
        </h1>
        <div className="mt-4 md:mt-6 bg-primary h-2.5 md:h-3 w-14 md:w-20"></div>
        <p className="mt-6 lg:mt-9 mb-12 lg:mb-16 lg:text-xl max-w-screen-md text-muted-foreground">
          Trace and visualize transactions on the blockchain with ease. Gain
          insights and discover patterns with powerful analytics.
        </p>
        {/* After the user presses enter or clicks the search icon, the search bar component will display a loading spinner until they are redirected to the wallet details page. */}
        <WalletSearch variant="full" showLoading={true} />
      </div>
      <BrainGraph className="aspect-[7/6] lg:ml-auto mx-auto w-[350px] md:w-[490px] max-w-full xl:w-[630px]" />
    </section>
  );
}
