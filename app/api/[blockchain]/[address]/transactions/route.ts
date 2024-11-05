import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE, COIN_NAMES, BIT_QUERY_URL } from "@/constants";

// API configuration for BitQuery GraphQL endpoint
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

export async function GET(
  request: NextRequest,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;

  // Extract pagination and sorting parameters from the request URL
  const searchParams = request.nextUrl.searchParams;
  const orderBy = (searchParams.get("orderBy") as "time" | "amount") || "time";
  const limit = Number(searchParams.get("limit")) || TRANSACTIONS_PER_PAGE;
  const offset = Number(searchParams.get("offset")) || 0;

  // Query to fetch paginated transaction history, sorted by either timestamp or amount
  const query = `
   {
     ethereum(network: ${COIN_NAMES[blockchain]}) {
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

  const response = await axios.post(BIT_QUERY_URL, { query }, { headers });
  const transactions: Transaction[] = response.data.data.ethereum.transactions;

  // Transform the response data into a simplified format with converted timestamps
  return NextResponse.json(
    transactions.map((tx: Transaction) => ({
      fromAddress: tx.sender.address,
      toAddress: tx.to.address,
      hash: tx.hash,
      value: Number(tx.amount),
      blockTimestamp: tx.block.timestamp.unixtime * 1000, // Convert to milliseconds
    })),
  );
}

// Define a type for the response transaction structure
type Transaction = {
  sender: { address: string };
  to: { address: string };
  hash: string;
  amount: string | number;
  block: {
    timestamp: {
      unixtime: number;
    };
  };
};