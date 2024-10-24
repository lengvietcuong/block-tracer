import axios from 'axios';
import Rand from 'rand-seed';
import { BlockchainSymbol } from "./types";

const API_URL = 'https://graphql.bitquery.io/';
const API_KEY = 'BQYPukAzSxvupCs722VUSymBjMiNEuWP';

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY,
};
function getRiskScore(rand: Rand) {
  return rand.next() < 2 / 3
    ? Math.floor(rand.next() * 26)  // Lower risk (0-25) for 2/3 of cases
    : 26 + Math.floor(rand.next() * 75);  // Higher risk (26-100) for the rest
}

export async function getTransactions(
  initcoin: BlockchainSymbol,
  address: string, sortOrder: 'time' | 'amount',
  start: number,
  end: number
) {
  if (!address.startsWith('0x')) {
    return [];
  }
  const coin = initcoin === 'eth' ? 'ethereum' :
  initcoin ===  "bnb" ? 'bsc':
  initcoin === "avax" ? 'avalanche':
  initcoin === "matic" ? 'matic' : 'klaytn'
  // Fetch transactions to this address
  const queryToAddress = `
  {
    ethereum(network: ${coin}) {
      transactions(txTo: {is: "${address}"}, options: {limit: 100}) {
        block {
          timestamp { unixtime }
          height
        }
        hash
        amount
        gasValue
        sender { address }
        to { address }
        gasPrice
        gas
        index
      }
    }
  }`;

  const queryFromAddress = `
  {
    ethereum(network: ${coin}) {
      transactions(txSender: {is: "${address}"}, options: {limit: 100}) {
        block {
          timestamp { unixtime }
          height
        }
        hash
        amount
        gasValue
        sender { address }
        to { address }
        gasPrice
        gas
        index
      }
    }
  }`;

  try {
    // Fetch both directions of transactions
    const [toResponse, fromResponse] = await Promise.all([
      axios.post(API_URL, { query: queryToAddress }, { headers }),
      axios.post(API_URL, { query: queryFromAddress }, { headers }),
    ]);

    const toTransactions = toResponse.data.data.ethereum.transactions;
    const fromTransactions = fromResponse.data.data.ethereum.transactions;
    
    const allTransactions = [...toTransactions, ...fromTransactions].map((tx: any) => ({
      sender: tx.sender.address,
      receiver: tx.to.address,
      id: tx.hash,
      amount: tx.amount,
      gasUsed: tx.gasValue / tx.gasPrice,
      gasPrice: tx.gasPrice,
      transactionFee: tx.gasValue,
      blockNumber: tx.block.height,
      timestamp: new Date(tx.block.timestamp.unixtime),
    }));

    allTransactions.sort((a, b) => {
      if (sortOrder === "time") {
        return b.timestamp.getTime() - a.timestamp.getTime();  // Newest first
      } else {
        return Math.abs(b.amount) - Math.abs(a.amount);  // Largest amount first
      }
    });
    
    const transactions = [];
    const count = allTransactions.length;
    for (let i = start; i < Math.min(end, count); i++) {
      const isSender = address === allTransactions[i].sender;
      transactions.push({
        id: String(allTransactions[i].id),
        sender: isSender ? String(allTransactions[i].sender) : String(allTransactions[i].receiver),
        receiver: isSender ? String(allTransactions[i].receiver) : String(allTransactions[i].sender),
        amount: parseFloat(allTransactions[i].amount),
        timestamp: new Date(allTransactions[i].timestamp),
      });
    }

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getWalletOverview(initcoin: BlockchainSymbol, address: string) {
  if (!address.startsWith('0x')) {
    return null;
  }
  const coin = initcoin === 'eth' ? 'ethereum' :
  initcoin ===  "bnb" ? 'bsc':
  initcoin === "avax" ? 'avalanche':
  initcoin === "matic" ? 'matic' : 'klaytn'

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

  try {
    const response = await axios.post(API_URL, { query }, { headers });
    const walletDetails = response.data.data.ethereum.addressStats[0].address;
    return {
      balance: parseFloat(walletDetails.balance.toFixed(4)),
      amountReceived: walletDetails.receiveAmount.toFixed(4),
      amountSent: walletDetails.sendAmount.toFixed(4),
      sent: walletDetails.sendToCount,
      received: walletDetails.receiveFromCount,
      firstActive: new Date(walletDetails.firstTransferAt.unixtime),
      lastActive: new Date(walletDetails.lastTransferAt.unixtime),
      riskScore: getRiskScore(new Rand(`${initcoin}-${address}`)),
    };
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    return null;
  }
}
