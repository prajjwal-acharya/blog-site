"use client";

/**
 * CodeSandbox — syntax-highlighted code display
 * Supports: Python, JavaScript, Go, Rust, TypeScript, and more
 * Uses Prism.js for syntax highlighting with proper indentation
 */

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Prism?: {
      highlightElement: (element: HTMLElement) => void;
    };
  }
}

interface CodeSandboxProps {
  title: string;
  language: string;
  code: string;
}

// Language display names
const LANGUAGE_NAMES: Record<string, string> = {
  python: "Python",
  py: "Python",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  go: "Go",
  rust: "Rust",
  rs: "Rust",
  cpp: "C++",
  c: "C",
  java: "Java",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  json: "JSON",
  xml: "XML",
  html: "HTML",
  css: "CSS",
};

export default function CodeSandbox({ title, language, code }: CodeSandboxProps) {
  const codeRef = useRef<HTMLElement>(null);
  const safeCode = code?.trim() || "# Code unavailable";
  const langKey = language.toLowerCase();
  const langDisplay = LANGUAGE_NAMES[langKey] || language;

  useEffect(() => {
    // Dynamically load Prism if not already loaded
    if (typeof window !== "undefined" && !window.Prism) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js";
      script.onload = () => {
        // Load language support
        const langScript = document.createElement("script");
        langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${langKey}.min.js`;
        document.head.appendChild(langScript);

        // Load CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css";
        document.head.appendChild(link);

        if (codeRef.current && window.Prism) {
          window.Prism!.highlightElement(codeRef.current);
        }
      };
      document.head.appendChild(script);
    } else if (window.Prism && codeRef.current) {
      window.Prism!.highlightElement(codeRef.current);
    }
  }, [code, langKey]);

  return (
    <div className="not-prose my-8 bg-[var(--color-surface-container-lowest)] rounded-[0.25rem] border border-[var(--color-outline-variant)]/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg font-semibold text-[var(--color-on-surface)]">
          {title}
        </h3>
        <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded px-2 py-0.5">
          {langDisplay}
        </span>
      </div>

      {/* Code block with syntax highlighting */}
      <div className="mb-4 rounded-[0.25rem] overflow-x-auto">
        <pre className="m-0 p-4 bg-[#282c34] text-[#abb2bf]">
          <code
            ref={codeRef}
            className={`language-${langKey} text-sm leading-relaxed font-mono`}
          >
            {safeCode}
          </code>
        </pre>
      </div>

      {/* Info note */}
      <div className="text-xs text-[var(--color-on-surface-variant)] italic">
        <p>💡 Code is displayed with syntax highlighting. Copy to use in your editor.</p>
      </div>
    </div>
  );
}
