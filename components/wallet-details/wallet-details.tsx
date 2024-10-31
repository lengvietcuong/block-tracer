import { Suspense, cache } from "react";
import WalletOverview from "@/components/wallet-details/wallet-overview";
import TransactionGraph from "@/components/wallet-details/transaction-graph";
import TransactionHistory from "@/components/wallet-details/transaction-history";
import SortSelection from "@/components/wallet-details/sort-selection";
import Pages from "@/components/wallet-details/pages";
import {
  TransactionGraphSkeleton,
  WalletOverviewSkeleton,
  TransactionHistorySkeleton,
  PagesSkeleton,
} from "@/components/wallet-details/skeletons";
import { BlockchainSymbol, Transaction } from "@/types";
import { getWalletOverview, getTransactions } from "@/bitQuery";

const TRANSACTIONS_PER_PAGE = 16;

interface WalletDetailsProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
  sortOrder: "time" | "amount";
  currentPage: number;
}

export default function WalletDetails({
  blockchainSymbol,
  address,
  sortOrder,
  currentPage,
}: WalletDetailsProps) {
  // This component uses Suspense boundaries to separate dynamic elements from static ones
  // The static components are rendered immediately
  // The dynamic components that need to fetch data will be streamed in later
  // When data is being fetched, loading skeletons are displayed (by setting the "fallback" attribute)

  return (
    <>
      <SortSelection className="hidden lg:block" selected={sortOrder} />

      <div className="flex flex-col-reverse lg:flex-row gap-12 xl:gap-24 mt-4 mb-12">
        <div className="flex-1">
          <SortSelection className="lg:hidden mb-4" selected={sortOrder} />
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Transaction Graph
          </h2>
          <div className="w-fit mx-auto">
            <Suspense fallback={<TransactionGraphSkeleton />}>
              <TransactionsWrapper
                blockchainSymbol={blockchainSymbol}
                address={address}
                sortOrder={sortOrder}
                currentPage={currentPage}
                render={(transactions) => (
                  <TransactionGraph
                    className="size-[360px] sm:size[400px] md:size-[500px] lg:size-[400px] xl:size-[500px]"
                    blockchainSymbol={blockchainSymbol}
                    address={address}
                    transactions={transactions}
                  />
                )}
              />
            </Suspense>
          </div>
        </div>

        {/* This div renders a vertical line to separate the transaction graph and the wallet overview */}
        <div className="self-strech border-l border-muted hidden lg:block"></div>

        <div className="flex-1">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Wallet Overview
          </h2>
          <Suspense fallback={<WalletOverviewSkeleton />}>
            <WalletOverviewWrapper
              blockchainSymbol={blockchainSymbol}
              address={address}
              render={(walletOverview) => (
                <WalletOverview
                  blockchainSymbol={blockchainSymbol}
                  address={address}
                  {...walletOverview}
                />
              )}
            />
          </Suspense>
        </div>
      </div>

      <h2 className="text-2xl lg:text-3xl font-bold mb-6">
        Transaction History
      </h2>
      <Suspense fallback={<TransactionHistorySkeleton />}>
        <TransactionsWrapper
          blockchainSymbol={blockchainSymbol}
          address={address}
          sortOrder={sortOrder}
          currentPage={currentPage}
          render={(transactions) => (
            <TransactionHistory
              blockchainSymbol={blockchainSymbol}
              address={address}
              transactions={transactions}
            />
          )}
        />
      </Suspense>

      <Suspense fallback={<PagesSkeleton />}>
        <WalletOverviewWrapper
          blockchainSymbol={blockchainSymbol}
          address={address}
          render={({ sent, received }) => {
            const numPages = Math.ceil(
              (sent + received) / TRANSACTIONS_PER_PAGE
            );
            // Only render the pagination component if there are more than one page
            return (
              numPages > 1 && (
                <Pages
                  className="mt-6"
                  sortOrder={sortOrder}
                  numPages={numPages}
                  currentPage={currentPage}
                />
              )
            );
          }}
        />
      </Suspense>
    </>
  );
}

// Because there are multiple components that need access to the same data, caching is used to prevent redundant API calls
// The cache is cleared when the user refreshes the page
const getCachedWalletOverview = cache(
  (blockchainSymbol: BlockchainSymbol, address: string) =>
    getWalletOverview(blockchainSymbol, address)
);
const getCachedTransactions = cache(
  (
    blockchainSymbol: BlockchainSymbol,
    address: string,
    sortOrder: "time" | "amount",
    start: number,
    end: number,
  ) => getTransactions(blockchainSymbol, address, sortOrder, start, end)
);

// The transaction wrapper provides the fetched transaction data to its child components
interface TransactionsWrapperProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
  sortOrder: "time" | "amount";
  currentPage: number;
  render: (transactions: Transaction[]) => React.ReactNode;
}

async function TransactionsWrapper({
  blockchainSymbol,
  address,
  sortOrder,
  currentPage,
  render,
}: TransactionsWrapperProps) {
  const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const end = currentPage * TRANSACTIONS_PER_PAGE - 1;
  const transactions = await getCachedTransactions(
    blockchainSymbol,
    address,
    sortOrder,
    start,
    end
  );
  return <>{render(transactions)}</>;
}

// The wallet overview wrapper provides the fetched wallet overview data to its child components
interface WalletOverviewWrapperProps {
  address: string;
  blockchainSymbol: BlockchainSymbol;
  render: (walletOverview: {
    balance: number;
    sent: number;
    received: number;
    amountSent: number;
    amountReceived: number;
    firstActive: Date;
    lastActive: Date;
  }) => React.ReactNode;
}

async function WalletOverviewWrapper({
  blockchainSymbol,
  address,
  render,
}: WalletOverviewWrapperProps) {
  const walletOverview = await getCachedWalletOverview(
    blockchainSymbol,
    address
  );
  return <>{render(walletOverview)}</>;
}