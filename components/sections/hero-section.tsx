import WalletSearch from "@/components/wallet-details/wallet-search";
import BrainGraph from "@/components/brain-graph";

export default function HeroSection() {
  return (
    <section className="spacing-section flex flex-col gap-12 lg:flex-row lg:items-center xl:gap-24">
      <div className="w-full lg:w-2/5">
        <h1 className="text-3xl font-bold md:text-5xl xl:text-6xl">
          Effortlessly uncover every transaction.
        </h1>
        <div className="mt-4 h-2.5 w-14 bg-primary md:mt-6 md:h-3 md:w-20"></div>
        <p className="mb-12 mt-6 max-w-screen-md text-muted-foreground lg:mb-16 lg:mt-9 lg:text-xl">
          Trace and visualize transactions on the blockchain with ease. Gain
          insights and discover patterns with powerful analytics.
        </p>
        {/* After the user presses enter or clicks the search icon, the search bar component will display a loading spinner until they are redirected to the wallet details page. */}
        <WalletSearch variant="full" showLoading={true} />
      </div>
      <BrainGraph className="mx-auto aspect-[7/6] w-[350px] max-w-full md:w-[490px] lg:ml-auto xl:w-[630px]" />
    </section>
  );
}
