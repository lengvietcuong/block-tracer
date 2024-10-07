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
  // The URL is formatted as "/<blockchain>/<address>?sort=<sortOrder>&page=<currentPage>"

  const blockchainSymbol = params.blockchain as BlockchainSymbol;
  if (!(blockchainSymbol in BLOCKCHAIN_NAMES)) {
    // Invalid blockchain provided
    notFound();
  }
  const address = params.address as string;

  // If not provided, the sort order defaults to "time"
  const sortOrder = (searchParams.sort || "time");
  if (sortOrder !== "time" && sortOrder !== "amount") {
    // Invalid sort order provided
    notFound();
  }
  // If not provided, the current page defaults to 1
  const currentPage = Number(searchParams.page) || 1;
  if (currentPage < 1) {
    // Invalid page number provided
    notFound();
  }

  // Header and footer elements are static, but the wallet details component is dynamic
  return (
    <>
      <Header changeStyleOnScroll={false} />
      <main className="spacing-section pt-4">
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
