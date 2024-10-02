import Rand from "rand-seed";

function generateRandomAddress(rand: Rand) {
  let address = "0x";
  for (let i = 0; i < 20; i++) {
    address += Math.floor(rand.next() * 256).toString(16).padStart(2, '0');
  }
  return address;
}

function generateRandomTransactionID(rand: Rand) {
  let id = "";
  for (let i = 0; i < 32; i++) {
    id += Math.floor(rand.next() * 256).toString(16).padStart(2, '0');
  }
  return id;
}

export function getTransactions(address: string, start: number, end: number) {
  const rand = new Rand(`${address}${start}${end}`);

  const transactions = [];
  const count = end - start + 1;

  for (let i = 0; i < count; i++) {
    const isSender = rand.next() > 0.5;
    const randomAddress = generateRandomAddress(rand);
    const amount = (rand.next() * 1).toFixed(2);

    transactions.push({
      id: generateRandomTransactionID(rand),
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
    balance: parseFloat((rand.next() * 2).toFixed(2)),
    sent: Math.floor(rand.next() * 20),
    received: Math.floor(rand.next() * 20),
    lastActive: `${Math.floor(rand.next() * 30)} days ago`,
  };
}