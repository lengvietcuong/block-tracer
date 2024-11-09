// swinncoin.ts

"use server";

import neo4j, { Driver } from 'neo4j-driver';
import { Transaction, TransactionPartial, TopInteractions, MonthlyTransactionCount } from "@/types";
import { TRANSACTIONS_PER_PAGE } from "@/constants";

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

// Function to retrieve Swincoin transactions
export async function getTransactions(
    address: string,
    orderBy: "time" | "amount" = "time",
    limit: number = TRANSACTIONS_PER_PAGE,
    offset: number = 0
): Promise<TransactionPartial[]> {
    const session = driver.session();
    try {
        const orderField = orderBy === "time" ? "tx.timestamp" : "tx.amount";
        const result = await session.run(
            `
      MATCH (from:Address)-[tx:TRANSACTION]->(to:Address)
      WHERE from.address = $address OR to.address = $address
      RETURN from.address AS fromAddress, to.address AS toAddress, tx.hash AS hash, tx.amount AS value, tx.timestamp AS blockTimestamp
      ORDER BY ${orderField} DESC
      SKIP $offset
      LIMIT $limit
      `,
            { address, offset: neo4j.int(offset), limit: neo4j.int(limit) }
        );

        const transactions: TransactionPartial[] = result.records.map(record => ({
            fromAddress: record.get('fromAddress'),
            toAddress: record.get('toAddress'),
            hash: record.get('hash'),
            value: Number(record.get('value')),
            blockTimestamp: Number(record.get('blockTimestamp')) * 1000, // Assuming timestamp is in seconds
        }));

        return transactions;
    } finally {
        await session.close();
    }
}

// Function to retrieve Swincoin transaction details
export async function getTransactionDetails(
    hash: string
): Promise<Omit<Transaction, keyof TransactionPartial>> {
    const session = driver.session();
    try {
        const result = await session.run(
            `
      MATCH (from:Address)-[tx:TRANSACTION {hash: $hash}]->(to:Address)
      RETURN tx, from.address AS fromAddress, to.address AS toAddress
      `,
            { hash }
        );

        const record = result.records[0];
        if (!record) {
            throw new Error('Transaction not found');
        }

        const tx = record.get('tx').properties;

        return {
            transactionIndex: Number(tx.index),
            gasUsed: Number(tx.gas),
            gasPrice: Number(tx.gasPrice),
            transactionFee: Number(tx.gasValue),
            blockNumber: Number(tx.block.height),
            blockHash: tx.block.hash,
        };
    } finally {
        await session.close();
    }
}

// Function to retrieve Swincoin wallet overview
export async function getWalletOverview(address: string) {
    const session = driver.session();
    try {
        const result = await session.run(
            `
      MATCH (addr:Address {address: $address})
      OPTIONAL MATCH (addr)-[sent:TRANSACTION]->()
      OPTIONAL MATCH ()-[received:TRANSACTION]->(addr)
      RETURN 
        addr.balance AS balance,
        COUNT(DISTINCT sent) AS sentCount,
        COUNT(DISTINCT received) AS receivedCount,
        SUM(sent.amount) AS amountSent,
        SUM(received.amount) AS amountReceived,
        MIN(sent.timestamp) AS firstSent,
        MIN(received.timestamp) AS firstReceived,
        MAX(sent.timestamp) AS lastSent,
        MAX(received.timestamp) AS lastReceived
      `,
            { address }
        );

        const record = result.records[0];

        const firstActive = Math.min(
            record.get('firstSent')?.toNumber() || Infinity,
            record.get('firstReceived')?.toNumber() || Infinity
        );

        const lastActive = Math.max(
            record.get('lastSent')?.toNumber() || 0,
            record.get('lastReceived')?.toNumber() || 0
        );

        return {
            balance: Number(record.get('balance')),
            sentCount: record.get('sentCount').toNumber(),
            receivedCount: record.get('receivedCount').toNumber(),
            amountSent: Number(record.get('amountSent') || 0),
            amountReceived: Number(record.get('amountReceived') || 0),
            firstActive: new Date(firstActive * 1000),
            lastActive: new Date(lastActive * 1000),
        };

    } finally {
        await session.close();
    }
}

// Function to get total transactions for pagination
export async function getTotalTransactions(address: string): Promise<number> {
    const session = driver.session();
    try {
        const result = await session.run(
            `
      MATCH (from:Address)-[tx:TRANSACTION]->(to:Address)
      WHERE from.address = $address OR to.address = $address
      RETURN COUNT(tx) AS total
      `,
            { address }
        );
        const total = result.records[0].get('total').toNumber();
        return total;
    } finally {
        await session.close();
    }
}

// Function to retrieve top interactions for Swincoin
export async function getTopInteractions(address: string): Promise<TopInteractions> {
    const session = driver.session();
    try {
        // Top Received Interactions
        const topReceivedResult = await session.run(
            `
            MATCH (sender:Address)-[tx:TRANSACTION]->(receiver:Address)
            WHERE receiver.address = $address
            RETURN sender.address AS address, COUNT(tx) AS count
            ORDER BY count DESC
            LIMIT 10
            `,
            { address }
        );

        const topSentResult = await session.run(
            `
            MATCH (sender:Address)-[tx:TRANSACTION]->(receiver:Address)
            WHERE sender.address = $address
            RETURN receiver.address AS address, COUNT(tx) AS count
            ORDER BY count DESC
            LIMIT 10
            `,
            { address }
        );

        const topReceived = topReceivedResult.records.map(record => ({
            address: record.get('address'),
            count: record.get('count').toNumber(),
            percentage: 0, // To be calculated if total is available
        }));

        const topSent = topSentResult.records.map(record => ({
            address: record.get('address'),
            count: record.get('count').toNumber(),
            percentage: 0, // To be calculated if total is available
        }));

        // Calculate percentages based on total transactions
        const totalReceived = topReceived.reduce((acc, curr) => acc + curr.count, 0);
        const totalSent = topSent.reduce((acc, curr) => acc + curr.count, 0);

        const topReceivedWithPercentage = topReceived.map(item => ({
            ...item,
            percentage: totalReceived > 0 ? (item.count / totalReceived) * 100 : 0,
        }));

        const topSentWithPercentage = topSent.map(item => ({
            ...item,
            percentage: totalSent > 0 ? (item.count / totalSent) * 100 : 0,
        }));

        return {
            topReceived: topReceivedWithPercentage,
            topSent: topSentWithPercentage,
        };
    } finally {
        await session.close();
    }
}

// Function to retrieve monthly transaction counts for Swincoin
export async function getMonthlyTransactionCount(address: string): Promise<MonthlyTransactionCount> {
    const session = driver.session();
    try {
        const result = await session.run(
            `
            MATCH (sender:Address)-[tx:TRANSACTION]->(receiver:Address)
            WHERE sender.address = $address OR receiver.address = $address
            RETURN 
                date(datetime({ epochSeconds: toInteger(tx.timestamp) })) AS date,
                COUNT(tx) AS count
            ORDER BY date ASC
            `,
            { address }
        );

        const transactions = result.records.map(record => {
            const date = record.get('date');
            const count = record.get('count').toNumber();
            return {
                count,
                date: new Date(date.year, date.month - 1),
            };
        });

        // Aggregate by month and year
        const monthlyCounts: { [key: string]: number } = {};

        transactions.forEach(tx => {
            const key = `${tx.date.getFullYear()}-${tx.date.getMonth() + 1}`;
            if (monthlyCounts[key]) {
                monthlyCounts[key] += tx.count;
            } else {
                monthlyCounts[key] = tx.count;
            }
        });

        const received: { count: number; date: Date }[] = [];
        const sent: { count: number; date: Date }[] = [];

        // Fetch sent transactions
        const sentResult = await session.run(
            `
            MATCH (sender:Address)-[tx:TRANSACTION]->(receiver:Address)
            WHERE sender.address = $address
            RETURN 
                date(datetime({ epochSeconds: toInteger(tx.timestamp) })) AS date,
                COUNT(tx) AS count
            ORDER BY date ASC
            `,
            { address }
        );

        sentResult.records.forEach(record => {
            const date = record.get('date');
            const count = record.get('count').toNumber();
            sent.push({
                count,
                date: new Date(date.year, date.month - 1),
            });
        });

        // Fetch received transactions
        const receivedResult = await session.run(
            `
            MATCH (sender:Address)-[tx:TRANSACTION]->(receiver:Address)
            WHERE receiver.address = $address
            RETURN 
                date(datetime({ epochSeconds: toInteger(tx.timestamp) })) AS date,
                COUNT(tx) AS count
            ORDER BY date ASC
            `,
            { address }
        );

        receivedResult.records.forEach(record => {
            const date = record.get('date');
            const count = record.get('count').toNumber();
            received.push({
                count,
                date: new Date(date.year, date.month - 1),
            });
        });

        return {
            received,
            sent,
        };
    } finally {
        await session.close();
    }
}
