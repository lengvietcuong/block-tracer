import WalletDetails from "@/components/wallet-details/wallet-details";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE } from "@/constants";
import { isValidAddress } from "@/utils";

export default function Page({
  params,
  searchParams,
}: {
  params: { blockchain: string; address: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract parameters from the URL
  // The URL is in the format /[blockchain]/[address]?sort=<sort>&page=<page>
  const blockchainSymbol = params.blockchain as BlockchainSymbol;
  const address = params.address.toLowerCase();
  const sort = searchParams.sort || "time";
  const page = Number(searchParams.page) || 1;

  // Verify that the parameters are valid
  if (
    !(isValidAddress(address, blockchainSymbol)) ||
    (sort !== "time" && sort !== "amount") ||
    page < 1
  ) {
    notFound();
  }
  const offset = (page - 1) * TRANSACTIONS_PER_PAGE;

  return (
    <>
      <Header
        changeStyleOnScroll={false}
        defaultBlockchain={blockchainSymbol}
      />
      <main className="spacing-section pt-4">
        <WalletDetails
          blockchainSymbol={blockchainSymbol}
          address={address}
          orderBy={sort}
          limit={TRANSACTIONS_PER_PAGE}
          offset={offset}
        />
      </main>
      <Footer />
    </>
  );
}
