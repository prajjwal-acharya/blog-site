"use client";

import React, { useMemo, useState } from "react";

export default function RecomputationSim() {
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

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface-container-low)] space-y-6 not-prose">
      <h3 className="text-xl font-semibold text-[var(--color-on-surface)]">Recomputation Simulator</h3>

      <div className="space-y-4">
        {[
          { key: "n", value: n, set: setN, min: 1, max: 256, label: "Sequence Length (n)" },
          { key: "h", value: h, set: setH, min: 1, max: 128, label: "Attention Heads (h)" },
          { key: "d", value: d, set: setD, min: 1, max: 128, label: "Embedding Dim (d)" },
        ].map(({ key, value, set, min, max, label }) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--color-on-surface-variant)]">{label}</span>
              <span className="font-mono text-[var(--color-primary)]">{value}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => set(parseInt(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="p-4 rounded-xl bg-[var(--color-surface)]">
            <div className="text-xs uppercase text-[var(--color-on-surface-variant)]">{k}</div>
            <div className="text-lg font-bold font-mono text-[var(--color-on-surface)]">{v.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
