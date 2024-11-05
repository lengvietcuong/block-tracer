import { USD_VALUE } from "./constants";
import { BlockchainSymbol } from "./types";

export function convertToUsd(
  value: number,
  blockchainSymbol: BlockchainSymbol
) {
  // Converts an amount in crypto to USD
  const convertedAmount = value * USD_VALUE[blockchainSymbol];
  return parseFloat(convertedAmount.toFixed(2));
}

export function getTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const times = [
    { unit: "year", value: Math.floor(diff / (1000 * 60 * 60 * 24 * 365)) },
    { unit: "month", value: Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) },
    { unit: "week", value: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) },
    { unit: "day", value: Math.floor(diff / (1000 * 60 * 60 * 24)) },
    { unit: "hour", value: Math.floor(diff / (1000 * 60 * 60)) },
    { unit: "minute", value: Math.floor(diff / (1000 * 60)) },
    { unit: "second", value: Math.floor(diff / 1000) },
  ];

  // Find the first non-zero unit and return the corresponding string
  for (const { unit, value } of times) {
    if (value > 0) {
      // Append "s" for plural units
      return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
  }
  return "";
}

export function formatAmount(amount: number, maximumFractionDigits = 5) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumFractionDigits,
  });
}

export function abbreviateAddress(address: string, maxLength: number = 8) {
  if (address.length <= maxLength) {
    return address; // If the address is short enough, no need to abbreviate
  }
  // Shorten the address with "..." in the middle
  const half = Math.floor(maxLength / 2);
  return `${address.slice(0, half)}...${address.slice(-half)}`;
}
