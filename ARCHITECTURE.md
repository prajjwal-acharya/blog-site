# Architecture & Design Decisions

This document explains the technical choices behind the blog platform.

---

## Overview

The blog platform is built on a **content-first** philosophy:

1. Write in ArticleML (a clean, semantic format)
2. Convert to MDX (markdown with JSX)
3. Render with Next.js (server components + MDXRemote)
4. Display with styled component overrides (consistent, beautiful output)

---

## Core Design Principles

### 1. Semantic Content Format

**ArticleML** extends Markdown with semantic blocks:
- `!CALLOUT` — for insights
- `!ATTENTION` — for critical info
- `!MATH-NOTE` — for equations
- `|TABLE` — for data
- Placeholders — for planned content
- Components — for interactivity

**Why not just Markdown?**
- Markdown lacks semantics for specialized blocks (callouts, math containers)
- Raw HTML is verbose and error-prone
- A custom format makes intent explicit

**Why not Org-mode or reStructuredText?**
- ArticleML is simpler and more discoverable
- Lower barrier to entry (extends Markdown, not a separate ecosystem)
- Easier to parse with a state machine

### 2. Two-Stage Pipeline

**Stage 1: ArticleML → MDX** (convert.mjs)
- Parse frontmatter (YAML)
- Segment body into typed blocks
- Process each block type (markdown via remark, tables to GFM, math preprocessing)
- Generate `.mdx` output

**Stage 2: MDX → HTML** (next-mdx-remote in page.tsx)
- Next.js server component renders MDX
- `remark` plugins process markdown (gfm, math)
- `rehype` plugins process HTML (katex, highlight)
- Component overrides style HTML elements

**Why two stages?**
- Separation of concerns: content generation vs. rendering
- Easier to debug: inspect generated `.mdx` files
- Faster iteration: edit `.articleml`, run converter, preview
- Flexibility: convert to other formats (HTML, PDF) later

### 3. Component Auto-Discovery

Post components are loaded dynamically without hardcoding imports.

**Mechanism:**
```typescript
// In page.tsx
const postComponents = await getPostComponents(slug);
const allComponents = { ...mdxComponents, ...postComponents };
```

`load-post-components.ts` checks if `src/content/posts/{slug}/components.tsx` exists, then dynamically imports it.

**Why dynamic import?**
- In Next.js 16 React Server Components, `import()` resolves at **build time** (via Turbopack)
- Valid pattern: not the same as React.lazy (client-only)
- Allows posts to bring their own components without modifying page.tsx

**Why not a static registry?**
- Registry would need regeneration on every new post
- Dynamic import is cleaner for developer experience
- Fallback: if Turbopack fails, could generate `__component-registry.ts`

### 4. MDX Component Overrides

All HTML elements in MDX are replaced with styled versions:

```tsx
const mdxComponents = {
  h1: ({ children, ...props }) => <h1 {...props} className="...">...</h1>,
  table: ({ children, ...props }) => <div className="overflow-x-auto">...</div>,
  // ... etc
};
```

**Why override?**
- Consistency: all headings styled identically
- Accessibility: proper semantics (semantic HTML)
- Theme support: dark mode works automatically (CSS variables)
- Typography: editorial-specific adjustments (line-height, spacing)

**Why not Tailwind prose?**
- Tailwind prose is general-purpose; our theme requires custom styling
- Component overrides give precise control
- Easier to debug (explicit component per element)

---

## Technical Choices

### Why Next.js 16 + Turbopack?

- **RSC (React Server Components):** Renders on server, reduces client JS
- **Turbopack:** Fast bundler, better than Webpack for development
- **App Router:** Modern, better file-based routing
- **Image optimization:** Built-in via `next/image`
- **Static generation:** SSG for blog posts (fast, no server needed)

### Why MDX via next-mdx-remote?

- **Server-first:** Compiles on server, not in browser
- **No build-time compilation:** Unlike `@mdx-js/react`, allows dynamic content
- **Flexible:** Easy to customize plugins and overrides
- **Mature:** Stable, well-tested library

### Why Remark + Rehype?

- **Composable:** Unix philosophy (small tools that do one thing)
- **Standard ecosystem:** Plugins for GFM, math, highlighting, etc.
- **AST-based:** Proper parsing, not fragile regex
- **Extensible:** Can add custom plugins easily

### Why KaTeX for Math?

- **Fast:** Server-side rendering (no JavaScript in browser)
- **Beautiful:** Excellent output quality
- **Lightweight:** Small bundle size
- **Standard:** Industry standard for academic math rendering

### Why highlight.js for Code?

- **Comprehensive:** Supports 200+ languages
- **Lightweight:** Smaller than Prism.js
- **CSS-based:** Easy to swap themes (we use github-dark)
- **CLI tool:** `highlight-cli` useful for preprocessing

### Why Tailwind CSS?

- **Utility-first:** Fast iteration (compose styles in class names)
- **Tree-shaking:** Unused styles removed (small final bundle)
- **Dark mode:** Built-in support (class-based)
- **CSS variables:** Can be customized per-theme
- **Version 4:** New `@theme` and `@plugin` syntax

---

## Rendering Pipeline Deep Dive

### ArticleML Conversion

```
Input: {slug}.articleml (frontmatter + body)
  ↓
1. gray-matter: parse YAML frontmatter + extract body
  ↓
2. State machine: segment body into typed blocks
   - markdown, callout, attention, math-note, table, placeholder
  ↓
3. Process each segment:
   - markdown: remark parse → AST → serialize back to MDX
   - table: pipe-split → GFM pipe syntax
   - math: \(...\) → $...$, \[...\] → $$...$$
   - placeholder: [!TYPE] → <Placeholder /> or <Component />
  ↓
4. Build frontmatter string (YAML → validated)
  ↓
5. Combine: frontmatter + body → single .mdx file
  ↓
Output: src/content/posts/{slug}/page.mdx
```

### Remark/Rehype Plugins (In Order)

1. **remark-parse:** Parse Markdown → AST
2. **remark-gfm:** Add GitHub Flavored Markdown support (tables, strikethrough)
3. **remark-math:** Identify math expressions (inline/display)
4. **rehype-katex:** Convert math expressions → KaTeX HTML
5. **rehype-highlight:** Apply syntax highlighting to code blocks

### MDXRemote Rendering

```typescript
<MDXRemote
  source={post.content}           // .mdx source string
  options={{ mdxOptions }}         // remark/rehype plugins
  components={allComponents}       // styled component overrides
/>
```

Result: Fully styled HTML with:
- Syntax highlighting
- KaTeX math
- Component interactivity
- Editorial typography
- Dark mode support

---

## Data Structure

### PostMeta Type

```typescript
interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  featured?: boolean;
  readingTime?: string;
  series?: string;
  seriesOrder?: number;
}
```

Extracted from `.mdx` frontmatter via `lib/posts.ts`.

### Component Loading

```typescript
export async function getPostComponents(slug: string) {
  const path = `../content/posts/${slug}/components.tsx`;
  const mod = await import(path);
  // Collect PascalCase named exports
  // Return Record<string, React.ComponentType>
}
```

---

## Performance Optimizations

### Static Site Generation (SSG)

- `generateStaticParams()` in `blog/[slug]/page.tsx` generates all post pages at build time
- Result: `.html` files on disk (no server rendering needed)
- Cost: Build time increases with post count (typically <1s per post)
- Benefit: Fast page loads, CDN-friendly, zero latency

### Code Splitting

- Each page is a separate bundle (Next.js automatic)
- Common dependencies (React, MDX runtime) shared across pages
- Client components (`"use client"`) are code-split separately

### CSS Optimization

- Tailwind CSS tree-shaking removes unused utilities
- CSS variables (no dynamic CSS generation)
- Dark mode uses class selector (no extra CSS)

### Image Optimization

- `next/image` component lazy-loads images
- Automatic srcset generation (responsive images)
- WebP for modern browsers

---

## Security Considerations

### XSS Prevention

- MDX is sandboxed (no arbitrary JavaScript execution)
- Component overrides prevent malicious HTML injection
- Character escaping in ArticleML (JSX-critical chars → HTML entities)

### Frontmatter Validation

- Required fields checked before processing
- YAML parsing via `gray-matter` (robust)
- No `eval()` or dynamic code execution

### File System Access

- Converter reads only input files, writes to designated output
- No access to parent directories (paths are resolved safely)
- Component loading uses `import()` with fixed module paths

---

## Trade-offs

### ArticleML vs. Markdown

**Pros:**
- Semantics (callouts, attention blocks are explicit)
- Consistency (no raw HTML)
- Developer ergonomics (clearer intent)

**Cons:**
- Not a standard (only this project uses it)
- Slightly longer to write (structured block syntax)
- Limited to defined block types

### Dynamic Imports vs. Static Registry

**Pros of dynamic imports:**
- No codegen step
- Simpler developer flow
- Post components are auto-discovered

**Cons:**
- Requires Turbopack (not guaranteed in all Next.js versions)
- Slightly more complex code path

**Fallback:** Static registry generation if dynamic imports fail.

### Server Components vs. Client Components

**Server Components (default):**
- Smaller client bundle
- Direct access to databases/APIs
- Automatic code-splitting

**Client Components (interactive components only):**
- Required for interactivity (useState, useEffect, etc.)
- Loaded on-demand
- Larger initial JS

---

## Future Improvements

### Possible Enhancements

1. **Component Library:** Pre-built interactive components (charts, timelines, etc.)
2. **Image Optimization in ArticleML:** Auto-generate responsive images
3. **Static Search:** Algolia or local full-text search
4. **Comments:** Giscus or Utterances integration
5. **Export Formats:** Generate PDF, EPUB from `.articleml`
6. **Versioning:** GitHub-backed post history
7. **Analytics:** Track page views, reading time distribution
8. **RSS Feed:** Automatic feed generation

### Performance Gains

- Image compression pipeline
- CSS-in-JS optimization (currently none needed with Tailwind)
- Service worker for offline reading
- Incremental Static Regeneration (ISR) for frequently-updated posts

---

## Debugging

### Convert Issues

```bash
node convert.mjs file.articleml 2>&1
```

Check output for:
- Frontmatter validation errors
- Invalid block syntax
- Component name issues

### Rendering Issues

1. Check generated `page.mdx` file
2. Verify component exports in `components.tsx` (must be PascalCase)
3. Check browser console for JSX parse errors
4. Verify CSS is loaded (KaTeX, hljs styles in layout.tsx)

### Type Errors

```bash
npx tsc --noEmit
```

Common issues:
- Component return type mismatch
- Missing React.ReactNode imports
- Props type misalignment

---

## Next Steps

- **[Getting Started](./GETTING_STARTED.md)** — Create your first post
- **[ArticleML Syntax](./ARTICLEML_SYNTAX.md)** — Detailed syntax guide
- **[Project Structure](./PROJECT_STRUCTURE.md)** — File organization
