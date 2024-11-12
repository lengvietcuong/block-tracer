import { NextResponse } from "next/server";
import axios from "axios";
import { initializeNeo4j, runQuery } from "@/lib/neo4j";
import status from "http-status";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";
import { isValidAddress, getJsonOfError } from "@/utils";

// Define the API endpoint /api/[blockchain]/[address]/total-transactions
export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;
  if (!isValidAddress(address, blockchain)) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }

  try {
    if (blockchain === "swc") {
      return await getSwincoinTotalTransactions(address); // Swincoin data from the school's dataset
    }
    return await getTotalTransactions(blockchain, address); // From the actual blockchain
  } catch (error) {
    return getJsonOfError(error);
  }
}

// Function to retrieve total transaction count from Neo4j for "swc"
async function getSwincoinTotalTransactions(address: string) {
  const neo4jDriver = initializeNeo4j();
  try {
    const query = `
      MATCH (addr:Address {address: $address})-[:SENT|RECEIVED_BY]->(tx:Transaction)
      RETURN COUNT(DISTINCT tx) AS totalTransactions
    `;

    const result = await runQuery(neo4jDriver, query, { address });
    if (result.records.length === 0) {
      return NextResponse.json(
        { message: "Not found" },
        { status: status.NOT_FOUND },
      );
    }
    const totalTransactions = result.records[0]
      .get("totalTransactions")
      .toNumber();
    return NextResponse.json(totalTransactions);
  } finally {
    await neo4jDriver.close();
  }
}

async function getTotalTransactions(
  blockchain: BlockchainSymbol,
  address: string,
) {
  // API configuration for BitQuery GraphQL endpoint
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.BIT_QUERY_API_KEY,
  };
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
  const totalTransactions = response.data.data.ethereum.transactions[0].count;
  if (totalTransactions === 0) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }

  return NextResponse.json(totalTransactions);
}
