"use client";

/**
 * GraphVisualizer — interactive graph/network diagram with draggable nodes
 * Renders SVG-based graph with clickable nodes and edges
 */

import { useRef, useEffect, useState, useCallback } from "react";

interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
}

interface GraphVizProps {
  title: string;
  config?: {
    nodes?: Node[];
    edges?: Edge[];
  };
}

const fallbackConfig = {
  nodes: [
    { id: "point", label: "P", x: 300, y: 120 },
    { id: "origin", label: "O", x: 120, y: 220 },
    { id: "cart", label: "(x,y)", x: 480, y: 120 },
    { id: "polar", label: "(r,θ)", x: 480, y: 220 },
  ],
  edges: [
    { from: "origin", to: "point", weight: 1 },
    { from: "point", to: "cart", weight: 1 },
    { from: "point", to: "polar", weight: 1 },
    { from: "origin", to: "polar", weight: 1 },
  ],
};

export default function GraphVisualizer({ title, config }: GraphVizProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const resolvedConfig = config?.nodes?.length ? config : fallbackConfig;
  const [nodes, setNodes] = useState<Node[]>(() =>
    (resolvedConfig?.nodes || []).map((node, idx) => ({
      ...node,
      x: node.x ?? (idx + 1) * (600 / ((resolvedConfig?.nodes?.length || 0) + 1)),
      y: node.y ?? 150,
    }))
  );
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(new Set());

  // Initialize nodes with positions if not provided
  useEffect(() => {
    if (!resolvedConfig?.nodes || resolvedConfig.nodes.length === 0) return;

    const initialNodes = (resolvedConfig?.nodes || []).map((node, idx) => ({
      ...node,
      x: node.x ?? (idx + 1) * (600 / ((resolvedConfig?.nodes?.length || 0) + 1)),
      y: node.y ?? 150,
    }));
    setNodes(initialNodes);
  }, [resolvedConfig?.nodes]);

  const handleMouseDown = (nodeId: string) => {
    setDraggedNode(nodeId);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedNode || !svgRef.current) return;

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setNodes((prev) =>
        prev.map((node) =>
          node.id === draggedNode ? { ...node, x, y } : node
        )
      );
    },
    [draggedNode]
  );

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  const handleNodeClick = (nodeId: string) => {
    const connectedEdges = new Set<string>();
    (resolvedConfig?.edges || []).forEach((edge) => {
      if (edge.from === nodeId || edge.to === nodeId) {
        connectedEdges.add(`${edge.from}-${edge.to}`);
      }
    });
    setHighlightedEdges(connectedEdges);
  };

  const getNodePosition = (id: string): [number, number] => {
    const node = nodes.find((n) => n.id === id);
    return node ? [node.x || 0, node.y || 0] : [0, 0];
  };

  return (
    <div className="not-prose my-8 bg-[var(--color-surface-container-lowest)] rounded-[0.25rem] border border-[var(--color-outline-variant)]/20 p-6">
      <h3 className="font-headline text-lg font-semibold text-[var(--color-on-surface)] mb-6">{title}</h3>

      <div className="bg-[var(--color-surface-container-low)] rounded-[0.25rem] overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          viewBox="0 0 600 300"
          className="border border-[var(--color-outline-variant)]/20"
          style={{ cursor: draggedNode ? "grabbing" : "grab" }}
        >
          {/* Draw edges */}
          {(resolvedConfig?.edges || []).map((edge, idx) => {
            const [fromX, fromY] = getNodePosition(edge.from);
            const [toX, toY] = getNodePosition(edge.to);
            const isHighlighted = highlightedEdges.has(`${edge.from}-${edge.to}`);

            return (
              <g key={idx}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={isHighlighted ? "#994121" : "#89726B"}
                  strokeWidth={isHighlighted ? 3 : 2}
                  opacity={isHighlighted ? 1 : 0.4}
                  className="transition-all"
                />
                {edge.weight !== undefined && (
                  <text
                    x={(fromX + toX) / 2}
                    y={(fromY + toY) / 2 - 5}
                    textAnchor="middle"
                    fontSize="12"
                    fill="var(--color-secondary)"
                    className="pointer-events-none"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => {
            const x = node.x || 0;
            const y = node.y || 0;
            return (
              <g
                key={node.id}
                onMouseDown={() => handleMouseDown(node.id)}
                onClick={() => handleNodeClick(node.id)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={24}
                  fill={highlightedEdges.size > 0 ? "#E3E3DE" : "#F5F4EF"}
                  stroke={highlightedEdges.has(node.id) ? "#994121" : "#89726B"}
                  strokeWidth={highlightedEdges.has(node.id) ? 3 : 2}
                  className="transition-all"
                />
                <text
                  x={x}
                  y={y + 6}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="var(--color-on-surface)"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 text-sm text-[var(--color-on-surface-variant)] italic">
        💡 Click on a node to highlight its connections. Drag nodes to reposition.
      </div>
    </div>
  );
}
