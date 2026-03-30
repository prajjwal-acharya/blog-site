# Folder-Based Article Structure

## Overview

Articles are now organized in a **folder-based structure** instead of individual `.mdx` files. This allows you to keep article content and its dependent components (graphs, simulations, interactive demos) together in a single folder.

---

## New Structure

```
src/content/posts/
├── google-turboquant/
│   ├── page.mdx              (main article content)
│   ├── graph.tsx             (optional: graph component)
│   ├── simulation.tsx         (optional: simulation component)
│   ├── chart.tsx             (optional: chart component)
│   └── ...                   (any other dependent files)
└── another-article/
    ├── page.mdx
    ├── visualization.tsx
    └── ...
```

**Each article is a folder** containing:
- **`page.mdx`** — The main article content (required)
- **Dependent files** — Graph, simulation, chart, or any other `.tsx`/`.ts` components (optional)

---

## Workflow

### 1. Create an ArticleML File

Write your article in ArticleML format:

```bash
cat > my-article.articleml << 'EOF'
---
title: "My Article Title"
date: "2026-03-30"
description: "Brief description"
category: "Category Name"
tags: ["tag1", "tag2"]
series: "Series Name"
seriesOrder: 1
---

## Introduction

Your article content here.

[!IMAGE] : {desc: "Description of image"}

[!SIMULATION] : {desc: "Description of simulation"}

More content...
EOF
```

### 2. Parse to MDX

The converter creates a **folder** with the article slug:

```bash
node convert.js my-article.articleml
```

**Output structure:**
```
src/content/posts/my-article/
├── page.mdx                    ← Auto-generated
└── (ready for graph.tsx, simulation.tsx, etc.)
```

### 3. (Optional) Add Dependent Components

In the same folder, add any dependent files:

```bash
# Add a chart component
cat > src/content/posts/my-article/chart.tsx << 'EOF'
export function CompressionChart() {
  return (
    <div className="w-full h-96 bg-surface-container-low rounded p-4">
      {/* Chart implementation */}
    </div>
  );
}
EOF

# Add a simulation component
cat > src/content/posts/my-article/simulation.tsx << 'EOF'
export function QuantizationSimulation() {
  return (
    <div className="space-y-4">
      {/* Interactive simulation */}
    </div>
  );
}
EOF
```

### 4. Update page.mdx with Components

After adding components, import and use them in `page.mdx`:

```tsx
---
title: "My Article"
date: "2026-03-30"
...
---

import { CompressionChart } from "./chart";
import { QuantizationSimulation } from "./simulation";

## Compression Analysis

Here's the compression ratio visualization:

<CompressionChart />

## Interactive Demo

Try the quantization simulation:

<QuantizationSimulation />
```

Replace `[!IMAGE]` placeholders with actual components as needed.

### 5. Build & Deploy

```bash
npm run build
npm run dev
```

Your article is now live at `/blog/my-article` with all components working together.

---

## Converter Changes

### Old Behavior
```bash
node convert.js article.articleml
# Output: src/content/posts/article.mdx
```

### New Behavior
```bash
node convert.js article.articleml
# Output: src/content/posts/article/page.mdx  ← In a folder!
```

The converter automatically:
1. Extracts the slug from the filename (e.g., `my-article.articleml` → `my-article`)
2. Creates the folder: `src/content/posts/my-article/`
3. Generates `page.mdx` inside that folder
4. Preserves all ArticleML features (callouts, math, tables, placeholders)

---

## Why This Structure?

### ✅ Benefits

1. **Organized** — All article files (content + components) in one place
2. **Scalable** — Easy to add graphs, simulations, charts as separate files
3. **Maintainable** — Clear folder structure, no file name collisions
4. **Composable** — Components can import from each other
5. **Flexible** — Add any `.tsx`, `.ts`, `.json`, or media files

### Example Structure

```
src/content/posts/neural-networks/
├── page.mdx                      (main content)
├── activation-graph.tsx          (graph visualization)
├── backprop-simulator.tsx        (interactive demo)
├── formulas.ts                   (math utilities)
└── data.json                     (reference data)
```

---

## File Organization Tips

### Keep Related Files Together

```
src/content/posts/optimization/
├── page.mdx
├── gradient-descent-demo.tsx
├── loss-curve.tsx
└── utils.ts                    (shared utilities)
```

### Import Between Files

In `page.mdx`:
```tsx
import { GradientDescentDemo } from "./gradient-descent-demo";
import { LossCurve } from "./loss-curve";

## Gradient Descent

<GradientDescentDemo />

<LossCurve />
```

In `gradient-descent-demo.tsx`:
```tsx
import { formatNumber } from "./utils";

export function GradientDescentDemo() {
  // Uses shared utilities
}
```

### Asset Organization

```
src/content/posts/article-slug/
├── page.mdx
├── components/
│   ├── graph.tsx
│   └── simulation.tsx
├── styles/
│   └── custom.css
└── data/
    └── dataset.json
```

---

## Parser Features (Unchanged)

All ArticleML features still work:

- ✅ **Callout boxes** — `!CALLOUT title="..." ... !END-CALLOUT`
- ✅ **Math notes** — `!MATH-NOTE ... !END-MATH-NOTE` with LaTeX
- ✅ **Editorial accents** — `!ATTENTION ... !END-ATTENTION`
- ✅ **Tables** — `|TABLE ... |END-TABLE`
- ✅ **Placeholders** — `[!IMAGE]`, `[!CODE]`, `[!VIDEO]`, `[!SIMULATION]`
- ✅ **Standard markdown** — Headings, bold, italic, lists, links

### Placeholder Workflow

1. **ArticleML** → `[!IMAGE] : {desc: "..."}`
2. **Generated MDX** → `<Placeholder type="image" ... />`
3. **Manual Edit** → Replace with actual component

---

## Example: Complete Article

### ArticleML (`quantization-guide.articleml`)

```yaml
---
title: "Neural Network Quantization Guide"
date: "2026-03-30"
description: "Step-by-step guide to quantizing neural networks"
category: "ML"
tags: ["quantization", "optimization", "tutorial"]
series: "Model Optimization"
seriesOrder: 2
---

Quantization is a key technique for...

!CALLOUT title="What You'll Learn"
- How quantization works
- Post-training vs QAT approaches
- Practical implementation tips
!END-CALLOUT

## Visualization

[!IMAGE] : {desc: "Quantization process diagram"}

## Interactive Demo

[!SIMULATION] : {desc: "Adjust quantization levels in real-time"}

## Code Example

[!CODE] : {desc: "PyTorch quantization implementation"}

!MATH-NOTE
The quantization function:
$$ q = \text{round}\left(\frac{x - x_{\min}}{x_{\max} - x_{\min}} \cdot (2^b - 1)\right) $$
!END-MATH-NOTE
```

### Parse

```bash
node convert.js quantization-guide.articleml
# Creates: src/content/posts/quantization-guide/page.mdx
```

### Enhance (`src/content/posts/quantization-guide/page.mdx`)

After parsing, replace placeholders with actual components:

```tsx
---
title: "Neural Network Quantization Guide"
...
---

import { QuantizationDiagram } from "./diagram";
import { QuantizationSimulator } from "./simulator";
import { CodeExample } from "./code-example";

Quantization is a key technique for...

<Callout title="What You'll Learn">
- How quantization works
- Post-training vs QAT approaches
- Practical implementation tips
</Callout>

## Visualization

<QuantizationDiagram />

## Interactive Demo

<QuantizationSimulator />

## Code Example

<CodeExample />

<MathNote>
The quantization function:
$$ q = \text{round}\left(\frac{x - x_{\min}}{x_{\max} - x_{\min}} \cdot (2^b - 1)\right) $$
</MathNote>
```

### Add Components

```bash
# diagram.tsx
export function QuantizationDiagram() { ... }

# simulator.tsx
export function QuantizationSimulator() { ... }

# code-example.tsx
export function CodeExample() { ... }
```

---

## Build & Deployment

### Local Development

```bash
npm run dev
# Visit: http://localhost:3000/blog/quantization-guide
```

### Production Build

```bash
npm run build
# Generates static HTML for all articles in src/content/posts/*/page.mdx
```

### Verify Structure

```bash
# Check that article was created correctly
ls -la src/content/posts/your-article/
# Expected: page.mdx + any additional component files
```

---

## Migration Guide (From Old Structure)

### If You Had

```
src/content/posts/article.mdx
```

### You Now Have

```
src/content/posts/article/
└── page.mdx
```

**Just run the converter again:**
```bash
node convert.js article.articleml
```

The converter automatically handles the new folder structure.

---

## Best Practices

1. **Keep components small** — One component per file when possible
2. **Use shared utilities** — Extract common logic to `utils.ts`
3. **Document dependencies** — Comments explaining component usage
4. **Organize by concern** — Separate `components/`, `styles/`, `data/` if needed
5. **Use TypeScript** — All `.tsx` files are TypeScript

---

## Troubleshooting

### Article not showing up?

Check that the folder structure is correct:
```bash
ls src/content/posts/your-slug/page.mdx
# Should exist and have content
```

### Component import errors?

Verify the import path:
```tsx
// ✅ Correct (same folder)
import { MyComponent } from "./my-component";

// ❌ Wrong (relative path)
import { MyComponent } from "../my-component";
```

### Build fails on new component?

Make sure all imports are properly resolved:
```bash
npm run build
# Read error message for exact file/line
```

---

## Summary

Articles are now **folder-based** for better organization. Each article folder contains:
- **`page.mdx`** — Main content (auto-generated from `.articleml`)
- **Component files** — Optional `.tsx` files for graphs, simulations, etc.

**Workflow:**
1. Write `.articleml`
2. Parse: `node convert.js article.articleml`
3. Add components to the folder
4. Import components in `page.mdx`
5. Build: `npm run build`

This keeps all article-related code together and makes it easy to add rich, interactive content! 🚀
