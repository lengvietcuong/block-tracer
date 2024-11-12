import { NextResponse } from "next/server";
import axios from "axios";
import { initializeNeo4j, runQuery } from "@/lib/neo4j";
import status from "http-status";
import { BlockchainSymbol } from "@/types";
import { COIN_NAMES, BIT_QUERY_URL } from "@/constants";
import { isValidAddress, getJsonOfError } from "@/utils";

// Define the API endpoint /api/[blockchain]/[address]/overview
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
      return await getSwincoinWalletOverview(address); // Swincoin data from the school's dataset
    }
    return await getWalletOverview(blockchain, address); // From the actual blockchain
  } catch (error) {
    return getJsonOfError(error);
  }
}

async function getSwincoinWalletOverview(address: string) {
  // Connect to Neo4j
  const neo4jDriver = initializeNeo4j();

  const query = `
  MATCH (addr:Address {address: $address})
  OPTIONAL MATCH (addr)-[:SENT]->(sentTx:Transaction)
  OPTIONAL MATCH (receivedTx:Transaction)-[:RECEIVED_BY]->(addr)
  MATCH (addid: Address{addressId: $address})
  RETURN
    COUNT(DISTINCT sentTx) AS sentCount,
    COUNT(DISTINCT receivedTx) AS receivedCount,
    SUM(toFloat(sentTx.value)) AS amountSent,
    SUM(toFloat(receivedTx.value)) AS amountReceived,
    (SUM(toFloat(receivedTx.value)) - SUM(toFloat(sentTx.value))) AS balance,
    MIN(sentTx.block_timestamp) AS firstSent,
    MIN(receivedTx.block_timestamp) AS firstReceived,
    MAX(sentTx.block_timestamp) AS lastSent,
    MAX(receivedTx.block_timestamp) AS lastReceived,
    addid.type
  `;
  try {
    const result = await runQuery(neo4jDriver, query, { address });
    if (result.records.length === 0) {
      return NextResponse.json(
        { message: "Not found" },
        { status: status.NOT_FOUND },
      );
    }
    const record = result.records[0];

    // Parse timestamps as integers
    const firstSent = parseInt(record.get("firstSent"));
    const firstReceived = parseInt(record.get("firstReceived"));
    const lastSent = parseInt(record.get("lastSent"));
    const lastReceived = parseInt(record.get("lastReceived"));
    // Determine firstActive and lastActive timestamps
    const firstActiveUnix = isNaN(firstSent) ? firstReceived : firstSent;
    const lastActiveUnix = isNaN(lastSent) ? lastReceived : lastSent;

    return NextResponse.json({
      balance: Math.abs(parseFloat(record.get("balance")) / 1e18), // Convert from wei to eth
      sentCount: parseInt(record.get("sentCount")),
      receivedCount: parseInt(record.get("receivedCount")),
      amountSent: parseFloat(record.get("amountSent")) / 1e18, // Convert from wei to eth
      amountReceived: parseFloat(record.get("amountReceived")) / 1e18, // Convert from wei to eth
      firstActive: new Date(firstActiveUnix * 1000), // Convert to ms
      lastActive: new Date(lastActiveUnix * 1000), // Convert to ms
      contractType: record.get("addid.type"),
    });
  } finally {
    // Close Neo4j
    await neo4jDriver.close();
  }
}

async function getWalletOverview(
  blockchain: BlockchainSymbol,
  address: string,
) {
  // API configuration for BitQuery GraphQL endpoint
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.BIT_QUERY_API_KEY,
  };
  const query = `
    {
      ethereum(network: ${COIN_NAMES[blockchain]}) {
        addressStats(address: {is: "${address}"}) {
          address {
            balance
            sendAmount
            receiveAmount 
            sendTxCount
            receiveTxCount
            firstTransferAt { unixtime }
            lastTransferAt { unixtime }
          }
        }
        address(address: {is: "${address}"}) {
          smartContract {
            contractType
          }
        }
      }
    }`;

  const response = await axios.post(BIT_QUERY_URL, { query }, { headers });
  const responseData = response.data.data.ethereum;
  if (responseData.addressStats.length === 0) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }

  const walletDetails = responseData.addressStats[0].address;
  const contractType = responseData.address[0].smartContract
    ? response.data.data.ethereum.address[0].smartContract.contractType
    : "eoa";

  // Format response with proper number conversions and convert unix timestamps to dates
  return NextResponse.json({
    balance: Math.abs(Number(walletDetails.balance)),
    sentCount: Number(walletDetails.sendTxCount),
    receivedCount: Number(walletDetails.receiveTxCount),
    amountReceived: Number(walletDetails.receiveAmount),
    amountSent: Number(walletDetails.sendAmount),
    firstActive: new Date(walletDetails.firstTransferAt.unixtime * 1000), // Convert to ms
    lastActive: new Date(walletDetails.lastTransferAt.unixtime * 1000), // Convert to ms
    contractType,
  });
}
