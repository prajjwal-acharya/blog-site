"use client";

/**
 * MatrixVisualization — interactive matrix operations with step-by-step animation
 * Supports matrix multiplication, element highlighting, and computational steps
 */

import { useEffect, useState } from "react";

interface MatrixVizProps {
  title: string;
  config: {
    matrixA?: number[][];
    matrixB?: number[][];
    animated?: boolean;
    enableEdit?: boolean;
    showSteps?: boolean;
  };
}

export default function MatrixVisualization({ title, config }: MatrixVizProps) {
  const [matrixA, setMatrixA] = useState(config.matrixA || [[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState(config.matrixB || [[5, 6], [7, 8]]);
  const [result, setResult] = useState<number[][] | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [highlightedCell, setHighlightedCell] = useState<[number, number] | null>(null);

  // Compute matrix multiplication
  useEffect(() => {
    const rows = matrixA.length;
    const cols = matrixB[0].length;
    const intermediate = matrixB.length;

    const computed: number[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < intermediate; k++) {
          computed[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }

    setResult(computed);
  }, [matrixA, matrixB]);

  const handleStepForward = () => {
    const totalSteps = matrixA.length * matrixB[0].length;
    if (activeStep < totalSteps - 1) {
      setActiveStep(activeStep + 1);
      const row = Math.floor(activeStep / matrixB[0].length);
      const col = activeStep % matrixB[0].length;
      setHighlightedCell([row, col]);
    }
  };

  const handleStepBackward = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      const row = Math.floor((activeStep - 1) / matrixB[0].length);
      const col = (activeStep - 1) % matrixB[0].length;
      setHighlightedCell([row, col]);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setHighlightedCell(null);
  };

  const renderMatrix = (matrix: number[][], title: string, isResult = false) => (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold text-[var(--color-on-surface)]">{title}</p>
      <div className="bg-[var(--color-surface-container-low)] p-4 rounded-[0.25rem] border border-[var(--color-outline-variant)]/20">
        <div className="flex gap-3">
          {matrix.map((row, i) => (
            <div key={i} className="flex flex-col gap-2">
              {row.map((cell, j) => {
                const isHighlighted = isResult && highlightedCell && highlightedCell[0] === i && highlightedCell[1] === j;
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`w-12 h-12 flex items-center justify-center rounded-[0.125rem] border-2 font-mono font-bold transition-all ${
                      isHighlighted
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-white text-[var(--color-on-surface)] border-[var(--color-outline-variant)]/30 dark:bg-[var(--color-surface-container)] dark:text-[var(--color-on-surface)]"
                    }`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-8 bg-[var(--color-surface-container-lowest)] rounded-[0.25rem] border border-[var(--color-outline-variant)]/20 p-6">
      <h3 className="font-headline text-lg font-semibold text-[var(--color-on-surface)] mb-6">{title}</h3>

      {/* Matrix Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-center justify-items-center">
        {renderMatrix(matrixA, "Matrix A")}
        <div className="text-2xl font-bold text-[var(--color-primary)]">×</div>
        {renderMatrix(matrixB, "Matrix B")}
        <div className="text-2xl font-bold text-[var(--color-primary)]">=</div>
        {result && renderMatrix(result, "Result", true)}
      </div>

      {/* Step Controls */}
      {config.showSteps && (
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={handleStepBackward}
            disabled={activeStep === 0}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[0.25rem] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-container)] transition-colors"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 text-[var(--color-on-surface)]">
            Step {activeStep + 1} of {matrixA.length * matrixB[0].length}
          </span>
          <button
            onClick={handleStepForward}
            disabled={activeStep >= matrixA.length * matrixB[0].length - 1}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[0.25rem] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-container)] transition-colors"
          >
            Next →
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-[0.25rem] hover:bg-[var(--color-secondary-container)] transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Computation Explanation */}
      {highlightedCell && (
        <div className="mt-6 p-4 bg-[var(--color-primary-fixed-dim)]/20 rounded-[0.25rem] border-l-4 border-[var(--color-primary)]">
          <p className="font-label text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-2">
            Current Computation
          </p>
          <p className="text-sm text-[var(--color-on-surface-variant)] font-mono">
            Result[{highlightedCell[0]}][{highlightedCell[1]}] = {matrixA[highlightedCell[0]].map((val, k) => `${val} × ${matrixB[k][highlightedCell[1]]}`).join(" + ")}
          </p>
          <p className="text-sm text-[var(--color-on-surface)] font-semibold mt-2">
            = {result?.[highlightedCell[0]][highlightedCell[1]]}
          </p>
        </div>
      )}
    </div>
  );
}
