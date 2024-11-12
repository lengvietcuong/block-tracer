import { NextResponse } from "next/server";
import axios from "axios";
import { initializeNeo4j, runQuery } from "@/lib/neo4j";
import status from "http-status";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BLOCKCHAIN_NAMES, BIT_QUERY_URL } from "@/constants";
import { getJsonOfError } from "@/utils";

// Define the API endpoint /api/[blockchain]/transaction/[hash]
export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; hash: string } },
) {
  const { blockchain, hash } = params;
  if (!(blockchain in BLOCKCHAIN_NAMES)) {
    return NextResponse.json(
      { message: "NOT FOUND" },
      { status: status.NOT_FOUND },
    );
  }

  try {
    if (blockchain === "swc") {
      return await getSwincoinTransactionsDetails(hash); // Swincoin data from the school's dataset
    }
    return await getTransactionDetails(blockchain, hash); // From the actual blockchain
  } catch (error) {
    return getJsonOfError(error);
  }
}

async function getSwincoinTransactionsDetails(hash: string) {
  const neo4jDriver = initializeNeo4j();
  const query = `
      MATCH (tx:Transaction {hash: $hash})
      RETURN
        tx.transaction_index AS index,
        tx.input AS input,
        tx.gas AS gas,
        tx.gas_used AS gasUsed,
        tx.gas_price AS gasPrice,
        tx.transaction_fee AS gasValue,
        tx.block_number AS blockNumber,
        tx.block_hash AS blockHash
    `;
  try {
    const result = await runQuery(neo4jDriver, query, { hash });
    if (result.records.length === 0) {
      return NextResponse.json(
        { message: "Not found" },
        { status: status.NOT_FOUND },
      );
    }
    const record = result.records[0];
    return NextResponse.json({
      transactionIndex: record.get("index").toNumber(),
      input: record.get("input"),
      gas: record.get("gas").toNumber(),
      gasUsed: record.get("gasUsed").toNumber(),
      gasPrice: record.get("gasPrice").toNumber(),
      transactionFee: record.get("gasValue").toNumber() / 1e18, // Convert from wei to ether
      blockNumber: record.get("blockNumber").toNumber(),
      blockHash: record.get("blockHash"),
    });
  } finally {
    await neo4jDriver.close();
  }
}

async function getTransactionDetails(
  blockchain: BlockchainSymbol,
  hash: string,
) {
  // API configuration for BitQuery GraphQL endpoint
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.BIT_QUERY_API_KEY,
  };
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
  const transactionData = transaactionResponse.data.data.ethereum.transactions;
  if (transactionData.length === 0) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }

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
