import WalletDetails from "@/components/wallet-details/wallet-details";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import { BLOCKCHAIN_NAMES } from "@/constants";
import { BlockchainSymbol } from "@/types";

export default function Home({
  params,
  searchParams,
}: {
  params: { blockchain: string; address: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const blockchainSymbol = params.blockchain as BlockchainSymbol;
  if (!(blockchainSymbol in BLOCKCHAIN_NAMES)) {
    notFound();
  }
  const address = params.address as string;

  const sortOrder = (searchParams.sort || "time");
  if (sortOrder !== "time" && sortOrder !== "amount") {
    notFound();
  }
  const currentPage = Number(searchParams.page) || 1;
  if (currentPage < 1) {
    notFound();
  }

  return (
    <>
      <Header changeStyleOnScroll={false} />
      <main className="spacing-section pt-5">
        <WalletDetails
          blockchainSymbol={blockchainSymbol}
          address={address}
          sortOrder={sortOrder}
          currentPage={currentPage}
        />
      </main>
      <Footer />
    </>
  );
}
