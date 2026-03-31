"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export function RecomputationSim() {
  const [n, setN] = useState(16);
  const [h, setH] = useState(8);
  const [d, setD] = useState(64);

  const stats = useMemo(() => {
    const attentionMatrix = n * n;
    const kvMemory = n * d * h;
    const compute = n * n * d;
    const bandwidth = kvMemory * 4;
    const idleRatio = bandwidth / (compute + 1);
    return { attentionMatrix, kvMemory, compute, bandwidth, idleRatio };
  }, [n, h, d]);

  const sliders = [
    { key: "n", value: n, set: setN, min: 1, max: 256 },
    { key: "h", value: h, set: setH, min: 1, max: 128 },
    { key: "d", value: d, set: setD, min: 1, max: 128 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface-container-low)] space-y-6">
      <h3 className="text-xl font-semibold">Recomputation Simulator</h3>

      <div className="space-y-4">
        {sliders.map(({ key, value, set, min, max }) => (
          <div key={key}>
            <label className="text-sm uppercase font-label">{key} = {value}</label>
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => set(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <motion.div
            key={k}
            className="p-4 rounded-xl bg-[var(--color-surface)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-xs uppercase font-label text-[var(--color-secondary)]">{k}</div>
            <div className="text-lg font-bold">{v.toFixed(2)}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function AttentionFlow() {
  const tokens = Array.from({ length: 8 });

  return (
    <div className="p-6 bg-[var(--color-surface-container-low)] rounded-2xl">
      <h3 className="text-xl font-semibold mb-4">Attention Flow</h3>
      <div className="grid grid-cols-8 gap-2">
        {tokens.map((_, i) => (
          <div
            key={i}
            className="h-10 bg-[var(--color-surface)] rounded flex items-center justify-center text-sm font-mono"
          >
            {i}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-[var(--color-secondary)]">
        Each token attends to previous tokens dynamically.
      </div>
    </div>
  );
}

export function MemoryLayersDiagram() {
  return (
    <div className="p-6 bg-[var(--color-surface-container-low)] rounded-2xl space-y-4">
      <h3 className="text-xl font-semibold">Memory Layers</h3>

      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "Weights", desc: "Long-term knowledge" },
          { title: "Activations", desc: "Temporary compute" },
          { title: "Context", desc: "External memory" },
        ].map(({ title, desc }) => (
          <div key={title} className="p-4 rounded-xl bg-[var(--color-surface)]">
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-[var(--color-secondary)]">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
