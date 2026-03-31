# Getting Started — Blog Creation Guide

This guide walks you through creating and publishing a blog post from start to finish.

## Prerequisites

- Node.js 18+ and npm installed
- Familiarity with Markdown (ArticleML extends it)
- Optional: React knowledge for interactive components

## 5-Minute Quick Start

### 1. Create a New Post

```bash
npm run new-post -- "My First Article" --category "AI Advances"
```

This scaffolds:
- `my-first-article.articleml` — your editable source
- `src/content/posts/my-first-article/` — post directory
- `src/content/posts/my-first-article/components.tsx` — optional component stub

### 2. Write Content

Edit `my-first-article.articleml`:

```yaml
---
title: "My First Article"
date: "2026-03-31"
description: "A brief summary of what this article covers."
category: "AI Advances"
tags: ["ai", "tutorial"]
readingTime: "5 min"
---

Your opening paragraph here.

## Section Heading

Content with **bold**, *italic*, and `code`.

!CALLOUT title="Key Insight"
Important takeaway or highlight.
!END-CALLOUT

---

## Another Section

More content...
```

### 3. Convert to MDX

```bash
npm run convert -- my-first-article.articleml
```

This generates `src/content/posts/my-first-article/page.mdx` with all fixes applied:
- ✅ Math rendering (KaTeX CSS loaded)
- ✅ Code highlighting (highlight.js CSS loaded)
- ✅ Styled tables (GFM pipe syntax)
- ✅ Proper character escaping (JSX-safe)

### 4. Preview

```bash
npm run dev
```

Visit: `http://localhost:3000/blog/my-first-article`

### 5. Add Components (Optional)

Edit `src/content/posts/my-first-article/components.tsx`:

```tsx
"use client";
export function InteractiveDemo() {
  return (
    <div className="p-6 bg-[var(--color-surface-container-low)] rounded-xl">
      <p>Interactive content here</p>
    </div>
  );
}
```

Then reference in your `.articleml`:

```
[!SIMULATION] : {desc: "A demo", component: "InteractiveDemo"}
```

Reconvert: `npm run convert -- my-first-article.articleml`

---

## Step-by-Step Workflow

### Scaffold a Post

```bash
npm run new-post -- "Article Title" [--category "Category"] [--series "Series Name"] [--no-components]
```

**Options:**
- `--category` — Grouping label (default: "Uncategorized")
- `--series` — Series name (optional, e.g., "Memory Systems")
- `--no-components` — Skip creating `components.tsx` stub

**Output:**
- `{slug}.articleml` — Edit this file
- `src/content/posts/{slug}/` — Post directory
- `src/content/posts/{slug}/components.tsx` — Optional component file

### Edit Source

Open `{slug}.articleml` in your editor. See [ArticleML Syntax](./ARTICLEML_SYNTAX.md) for full reference.

**Minimal example:**
```yaml
---
title: "Understanding Attention"
date: "2026-03-31"
description: "How transformers use attention to process sequences."
category: "AI Advances"
tags: ["transformers", "attention"]
readingTime: "7 min"
---

Transformers revolutionized NLP by introducing attention.

## The Mechanism

Attention works by computing a weighted average over all input tokens...

> "Attention is all you need." — Vaswani et al., 2017
```

### Convert to MDX

```bash
npm run convert -- {slug}.articleml
```

**What happens:**
1. Parses `.articleml` frontmatter and body
2. Segments body by block type (markdown, tables, callouts, etc.)
3. Processes math: `\(...\)` → `$...$`, `\[...\]` → `$$...$$`
4. Converts tables to GFM pipe syntax
5. Transforms placeholders and components
6. Generates `src/content/posts/{slug}/page.mdx`

**Auto-slug inference** (in order):
1. `--slug` flag (if provided)
2. `slug:` field in frontmatter (if present)
3. `title:` field (converted to slug format)
4. `.articleml` filename (fallback)

### Preview Locally

```bash
npm run dev
```

Visit: `http://localhost:3000/blog/{slug}`

Changes to `.articleml` require re-running `npm run convert` to preview updates.

### Build for Production

```bash
npm run build
```

Verifies:
- No TypeScript errors
- All posts render correctly
- Static site generation completes

---

## ArticleML Block Reference

### Frontmatter (YAML)

```yaml
---
title: "Article Title"
date: "YYYY-MM-DD"
description: "Brief summary (max 2 sentences)"
category: "Category Name"
tags: ["tag1", "tag2"]
slug: "optional-slug-override"
series: "Series Name (optional)"
seriesOrder: 1
featured: true
readingTime: "5 min"
---
```

**Required:** `title`, `date`, `description`, `category`, `tags`

### Block Types

#### Markdown (Standard)

Write regular Markdown. Supports **bold**, *italic*, `code`, `[links](url)`, and lists.

#### Callout

```
!CALLOUT title="Key Insight"
Content here. Can include **bold** and [links](url).
!END-CALLOUT
```

#### Attention (Editorial Accent)

```
!ATTENTION
This is important.
!END-ATTENTION
```

#### Math Note

```
!MATH-NOTE
Display math equations here:

$$
f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx
$$
!END-MATH-NOTE
```

#### Table

```
|TABLE
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
|END-TABLE
```

Gets converted to GFM pipe syntax and styled with MDX overrides.

#### Placeholder

```
[!IMAGE] : {desc: "A descriptive caption"}
```

Types: `IMAGE`, `VIDEO`, `SIMULATION`, `CODE`

Without a `component:` field, renders a placeholder box (for future content).

#### Placeholder with Component

```
[!SIMULATION] : {desc: "Interactive demo", component: "MyComponent"}
```

Directly emits `<MyComponent />` instead of a placeholder.

### Math Syntax

**Inline math:**
```
The formula \(E = mc^2\) is fundamental.
```

**Display math:**
```
\[
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V
\]
```

---

## Common Workflows

### Add an Interactive Component

1. Edit `src/content/posts/{slug}/components.tsx`:
   ```tsx
   "use client";
   export function MyChart() {
     return <div>Chart here</div>;
   }
   ```

2. Reference in `.articleml`:
   ```
   [!SIMULATION] : {desc: "Chart demo", component: "MyChart"}
   ```

3. Reconvert:
   ```bash
   npm run convert -- {slug}.articleml
   ```

### Use Math in Content

Inline: `This is \(x^2 + y^2 = z^2\).`

Display:
```
\[
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
\]
```

### Create a Series

When scaffolding:
```bash
npm run new-post -- "Series Part 1" --series "My Series"
```

Frontmatter automatically includes:
```yaml
series: "My Series"
seriesOrder: 1
```

Update `seriesOrder` for each post in the series.

### Draft and Publish

All posts are published immediately after conversion. To keep a post unpublished:
- Store `.articleml` in a `_drafts/` folder
- Only move to root when ready to publish
- Run conversion when ready

---

## File Locations

| Item | Location |
|------|----------|
| Source template | `.articleml` in repo root |
| Generated MDX | `src/content/posts/{slug}/page.mdx` |
| Components | `src/content/posts/{slug}/components.tsx` |
| Post metadata | Frontmatter in `.mdx` |

---

## Troubleshooting

### Build fails with TypeScript errors

Check `src/content/posts/{slug}/components.tsx` for export issues. All named exports should be React components (functions returning JSX).

### Components not appearing

1. Ensure `components.tsx` has `"use client"` at top
2. Check component names match MDX tags exactly (case-sensitive)
3. Verify MDX file includes `<ComponentName />` tag

### Math not rendering

KaTeX CSS must be loaded in `src/app/layout.tsx` (already included). Check browser console for errors.

### Tables not styled

Ensure `processTableSegment` converts to GFM pipe syntax (not raw HTML). After recent code fixes, reconvert old posts:

```bash
npm run convert -- old-post.articleml
```

---

## Next Steps

- **[ArticleML Syntax](./ARTICLEML_SYNTAX.md)** — Full reference for all syntax features
- **[Project Structure](./PROJECT_STRUCTURE.md)** — Understand the codebase layout
- **[Architecture](./ARCHITECTURE.md)** — Deep dive into design decisions

Happy writing! 📝
