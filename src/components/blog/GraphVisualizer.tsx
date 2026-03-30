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
  config: {
    nodes: Node[];
    edges: Edge[];
  };
}

export default function GraphVisualizer({ title, config }: GraphVizProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(new Set());

  // Initialize nodes with positions if not provided
  useEffect(() => {
    if (config.nodes.length === 0) return;

    const initialNodes = config.nodes.map((node, idx) => ({
      ...node,
      x: node.x ?? (idx + 1) * (600 / (config.nodes.length + 1)),
      y: node.y ?? 150,
    }));
    setNodes(initialNodes);
  }, [config.nodes]);

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
    config.edges.forEach((edge) => {
      if (edge.from === nodeId || edge.to === nodeId) {
        connectedEdges.add(`${edge.from}-${edge.to}`);
      }
    });
    setHighlightedEdges(connectedEdges);
  };

  return (
    <div className="my-8 bg-[var(--color-surface-container-lowest)] rounded-[0.25rem] border border-[var(--color-outline-variant)]/20 p-6">
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
          {config.edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) return null;

            const isHighlighted = highlightedEdges.has(`${edge.from}-${edge.to}`);

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? "#994121" : "#89726B"}
                  strokeWidth={isHighlighted ? 3 : 2}
                  opacity={isHighlighted ? 1 : 0.4}
                  className="transition-all"
                />
                {edge.weight !== undefined && (
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 5}
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
          {nodes.map((node) => (
            <g
              key={node.id}
              onMouseDown={() => handleMouseDown(node.id)}
              onClick={() => handleNodeClick(node.id)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={24}
                fill={highlightedEdges.size > 0 ? "#E3E3DE" : "#F5F4EF"}
                stroke={highlightedEdges.has(node.id) ? "#994121" : "#89726B"}
                strokeWidth={highlightedEdges.has(node.id) ? 3 : 2}
                className="transition-all"
              />
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="var(--color-on-surface)"
                className="pointer-events-none"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 text-sm text-[var(--color-on-surface-variant)] italic">
        💡 Click on a node to highlight its connections. Drag nodes to reposition.
      </div>
    </div>
  );
}
