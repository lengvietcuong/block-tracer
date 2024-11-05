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

  // Query to get total transaction count for an address (both sent and received)
  // Uses the 'any' operator to match transactions where the address is either sender or receiver
  const query = `
   {
     ethereum(network: ${COIN_NAMES[blockchain]}) {
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

  const response = await axios.post(BIT_QUERY_URL, { query }, { headers });
  // Return just the total transaction count
  return NextResponse.json(response.data.data.ethereum.transactions[0].count);
}
