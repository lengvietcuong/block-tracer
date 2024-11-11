import { BlockchainSymbol } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CopyButton from "@/components/wallet-details/copy-button";
import { abbreviateAddress } from "@/utils";
import { notFound } from "next/navigation";

interface TopInteractionData {
  address: string;
  count: number;
  percentage: number;
}

interface TopInteractionsTableProps {
  data: TopInteractionData[];
  addressColumnHeader: string;
  colorHsl: string;
}

// Component to render a table of top interactions (received or sent) for an address
function TopInteractionsTable({
  data,
  addressColumnHeader,
  colorHsl,
}: TopInteractionsTableProps) {
  return (
    <Table className="h-fit table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center xl:w-[40%]">
            {addressColumnHeader}
          </TableHead>
          <TableHead className="text-center xl:w-[30%]">Transactions</TableHead>
          <TableHead className="text-center xl:w-[30%]">Percentage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((interaction) => (
          <TableRow
            key={interaction.address}
            // Set background color based on the percentage of total interactions
            style={{
              backgroundColor: `hsla(${colorHsl}, ${interaction.percentage / 100})`,
            }}
          >
            <TableCell className="flex items-center justify-center space-x-2 px-3 py-3 sm:px-4">
              <span className="truncate">
                {abbreviateAddress(interaction.address, 16)}
              </span>
              <CopyButton content={interaction.address} />{" "}
              {/* Button to copy the address */}
            </TableCell>
            <TableCell className="px-3 py-3 text-center sm:px-4">
              {interaction.count} {/* Display number of transactions */}
            </TableCell>
            <TableCell className="px-3 py-3 text-center sm:px-4">
              {interaction.percentage.toFixed(2)}%{" "}
              {/* Display percentage of interactions */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface TopInteractionsProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
}

// Main function to fetch and display top received and sent interactions for an address
export default async function TopInteractions({
  blockchainSymbol,
  address,
}: TopInteractionsProps) {
  // Fetch interaction data for received and sent transactions
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${blockchainSymbol}/${address}/top-interactions`,
    { cache: "no-store" },
  );
  if (response.status === 404) {
    notFound();
  }
  const { topReceived, topSent } = await response.json();

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-16">
      <TopInteractionsTable
        data={topReceived}
        addressColumnHeader="Sender"
        colorHsl="160, 60%, 45%" // Greenish background for received transactions
      />
      <TopInteractionsTable
        data={topSent}
        addressColumnHeader="Receiver"
        colorHsl="340, 75%, 55%" // Reddish background for sent transactions
      />
    </div>
  );
}
