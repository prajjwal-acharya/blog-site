"use client";

/**
 * CodeSandbox — interactive code execution environment
 * Displays code with syntax highlighting and allows execution with live output
 */

import { useState, useRef, useEffect } from "react";

interface CodeSandboxProps {
  title: string;
  language: string;
  code: string;
}

export default function CodeSandbox({ title, language, code }: CodeSandboxProps) {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const consoleRef = useRef<string[]>([]);

  const handleRun = () => {
    setIsRunning(true);
    setOutput("");
    setError("");
    consoleRef.current = [];

    try {
      // Create a safe execution environment
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = (...args: any[]) => {
        const message = args.map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(" ");
        consoleRef.current.push(message);
      };

      console.error = (...args: any[]) => {
        const message = args.map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(" ");
        consoleRef.current.push(`ERROR: ${message}`);
      };

      console.warn = (...args: any[]) => {
        const message = args.map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(" ");
        consoleRef.current.push(`WARN: ${message}`);
      };

      // Execute code
      const fn = new Function(code);
      fn();

      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      setOutput(consoleRef.current.join("\n"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred"
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="my-8 bg-[var(--color-surface-container-lowest)] rounded-[0.25rem] border border-[var(--color-outline-variant)]/20 p-6">
      <h3 className="font-headline text-lg font-semibold text-[var(--color-on-surface)] mb-4">{title}</h3>

      {/* Code Block */}
      <div className="mb-4 bg-[var(--color-on-surface)] rounded-[0.25rem] p-4 overflow-x-auto">
        <code className="text-xs font-mono text-[var(--color-surface)] leading-relaxed whitespace-pre">
          {code}
        </code>
      </div>

      {/* Execute Button */}
      <button
        onClick={handleRun}
        disabled={isRunning}
        className="mb-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[0.25rem] font-semibold hover:bg-[var(--color-primary-container)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? "Running..." : "▶ Run Code"}
      </button>

      {/* Output */}
      {(output || error) && (
        <div>
          <p className="font-label text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--color-on-surface)] mb-2">
            Output
          </p>
          <div className={`bg-[var(--color-on-surface)] rounded-[0.25rem] p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${
            error ? "text-red-400" : "text-[#90EE90]"
          }`}>
            {error ? (
              <span>
                <strong>Error:</strong> {error}
              </span>
            ) : (
              output || "No output"
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mt-4 text-xs text-[var(--color-on-surface-variant)] italic space-y-1">
        <p>💡 This code runs in your browser. Output uses console.log().</p>
        <p>⚠️ For security, only JavaScript is supported in this sandbox.</p>
      </div>
    </div>
  );
}
