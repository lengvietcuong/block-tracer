"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Transaction, Node, BlockchainSymbol } from "@/types";

function abbreviateAddress(address: string) {
  if (address.length <= 8) {
    return address; // If the address is short enough, no need to abbreviate
  }
  // Shorten the address: keep the first 4 and last 4 characters, with "..." in the middle
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

interface TransactionGraphProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  address: string;
  transactions: Transaction[];
}

// Constants for the dimensions of the graph
const SIDE_LENGTH = 600;
const CENTER = SIDE_LENGTH / 2;
const RADIUS = SIDE_LENGTH / 2.5;
const MIN_NODE_RADIUS = 16;
const MAX_NODE_RADIUS = 40;
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

  // Calculate node positions and sizes based on transactions
  const { nodes } = useMemo(() => {
    const amounts = transactions.map((transaction) => transaction.amount);
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);

    const nodes: Node[] = transactions.map((transaction, index) => {
      // Use trigonometry to place the nodes in a circular formation
      const angle = (index / transactions.length) * 2 * Math.PI;

      // Normalize the transaction amount to determine the node size
      // The node corresponding to the minimum amount will have the smallest radius and vice versa
      const normalizedAmount =
        (transaction.amount - minAmount) / (maxAmount - minAmount);
      const nodeRadius =
        MIN_NODE_RADIUS +
        normalizedAmount * (MAX_NODE_RADIUS - MIN_NODE_RADIUS);

      return {
        id: transaction.id,
        address:
          transaction.sender === address // Get the address of the "other" node (not the one searched for)
            ? transaction.receiver
            : transaction.sender,
        x: CENTER + RADIUS * Math.cos(angle), // Trigonometry
        y: CENTER + RADIUS * Math.sin(angle), // Trigonometry
        radius: nodeRadius,
      };
    });

    return { nodes, minAmount, maxAmount };
  }, [transactions, address]);

  function renderEdge(transaction: Transaction, node: Node) {
    // Determine where the edge's direction
    // If the searched wallet is the sender, the edge starts from the center and points to the node
    // Otherwise, the edge starts from the node and points to the center
    const isSearchedWalletSender = transaction.sender === address;
    const start = isSearchedWalletSender ? { x: CENTER, y: CENTER } : node;
    const end = isSearchedWalletSender ? node : { x: CENTER, y: CENTER };

    // Calculate the distance between start and end points
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Adjust start and end coordinates to account for node radius
    const startX =
      start.x +
      (dx * (isSearchedWalletSender ? MAX_NODE_RADIUS : node.radius)) / length;
    const startY =
      start.y +
      (dy * (isSearchedWalletSender ? MAX_NODE_RADIUS : node.radius)) / length;
    const endX =
      end.x -
      (dx * (isSearchedWalletSender ? node.radius : MAX_NODE_RADIUS)) / length;
    const endY =
      end.y -
      (dy * (isSearchedWalletSender ? node.radius : MAX_NODE_RADIUS)) / length;

    // Calculate the arrow position for the edge
    const arrowDx = dx / length;
    const arrowDy = dy / length;
    const arrowPoint1X = endX - ARROW_LENGTH * arrowDx + ARROW_WIDTH * arrowDy;
    const arrowPoint1Y = endY - ARROW_LENGTH * arrowDy - ARROW_WIDTH * arrowDx;
    const arrowPoint2X = endX - ARROW_LENGTH * arrowDx - ARROW_WIDTH * arrowDy;
    const arrowPoint2Y = endY - ARROW_LENGTH * arrowDy + ARROW_WIDTH * arrowDx;

    const edgeId = `edge-${transaction.id}`;
    const isHovered = hoveredEdge === edgeId;

    // Determine the sign of the transaction amount (positive for received, negative for sent)
    const sign = isSearchedWalletSender ? "-" : "+";
    const amount = `${sign}${transaction.amount.toFixed(
      2
    )} ${blockchainSymbol.toUpperCase()}`; // Display the transaction amount with the blockchain symbol

    return (
      <g
        key={edgeId}
        onMouseEnter={() => setHoveredEdge(edgeId)}
        onMouseLeave={() => setHoveredEdge(null)}
      >
        {/* Invisible line to increase the hitbox of the edge to make hovering easier */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="transparent"
          strokeWidth={20}
        />

        {/* Visible line for the edge */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className={
            isHovered ? "stroke-primary stroke-2" : "stroke-muted-foreground/35"
          }
        />

        {/* Arrow to indicate the direction of the transaction */}
        <polygon
          points={`${endX},${endY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
          className={isHovered ? "fill-primary" : "fill-neutral-500"}
        />

        {/* Display transaction amount label in the middle of the edge */}
        {/* Edges become larger and highlighted when hovered */}
        <g
          transform={`translate(${(startX + endX) / 2}, ${
            (startY + endY) / 2
          })`}
        >
          {/* Render a rectangle as the background for the edge label */}
          <rect
            width={isHovered ? 100 : 75}
            height={isHovered ? 30 : 22.5}
            x={isHovered ? -50 : -37.5}
            y={isHovered ? -15 : -11.25}
            rx={4}
            className={isHovered ? "fill-muted" : "fill-background"}
          />
          {/* Render the edge label which displays the transaction amount */}
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
        href={`/${blockchainSymbol}/${node.address}`}
        passHref
      >
        <g
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          className="cursor-pointer"
        >
          {/* Circle representing the node */}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.radius}
            className={
              hoveredNode === node.id
                ? "stroke-primary stroke-2 fill-primary/15"
                : "stroke-muted-foreground"
            }
          />
          {/* Display the abbreviated address above the node */}
          <text
            x={node.x}
            y={node.y - node.radius - 8}
            textAnchor="middle"
            className="text-xs fill-foreground"
          >
            {abbreviateAddress(node.address)}
          </text>
          <title>{node.address}</title> {/* Tooltip with full address */}
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
        {/* Render all transaction edges */}
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
            r={MAX_NODE_RADIUS}
            className="fill-primary"
          />
          <text
            x={CENTER}
            y={CENTER - MAX_NODE_RADIUS - 8}
            textAnchor="middle"
            className="text-xs fill-foreground"
          >
            {abbreviateAddress(address)}
          </text>
        </g>

        {/* Render nodes for other wallets involved in transactions */}
        {nodes.map(renderNode)}
      </svg>
    </div>
  );
}