import Rand from "rand-seed";
import { BlockchainSymbol } from "./types";

function generateRandomAddress(rand: Rand) {
  let address = "0x";
  for (let i = 0; i < 20; i++) {
    address += Math.floor(rand.next() * 256)
      .toString(16)
      .padStart(2, "0");
  }
  return address;
}

function generateRandomTransactionID(rand: Rand) {
  let id = "";
  for (let i = 0; i < 32; i++) {
    id += Math.floor(rand.next() * 256)
      .toString(16)
      .padStart(2, "0");
  }
  return id;
}

export async function getTransactions(
  blockchainSymbol: BlockchainSymbol,
  address: string,
  sortOrder: "time" | "amount",
  start: number,
  end: number
) {
  // Simulate a delay of up to 1.5s
  const delay = Math.floor(Math.random() * 1_500);
  await new Promise((resolve) => setTimeout(resolve, delay));

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

  transactions.sort((a, b) => {
    if (sortOrder === "time") {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else {
      return Math.abs(b.amount) - Math.abs(a.amount);
    }
  });
  return transactions;
}

function getRandomDate(startDate: Date, endDate: Date, rand: Rand) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = Math.floor(rand.next() * (end - start + 1) + start);
  return new Date(randomTime);
}

function getRiskScore(rand: Rand) {
  return rand.next() < 2 / 3
    ? Math.floor(rand.next() * 26)
    : 26 + Math.floor(rand.next() * 75);
}

export async function getWalletOverview(blockchainSymbol: BlockchainSymbol, address: string) {
  // Simulate a delay of up to 1.5s
  const delay = Math.floor(Math.random() * 1_500);
  await new Promise((resolve) => setTimeout(resolve, delay));

  const rand = new Rand(`${blockchainSymbol}-${address}`);

  const sent = Math.floor(rand.next() * 100);
  const received = Math.floor(rand.next() * 100);

  const amountSent = parseFloat((rand.next() * 10).toFixed(4));
  const amountReceived = parseFloat((amountSent + rand.next() * 10).toFixed(4));
  const balance = parseFloat((amountReceived - amountSent).toFixed(4));

  const firstActive = getRandomDate(
    new Date(2010, 0, 1),
    new Date(2020, 0, 1),
    rand
  );
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
