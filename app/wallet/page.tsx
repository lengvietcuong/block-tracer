import WalletDetails from "@/components/wallet-details/wallet-details";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { redirect } from "next/navigation";
import { BLOCKCHAIN_NAMES } from "@/constants";
import { BlockchainSymbol } from "@/types";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const blockchainSymbol = searchParams.chain as BlockchainSymbol;
  if (!(blockchainSymbol in BLOCKCHAIN_NAMES)) {
    redirect("/not-found");
  }

  const address = searchParams.address as string;
  const currentPage = Number(searchParams.page) || 1;

  return (
    <>
      <Header changeStyleOnScroll={false} />
      <main className="spacing-section">
        <WalletDetails
          blockchainSymbol={blockchainSymbol}
          address={address}
          currentPage={currentPage}
        />
      </main>
      <Footer />
    </>
  );
}
