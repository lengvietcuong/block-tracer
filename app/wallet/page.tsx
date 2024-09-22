import WalletDetails from "@/components/wallet-details";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const address = searchParams.address as string;
  const currentPage = Number(searchParams.page) || 1;

  return (
    <>
      <Header changeStyleOnScroll={false}/>
      <main className="spacing-section">
        <WalletDetails
          address={address}
          currentPage={currentPage}
        />
      </main>
      <Footer />
    </>
  );
}
