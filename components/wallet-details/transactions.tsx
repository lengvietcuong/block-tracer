import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE } from "@/constants";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import SortSelection from "@/components/wallet-details/sort-selection";
import TransactionGraph from "@/components/wallet-details/transaction-graph";
import TransactionTable from "@/components/wallet-details/transaction-table";
import { notFound } from "next/navigation";

// Define the interface for the Transactions component props
interface TransactionsProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
  orderBy?: "time" | "amount";
  limit?: number;
  offset?: number;
}

// Define the Transactions component
export default async function Tranasctions({
  blockchainSymbol,
  address,
  orderBy = "time",
  limit = TRANSACTIONS_PER_PAGE,
  offset = 0,
}: TransactionsProps) {
  // Fetch the transactions from the bitQuery API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${blockchainSymbol}/${address}/transactions?orderBy=${orderBy}&limit=${limit}&offset=${offset}`,
    { cache: "no-store" },
  );
  if (response.status === 404) {
    notFound();
  }
  const transactions = await response.json();

  // If there are no transactions, display an alert
  if (transactions.length === 0) {
    return (
      <Alert className="w-fit">
        <InfoIcon className="size-4" />
        <AlertTitle>No transactions found</AlertTitle>
      </Alert>
    );
  }

  // Render the transactions with a sort selection, a transaction graph, and a transaction table
  return (
    <>
      <SortSelection orderBy={orderBy} />
      <div className="mb-6 flex flex-col xl:mb-0 xl:flex-row xl:gap-16">
        <div className="flex-1">
          <TransactionGraph
            transactions={transactions}
            blockchainSymbol={blockchainSymbol}
            address={address}
            className="mx-auto w-full max-w-screen-md"
          />
        </div>
        <div className="relative mx-auto max-w-screen-lg flex-1 overflow-y-auto xl:max-h-[600px]">
          <TransactionTable
            transactions={transactions}
            blockchainSymbol={blockchainSymbol}
            address={address}
            className="w-full"
          />
          <div className="pointer-events-none sticky inset-x-0 bottom-0 hidden h-16 bg-gradient-to-b from-transparent to-background xl:block" />
        </div>
      </div>
    </>
  );
}
