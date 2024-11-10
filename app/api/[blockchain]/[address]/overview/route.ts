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

// Function to retrieve Swincoin wallet overview
export async function getSwincoinWalletOverview(address: string) {
  const session = driver.session();
  try {
    const result = await session.run(
      `
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
      `,
      { address }
    );

    const record = result.records[0];

    // Parse timestamps as integers
    const firstSent = record.get('firstSent') ? parseInt(record.get('firstSent'), 10) : null;
    const firstReceived = record.get('firstReceived') ? parseInt(record.get('firstReceived'), 10) : null;
    const lastSent = record.get('lastSent') ? parseInt(record.get('lastSent'), 10) : null;
    const lastReceived = record.get('lastReceived') ? parseInt(record.get('lastReceived'), 10) : null;

    // Determine firstActive and lastActive timestamps
    const firstActiveUnix = Math.min(...[firstSent, firstReceived].filter((t) => t !== null));
    const lastActiveUnix = Math.max(...[lastSent, lastReceived].filter((t) => t !== null));

    // Create Date objects

    const firstActive = new Date(firstActiveUnix * 1000);
    const lastActive = new Date(lastActiveUnix * 1000);

    const balance = record.get('balance') ? parseFloat(record.get('balance')) / 1e18 : 0;
    const type = record.get('addid.type');

    return ({
      balance: Math.abs(balance),
      sentCount: record.get('sentCount') ? parseInt(record.get('sentCount'), 10) : 0,
      receivedCount: record.get('receivedCount') ? parseInt(record.get('receivedCount'), 10) : 0,
      amountSent: record.get('amountSent') ? parseFloat(record.get('amountSent')) / 1e18 : 0,
      amountReceived: record.get('amountReceived') ? parseFloat(record.get('amountReceived')) / 1e18 : 0,
      firstActive,
      lastActive,
      contractType: type,
    });
  } finally {
    await session.close();
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { blockchain, address } = params;

  if (blockchain === 'swc') {
    const result = await getSwincoinWalletOverview(address);
    return NextResponse.json(result);
  }
  // GraphQL query to fetch comprehensive wallet statistics including balance,
  // transaction counts and timestamps
  else {
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
    const walletDetails = response.data.data.ethereum.addressStats[0].address;
    const contractType = response.data.data.ethereum.address[0].smartContract? response.data.data.ethereum.address[0].smartContract.contractType : 'eoa';

    // Format response with proper number conversions and convert unix timestamps to dates
    return NextResponse.json({
      balance: Math.abs(Number(walletDetails.balance)),
      sentCount: Number(walletDetails.sendTxCount),
      receivedCount: Number(walletDetails.receiveTxCount),
      amountReceived: Number(walletDetails.receiveAmount),
      amountSent: Number(walletDetails.sendAmount),
      firstActive: new Date(walletDetails.firstTransferAt.unixtime * 1000),
      lastActive: new Date(walletDetails.lastTransferAt.unixtime * 1000),
      contractType: contractType,
    });
  }
}