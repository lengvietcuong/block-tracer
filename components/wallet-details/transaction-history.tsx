import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction, BlockchainSymbol } from "@/types";
import { cn } from "@/lib/utils";

interface TransactionHistoryProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  transactions: Transaction[];
}

export default function TransactionHistory({
  className,
  blockchainSymbol,
  transactions,
}: TransactionHistoryProps) {
  return (
    <Table className={cn("table-fixed", className)}>
      <TableHeader>
        <TableRow>
          <TableHead className="text-primary font-bold w-[10%] md:w-[15%] lg:w-[20%]">ID</TableHead>
          <TableHead className="text-primary font-bold w-[15%] md:w-[25%] lg:w-[35%]">
            Sender
          </TableHead>
          <TableHead className="text-primary font-bold w-[15%] md:w-[25%] lg:w-[35%]">
            Receiver
          </TableHead>
          <TableHead className="text-primary font-bold w-[10%]">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="truncate" title={transaction.id}>
              {transaction.id}
            </TableCell>
            <TableCell className="truncate" title={transaction.sender}>
              {transaction.sender}
            </TableCell>
            <TableCell className="truncate" title={transaction.receiver}>
              {transaction.receiver}
            </TableCell>
            <TableCell
              className="text-nowrap"
              title={`${transaction.amount} ${blockchainSymbol}`}
            >
              {transaction.amount} ETH
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
