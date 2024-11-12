import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import neo4j from "neo4j-driver";
import { initializeNeo4j, runQuery } from "@/lib/neo4j";
import status from "http-status";
import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE, COIN_NAMES, BIT_QUERY_URL } from "@/constants";
import { isValidAddress, getJsonOfError } from "@/utils";

// Define the API endpoint /api/[blockchain]/[address]/transactions
export async function GET(
  request: NextRequest,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  // Extract parameters from the request URL
  const { blockchain, address } = params;
  const searchParams = request.nextUrl.searchParams;
  const sort = searchParams.get("sort") || "time";
  const page = Number(searchParams.get("page")) || 1;
  // Verify that the parameters are valid
  if (
    !isValidAddress(address, blockchain) ||
    (sort !== "time" && sort !== "amount") ||
    page < 1
  ) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }
  const offset = (page - 1) * TRANSACTIONS_PER_PAGE;

  try {
    if (blockchain === "swc") {
      return await getSwincoinTransactions(
        address,
        TRANSACTIONS_PER_PAGE,
        offset,
        sort,
      ); // Swincoin data from the school's dataset
    }
    return await getTransactions(
      blockchain,
      address,
      TRANSACTIONS_PER_PAGE,
      offset,
      sort,
    ); // From the actual blockchain
  } catch (error) {
    return getJsonOfError(error);
  }
}

async function getSwincoinTransactions(
  address: string,
  limit: number,
  offset: number,
  orderBy: string,
) {
  // Connect to Neo4j
  const neo4jDriver = initializeNeo4j();

  const orderClause =
    orderBy === "time"
      ? "ORDER BY t.block_timestamp DESC"
      : "ORDER BY t.value DESC";
  const query = `
    MATCH (sender:Address)-[:SENT]->(t:Transaction)-[:RECEIVED_BY]->(receiver:Address)
    WHERE sender.address = $address OR receiver.address = $address
    ${orderClause}
    SKIP $offset
    LIMIT $limit
    RETURN
      sender.address AS fromAddress,
      receiver.address AS toAddress,
      t.hash AS hash,
      t.value AS value,
      t.block_timestamp AS blockTimestamp
  `;

  try {
    const result = await runQuery(neo4jDriver, query, {
      address,
      limit: neo4j.int(limit),
      offset: neo4j.int(offset),
    });
    if (result.records.length === 0) {
      return NextResponse.json(
        { message: "Not found" },
        { status: status.NOT_FOUND },
      );
    }
    return NextResponse.json(
      result.records.map((record) => ({
        fromAddress: record.get("fromAddress"),
        toAddress: record.get("toAddress"),
        hash: record.get("hash"),
        value: Number(record.get("value")) / 1e18, // Convert from wei to ETH
        blockTimestamp: Number(record.get("blockTimestamp")) * 1000, // Convert to milliseconds
      })),
    );
  } finally {
    // Close Neo4j
    await neo4jDriver.close();
  }
}

async function getTransactions(
  blockchain: BlockchainSymbol,
  address: string,
  limit: number,
  offset: number,
  orderBy: string,
) {
  // API configuration for BitQuery GraphQL endpoint
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.BIT_QUERY_API_KEY,
  };
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
  if (transactions.length === 0) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }

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
