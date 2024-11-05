import { BlockchainSymbol } from "./types";

export const BLOCKCHAIN_NAMES: Record<BlockchainSymbol, string> = {
  eth: "Ethereum",
  bnb: "Binance",
  avax: "Avalanche",
  matic: "Polygon",
  klay: "Klaytn",
  swc: "Swincoin", // Imaginary coin
};

// Used for the BitQuery API
export const COIN_NAMES: Record<BlockchainSymbol, string> = {
  eth: "ethereum",
  bnb: "bsc",
  avax: "avalanche",
  matic: "matic",
  klay: "klaytn",
  swc: "swincoin",
};

export const USD_VALUE: Record<BlockchainSymbol, number> = {
  eth: 2345.85,
  bnb: 539.60,
  avax: 24.48,
  matic: 0.3733,
  klay: 0.126990,
  swc: 35.34,
};

export const TRANSACTIONS_PER_PAGE = 20;

export const BIT_QUERY_URL = "https://graphql.bitquery.io";
export const CHAIN_ANALYSIS_URL = "https://public.chainalysis.com/api/v1/address";