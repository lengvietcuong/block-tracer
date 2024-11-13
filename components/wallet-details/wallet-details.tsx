import { Suspense } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { PiArrowUpRightBold as UpRightArrowIcon } from "react-icons/pi";
import WalletOverview from "@/components/wallet-details/wallet-overview";
import WalletReports from "@/components/wallet-details/wallet-reports";
import TransactionsCount from "@/components/wallet-details/transaction-count";
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
    <>
      {blockchainSymbol === "swc" && (
        <Alert className="mb-6 w-fit">
          <Terminal className="size-4 stroke-primary" />
          <AlertTitle>Archived blockchain</AlertTitle>
          <AlertDescription className="mt-2 text-muted-foreground">
            Swincoin transactions are archived and can be viewed in{" "}
            <a
              href="https://app.powerbi.com/view?r=eyJrIjoiN2I2NTU2ZGEtYzhkMy00ZWZlLWJkN2YtMWJjNjc2MzgyNDQ0IiwidCI6ImRmN2Y3NTc5LTNlOWMtNGE3ZS1iODQ0LTQyMDI4MGY1Mzg1OSIsImMiOjEwfQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="peer underline-offset-4 transition-colors duration-100 hover:text-foreground hover:underline"
            >
              Power BI
            </a>
            <UpRightArrowIcon className="peer ml-0.5 inline-block transition-colors duration-100 peer-hover:fill-foreground" />
          </AlertDescription>
        </Alert>
      )}
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
          <h2 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-3xl">
            Reports
          </h2>
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
            <TransactionsCount
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
    </>
  );
}
