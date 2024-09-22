"use client"

import { useState, useCallback } from "react"
import {
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
  BaseEdge,
  Edge,
} from "reactflow"

export default function TransactionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<Edge<{ label: string; selected: boolean }>>) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })
  const [isHovered, setIsHovered] = useState(false)

  const onEdgeMouseEnter = useCallback(() => setIsHovered(true), [])
  const onEdgeMouseLeave = useCallback(() => setIsHovered(false), [])

  return (
    <>
      <svg>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <polygon
              points="0 0, 12 6, 0 12"
              fill={`${
                isHovered
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))"
              }`}
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isHovered
            ? "hsl(var(--primary))"
            : "hsl(var(--muted-foreground))",
          strokeOpacity: isHovered ? 1 : 0.5,
        }}
        markerStart="url(#arrowhead)"
        markerEnd="url(#arrowhead)"
      />
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        onMouseEnter={onEdgeMouseEnter}
        onMouseLeave={onEdgeMouseLeave}
        style={{ pointerEvents: "stroke", cursor: "default" }}
      />
      <EdgeLabelRenderer>
        <div
          className={`absolute pointer-events-auto ${
            isHovered
              ? "text-base text-primary bg-muted font-bold px-2 py-1 rounded-md z-10"
              : "text-xs text-muted-foreground bg-background"
          }`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            cursor: "default",
          }}
          onMouseEnter={onEdgeMouseEnter}
          onMouseLeave={onEdgeMouseLeave}
        >
          {data?.label}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}