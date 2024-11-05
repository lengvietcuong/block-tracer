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

  // GraphQL query to fetch incoming transactions for the address
  const receivedQuery = `
    {
      ethereum(network: ${COIN_NAMES[blockchain]}) {
        transfers(
          receiver: {is: "${address}"}
        ) {
          date { month, year }
          count
        }
      }
    }`;

  // GraphQL query to fetch outgoing transactions for the address
  const sentQuery = `
    {
      ethereum(network: ${COIN_NAMES[blockchain]}) {
        transfers(
          sender: {is: "${address}"}
        ) {
          date { month, year }
          count
        }
      }
    }`;

  // Fetch both queries in parallel for better performance
  const [receivedResponse, sentResponse] = await Promise.all([
    axios.post<TransfersResponse>(BIT_QUERY_URL, { query: receivedQuery }, { headers }),
    axios.post<TransfersResponse>(BIT_QUERY_URL, { query: sentQuery }, { headers }),
  ]);

  const receivedTransactions = receivedResponse.data.data.ethereum.transfers;
  const sentTransactions = sentResponse.data.data.ethereum.transfers;

  // Format the response with proper date objects and number conversions
  return NextResponse.json({
    received: receivedTransactions.map((tx) => ({
      count: Number(tx.count),
      date: new Date(tx.date.year, tx.date.month - 1),
    })),
    sent: sentTransactions.map((tx) => ({
      count: Number(tx.count),
      date: new Date(tx.date.year, tx.date.month - 1),
    })),
  });
}

// Define the structure of the response data for the Ethereum transfers
type TransfersResponse = {
  data: {
    ethereum: {
      transfers: {
        date: {
          month: number;
          year: number;
        };
        count: string;
      }[];
    };
  };
}
