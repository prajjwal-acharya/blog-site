#!/usr/bin/env node

/**
 * new-post.mjs — Blog post scaffolding script
 *
 * Usage:
 *   npm run new-post -- "My Article Title" [--category "AI Advances"] [--series "Series Name"] [--no-components]
 *
 * Creates:
 *   src/content/posts/{slug}/          — post directory
 *   {slug}.articleml                   — pre-filled ArticleML template
 *   src/content/posts/{slug}/components.tsx  — optional component stub
 */

import fs from "fs";
import path from "path";

// ── Arg parsing ───────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log('Usage: npm run new-post -- "My Article Title" [options]');
  console.log("");
  console.log("Options:");
  console.log('  --category <name>   Category label  (default: "Uncategorized")');
  console.log('  --series <name>     Series name      (optional)');
  console.log("  --no-components     Skip creating components.tsx stub");
  console.log("");
  console.log('Example: npm run new-post -- "How Attention Works" --category "AI Advances"');
  process.exit(args.length === 0 ? 1 : 0);
}

function getFlag(flag, fallback = null) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")
    ? args[idx + 1]
    : fallback;
}

const title = args[0];
const category = getFlag("--category", "Uncategorized");
const series = getFlag("--series", null);
const noComponents = args.includes("--no-components");

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const today = new Date().toISOString().slice(0, 10);
const cwd = process.cwd();
const postDir = path.join(cwd, "src", "content", "posts", slug);
const articlemlPath = path.join(cwd, `${slug}.articleml`);
const componentsPath = path.join(postDir, "components.tsx");

// ── Guard against overwrite ───────────────────────────────────

if (fs.existsSync(postDir)) {
  console.error(`❌ Post directory already exists: src/content/posts/${slug}/`);
  process.exit(1);
}
if (fs.existsSync(articlemlPath)) {
  console.error(`❌ ArticleML file already exists: ${slug}.articleml`);
  process.exit(1);
}

// ── Create post directory ─────────────────────────────────────

fs.mkdirSync(postDir, { recursive: true });
console.log(`📁 Created:  src/content/posts/${slug}/`);

// ── Write ArticleML template ──────────────────────────────────

const seriesLines = series
  ? `series: "${series}"\nseriesOrder: 1\n`
  : "";

const articleml = `---
title: "${title}"
date: "${today}"
description: "A brief summary of what this article covers."
category: "${category}"
tags: ["tag1", "tag2"]
${seriesLines}readingTime: "5 min"
---

Opening paragraph — hook the reader in one or two sentences.

---

## First Section

Your content goes here.

---

## Second Section

More content.

!CALLOUT title="Key Insight"
Highlight an important takeaway.
!END-CALLOUT

---

## Conclusion

Wrap up and point to next steps.
`;

fs.writeFileSync(articlemlPath, articleml, "utf-8");
console.log(`📝 Created:  ${slug}.articleml`);

// ── Write components stub (optional) ─────────────────────────

if (!noComponents) {
  const componentsStub = `"use client";
import { useState } from "react";

/**
 * Post-specific interactive components for "${title}".
 * Each named export becomes available as a JSX tag in page.mdx.
 * Example: export function MyChart() { ... } → <MyChart /> in MDX
 */

export function ExampleComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-[var(--color-surface-container-low)] rounded-xl my-6">
      <p className="text-sm text-[var(--color-secondary)] mb-3">Example interactive component</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded text-sm"
      >
        Clicked {count} times
      </button>
    </div>
  );
}
`;
  fs.writeFileSync(componentsPath, componentsStub, "utf-8");
  console.log(`⚛️  Created:  src/content/posts/${slug}/components.tsx`);
}

// ── Done ──────────────────────────────────────────────────────

console.log("");
console.log("Next steps:");
console.log(`  1. Edit ${slug}.articleml`);
console.log(`  2. npm run convert -- ${slug}.articleml`);
console.log(`  3. npm run dev → visit /blog/${slug}`);
