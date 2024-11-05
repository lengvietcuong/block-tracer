import { NextResponse } from "next/server";
import axios from "axios";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";

const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.BIT_QUERY_API_KEY,
};

// API endpoint to fetch transaction analytics for a blockchain address
export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;

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
