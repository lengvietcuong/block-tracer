import { NextResponse } from "next/server";
import axios from "axios";
import { initializeNeo4j, runQuery } from "@/lib/neo4j";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";

// Define the API endpoint /[blockchain]/[address]/top-interactions
export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;
  if (blockchain === "swc") {
    return getSwincoinTopInteractions(address);
  }
  return getTopInteractions(blockchain, address);
}

async function getSwincoinTopInteractions(address: string) {
  // Connect to Neo4j
  const neo4jDriver = initializeNeo4j();

  const topReceivedQuery = `
  MATCH (sender:Address)-[:SENT]->(:Transaction)-[:RECEIVED_BY]->(receiver:Address {address: $address})
  RETURN sender.address AS senderAddress, COUNT(*) AS count
  ORDER BY count DESC
  LIMIT 10
  `;
  const topSentQuery = `
  MATCH (sender:Address {address: $address})-[:SENT]->(:Transaction)-[:RECEIVED_BY]->(receiver:Address)
  RETURN receiver.address AS receiverAddress, COUNT(*) AS count
  ORDER BY count DESC
  LIMIT 10
  `;
  const totalCountQuery = `
  MATCH (a:Address {address: $address})
  OPTIONAL MATCH (a)-[:SENT]->(:Transaction)
  WITH a, COUNT(*) AS sendTxCount
  OPTIONAL MATCH (:Transaction)-[:RECEIVED_BY]->(a)
  RETURN sendTxCount, COUNT(*) AS receiveTxCount
  `;
  try {
    const [topReceivedResult, topSentResult, totalCountResult] =
      await Promise.all([
        runQuery(neo4jDriver, topReceivedQuery, { address }),
        runQuery(neo4jDriver, topSentQuery, { address }),
        runQuery(neo4jDriver, totalCountQuery, { address }),
      ]);

    const totalReceivedCount =
      totalCountResult.records[0]?.get("receiveTxCount").toNumber() || 0;
    const totalSentCount =
      totalCountResult.records[0]?.get("sendTxCount").toNumber() || 0;

    const topReceived = topReceivedResult.records.map((record) => {
      const count = record.get("count").toNumber();
      return {
        address: record.get("senderAddress") || "",
        count,
        percentage: totalReceivedCount ? (count / totalReceivedCount) * 100 : 0,
      };
    });
    const topSent = topSentResult.records.map((record) => {
      const count = record.get("count").toNumber();
      return {
        address: record.get("receiverAddress") || "",
        count,
        percentage: totalSentCount ? (count / totalSentCount) * 100 : 0,
      };
    });

    return NextResponse.json({ topReceived, topSent });
  } finally {
    // Close Neo4j
    await neo4jDriver.close();
  }
}

async function getTopInteractions(
  blockchain: BlockchainSymbol,
  address: string,
) {
  // API configuration for BitQuery GraphQL endpoint
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.BIT_QUERY_API_KEY,
  };
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
