import { redirect } from "next/navigation";
import WalletDetails from "@/components/wallet-details";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const address = params.id;
  const currentPage = Number(searchParams.page);
  if (!searchParams.page) {
    redirect(`/wallet/${address}?page=1`);
  }

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
