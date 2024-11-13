"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiPlusCircle as PlusIcon } from "react-icons/fi";
import { FiMinusCircle as MinusIcon } from "react-icons/fi";
import { GrDocumentText as TransactionIcon } from "react-icons/gr";
import { BlockchainSymbol } from "@/types";
import { convertToUsd, formatAmount } from "@/utils";

// Props interface defining transaction details and dates for the component
interface TransactionVolumeProps {
  blockchainSymbol: BlockchainSymbol;
  sentCount: number;
  receivedCount: number;
  amountSent: number;
  amountReceived: number;
  firstActive: Date;
  lastActive: Date;
}

type TimeFrame = "all" | "daily" | "monthly" | "yearly";

// Main component to display transaction volume and averages
export function TransactionVolume({
  blockchainSymbol,
  sentCount,
  receivedCount,
  amountSent,
  amountReceived,
  firstActive,
  lastActive,
}: TransactionVolumeProps) {
  // State to manage selected time frame for averages
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all");

  // Function to calculate average based on selected time frame
  function calculateAverage(value: number) {
    const totalDays =
      (lastActive.getTime() - firstActive.getTime()) / (1000 * 60 * 60 * 24);
    switch (timeFrame) {
      case "daily":
        return value / totalDays;
      case "monthly":
        return (value / totalDays) * 30;
      case "yearly":
        return (value / totalDays) * 365;
      default:
        return value;
    }
  }

  // Convert transaction amounts to USD based on blockchain symbol
  const sentUsdValue = convertToUsd(amountSent, blockchainSymbol);
  const receivedUsdValue = convertToUsd(amountReceived, blockchainSymbol);

  // Calculate averages for counts and amounts based on time frame
  const avgSentCount = calculateAverage(sentCount);
  const avgReceivedCount = calculateAverage(receivedCount);
  const avgAmountSent = calculateAverage(amountSent);
  const avgAmountReceived = calculateAverage(amountReceived);
  const avgSentUsdValue = calculateAverage(sentUsdValue);
  const avgReceivedUsdValue = calculateAverage(receivedUsdValue);

  return (
    <>
      <div className="flex items-center justify-between sm:justify-start sm:gap-8">
        <h3 className="text-lg font-semibold">Transaction Volume</h3>
        {/* Select component to choose time frame for averages */}
        <Select
          value={timeFrame}
          onValueChange={(value: TimeFrame) => setTimeFrame(value)}
        >
          <SelectTrigger id="time-period" aria-label="Select time period" className="w-44">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="daily">Daily Average</SelectItem>
            <SelectItem value="monthly">Monthly Average</SelectItem>
            <SelectItem value="yearly">Yearly Average</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display transaction counts (sent, received, and total) */}
      <div className="mt-3">
        <div className="mb-1.5 flex items-center">
          <TransactionIcon className="mr-1.5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Transactions
          </span>
        </div>
        <div className="flex flex-wrap gap-x-16 gap-y-6">
          <div className="space-y-1">
            <p className="text-2xl">{formatAmount(avgSentCount, 1)}</p>
            <p className="text-sm text-muted-foreground">Sent</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl">{formatAmount(avgReceivedCount, 1)}</p>
            <p className="text-sm text-muted-foreground">Received</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl">
              {formatAmount(avgSentCount + avgReceivedCount, 1)}
            </p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      {/* Display amount sent and received in both crypto and USD */}
      <div className="mt-6 flex flex-wrap gap-x-16 gap-y-6">
        {/* Sent amount */}
        <div>
          <div className="mb-1.5 flex items-center">
            <MinusIcon className="mr-1.5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Sent
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {formatAmount(avgAmountSent)} {blockchainSymbol.toUpperCase()}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ~ ${formatAmount(avgSentUsdValue)} USD
          </p>
        </div>

        {/* Received amount */}
        <div>
          <div className="mb-1.5 flex items-center">
            <PlusIcon className="mr-1.5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Received
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {formatAmount(avgAmountReceived)} {blockchainSymbol.toUpperCase()}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ~ ${formatAmount(avgReceivedUsdValue)} USD
          </p>
        </div>
      </div>
    </>
  );
}
