import { BlockchainSymbol } from "./types";

export const BLOCKCHAIN_NAMES: Record<BlockchainSymbol, string> = {
  ETH: "Ethereum",
  BNB: "Binance",
  AVAX: "Avalanche",
  MATIC: "Polygon",
  KLAY: "Klaytn",
  SWC: "Swincoin",
};

export const USD_VALUE: Record<BlockchainSymbol, number> = {
  ETH: 2345.85,
  BNB: 539.60,
  AVAX: 24.48,
  MATIC: 0.3733,
  KLAY: 0.126990,
  SWC: 35.34,
};