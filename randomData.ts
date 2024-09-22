import crypto from "crypto";
import Rand from "rand-seed";

function generateRandomAddress() {
  return "0x" + crypto.randomBytes(20).toString("hex");
}

function generateRandomTransactionID() {
  return crypto.randomBytes(32).toString("hex");
}

export function getTransactions(address: string, start: number, end: number) {
  const transactions = [];
  const count = end - start + 1;

  for (let i = 0; i < count; i++) {
    const isSender = Math.random() > 0.5;
    const randomAddress = generateRandomAddress();
    const amount = (Math.random() * 1).toFixed(2);

    transactions.push({
      id: generateRandomTransactionID(),
      sender: isSender ? address : randomAddress,
      receiver: isSender ? randomAddress : address,
      amount: parseFloat(amount),
    });
  }

  return transactions;
}

export function getWalletOverview(address: string) {
  const rand = new Rand(address);

  return {
    blockchain: "Ethereum",
    balance: parseFloat((rand.next() * 2).toFixed(2)),
    sent: Math.floor(rand.next() * 20),
    received: Math.floor(rand.next() * 20),
    lastActive: `${Math.floor(rand.next() * 30)} days ago`,
  };
}
