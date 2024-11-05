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
  { params }: { params: { blockchain: BlockchainSymbol; hash: string } },
) {
  const { blockchain, hash } = params;

  // First query: Get transaction details using transaction hash
  let query = `
   {
     ethereum(network: ${COIN_NAMES[blockchain]}) {
       transactions(
         txHash: {is: "${hash}"}
       ) {
         index
         gas
         gasValue
         gasPrice
         block {
           height
         }
       }
     }
   }`;

  const transaactionResponse = await axios.post(
    BIT_QUERY_URL,
    { query },
    { headers },
  );
  const tx = transaactionResponse.data.data.ethereum.transactions[0];

  // Second query: Get block hash using block height from first query
  query = `
   {
     ethereum(network: ${COIN_NAMES[blockchain]}) {
       blocks(
         height: {is: ${tx.block.height}}
       ) {
         hash
       }
     }
   }`;

  const blockResponse = await axios.post(BIT_QUERY_URL, { query }, { headers });
  const blockHash = blockResponse.data.data.ethereum.blocks[0].hash;

  // Return formatted transaction and block details with numeric conversions
  return NextResponse.json({
    transactionIndex: Number(tx.index),
    gasUsed: Number(tx.gas),
    gasPrice: Number(tx.gasPrice),
    transactionFee: Number(tx.gasValue),
    blockNumber: Number(tx.block.height),
    blockHash,
  });
}
