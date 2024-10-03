export type Transaction = {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
};

export type Node = {
  id: string;
  address: string;
  x: number;
  y: number;
};

export type BlockchainSymbol = "ETH" | "BNB" | "AVAX" | "MATIC" | "KLAY" | "SWC";