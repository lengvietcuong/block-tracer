"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GrDocumentText as TransactionIcon } from "react-icons/gr";
import { LiaSpinnerSolid as LoadingSpinner } from "react-icons/lia";
import { TransactionPartial, BlockchainSymbol, Transaction } from "@/types";
import { format } from "date-fns";

interface TransactionDialogProps {
  isOpen: boolean; // Controls whether the dialog is open or closed
  onOpenChange: (open: boolean) => void; // Callback to handle dialog open state changes
  transaction: TransactionPartial | null; // Basic transaction data used to fetch full details
  blockchainSymbol: BlockchainSymbol; // Symbol for the blockchain, e.g., BTC or ETH
}

export default function TransactionDialog({
  isOpen,
  onOpenChange,
  transaction,
  blockchainSymbol,
}: TransactionDialogProps) {
  const [transactionDetails, setTransactionDetails] = useState<Omit<
    Transaction,
    keyof TransactionPartial
  > | null>(null); // Stores the full transaction details once loaded
  const [canClose, setCanClose] = useState(true); // Determines if the dialog can be closed

  useEffect(() => {
    async function fetchTransactionDetails() {
      // Fetch full transaction details when dialog opens
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${blockchainSymbol}/transaction/${transaction!.hash}`,
        { cache: "no-store" },
      );
      const details = await response.json();
      setTransactionDetails(details);
    }

    if (isOpen && transaction && !transactionDetails) {
      fetchTransactionDetails(); // Only fetch if dialog is open and details are not yet loaded
    }
  }, [isOpen, transaction, blockchainSymbol, transactionDetails]);

  // Prevents immediate closure after opening, handling accidental double-clicks
  useEffect(() => {
    if (isOpen) {
      setCanClose(false); // Temporarily prevent closing
      const timer = setTimeout(() => setCanClose(true), 500); // Allow closing after 500ms
      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (canClose) {
          onOpenChange(isOpen); // Only allows closing if canClose is true
        }
      }}
    >
      <DialogContent className="max-w-screen-sm lg:max-w-screen-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TransactionIcon className="size-4 text-primary" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>
        {transaction && transactionDetails ? (
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {/* Displays transaction details in a two-column grid */}
            <p className="font-semibold">From:</p>
            <p className="break-all">{transaction.fromAddress}</p>
            <p className="font-semibold">To:</p>
            <p className="break-all">{transaction.toAddress}</p>
            <p className="font-semibold">Hash:</p>
            <p className="break-all">{transaction.hash}</p>
            <p className="font-semibold">Value:</p>
            <p>
              {transaction.value} {blockchainSymbol.toUpperCase()}
            </p>
            {"input" in transactionDetails && (
              <>
                <p className="font-semibold">Input:</p>
                <p className="break-all">{transactionDetails.input}</p>
              </>
            )}
            <p className="font-semibold">Transaction Index:</p>
            <p>{transactionDetails.transactionIndex}</p>
            {"gas" in transactionDetails && (
              <>
                <p className="font-semibold">Gas:</p>
                <p>{transactionDetails.gas}</p>
              </>
            )}
            <p className="font-semibold">Gas Used:</p>
            <p>{transactionDetails.gasUsed}</p>
            <p className="font-semibold">Gas Price:</p>
            <p>{transactionDetails.gasPrice} </p>
            <p className="font-semibold">Transaction Fee:</p>
            <p>
              {transactionDetails.transactionFee}{" "}
              {blockchainSymbol.toUpperCase()}
            </p>
            <p className="font-semibold">Block Number:</p>
            <p>{transactionDetails.blockNumber}</p>
            <p className="font-semibold">Block Hash:</p>
            <p className="break-all">{transactionDetails.blockHash}</p>
            <p className="font-semibold">Block Timestamp:</p>
            <p>
              {format(
                new Date(transaction.blockTimestamp),
                "hh:mmaaa dd/MM/yyyy",
              )}
            </p>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner className="size-12 animate-spin text-primary" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
