import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import neo4j, { Driver } from 'neo4j-driver';
import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE, COIN_NAMES, BIT_QUERY_URL } from "@/constants";

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Connect to Neo4j using credentials from .env
const neo4jUrl = process.env.NEO4J_URL;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;

if (!neo4jUrl || !neo4jUser || !neo4jPassword) {
  throw new Error('Missing Neo4j connection credentials');
}

const driver: Driver = neo4j.driver(
  neo4jUrl,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// API configuration for BitQuery GraphQL endpoint
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

export async function getSWCTransactions(
  address: string,
  limit: number,
  offset: number,
  orderBy: string
) {
  const session = driver.session();
  try {
    const orderClause =
      orderBy === "time" ? "ORDER BY t.block_timestamp DESC" : "ORDER BY t.value DESC";
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
    const result = await session.run(query, {
      address,
      limit: neo4j.int(limit),
      offset: neo4j.int(offset),
    });

    const transactions = result.records.map((record: any) => ({
      fromAddress: record.get('fromAddress'),
      toAddress: record.get('toAddress'),
      hash: record.get('hash'),
      value: Number(record.get('value')) / 1e18, // Convert to SWC
      blockTimestamp: Number(record.get('blockTimestamp')) * 1000, // Convert to milliseconds
    }));

    // Return the transactions
    return transactions;
  } finally {
    await session.close();
  }
}

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

  if (blockchain === "swc") {
    const transactions = await getSWCTransactions(address, limit, offset, orderBy);
    return NextResponse.json(transactions);
  }

  const swctransactions = await getSWCTransactions(address, limit, offset, orderBy);
  console.log(swctransactions);

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