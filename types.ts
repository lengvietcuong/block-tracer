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