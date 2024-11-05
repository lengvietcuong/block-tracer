import { NextResponse } from "next/server";
import axios from "axios";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";

// API configuration for BitQuery GraphQL endpoint
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;

  // GraphQL query to fetch comprehensive wallet statistics including balance,
  // transaction counts and timestamps
  const query = `
   {
     ethereum(network: ${COIN_NAMES[blockchain]}) {
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

  const response = await axios.post(BIT_QUERY_URL, { query }, { headers });
  const walletDetails = response.data.data.ethereum.addressStats[0].address;

  // Format response with proper number conversions and convert unix timestamps to dates
  return NextResponse.json({
    balance: Math.abs(Number(walletDetails.balance)),
    sentCount: Number(walletDetails.sendTxCount),
    receivedCount: Number(walletDetails.receiveTxCount),
    amountReceived: Number(walletDetails.receiveAmount),
    amountSent: Number(walletDetails.sendAmount),
    firstActive: new Date(walletDetails.firstTransferAt.unixtime * 1000),
    lastActive: new Date(walletDetails.lastTransferAt.unixtime * 1000),
  });
}
