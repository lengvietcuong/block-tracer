import Rand from "rand-seed";
import { BlockchainSymbol } from "./types";

// Generates a random blockchain address using a seeded random number generator
function generateRandomAddress(rand: Rand) {
  let address = "0x";
  for (let i = 0; i < 20; i++) {
    address += Math.floor(rand.next() * 256)
      .toString(16)
      .padStart(2, "0");  // Generate each byte in hexadecimal form
  }
  return address;
}

// Generates a random transaction ID (32 bytes in hexadecimal format)
function generateRandomTransactionID(rand: Rand) {
  let id = "";
  for (let i = 0; i < 32; i++) {
    id += Math.floor(rand.next() * 256)
      .toString(16)
      .padStart(2, "0");  // Each byte is converted to hex and padded
  }
  return id;
}

// Simulates fetching a list of transactions
export async function getTransactions(
  blockchainSymbol: BlockchainSymbol,
  address: string,
  sortOrder: "time" | "amount",
  start: number,
  end: number
) {
  // Simulates network delay (up to 1.5 seconds)
  const delay = Math.floor(Math.random() * 1_500);
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Create a seeded random number generator using input parameters
  const rand = new Rand(`${blockchainSymbol}-${address}-${sortOrder}-${start}-${end}`);

  const transactions = [];
  const count = end - start + 1;

  for (let i = 0; i < count; i++) {
    const isSender = rand.next() > 0.5;
    const randomAddress = generateRandomAddress(rand);
    const amount = (rand.next() * 3).toFixed(4);

    transactions.push({
      id: generateRandomTransactionID(rand),
      sender: isSender ? address : randomAddress,
      receiver: isSender ? randomAddress : address,
      amount: parseFloat(amount),
      timestamp: getRandomDate(new Date(2020, 0, 1), new Date(), rand),
    });
  }

  // Sort transactions by either time or amount
  transactions.sort((a, b) => {
    if (sortOrder === "time") {
      return b.timestamp.getTime() - a.timestamp.getTime();  // Newest first
    } else {
      return Math.abs(b.amount) - Math.abs(a.amount);  // Largest amount first
    }
  });

  return transactions;
}

// Generates a random date between start and end using the seeded RNG
function getRandomDate(startDate: Date, endDate: Date, rand: Rand) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = Math.floor(rand.next() * (end - start + 1) + start);
  return new Date(randomTime);
}

// Generates a random risk score between 0 and 100, with lower values being more probable
function getRiskScore(rand: Rand) {
  return rand.next() < 2 / 3
    ? Math.floor(rand.next() * 26)  // Lower risk (0-25) for 2/3 of cases
    : 26 + Math.floor(rand.next() * 75);  // Higher risk (26-100) for the rest
}

// Simulates fetching an overview of a wallet's activity and balance
export async function getWalletOverview(blockchainSymbol: BlockchainSymbol, address: string) {
  // Simulate a network delay (up to 1.5 seconds)
  const delay = Math.floor(Math.random() * 1_500);
  await new Promise((resolve) => setTimeout(resolve, delay));

  const rand = new Rand(`${blockchainSymbol}-${address}`);

  const sent = Math.floor(rand.next() * 100);
  const received = Math.floor(rand.next() * 100);

  const amountSent = parseFloat((rand.next() * 10).toFixed(4));
  const amountReceived = parseFloat((amountSent + rand.next() * 10).toFixed(4)); 
  const balance = parseFloat((amountReceived - amountSent).toFixed(4));

  const firstActive = getRandomDate(new Date(2010, 0, 1), new Date(2020, 0, 1), rand);
  const lastActive = getRandomDate(new Date(2020, 0, 2), new Date(), rand);

  const riskScore = getRiskScore(rand);

  return {
    balance,
    sent,
    received,
    amountSent,
    amountReceived,
    firstActive,
    lastActive,
    riskScore,
  };
}
