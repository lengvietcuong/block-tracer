// Note: the 'gas' (gas limit) and 'input' fields are available in the assignment's dataset but not available via the BitQuery API for some reason
export type Transaction = {
  fromAddress: string; // The sender's address
  toAddress: string; // The receiver's address
  hash: string; // Unique identifier of the transaction
  value: number; // Transaction amount in smallest units
  input?: string; // Input data, often used for function calls in smart contracts
  transactionIndex: number; // Index of the transaction within the block
  gas?: number; // Amount of gas provided for the transaction
  gasUsed: number; // Actual amount of gas used in the transaction
  gasPrice: number; // Gas price in wei
  transactionFee: number; // Total transaction fee (gas price * gas used)
  blockNumber: number; // Block number in which the transaction was included
  blockHash: string; // Hash of the block containing this transaction
  blockTimestamp: number; // Timestamp of the block (Unix format)
};

// When displaying transactions in the graph or table, only a few fields are needed
export type TransactionPartial = Pick<
  Transaction,
  "hash" | "fromAddress" | "toAddress" | "value" | "blockTimestamp"
>;

// Represents a node in the transaction graph
export type Node = {
  id: string;
  address: string;
  x: number;
  y: number;
  radius: number;
};

export type BlockchainSymbol =
  | "eth"
  | "bnb"
  | "avax"
  | "matic"
  | "klay"
  | "swc";
