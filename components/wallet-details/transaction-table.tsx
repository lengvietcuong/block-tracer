"use client";

import { useState } from "react";
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
import { convertToUsd, formatAmount } from "@/utils";
import { TransactionPartial, BlockchainSymbol } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { abbreviateAddress } from "@/utils";
import TransactionDialog from "@/components/wallet-details/transaction-dialog";

interface TransactionTableProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  address: string;
  transactions: TransactionPartial[];
}

export default function TransactionTable({
  className,
  blockchainSymbol,
  address,
  transactions,
}: TransactionTableProps) {
  // Holds the transaction selected by the user for detailed view
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionPartial | null>(null);

  return (
    <>
      {/* Main table structure to display transaction data */}
      <Table className={cn("table-fixed", className)}>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            {/* Define table headers for each transaction attribute */}
            <TableHead className="w-2/4 text-center font-bold text-primary md:w-1/3 xl:w-[40%]">
              Sender-Receiver
            </TableHead>
            <TableHead className="w-1/4 text-center font-bold text-primary md:w-1/3 xl:w-[30%]">
              Amount
            </TableHead>
            <TableHead className="w-1/4 text-center font-bold text-primary md:w-1/3 xl:w-[30%]">
              Time (UTC)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Map through each transaction to create a row */}
          {transactions.map((transaction) => (
            <TransactionRecord
              key={transaction.hash}
              transaction={transaction}
              blockchainSymbol={blockchainSymbol}
              address={address}
              onClick={() => setSelectedTransaction(transaction)}
            />
          ))}
        </TableBody>
      </Table>
      {/* Dialog to display detailed transaction info when a row is clicked */}
      <TransactionDialog
        isOpen={selectedTransaction !== null}
        onOpenChange={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        blockchainSymbol={blockchainSymbol}
      />
    </>
  );
}

interface TransactionRecordProps {
  transaction: TransactionPartial;
  blockchainSymbol: BlockchainSymbol;
  address: string;
  onClick: () => void;
}

function TransactionRecord({
  transaction,
  blockchainSymbol,
  address,
  onClick,
}: TransactionRecordProps) {
  return (
    <TableRow
      key={transaction.hash}
      onClick={onClick}
      className="cursor-pointer text-center hover:bg-muted/50"
    >
      {/* Sender and receiver addresses displayed with copy buttons */}
      <TableCell className="py-3 md:grid md:place-items-center">
        <div>
          <div className="flex items-center gap-2">
            <p
              className={`truncate ${
                transaction.fromAddress === address
                  ? "text-muted-foreground"
                  : ""
              }`}
              title={transaction.fromAddress}
            >
              {abbreviateAddress(transaction.fromAddress, 16)}
            </p>
            <span onClick={(e) => e.stopPropagation()}>
              <CopyButton content={transaction.fromAddress} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DownRightArrowIcon className="size-4 flex-shrink-0 fill-muted-foreground" />
            <p
              className={`truncate ${
                transaction.toAddress === address ? "text-muted-foreground" : ""
              }`}
              title={transaction.toAddress}
            >
              {abbreviateAddress(transaction.toAddress, 16)}
            </p>
            <span onClick={(e) => e.stopPropagation()}>
              <CopyButton content={transaction.toAddress} />
            </span>
          </div>
        </div>
      </TableCell>
      {/* Amount cell, formatted with blockchain symbol and approximate USD value */}
      <TableCell
        className="py-3"
        title={`${transaction.value} ${blockchainSymbol.toUpperCase()}`}
      >
        <p>
          {formatAmount(transaction.value)} {blockchainSymbol.toUpperCase()}
        </p>
        <p className="hidden text-xs text-muted-foreground md:block">
          ~ ${formatAmount(convertToUsd(transaction.value, blockchainSymbol))}{" "}
          USD
        </p>
      </TableCell>
      {/* Timestamp for the transaction formatted in UTC */}
      <TableCell className="py-3">
        {format(new Date(transaction.blockTimestamp), "hh:mmaaa dd/MM/yyyy")}
      </TableCell>
    </TableRow>
  );
}
