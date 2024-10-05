import { BlockchainSymbol } from "./types";

export const BLOCKCHAIN_NAMES: Record<BlockchainSymbol, string> = {
  eth: "Ethereum",
  bnb: "Binance",
  avax: "Avalanche",
  matic: "Polygon",
  klay: "Klaytn",
  swc: "Swincoin",
};

export const USD_VALUE: Record<BlockchainSymbol, number> = {
  eth: 2345.85,
  bnb: 539.60,
  avax: 24.48,
  matic: 0.3733,
  klay: 0.126990,
  swc: 35.34,
};