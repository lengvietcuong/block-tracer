import { NextResponse } from "next/server";
import axios from "axios";
import { initializeNeo4j, runQuery } from "@/lib/neo4j";
import status from "http-status";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";
import { isValidAddress, getJsonOfError } from "@/utils";

// Define the API endpoint /api/[blockchain]/[address]/monthly-transactions
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
      return await getSwincoinMonthlyTransactions(address); // Swincoin data from the school's dataset
    }
    return await getMonthlyTransactions(blockchain, address); // From the actual blockchain
  } catch (error) {
    return getJsonOfError(error);
  }
}

async function getSwincoinMonthlyTransactions(address: string) {
  // Connect to Neo4j
  const neo4jDriver = initializeNeo4j();

  // Cypher query to fetch received transactions
  const receivedQuery = `
  MATCH (addr:Address {address: $address})<-[:RECEIVED_BY]-(tx:Transaction)
  WHERE tx.block_timestamp IS NOT NULL
  WITH date(datetime({ epochSeconds: tx.block_timestamp })) AS txDate, tx
  RETURN
    txDate.year AS year,
    txDate.month AS month,
    COUNT(tx) AS count
  ORDER BY year, month
  `;
  // Cypher query to fetch sent transactions
  const sentQuery = `
  MATCH (addr:Address {address: $address})-[:SENT]->(tx:Transaction)
  WHERE tx.block_timestamp IS NOT NULL
  WITH date(datetime({ epochSeconds: tx.block_timestamp })) AS txDate, tx
  RETURN
    txDate.year AS year,
    txDate.month AS month,
    COUNT(tx) AS count
  ORDER BY year, month
  `;

  try {
    // Fetch received and sent transactions in parallel
    const [receivedResult, sentResult] = await Promise.all([
      runQuery(neo4jDriver, receivedQuery, { address }),
      runQuery(neo4jDriver, sentQuery, { address }),
    ]);
    if (
      receivedResult.records.length === 0 &&
      sentResult.records.length === 0
    ) {
      return NextResponse.json(
        { message: "Not found" },
        { status: status.NOT_FOUND },
      );
    }
    // Format the response with proper date objects and number conversions
    return NextResponse.json({
      received: receivedResult.records.map((record) => ({
        date: new Date(
          record.get("year").toNumber(),
          record.get("month").toNumber() - 1,
        ),
        count: record.get("count").toNumber(),
      })),
      sent: sentResult.records.map((record) => ({
        date: new Date(
          record.get("year").toNumber(),
          record.get("month").toNumber() - 1,
        ),
        count: record.get("count").toNumber(),
      })),
    });
  } finally {
    // Close Neo4j
    await neo4jDriver.close();
  }
}

async function getMonthlyTransactions(
  blockchain: BlockchainSymbol,
  address: string,
) {
  // API configuration for BitQuery GraphQL endpoint
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.BIT_QUERY_API_KEY,
  };
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
  // Fetch both queries in parallel
  const [receivedResponse, sentResponse] = await Promise.all([
    axios.post<TransfersResponse>(
      BIT_QUERY_URL,
      { query: receivedQuery },
      { headers },
    ),
    axios.post<TransfersResponse>(
      BIT_QUERY_URL,
      { query: sentQuery },
      { headers },
    ),
  ]);
  const receivedTransactions = receivedResponse.data.data.ethereum.transfers;
  const sentTransactions = sentResponse.data.data.ethereum.transfers;
  if (receivedTransactions.length === 0 && sentTransactions.length === 0) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }
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
};
