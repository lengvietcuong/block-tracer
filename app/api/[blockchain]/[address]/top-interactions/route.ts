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

const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

export async function getSWCTopInteractions(address: string) {
  try {
    const [topReceivedResult, topSentResult, totalCountResult] = await Promise.all([
      runQuery(
        `
        MATCH (sender:Address)-[:SENT]->(:Transaction)-[:RECEIVED_BY]->(receiver:Address {address: $address})
        RETURN sender.address AS senderAddress, COUNT(*) AS count
        ORDER BY count DESC
        LIMIT 10
        `,
        { address }
      ),
      runQuery(
        `
        MATCH (sender:Address {address: $address})-[:SENT]->(:Transaction)-[:RECEIVED_BY]->(receiver:Address)
        RETURN receiver.address AS receiverAddress, COUNT(*) AS count
        ORDER BY count DESC
        LIMIT 10
        `,
        { address }
      ),
      runQuery(
        `
        MATCH (a:Address {address: $address})
        OPTIONAL MATCH (a)-[:SENT]->(:Transaction)
        WITH a, COUNT(*) AS sendTxCount
        OPTIONAL MATCH (:Transaction)-[:RECEIVED_BY]->(a)
        RETURN sendTxCount, COUNT(*) AS receiveTxCount
        `,
        { address }
      ),
    ]);

    const totalReceivedCount = totalCountResult.records[0]?.get('receiveTxCount').toNumber() || 0;
    const totalSentCount = totalCountResult.records[0]?.get('sendTxCount').toNumber() || 0;

    const topReceived = topReceivedResult.records.map((record: any) => {
      const count = record.get('count').toNumber();
      return {
        address: record.get('senderAddress') || '',
        count,
        percentage: totalReceivedCount ? (count / totalReceivedCount) * 100 : 0,
      };
    });

    const topSent = topSentResult.records.map((record: any) => {
      const count = record.get('count').toNumber();
      return {
        address: record.get('receiverAddress') || '',
        count,
        percentage: totalSentCount ? (count / totalSentCount) * 100 : 0,
      };
    });

    return { topReceived, topSent };
  } catch (error) {
    console.error('Error executing Neo4j queries:', error);
    return { error: 'Internal Server Error' };
  }
}

async function runQuery(query: string, params: any) {
  const session = driver.session();
  try {
    return await session.run(query, params);
  } finally {
    await session.close();
  }
}

// API endpoint to fetch transaction analytics for a blockchain address
export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;

  if (blockchain === "swc") {
    const result = await getSWCTopInteractions(address);
    return NextResponse.json(result);
  }

  // Query to get top 10 addresses that sent tokens to this address
  const topReceivedQuery = `
  {
    ethereum(network: ${COIN_NAMES[blockchain]}) {
      transfers(
        receiver: {is: "${address}"}
        options: {
          limit: 10
          desc: "count"
        }
      ) {
        sender { address }
        count
      }
    }
  }`;

  // Query to get top 10 addresses that received tokens from this address
  const topSentQuery = `
  {
    ethereum(network: ${COIN_NAMES[blockchain]}) {
      transfers(
        sender: {is: "${address}"}
        options: {
          limit: 10
          desc: "count"
        }
      ) {
        receiver { address }
        count
      }
    }
  }`;

  // Query to get total transaction counts for the address
  const totalCountQuery = `
  {
    ethereum(network: ${COIN_NAMES[blockchain]}) {
      addressStats(address: {is: "${address}"}) {
        address {
          sendTxCount
          receiveTxCount
        }
      }
    }
  }`;

  // const result = await getSWCTopInteractions(address);
  // console.log(result);

  // Make parallel API calls to fetch received, sent, and total transaction data
  const [topReceivedResponse, topSentResponse, totalCountResponse] =
    await Promise.all([
      axios.post<BitQueryTransferResponse>(
        BIT_QUERY_URL,
        { query: topReceivedQuery },
        { headers },
      ),
      axios.post<BitQueryTransferResponse>(
        BIT_QUERY_URL,
        { query: topSentQuery },
        { headers },
      ),
      axios.post<BitQueryTotalCountResponse>(
        BIT_QUERY_URL,
        { query: totalCountQuery },
        { headers },
      ),
    ]);

  let totalReceivedCount =
    totalCountResponse.data.data.ethereum.addressStats[0].address
      .receiveTxCount;
  let totalSentCount =
    totalCountResponse.data.data.ethereum.addressStats[0].address.sendTxCount;

  // Disclaimer: The BitQuery API may not always provide up-to-date statistics on the total number of transactions sent and received
  // Ensure the totals are greater than or equal to the sum of the top 10 results
  totalReceivedCount = Math.max(
    totalReceivedCount,
    topReceivedResponse.data.data.ethereum.transfers.reduce(
      (acc, tx) => acc + Number(tx.count),
      0,
    ),
  );
  totalSentCount = Math.max(
    totalSentCount,
    topSentResponse.data.data.ethereum.transfers.reduce(
      (acc, tx) => acc + Number(tx.count),
      0,
    ),
  );

  // Transform and calculate percentages for received transactions
  const topReceived = topReceivedResponse.data.data.ethereum.transfers.map(
    (tx) => ({
      address: tx.sender?.address ?? "",
      count: Number(tx.count),
      percentage: (Number(tx.count) / totalReceivedCount) * 100,
    }),
  );
  // Transform and calculate percentages for sent transactions
  const topSent = topSentResponse.data.data.ethereum.transfers.map((tx) => ({
    address: tx.receiver?.address ?? "",
    count: Number(tx.count),
    percentage: (Number(tx.count) / totalSentCount) * 100,
  }));

  // console.log({ topReceived, topSent });

  return NextResponse.json({ topReceived, topSent });
}

// Types for the BitQuery GraphQL API responses
type TransferData = {
  sender: { address: string } | null;
  receiver: { address: string } | null;
  count: string;
};

type BitQueryTransferResponse = {
  data: {
    ethereum: {
      transfers: TransferData[];
    };
  };
};

type BitQueryTotalCountResponse = {
  data: {
    ethereum: {
      addressStats: Array<{
        address: {
          sendTxCount: number;
          receiveTxCount: number;
        };
      }>;
    };
  };
};
