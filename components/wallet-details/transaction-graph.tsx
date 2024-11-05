"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { TransactionPartial, Node, BlockchainSymbol } from "@/types";
import { abbreviateAddress } from "@/utils";
import TransactionDialog from "@/components/wallet-details/transaction-dialog";

interface TransactionGraphProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  address: string;
  transactions: TransactionPartial[];
}

// Constants for the dimensions of the graph
const SIDE_LENGTH = 600;
const CENTER = SIDE_LENGTH / 2;
const RADIUS = SIDE_LENGTH / 2.5;
const MIN_NODE_RADIUS = 16;
const MAX_NODE_RADIUS = 36;
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
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionPartial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate node positions and sizes based on transactions
  const { nodes } = useMemo(() => {
    const amounts = transactions.map((transaction) => transaction.value);
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);

    const nodes: Node[] = transactions.map((transaction, index) => {
      // Use trigonometry to place the nodes in a circular formation
      const angle = (index / transactions.length) * 2 * Math.PI;

      // Normalize the transaction amount to determine the node size
      // The node corresponding to the minimum amount will have the smallest radius and vice versa
      const normalizedAmount =
        maxAmount === minAmount
          ? 0.5
          : (transaction.value - minAmount) / (maxAmount - minAmount);
      const nodeRadius =
        MIN_NODE_RADIUS +
        normalizedAmount * (MAX_NODE_RADIUS - MIN_NODE_RADIUS);

      return {
        id: transaction.hash,
        address:
          transaction.fromAddress === address
            ? transaction.toAddress
            : transaction.fromAddress,
        x: CENTER + RADIUS * Math.cos(angle),
        y: CENTER + RADIUS * Math.sin(angle),
        radius: nodeRadius,
      };
    });

    return { nodes, minAmount, maxAmount };
  }, [transactions, address]);

  function handleEdgeClick(transaction: TransactionPartial) {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  }

  function renderEdge(transaction: TransactionPartial, node: Node) {
    const isSearchedWalletSender = transaction.fromAddress === address;
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

    const edgeId = `edge-${transaction.hash}`;
    const isHovered = hoveredEdge === edgeId;

    // Determine the sign of the transaction amount (positive for received, negative for sent)
    const sign = isSearchedWalletSender ? "-" : "+";
    const amount = `${sign}${transaction.value.toFixed(
      2,
    )} ${blockchainSymbol.toUpperCase()}`;

    return (
      <g
        key={edgeId}
        onMouseEnter={() => setHoveredEdge(edgeId)}
        onMouseLeave={() => setHoveredEdge(null)}
        onClick={(e) => {
          e.preventDefault(); // Prevent any parent Link components from triggering
          handleEdgeClick(transaction);
        }}
        className="cursor-pointer"
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
            width={isHovered ? 100 : 50}
            height={isHovered ? 30 : 15}
            x={isHovered ? -50 : -25}
            y={isHovered ? -15 : -7.5}
            rx={4}
            className={isHovered ? "fill-muted" : "fill-background"}
          />
          {/* Render the edge label which displays the transaction amount */}
          <text
            textAnchor="middle"
            dy={isHovered ? 5 : 4}
            className={
              isHovered
                ? "fill-primary text-base font-bold"
                : "fill-muted-foreground text-[10px]"
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
                ? "fill-primary/15 stroke-primary stroke-2"
                : "stroke-muted-foreground"
            }
          />
          {/* Display the abbreviated address above the node */}
          <text
            x={node.x}
            y={node.y - node.radius - 8}
            textAnchor="middle"
            className="fill-foreground text-xs"
          >
            {abbreviateAddress(node.address)}
          </text>
          <title>{node.address}</title>
        </g>
      </Link>
    );
  }

  return (
    <>
      <div ref={containerRef} className={className}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SIDE_LENGTH} ${SIDE_LENGTH}`}
        >
          {/* Render edges between the searched wallet and other wallets */}
          {transactions.map((transaction, index) =>
            renderEdge(transaction, nodes[index]),
          )}

          {/* Render the hovered edge on top */}
          {hoveredEdge &&
            transactions.map(
              (transaction, index) =>
                hoveredEdge === `edge-${transaction.hash}` &&
                renderEdge(transaction, nodes[index]),
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
              className="fill-foreground text-xs"
            >
              {abbreviateAddress(address)}
            </text>
          </g>

          {/* Render nodes for other wallets involved in transactions */}
          {nodes.map(renderNode)}
        </svg>
      </div>

      {selectedTransaction && (
        <TransactionDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          transaction={selectedTransaction}
          blockchainSymbol={blockchainSymbol}
        />
      )}
    </>
  );
}
