"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Transaction, Node } from "@/types";

function abbreviateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface TransactionGraphProps {
  className?: string;
  blockchainSymbol: string;
  address: string;
  transactions: Transaction[];
}

const SIDE_LENGTH = 600;
const CENTER = SIDE_LENGTH / 2;
const RADIUS = SIDE_LENGTH / 2.5;
const NODE_RADIUS = 24;
const ARROW_LENGTH = 12;
const ARROW_WIDTH = 6;

export default function TransactionGraph({
  className,
  blockchainSymbol,
  address,
  transactions,
}: TransactionGraphProps) {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create nodes for wallets that have interacted with the searched wallet
  const nodes: Node[] = transactions.map((transaction, index) => {
    const angle = (index / transactions.length) * 2 * Math.PI;
    return {
      id: transaction.id,
      address:
        transaction.sender === address
          ? transaction.receiver
          : transaction.sender,
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  });

  function renderEdge(transaction: Transaction, node: Node) {
    const isSearchedWalletSender = transaction.sender === address;
    const start = isSearchedWalletSender ? { x: CENTER, y: CENTER } : node;
    const end = isSearchedWalletSender ? node : { x: CENTER, y: CENTER };

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const startX = start.x + (dx * NODE_RADIUS) / length;
    const startY = start.y + (dy * NODE_RADIUS) / length;
    const endX = end.x - (dx * NODE_RADIUS) / length;
    const endY = end.y - (dy * NODE_RADIUS) / length;

    const arrowDx = dx / length;
    const arrowDy = dy / length;
    const arrowPoint1X = endX - ARROW_LENGTH * arrowDx + ARROW_WIDTH * arrowDy;
    const arrowPoint1Y = endY - ARROW_LENGTH * arrowDy - ARROW_WIDTH * arrowDx;
    const arrowPoint2X = endX - ARROW_LENGTH * arrowDx - ARROW_WIDTH * arrowDy;
    const arrowPoint2Y = endY - ARROW_LENGTH * arrowDy + ARROW_WIDTH * arrowDx;

    const edgeId = `edge-${transaction.id}`;
    const isHovered = hoveredEdge === edgeId;

    const sign = isSearchedWalletSender ? "-" : "+";
    const amount = `${sign}${transaction.amount.toFixed(
      2
    )} ${blockchainSymbol}`;

    return (
      <g
        key={edgeId}
        onMouseEnter={() => setHoveredEdge(edgeId)}
        onMouseLeave={() => setHoveredEdge(null)}
      >
        {/* Invisible line to increase the edge's hitbox */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="transparent"
          strokeWidth={20}
        />

        {/* Visible line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className={
            isHovered ? "stroke-primary stroke-2" : "stroke-muted-foreground/35"
          }
        />

        <polygon
          points={`${endX},${endY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
          className={isHovered ? "fill-primary" : "fill-neutral-500"}
        />

        <g
          transform={`translate(${(startX + endX) / 2},
            ${(startY + endY) / 2})`}
        >
          <rect
            width={isHovered ? 100 : 75}
            height={isHovered ? 30 : 22.5}
            x={isHovered ? -50 : -37.5}
            y={isHovered ? -15 : -11.25}
            rx={4}
            className={isHovered ? "fill-muted" : "fill-background"}
          />
          <text
            textAnchor="middle"
            dy={isHovered ? 5 : 4}
            className={
              isHovered
                ? "fill-primary font-bold text-base"
                : "fill-muted-foreground text-xs"
            }
          >
            {amount}
          </text>
        </g>
      </g>
    );
  }

  function renderNode(node: Node) {
    return (
      <Link
        key={node.id}
        href={`/wallet?chain=${blockchainSymbol}&address=${node.address}`}
        passHref
      >
        <g
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          className="cursor-pointer"
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={NODE_RADIUS}
            className={
              hoveredNode === node.id
                ? "stroke-primary stroke-2 fill-primary/15"
                : "stroke-muted-foreground"
            }
          />
          <text
            x={node.x}
            y={node.y - 32}
            textAnchor="middle"
            className="text-xs fill-foreground"
          >
            {abbreviateAddress(node.address)}
          </text>
          <title>{node.address}</title>
        </g>
      </Link>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SIDE_LENGTH} ${SIDE_LENGTH}`}
      >
        {/* Transactions (edges) */}
        {transactions.map((transaction, index) =>
          renderEdge(transaction, nodes[index])
        )}

        {/* Render the hovered edge on top */}
        {hoveredEdge &&
          transactions.map(
            (transaction, index) =>
              hoveredEdge === `edge-${transaction.id}` &&
              renderEdge(transaction, nodes[index])
          )}

        {/* Central node for the searched wallet */}
        <g>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={NODE_RADIUS}
            className="fill-primary"
          />
          <text
            x={CENTER}
            y={CENTER - 32}
            textAnchor="middle"
            className="text-xs fill-foreground"
          >
            {abbreviateAddress(address)}
          </text>
        </g>

        {/* Other wallet nodes */}
        {nodes.map(renderNode)}
      </svg>
    </div>
  );
}
