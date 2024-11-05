import { Suspense } from "react";
import WalletOverview from "@/components/wallet-details/wallet-overview";
import WalletReports from "@/components/wallet-details/wallet-reports";
import TransactionsOverTime from "@/components/wallet-details/transaction-count";
import TopInteractions from "@/components/wallet-details/top-interactions";
import Transactions from "@/components/wallet-details/transactions";
import Pages from "@/components/wallet-details/pages";
import {
  WalletOverviewSkeleton,
  WalletReportsSkeleton,
  TransactionCountSkeleton,
  TopInteractionsSkeleton,
  TransactionsSkeleton,
  PagesSkeleton,
} from "@/components/wallet-details/skeletons";
import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE } from "@/constants";

interface WalletDetailsProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
  orderBy?: "time" | "amount";
  limit?: number;
  offset?: number;
}

export default function WalletDetails({
  blockchainSymbol,
  address,
  orderBy = "time",
  limit = TRANSACTIONS_PER_PAGE,
  offset = 0,
}: WalletDetailsProps) {
  // This component uses Suspense boundaries to separate dynamic elements from static ones
  // The static components are rendered immediately
  // The dynamic components that need to fetch data will be streamed in later
  // When data is being fetched, loading skeletons are displayed (by setting the "fallback" attribute)

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Wallet Overview */}
      <div>
        <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
          Overview
        </h2>
        <Suspense fallback={<WalletOverviewSkeleton />}>
          <WalletOverview
            address={address}
            blockchainSymbol={blockchainSymbol}
          />
        </Suspense>
      </div>

      {/* Wallet Reports */}
      <div className="flex-1">
        <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">Reports</h2>
        <Suspense fallback={<WalletReportsSkeleton />}>
          <WalletReports
            blockchainSymbol={blockchainSymbol}
            address={address}
          />
        </Suspense>
      </div>

      {/* Transaction Count */}
      <div>
        <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
          Transaction Count
        </h2>
        <Suspense fallback={<TransactionCountSkeleton />}>
          <TransactionsOverTime
            address={address}
            blockchainSymbol={blockchainSymbol}
          />
        </Suspense>
      </div>

      {/* Top Interactions */}
      <div>
        <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
          Top Interactions
        </h2>
        <Suspense fallback={<TopInteractionsSkeleton />}>
          <TopInteractions
            blockchainSymbol={blockchainSymbol}
            address={address}
          />
        </Suspense>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
          Transactions
        </h2>
        <Suspense fallback={<TransactionsSkeleton />}>
          <Transactions
            address={address}
            blockchainSymbol={blockchainSymbol}
            orderBy={orderBy}
            limit={limit}
            offset={offset}
          />
        </Suspense>
        <Suspense fallback={<PagesSkeleton />}>
          <Pages
            blockchainSymbol={blockchainSymbol}
            address={address}
            orderBy={orderBy}
            currentPage={Math.floor(offset / TRANSACTIONS_PER_PAGE) + 1}
            className="mx-auto mt-2"
          />
        </Suspense>
      </div>
    </div>
  );
}
