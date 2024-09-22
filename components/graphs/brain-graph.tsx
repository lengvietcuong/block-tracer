"use client";

import ReactFlow, { Edge, Node, NodeProps, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import brainPolygon from "@/public/brain-polygon.json";
import { FaRegUser as UserIcon } from "react-icons/fa";

const NUM_EDGES = 100;
const nodeTypes = {
  brain: BrainNode,
};

function createNode(id: number, x: number, y: number, selected: boolean) {
  return {
    id: `${id}`,
    position: { x, y },
    data: { selected },
    type: "brain",
  };
}

function createEdge(source: number, target: number) {
  return {
    id: `e${source}-${target}`,
    source: `${source}`,
    target: `${target}`,
    style: {
      stroke: "hsl(var(--muted-foreground))",
      strokeWidth: 1,
      strokeOpacity: Math.random(),
    },
    type: "straight",
    animated: true,
  };
}

function BrainNode({ data }: NodeProps) {
  return (
    <div className="relative size-7" title={data.label}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="source" position={Position.Left} className="invisible" />
      </div>
      <div
        className={`grid place-items-center size-full rounded-full border ${
          data.selected ? "border-destructive/50" : "border-primary/50"
        } bg-background`}
      >
        <UserIcon
          className={`size-3 ${
            data.selected ? "fill-destructive" : "fill-primary"
          }`}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="target" position={Position.Left} className="invisible" />
      </div>
    </div>
  );
}

export default function BrainGraph({ className }: { className?: string }) {
  const initialNodes: Node[] = brainPolygon.map((point, index) =>
    createNode(index + 1, point.x, point.y, point.selected)
  );

  const initialEdges: Edge[] = [];
  for (let i = 0; i < NUM_EDGES; i++) {
    const source = Math.floor(Math.random() * initialNodes.length) + 1;
    const target = Math.floor(Math.random() * initialNodes.length) + 1;
    if (source !== target) {
      initialEdges.push(createEdge(source, target));
    }
  }

  return (
    <div className={className}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        edgesUpdatable={false}
        edgesFocusable={false}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
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
