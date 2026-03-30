# Series Feature — Organizing Blog Posts into Collections

## Overview

The series feature allows you to organize blog posts into thematic collections, creating structured learning paths for readers. Each series automatically generates an index page and a flowchart visualization showing the progression through related articles.

---

## Quick Start

### 1. Add Series Metadata to ArticleML

```yaml
---
title: "Understanding Quantization"
date: "2026-03-30"
description: "..."
category: "ML"
tags: ["ml", "optimization"]
series: "LLM Optimization Techniques"
seriesOrder: 1
---
```

### 2. Parse the Article

```bash
node convert.js your-article.articleml
```

The generated MDX file will include `series` and `seriesOrder` in its front matter.

### 3. Add More Articles to the Same Series

```yaml
---
title: "Quantization in Practice"
series: "LLM Optimization Techniques"
seriesOrder: 2
---
```

### 4. Series Pages Auto-Generate

- **`/series`** — Index of all series with featured cards
- **`/series/llm-optimization-techniques`** — Flowchart visualization and article links

---

## Architecture

### Data Structure

Series are built dynamically from article metadata:

```typescript
interface Series {
  name: string;           // "LLM Optimization Techniques"
  slug: string;           // "llm-optimization-techniques"
  description: string;    // Generated from articles
  articles: SeriesArticle[];
  totalReadingTime: string;
}

interface SeriesArticle {
  slug: string;
  title: string;
  order: number;          // seriesOrder from front matter
  description: string;
  readingTime?: string;
}
```

### How It Works

1. **Parser Extension** — ArticleML parser now supports optional `series` and `seriesOrder` fields
2. **Series Index Generator** — Reads all MDX files, extracts series metadata, builds series collection
3. **Dynamic Page Generation** — Next.js generates static pages for each series using `generateStaticParams()`
4. **Flowchart Visualization** — SeriesFlowchart component visualizes article progression

---

## Files Created

### Core Infrastructure

- **`src/lib/series.ts`** — Type definitions and utility functions
  - `Series`, `SeriesArticle` interfaces
  - `seriesNameToSlug()` — Convert series names to URL slugs
  - `formatTotalReadingTime()` — Calculate total reading time for series

### UI Components

- **`src/components/blog/SeriesIndex.tsx`** — Editorial gallery of all series
  - Featured series (large card with image)
  - Regular series (grid layout)
  - Newsletter signup section
  - Uses stitch4 design system

- **`src/components/blog/SeriesFlowchart.tsx`** — Series visualization
  - SVG connector lines between articles
  - Individual article cards with metadata
  - Active path highlighting
  - Start/complete indicators

### Pages

- **`src/app/series/page.tsx`** — Series index page
  - Parses all MDX files to build series collection
  - Displays all series with metadata
  - Shows node count and total reading time

- **`src/app/series/[slug]/page.tsx`** — Individual series page
  - Shows series details and description
  - Displays flowchart visualization
  - Provides "Start Series" CTA
  - Uses `generateStaticParams()` for static generation

### Parser Updates

- **`src/lib/articleml-parser.ts`** — Updated FrontMatter interface
  - New optional fields: `series?`, `seriesOrder?`
  - Parses series metadata from YAML
  - Includes series in MDX output

- **`convert.js`** — JavaScript parser updated
  - Parses `series` and `seriesOrder` fields
  - Includes them in output MDX front matter

### Navigation

- **`src/components/layout/Navbar.tsx`** — Added "Series" link
  - Navigation option at `/series`

---

## Front Matter Specification

### Required Fields (Existing)
- `title` — Article title
- `date` — Publication date (YYYY-MM-DD)
- `description` — Brief summary
- `category` — Article category
- `tags` — Array of tags

### Optional Fields (Existing)
- `featured` — Boolean flag for featured articles
- `readingTime` — Estimated reading time (e.g., "8 min")

### Optional Fields (New — Series)
- `series` — Series name (creates series if it doesn't exist)
- `seriesOrder` — Position in series (1-indexed number)

### Example

```yaml
---
title: "Google TurboQuant: The 3-Bit KV Cache Revolution"
date: "2026-03-30"
description: "How Google's new training-free algorithm compresses LLM memory by 6x with zero accuracy loss."
category: "AI Advances"
tags: ["kv-cache", "quantization", "llms", "optimization"]
featured: true
readingTime: "8 min"
series: "LLM Optimization Techniques"
seriesOrder: 1
---
```

---

## Usage Examples

### Create a Series with 3 Articles

**Step 1: First Article**
```bash
cat > quant-intro.articleml << 'EOF'
---
title: "Introduction to Quantization"
date: "2026-03-30"
description: "The fundamentals of neural network quantization"
category: "ML"
tags: ["quantization", "optimization"]
series: "Neural Network Compression"
seriesOrder: 1
readingTime: "6 min"
---

Quantization is a key technique for...
EOF

node convert.js quant-intro.articleml
```

**Step 2: Second Article**
```bash
cat > quant-techniques.articleml << 'EOF'
---
title: "Advanced Quantization Techniques"
date: "2026-03-31"
description: "Exploring post-training and quantization-aware training"
category: "ML"
tags: ["quantization", "training"]
series: "Neural Network Compression"
seriesOrder: 2
readingTime: "10 min"
---

Building on the fundamentals, we now explore...
EOF

node convert.js quant-techniques.articleml
```

**Step 3: Third Article**
```bash
cat > quant-production.articleml << 'EOF'
---
title: "Deploying Quantized Models"
date: "2026-04-01"
description: "Best practices for production deployment"
category: "ML"
tags: ["quantization", "deployment"]
series: "Neural Network Compression"
seriesOrder: 3
readingTime: "8 min"
---

Deploying quantized models requires...
EOF

node convert.js quant-production.articleml
```

**Result:**
- Auto-generated series page at `/series/neural-network-compression`
- Series index shows "Neural Network Compression" with 3 nodes, 24m total reading time
- Flowchart visualization connects all 3 articles
- Reader can navigate from article 1 → 2 → 3

### Standalone Article (No Series)

```bash
cat > standalone.articleml << 'EOF'
---
title: "A Brief Note on Gradient Descent"
date: "2026-03-30"
description: "..."
category: "ML"
tags: ["optimization"]
---

Gradient descent is...
EOF

node convert.js standalone.articleml
```

Articles without `series` field appear in the blog but not in the series index.

---

## Design System Integration

The series feature uses the **stitch4 editorial design system**:

### Colors
- **Primary:** Clay-red (#994121)
- **Surface:** Off-white (#FAF9F4)
- **Text:** Dark charcoal (#1B1C19)

### Typography
- **Headlines:** Newsreader (serif, italic)
- **Body:** Inter (sans-serif)
- **Labels:** Inter (uppercase, small caps)

### Components
- **Cards:** No borders, tonal backgrounds
- **Flowchart:** SVG connector lines, subtle styling
- **Interactive:** Hover effects, smooth transitions

### Reference Designs
- **Series Index:** `stitch4/research_series_index_editorial_clay/code.html`
- **Series Flowchart:** `stitch4/knowledge_path_flowchart_view_editorial_clay/code.html`

---

## Static Generation

Series pages are pre-built at build time using Next.js `generateStaticParams()`:

```bash
npm run build
```

This generates:
- `/series/[series-name].html` for each unique series
- `/series/index.html` (series index page)

No database or server-side rendering required — fully static site.

---

## Future Enhancements

Possible improvements (not yet implemented):

1. **Series Metadata File** — Store series descriptions in a JSON file
2. **Series Images** — Add featured images to series cards
3. **Series Descriptions** — Customize series descriptions beyond auto-generation
4. **Series Tags** — Tag series (e.g., "Beginner", "Advanced")
5. **Series Progress** — Track reader progress through series
6. **Related Series** — Show suggested series based on current series
7. **Series Collections** — Group series into higher-level collections

---

## Testing

To verify series functionality:

1. **Build the site:**
   ```bash
   npm run build
   ```
   Should show: `✓ Generating static pages using 7 workers (16/16) in XXXms`

2. **Check generated pages:**
   ```bash
   ls .next/static/app/series/
   ```
   Should list `llm-optimization-techniques/` and other series

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Visit:
   - `http://localhost:3000/series` — Series index
   - `http://localhost:3000/series/llm-optimization-techniques` — Series detail

4. **Verify navigation:**
   - Click "Series" in navbar
   - Click a series card
   - Verify flowchart shows all articles in order

---

## Troubleshooting

### Series not appearing

**Problem:** Series page exists but doesn't show up in series index

**Solution:** Verify front matter:
```yaml
series: "Exact Series Name"  # Must match exactly
seriesOrder: 1              # Must be a number
```

### Series slug incorrect

**Problem:** Series name "ML Basics 101" creates wrong slug

**Solution:** Series names are converted to lowercase, spaces become dashes:
- "ML Basics 101" → "ml-basics-101"
- URLs are case-insensitive, this is expected

### Articles not in order

**Problem:** Articles appear in wrong order in flowchart

**Solution:** Verify `seriesOrder` values:
```yaml
seriesOrder: 1   # First
seriesOrder: 2   # Second
seriesOrder: 3   # Third (etc.)
```

---

## Summary

The series feature provides a complete taxonomy system for organizing blog posts. It's fully automatic, requires no database, and integrates seamlessly with the ArticleML parser. Readers can now follow structured learning paths through related articles using an elegant flowchart visualization.

✨ **Key Benefits:**
- 📚 Organize content into learning paths
- 🎨 Beautiful editorial design
- ⚡ Fully static, no performance overhead
- 🔧 Simple to use — just add 2 fields to front matter
- 🎯 Auto-generates series pages on build
