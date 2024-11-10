import { NextResponse } from "next/server";
import axios from "axios";
import neo4j, { Driver } from 'neo4j-driver';
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";

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

// Function to retrieve monthly transaction counts from Neo4j for "swc"
export async function getSWCMonthlyTransactions(address: string) {
  const session = driver.session();
  try {
    // Query for received transactions
    const receivedResult = await session.run(
      `
      MATCH (addr:Address {address: $address})<-[:RECEIVED_BY]-(tx:Transaction)
      WHERE tx.block_timestamp IS NOT NULL
      WITH date(datetime({ epochSeconds: tx.block_timestamp })) AS txDate, tx
      RETURN
        txDate.year AS year,
        txDate.month AS month,
        COUNT(tx) AS count
      ORDER BY year, month
      `,
      { address }
    );

    // Query for sent transactions
    const sentResult = await session.run(
      `
      MATCH (addr:Address {address: $address})-[:SENT]->(tx:Transaction)
      WHERE tx.block_timestamp IS NOT NULL
      WITH date(datetime({ epochSeconds: tx.block_timestamp })) AS txDate, tx
      RETURN
        txDate.year AS year,
        txDate.month AS month,
        COUNT(tx) AS count
      ORDER BY year, month
      `,
      { address }
    );

    // Process received transactions
    const receivedTransactions = receivedResult.records.map(record => ({
      date: {
        year: record.get('year').toNumber(),
        month: record.get('month').toNumber(),
      },
      count: record.get('count').toNumber(),
    }));

    // Process sent transactions
    const sentTransactions = sentResult.records.map(record => ({
      date: {
        year: record.get('year').toNumber(),
        month: record.get('month').toNumber(),
      },
      count: record.get('count').toNumber(),
    }));

    return { receivedTransactions, sentTransactions };
  } finally {
    await session.close();
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;

  if (blockchain === "swc") {
    // Fetch monthly transactions from Neo4j
    const { receivedTransactions, sentTransactions } = await getSWCMonthlyTransactions(address);

    // Format the response with proper date objects and number conversions
    const formattedReceived = receivedTransactions.map((tx) => ({
      count: tx.count,
      date: new Date(tx.date.year, tx.date.month - 1),
    }));

    const formattedSent = sentTransactions.map((tx) => ({
      count: tx.count,
      date: new Date(tx.date.year, tx.date.month - 1),
    }));

    return NextResponse.json({
      received: formattedReceived,
      sent: formattedSent,
    });
  }

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
