"use client";

import { useState, useEffect } from "react";
import ReactFlow, { Edge, Node } from "reactflow";
import TransactionNode from "./transaction-node";
import TransactionEdge from "./transaction-edge";
import { Transaction } from "@/types";
import "reactflow/dist/style.css";

const GRAPH_SIZE_LENGTH = 500;
const nodeTypes = {
  transaction: TransactionNode,
};
const edgeTypes = {
  transaction: TransactionEdge,
};

interface TransactionGraphProps {
  className?: string;
  address: string;
  transactions: Transaction[];
}

export default function TransactionGraph({
  className,
  address,
  transactions,
}: TransactionGraphProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  function createTransactionNode(transactionId: string, address: string) {
    const id = `${transactionId}-${address}`;
    return {
      id,
      data: {
        label: address,
        selected: false,
      },
      position: { x: 0, y: 0 }, // Set position later
      type: "transaction",
    };
  }

  function createTransactionEdge(transaction: {
    id: string;
    sender: string;
    receiver: string;
    amount: number;
  }) {
    let source, target;
    if (transaction.sender === address) {
      source = transaction.sender;
      target = `${transaction.id}-${transaction.receiver}`;
    } else {
      source = `${transaction.id}-${transaction.sender}`;
      target = transaction.receiver;
    }

    return {
      id: transaction.id,
      source,
      target,
      data: {
        label: `${transaction.sender === address ? "-" : "+"}${
          transaction.amount
        } ETH`,
        selected: false,
      },
      type: "transaction",
    };
  }

  function setNodePositions(nodes: Node[]) {
    // Set node positions in a circular layout
    const radius = GRAPH_SIZE_LENGTH / 2;
    const offset = 0.2; // Add a slight rotation to prevent straight lines that have small hitboxes
    nodes.forEach((node, index) => {
      if (node.id === address) return; // Position already set at the center
      const angle = (index / (nodes.length - 1)) * 2 * Math.PI + offset;
      node.position = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      };
    });
  }

  useEffect(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // Add the central node
    initialNodes.push({
      id: address,
      data: {
        label: address,
        selected: true,
      },
      position: { x: 0, y: 0 },
      type: "transaction",
    });

    // Add transactions as neighbors
    transactions.forEach((transaction) => {
      const neighborAddress =
        transaction.sender === address
          ? transaction.receiver
          : transaction.sender;
      initialNodes.push(createTransactionNode(transaction.id, neighborAddress));
      initialEdges.push(createTransactionEdge(transaction));
    });

    setNodePositions(initialNodes);

    setNodes(initialNodes);
    setEdges(initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, address]);

  return (
    <div className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        draggable={false}
        panOnDrag={false}
        elementsSelectable={false}
        preventScrolling={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        proOptions={{ hideAttribution: true }}
        className="!pointer-events-none"
      />
    </div>
  );
}
