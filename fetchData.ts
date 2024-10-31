import axios from 'axios';
import { BlockchainSymbol } from "./types";

const API_URL = 'https://graphql.bitquery.io/';
const API_KEY = 'BQYdkG2CjnW4F516QkNkWLNv5QqNiFIo';

let success = 0;
let fail = 0;
let progress = 0;

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY,
};
function getRiskScore() {
  if (success + fail > 0)
    return parseInt(((1 - (success / (success + fail))) * 100).toFixed(0));
  else return 0;
}

export async function getBlock(height: number, coin: string) {
  const blockQuery = `
{
  ethereum(network: ${coin}) {
    blocks(
      height: {is: ${height}}
    ) {
      height
      hash
    }
  }
}`
  try {
    const response = await axios.post(API_URL, { query: blockQuery }, { headers });
    if (response.status !== 200) {
      return 0;
    }
    return 1;
  } catch (error) {
    console.error('Error fetching block:', error);
    return 0;
  }
}

export async function getTransactions(
  initcoin: BlockchainSymbol,
  address: string, sortOrder: 'time' | 'amount',
  start: number,
  end: number,
  setProgress: (progress: number) => void
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
      transactions(txTo: {is: "${address}"}, options: {limit: 10000}) {
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
        success
      }
    }
  }`;

  const queryFromAddress = `
  {
    ethereum(network: ${coin}) {
      transactions(txSender: {is: "${address}"}, options: {limit: 10000}) {
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
        success
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
    success = 0;
    fail = 0;
    
    const allTransactions = await Promise.all([...toTransactions, ...fromTransactions].map(async (tx: any, index: number) => {
      if(tx.success === true){
        success++;
      } else {
        fail++;
      }
      if (await getBlock(tx.block.height, coin) === 1) {
        progress = Math.max(((index + 1) / (toTransactions.length + fromTransactions.length))*100, progress);
        setProgress(progress);
      }
      
      return {
        sender: tx.sender.address,
        receiver: tx.to.address,
        id: tx.hash,
        amount: tx.amount,
        gasUsed: tx.gasValue / tx.gasPrice,
        gasPrice: tx.gasPrice,
        transactionFee: tx.gasValue,
        blockNumber: tx.block.height,
        timestamp: new Date(tx.block.timestamp.unixtime),
      };
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
      riskScore: getRiskScore(),
    };
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    return null;
  }
}
