import { BlockchainSymbol } from "./types";
import api from "@/components/api";
import Rand from "rand-seed";

function getRiskScore(rand: Rand) {
    return rand.next() < 2 / 3
      ? Math.floor(rand.next() * 26)  // Lower risk (0-25) for 2/3 of cases
      : 26 + Math.floor(rand.next() * 75);  // Higher risk (26-100) for the rest
  }

export async function getTransactions(
  blockchainSymbol: BlockchainSymbol,
  address: string,
  sortOrder: "time" | "amount",
  start: number,
  end: number
) {
  if(!address.startsWith("0x")) {
    return [];
  }
  const response = await api.post(`/search_wallet/${blockchainSymbol}/${address}`);
  if (response.status === 200 && response.data && response.data.length > 0) {
    
    const transactions = [];
    const count = response.data.length;
    for (let i = start; i < Math.min(end, count); i++) {
      const isSender = address === response.data[i].from_address;
      const randomAddress = response.data[i].to_address === address ? response.data[i].from_address : response.data[i].to_address;
      const amount = response.data[i].value;
      transactions.push({
        id: String(response.data[i].hash),
        sender: isSender ? String(address) : String(randomAddress),
        receiver: isSender ? String(randomAddress) : String(address),
        amount: parseFloat(amount),
        timestamp: new Date(response.data[i].block_timestamp),
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
  else {
    return [];
  }
}

export async function getWalletOverview(blockchainSymbol: BlockchainSymbol, address: string) {
    // Simulate a network delay (up to 1.5 seconds)
  if(!address.startsWith("0x")) {
    return;
  }
  const response = await api.post(`/wallet_detail/${blockchainSymbol}/${address}`);
  if (response.status === 200 && response.data) {

    const sent = parseInt(response.data.sendToCount);
    const received = parseInt(response.data.receiveFromCount);
  
    const amountSent = parseFloat(response.data.sendAmount.toFixed(4));
    const amountReceived = parseFloat(response.data.receiveAmount.toFixed(4)); 
    const balance = parseFloat(response.data.balance.toFixed(4));
  
    const firstActive = new Date(response.data.firstTransferAt);
    const lastActive = new Date(response.data.lastTransferAt);
  
    const riskScore = getRiskScore(new Rand(`${blockchainSymbol}-${address}`));
  
    return {
      balance,
      sent,
      received,
      amountSent,
      amountReceived,
      firstActive,
      lastActive,
      riskScore,
    }}
    else {
      return;
    }
  }