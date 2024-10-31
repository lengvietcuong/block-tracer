"use server";

import axios from "axios";
import { BlockchainSymbol } from "@/types";

const COINS: Record<BlockchainSymbol, string> = {
  eth: "ethereum",
  bnb: "bsc",
  avax: "avalanche",
  matic: "matic",
  klay: "klaytn",
  swc: "swincoin",
};
const URL = "https://graphql.bitquery.io/";
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

export async function getTransactions(
  blockchainSymbol: BlockchainSymbol,
  address: string,
  sortOrder: "time" | "amount",
  start: number,
  end: number
) {
  if (!address.startsWith("0x")) {
    throw new Error("Invalid address");
  }

  const coin = COINS[blockchainSymbol];
  const limit = Math.floor((end - start + 1) / 2);
  const orderBy =
    sortOrder === "time" ? 'asc: "block.height"' : 'desc: "amount"';
  const buildQuery = (direction: "txTo" | "txSender") => `
    {
      ethereum(network: ${coin}) {
        transactions(
          ${direction}: {is: "${address}"},
          options: {
            limit: ${limit},
            offset: ${start},
            ${orderBy}
          }
        ) {
          block {
            timestamp { unixtime }
            height
          }
          hash
          sender { address }
          to { address }
          amount
        }
      }
    }`;

  const [toResponse, fromResponse] = await Promise.all([
    axios.post(URL, { query: buildQuery("txTo") }, { headers }),
    axios.post(URL, { query: buildQuery("txSender") }, { headers }),
  ]);

  const transactions = [
    ...toResponse.data.data.ethereum.transactions,
    ...fromResponse.data.data.ethereum.transactions,
  ];
    transactions.sort((a: any, b: any) => {
    if (sortOrder === "time") {
      return a.timestamp.getTime() - b.timestamp.getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  return transactions.map((tx: any) => ({
    id: tx.hash,
    sender: tx.sender.address,
    receiver: tx.to.address,
    amount: parseFloat(tx.amount),
    blockNumber: tx.block.height,
    timestamp: new Date(tx.block.timestamp.unixtime * 1000),
  }));
}

export async function getWalletOverview(
  blockchainSymbol: BlockchainSymbol,
  address: string
) {
  if (!address.startsWith("0x")) {
    throw new Error("Invalid address");
  }
  const coin = COINS[blockchainSymbol] || "unknown";
  const query = `
  {
    ethereum(network: ${coin}) {
      addressStats(address: {is: "${address}"}) {
        address {
          balance
          callTxCount
          receiveAmount
          sendAmount
          sendToCount
          receiveFromCount
          receiveTxCount
          sendTxCount
          firstTransferAt { unixtime }
          lastTransferAt { unixtime }
        }
      }
    }
  }`;

  const response = await axios.post(URL, { query }, { headers });
  const walletDetails = response.data.data.ethereum.addressStats[0].address;
  return {
    balance: Number(walletDetails.balance),
    amountReceived: Number(walletDetails.receiveAmount),
    amountSent: Number(walletDetails.sendAmount),
    sent: Number(walletDetails.sendToCount),
    received: Number(walletDetails.receiveFromCount),
    firstActive: new Date(walletDetails.firstTransferAt.unixtime * 1000),
    lastActive: new Date(walletDetails.lastTransferAt.unixtime * 1000),
    riskScore: Math.round(Math.random() * 100),
  };
}
