import { BlockchainSymbol } from "@/types";
import dynamic from "next/dynamic";
import { redirectIfFailed } from "@/utils";

// Dynamically import the chart component to avoid SSR issues with chart libraries
const TransactionBarChart = dynamic(
  () => import("@/components/wallet-details/transaction-bar-chart"),
  { ssr: false },
);

interface AggregateTransactionData {
  received: { count: number; date: Date }[];
  sent: { count: number; date: Date }[];
}

interface TransactionsCountProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
}

export default async function TransactionsCount({
  blockchainSymbol,
  address,
}: TransactionsCountProps) {
  // Fetch monthly transaction data for given blockchain address
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${blockchainSymbol}/${address}/monthly-transactions`,
    { cache: 'no-store' },
  );
  redirectIfFailed(response);
  const data: AggregateTransactionData = await response.json();
  // Convert the date strings to Date objects
  data.received.forEach((item) => (item.date = new Date(item.date)));
  data.sent.forEach((item) => (item.date = new Date(item.date)));

  // Define visual configuration for the two data series (sent and received transactions)
  const chartConfig = {
    received: {
      label: "Received",
      color: "hsl(var(--chart-2))",
    },
    sent: {
      label: "Sent",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <TransactionBarChart
      chartData={data}
      config={chartConfig}
      className="h-96 w-full"
    />
  );
}
