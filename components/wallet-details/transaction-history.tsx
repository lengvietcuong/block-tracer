import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CopyButton from "@/components/wallet-details/copy-button";
import { PiArrowElbowDownRightBold as DownRightArrowIcon } from "react-icons/pi";
import { convertToUsd } from "@/utils";
import { Transaction, BlockchainSymbol } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TransactionHistoryProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  address: string;
  transactions: Transaction[];
}

export default function TransactionHistory({
  className,
  blockchainSymbol,
  address,
  transactions,
}: TransactionHistoryProps) {
  return (
    <Table className={cn("table-fixed", className)}>
      <TableHeader>
        <TableRow>
          <TableHead className="text-primary font-bold w-[25%]">
            ID
          </TableHead>
          <TableHead className="text-primary font-bold w-[40%]">
            Sender-Receiver
          </TableHead>
          <TableHead className="text-primary font-bold w-[20%] lg:w-[15%]">
            Amount
          </TableHead>
          <TableHead className="text-primary font-bold w-[15%]">
            Time (UTC)
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="">
            {/* Transaction ID attribute */}
            <TableCell title={transaction.id}>
              <div className="flex items-center gap-2">
                <span className="truncate">{transaction.id}</span>
                <CopyButton content={transaction.id} />
              </div>
            </TableCell>
            
            {/* Sender and receiver attributes */}
            <TableCell>
              <div className="flex items-center gap-2">
                <p
                  className={`truncate ${
                    transaction.sender === address
                      ? "text-muted-foreground"
                      : ""
                  }`}
                  title={transaction.sender}
                >
                  {transaction.sender}
                </p>
                <CopyButton content={transaction.sender} />
              </div>
              <div className="flex items-center gap-2">
                <DownRightArrowIcon className="flex-shrink-0 size-4 fill-muted-foreground" />
                <p
                  className={`truncate ${
                    transaction.receiver === address
                      ? "text-muted-foreground"
                      : ""
                  }`}
                  title={transaction.receiver}
                >
                  {transaction.receiver}
                </p>
                <CopyButton content={transaction.receiver} />
              </div>
            </TableCell>

            {/* Transaction amount attribute */}
            <TableCell
              title={`${transaction.amount} ${blockchainSymbol.toUpperCase()}`}
            >
              <p>{transaction.amount} {blockchainSymbol.toUpperCase()}</p>
              <p className="text-muted-foreground text-xs hidden md:block">~ ${convertToUsd(transaction.amount, blockchainSymbol)} USD</p>
            </TableCell>
            <TableCell>
              {format(transaction.timestamp.getTime(), "hh:mmaaa dd/MM/yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
