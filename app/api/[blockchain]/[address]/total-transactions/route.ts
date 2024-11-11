import { NextResponse } from "next/server";
import axios from "axios";
import { initializeNeo4j, runQuery } from "@/lib/neo4j";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";

// API configuration for BitQuery GraphQL endpoint
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

// Function to retrieve total transaction count from Neo4j for "swc"
async function getSwincoinTotalTransactions(address: string) {
  const neo4jDriver = initializeNeo4j();
  const session = neo4jDriver.session();

  try {
    const query = `
      MATCH (addr:Address {address: $address})-[:SENT|RECEIVED_BY]->(tx:Transaction)
      RETURN COUNT(DISTINCT tx) AS totalTransactions
    `;

    const result = await runQuery(neo4jDriver, query, { address });
    // console.log(result.records[0].get("totalTransactions").toNumber());
    return result.records[0].get("totalTransactions").toNumber();
  } finally {
    await session.close();
    await neo4jDriver.close();
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;

  if (blockchain === "swc") {
    const totalCount = await getSwincoinTotalTransactions(address);
    return NextResponse.json(totalCount);
  }

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
