import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  WalletOverviewSkeleton,
  WalletReportsSkeleton,
  TransactionCountSkeleton,
  TopInteractionsSkeleton,
  TransactionsSkeleton,
  PagesSkeleton,
} from "@/components/wallet-details/skeletons";

export default function Loading() {
  return (
    <>
      <Header changeStyleOnScroll={false} />
      <main className="spacing-section pt-4">
        <div className="space-y-10 md:space-y-12">
          {/* Wallet Overview */}
          <div>
            <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
              Overview
            </h2>
            <WalletOverviewSkeleton />
          </div>

          {/* Wallet Reports */}
          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
              Reports
            </h2>
            <WalletReportsSkeleton />
          </div>

          {/* Transaction Count */}
          <div>
            <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
              Transaction Count
            </h2>
            <TransactionCountSkeleton />
          </div>

          {/* Top Interactions */}
          <div>
            <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
              Top Interactions
            </h2>
            <TopInteractionsSkeleton />
          </div>

          {/* Transactions */}
          <div>
            <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
              Transactions
            </h2>
            <TransactionsSkeleton />
            <PagesSkeleton />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
