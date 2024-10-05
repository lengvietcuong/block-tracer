import { USD_VALUE } from "./constants";
import { BlockchainSymbol } from "./types";

export function convertToUsd(value: number, blockchainSymbol: BlockchainSymbol) {
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

  for (const { unit, value } of times) {
    if (value > 0) {
      return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
  }
  return "";
}