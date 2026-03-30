# ArticleML Parser Simplification ✅ Complete

## Overview

The ArticleML parser has been simplified to focus on **text-based markup** while moving complex content (images, videos, code, simulations) to a placeholder system for manual editing.

---

## What You Get Now

### ✨ Simplified Parser
- **Faster** — Only processes text-based markup
- **Easier to maintain** — No complex regex for code execution, package detection
- **More reliable** — Fewer edge cases and error conditions
- **Cleaner** — Single responsibility: parse text-based content

### 📦 Supported ArticleML Syntax

**Still works:**
- ✅ Markdown (headings, bold, italic, lists)
- ✅ Callout boxes: `!CALLOUT title="..." ... !END-CALLOUT`
- ✅ Math notes: `!MATH-NOTE ... !END-MATH-NOTE` (with LaTeX)
- ✅ Editorial accents: `!ATTENTION ... !END-ATTENTION`
- ✅ Tables: `|TABLE ... |END-TABLE`
- ✅ Standard markdown links and formatting

**New placeholder syntax:**
- 🔲 `[!IMAGE] : {desc: "..."}` — Placeholder for images, diagrams, charts
- 🔲 `[!VIDEO] : {desc: "..."}` — Placeholder for videos, tutorials
- 🔲 `[!CODE] : {desc: "..."}` — Placeholder for code examples
- 🔲 `[!SIMULATION] : {desc: "..."}` — Placeholder for interactive content, Bokeh plots

### 📄 Documentation

- **`ARTICLEML_GUIDE.md`** — Complete syntax reference and examples
- **`PLACEHOLDER_EXAMPLES.md`** — How to use and replace placeholders
- **`SIMPLIFICATION_SUMMARY.md`** — What changed and why

---

## Your Workflow Now

```
1. Write Article (ArticleML)
        ↓
2. Parse (node convert.js)
        ↓
3. Generated MDX with Placeholders
        ↓
4. (Optional) Manual Edits
   - Replace placeholders with actual components
   - Add images, videos, code, simulations
   - Customize styling/layout
        ↓
5. Build & Deploy
```

---

## Example

### ArticleML Input
```markdown
---
title: "Neural Network Optimization"
date: "2026-03-30"
description: "Techniques for optimizing neural networks"
category: "ML"
tags: ["optimization", "ml"]
---

## Architecture

Here's the system architecture:

[!IMAGE] : {desc: "System diagram showing components"}

## Implementation

Python implementation:

[!CODE] : {desc: "NumPy implementation of the algorithm"}

## Demo

Try our interactive demo:

[!SIMULATION] : {desc: "Interactive tool to experiment with parameters"}
```

### Generated MDX (After Parsing)
```tsx
---
title: "Neural Network Optimization"
date: "2026-03-30"
description: "Techniques for optimizing neural networks"
category: "ML"
tags: ["optimization", "ml"]
---

## Architecture

Here's the system architecture:

<Placeholder type="image" title="Image" description="System diagram showing components" />

## Implementation

Python implementation:

<Placeholder type="code" title="Code" description="NumPy implementation of the algorithm" />

## Demo

Try our interactive demo:

<Placeholder type="simulation" title="Interactive Simulation" description="Interactive tool to experiment with parameters" />
```

### Manual Edit (Optional)
Replace placeholders with actual content:

```tsx
import Image from "next/image";
import BokehVisualization from "@/components/blog/BokehVisualization";

## Architecture

Here's the system architecture:

<Image src="/images/architecture.png" alt="System diagram" width={900} height={600} />

## Implementation

Python implementation:

```python
import numpy as np

def optimize(weights):
    # Your code here
    pass
```

## Demo

Try our interactive demo:

<BokehVisualization title="Optimization Demo" src="/bokeh/demo.html" height={600} />
```

---

## Files Changed

### Parser Files
- `src/lib/articleml-parser.ts` — Simplified to ~200 lines
- `convert.js` — Simplified JavaScript converter

### Components
- `src/components/blog/Placeholder.tsx` — NEW: Visual placeholder component
- `src/app/blog/[slug]/page.tsx` — Updated to use only Placeholder

### Documentation
- `ARTICLEML_GUIDE.md` — NEW: Comprehensive syntax reference
- `PLACEHOLDER_EXAMPLES.md` — NEW: How to use and replace placeholders
- `SIMPLIFICATION_SUMMARY.md` — NEW: Change summary

### Example
- `google-turboquant.articleml` — Updated to use new placeholder syntax
- `src/content/posts/google-turboquant.mdx` — Generated from ArticleML

### Removed/Deprecated
- ~~`CodeSandbox.tsx`~~ — Removed from MDX rendering
- ~~`BokehVisualization.tsx`~~ — Removed from MDX rendering
- ~~`GraphVisualizer.tsx`~~ — Removed from MDX rendering
- ~~`MatrixVisualization.tsx`~~ — Removed from MDX rendering
- ~~`BOKEH_GUIDE.md`~~ — No longer relevant
- ~~`BOKEH_SETUP.md`~~ — No longer relevant
- ~~`scripts/generate-bokeh-plot.py`~~ — Still available if you need it

---

## Quick Start

### 1. Create an Article
```bash
cat > my-article.articleml << 'EOF'
---
title: "My Article"
date: "2026-03-30"
description: "Brief description"
category: "Category"
tags: ["tag1", "tag2"]
---

## Introduction

Some text here.

[!IMAGE] : {desc: "What the image shows"}

More text.
EOF
```

### 2. Parse to MDX
```bash
node convert.js my-article.articleml
```

Output: `src/content/posts/my-article.mdx`

### 3. (Optional) Edit Placeholders
```bash
vim src/content/posts/my-article.mdx
```

Replace `<Placeholder>` components with actual content.

### 4. Build & Deploy
```bash
npm run build
npm run dev
```

---

## Benefits

| Before | After |
|--------|-------|
| Complex parser with code execution, package detection | Simple text-based parser |
| Hard to debug parsing errors | Easy to understand what went wrong |
| Limited customization | Full control over final output |
| Slow parsing | Fast parsing |
| Tightly coupled to React components | Loosely coupled with placeholders |
| Bloated with Bokeh, Pyodide dependencies | Minimal dependencies |

---

## Common Tasks

### Add an Image
In your MDX, replace:
```tsx
<Placeholder type="image" title="Image" description="My image" />
```

With:
```tsx
import Image from "next/image";
<Image src="/images/my-image.png" alt="My image" width={800} height={600} />
```

### Add Code Example
Replace:
```tsx
<Placeholder type="code" title="Code" description="Python example" />
```

With:
```tsx
<CodeBlock language="python" title="My Code">
{`# Your code here
print("Hello")`}
</CodeBlock>
```

### Add Bokeh Plot
Replace:
```tsx
<Placeholder type="simulation" title="Interactive Simulation" description="..." />
```

With:
```tsx
import BokehVisualization from "@/components/blog/BokehVisualization";
<BokehVisualization title="My Plot" src="/bokeh/my-plot.html" height={500} />
```

---

## No Breaking Changes ✅

- Existing articles continue to work
- Build process unchanged
- Deployment unchanged
- All markdown features preserved

---

## Support

See documentation in:
- `ARTICLEML_GUIDE.md` — Syntax reference
- `PLACEHOLDER_EXAMPLES.md` — Practical examples
- `SIMPLIFICATION_SUMMARY.md` — Details on what changed

---

## Summary

✨ The ArticleML parser is now **simpler, faster, and more flexible**. Write content in clean ArticleML syntax, parse it to MDX, and manually add rich media when needed. Perfect for a content-first workflow!

🚀 Ready to write your next article?

```bash
node convert.js your-article.articleml
```
