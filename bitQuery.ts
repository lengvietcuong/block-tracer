"use server";

import axios from "axios";
import { BlockchainSymbol, Transaction, TransactionPartial } from "@/types";
import { TRANSACTIONS_PER_PAGE, COIN_NAMES } from "@/constants";

const URL = "https://graphql.bitquery.io/";
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

export async function getWalletOverview(
  blockchainSymbol: BlockchainSymbol,
  address: string
) {
  const query = `
  {
    ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
      addressStats(address: {is: "${address}"}) {
        address {
          balance
          sendAmount
          receiveAmount
          sendTxCount
          receiveTxCount
          firstTransferAt { unixtime }
          lastTransferAt { unixtime }
        }
      }
    }
  }`;

  const response = await axios.post(URL, { query }, { headers });
  const walletDetails = response.data.data.ethereum.addressStats[0].address;

  return {
    balance: Math.abs(Number(walletDetails.balance)),
    sentCount: Number(walletDetails.sendTxCount),
    receivedCount: Number(walletDetails.receiveTxCount),
    amountReceived: Number(walletDetails.receiveAmount),
    amountSent: Number(walletDetails.sendAmount),
    firstActive: new Date(walletDetails.firstTransferAt.unixtime * 1000),
    lastActive: new Date(walletDetails.lastTransferAt.unixtime * 1000),
  };
}

export async function getTransactions(
  blockchainSymbol: BlockchainSymbol,
  address: string,
  orderBy: "time" | "amount" = "time",
  limit: number = TRANSACTIONS_PER_PAGE,
  offset: number = 0
): Promise<TransactionPartial[]> {
  const query = `
    {
      ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
        transactions(
          any: [
            {txTo: {is: "${address}"}},
            {txSender: {is: "${address}"}}
          ]
          options: {
            limit: ${limit},
            offset: ${offset},
            ${orderBy === "time" ? 'desc: "block.timestamp.unixtime"' : 'desc: "amount"'}
          }
        ) {
          sender { address }
          to { address }
          hash
          amount
          block {
            timestamp { unixtime }
          }
        }
      }
    }`;

  const response = await axios.post(URL, { query }, { headers });
  const transactions = [...response.data.data.ethereum.transactions];

  return transactions.map((tx: any) => ({
    fromAddress: tx.sender.address,
    toAddress: tx.to.address,
    hash: tx.hash,
    value: Number(tx.amount),
    blockTimestamp: Number(tx.block.timestamp.unixtime) * 1000,
  }));
}

export async function getTransactionDetails(
  hash: string,
  blockchainSymbol: BlockchainSymbol
): Promise<Omit<Transaction, keyof TransactionPartial>> {
  const query = `
    {
      ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
        transactions(
          txHash: {is: "${hash}"}
        ) {
          index
          gas
          gasValue
          gasPrice
          block {
            height
          }
        }
      }
    }`;

  const response = await axios.post(URL, { query }, { headers });
  const tx = response.data.data.ethereum.transactions[0];

  // Fetch block hash separately because the BitQuery API doesn't support fetching it in the transaction query
  const blockHash = await getBlockHash(
    tx.block.height,
    COIN_NAMES[blockchainSymbol]
  );

  return {
    transactionIndex: Number(tx.index),
    gasUsed: Number(tx.gas),
    gasPrice: Number(tx.gasPrice),
    transactionFee: Number(tx.gasValue),
    blockNumber: Number(tx.block.height),
    blockHash,
  };
}

async function getBlockHash(height: number, coin: string): Promise<string> {
  const query = `
    {
      ethereum(network: ${coin}) {
        blocks(
          height: {is: ${height}}
        ) {
          hash
        }
      }
    }`;

  const response = await axios.post(URL, { query }, { headers });
  return response.data.data.ethereum.blocks[0].hash;
}

export async function getTotalTransactions(
  blockchainSymbol: BlockchainSymbol,
  address: string
): Promise<number> {
  const query = `
    {
      ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
        transactions(
          any: [
            {txTo: {is: "${address}"}},
            {txSender: {is: "${address}"}}
          ]
        ) {
          count
        }
      }
    }`;
  const response = await axios.post(URL, { query }, { headers });
  return response.data.data.ethereum.transactions[0].count;
}

export async function getMonthlyTransactionCount(
  blockchainSymbol: BlockchainSymbol,
  address: string
) {
  const receivedQuery = `
    {
      ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
        transfers(
          receiver: {is: "${address}"}
        ) {
          date { month, year }
          count
        }
      }
    }`;
  const sentQuery = `
    {
      ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
        transfers(
          sender: {is: "${address}"}
        ) {
          date { month, year }
          count
        }
      }
    }`;
  const [receivedResponse, sentResponse] = await Promise.all([
    axios.post(URL, { query: receivedQuery }, { headers }),
    axios.post(URL, { query: sentQuery }, { headers }),
  ]);
  const receivedTransactions = receivedResponse.data.data.ethereum.transfers;
  const sentTransactions = sentResponse.data.data.ethereum.transfers;

  return {
    received: receivedTransactions.map((tx: any) => ({
      count: Number(tx.count),
      date: new Date(tx.date.year, tx.date.month - 1),
    })),
    sent: sentTransactions.map((tx: any) => ({
      count: Number(tx.count),
      date: new Date(tx.date.year, tx.date.month - 1),
    })),
  };
}

export async function getTopInteractions(
  blockchainSymbol: BlockchainSymbol,
  address: string
) {
  const topReceivedQuery = `
  {
    ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
      transfers(
        receiver: {is: "${address}"}
        options: {
          limit: 10
          desc: "count"
        }
      ) {
        sender { address }
        count
      }
    }
  }`;
  const topSentQuery = `
  {
    ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
      transfers(
        sender: {is: "${address}"}
        options: {
          limit: 10
          desc: "count"
        }
      ) {
        receiver { address }
        count
      }
    }
  }`;
  const totalCountQuery = `
  {
    ethereum(network: ${COIN_NAMES[blockchainSymbol]}) {
      addressStats(address: {is: "${address}"}) {
        address {
          sendTxCount
          receiveTxCount
        }
      }
    }
  }`;

  const [topReceivedResponse, topSentResponse, totalCountResponse] =
    await Promise.all([
      axios.post(URL, { query: topReceivedQuery }, { headers }),
      axios.post(URL, { query: topSentQuery }, { headers }),
      axios.post(URL, { query: totalCountQuery }, { headers }),
    ]);

  const totalReceivedCount =
    totalCountResponse.data.data.ethereum.addressStats[0].address
      .receiveTxCount;
  const totalSentCount =
    totalCountResponse.data.data.ethereum.addressStats[0].address.sendTxCount;
  const topReceived = topReceivedResponse.data.data.ethereum.transfers.map(
    (tx: any) => ({
      address: tx.sender.address,
      count: Number(tx.count),
      percentage: (Number(tx.count) / totalReceivedCount) * 100,
    })
  );
  const topSent = topSentResponse.data.data.ethereum.transfers.map(
    (tx: any) => ({
      address: tx.receiver.address,
      count: Number(tx.count),
      percentage: (Number(tx.count) / totalSentCount) * 100,
    })
  );

  return { topReceived, topSent };
}
