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
  const limit = end - start + 1;
  const orderBy =
    sortOrder === "time" ? 'desc: "block.timestamp.unixtime"' : 'desc: "amount"';
  const query = `
    {
      ethereum(network: ${coin}) {
        transactions(
          any: [
            {txTo: {is: "${address}"}},
            {txSender: {is: "${address}"}}
          ]
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

  const response = await axios.post(URL, { query }, { headers });
  const transactions = [...response.data.data.ethereum.transactions];

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
  };
}
