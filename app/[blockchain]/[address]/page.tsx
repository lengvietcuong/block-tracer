import WalletDetails from "@/components/wallet-details/wallet-details";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import { BLOCKCHAIN_NAMES } from "@/constants";
import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE } from "@/constants";

export default function Home({
  params,
  searchParams,
}: {
  params: { blockchain: string; address: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const blockchainSymbol = params.blockchain as BlockchainSymbol;
  const address = params.address;
  const from = searchParams.from
    ? new Date(searchParams.from as string)
    : undefined;
  const to = searchParams.to ? new Date(searchParams.to as string) : undefined;
  const sort = searchParams.sort || "time";
  const page = Number(searchParams.page) || 1;

  if (
    !(blockchainSymbol in BLOCKCHAIN_NAMES) ||
    (sort !== "time" && sort !== "amount") ||
    (from instanceof Date && isNaN(from.getTime())) ||
    (to instanceof Date && isNaN(to.getTime())) ||
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
