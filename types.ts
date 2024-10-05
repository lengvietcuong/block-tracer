export type Transaction = {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: Date;
};

export type Node = {
  id: string;
  address: string;
  x: number;
  y: number;
  radius: number;
};

export type BlockchainSymbol = "eth" | "bnb" | "avax" | "matic" | "klay" | "swc";
