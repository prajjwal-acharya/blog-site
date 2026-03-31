# Prajjwal's Blog

A Next.js + MDX blog platform for publishing deep dives into AI, mathematics, and elegant algorithms. Features a custom **ArticleML** format for streamlined content creation, automatic component discovery, and polished rendering of math, code, and interactive visualizations.

## Quick Links

- **[Getting Started](./GETTING_STARTED.md)** — Create your first blog post in 5 minutes
- **[ArticleML Syntax](./ARTICLEML_SYNTAX.md)** — Complete reference for the `.articleml` format
- **[Project Structure](./PROJECT_STRUCTURE.md)** — Codebase layout and file organization
- **[Architecture](./ARCHITECTURE.md)** — Design decisions and technical deep dives

## Key Features

✨ **ArticleML Format** — Write in a clean, semantic markdown-like syntax
🎨 **Auto-Discovery** — Post components are loaded automatically (no hardcoded imports)
📐 **Math & Science** — Native KaTeX support for inline and display equations
💻 **Syntax Highlighting** — highlight.js for beautiful code blocks
📊 **GFM Tables** — GitHub-flavored markdown tables with styled rendering
🔄 **Series Support** — Organize related posts into collections
⚡ **Interactive Components** — Drop React components into posts effortlessly
🌙 **Dark Mode** — Full theme support with CSS variables

## Stack

- **Framework:** Next.js 16 (React 19, Turbopack)
- **Content:** MDX via `next-mdx-remote` (server components)
- **Styling:** Tailwind CSS 4 + CSS variables
- **Parsing:** `remark` + `remark-gfm` + `remark-math` → rehype plugins
- **Math:** KaTeX + rehype-katex
- **Highlighting:** highlight.js + rehype-highlight
- **Animation:** Framer Motion

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Creating a Blog Post

### Option 1: Scaffold (Recommended)

```bash
npm run new-post -- "My Article Title" --category "AI Advances"
```

This creates:
- `src/content/posts/my-article-title/` — post directory
- `my-article-title.articleml` — editable source file
- `src/content/posts/my-article-title/components.tsx` — optional component stub

### Option 2: Manual Setup

1. Create a `.articleml` file at the root
2. Write content using [ArticleML syntax](./ARTICLEML_SYNTAX.md)
3. Run: `npm run convert -- my-post.articleml`
4. Add interactive components to `src/content/posts/{slug}/components.tsx` (optional)

## Publishing Workflow

```
1. npm run new-post -- "Title"          # Scaffold new post
2. Edit {slug}.articleml                # Write content
3. npm run convert -- {slug}.articleml   # Generate MDX
4. (Optional) Add components.tsx         # Interactive elements
5. npm run dev                          # Preview at /blog/{slug}
6. npm run build                        # Production build
```

See [Getting Started](./GETTING_STARTED.md) for step-by-step guide with examples.

## Rendering Pipeline

```
ArticleML → convert.mjs → page.mdx → remark/rehype pipeline → MDXRemote → HTML
```

**Key transformations:**
- State machine segments body into markdown, tables, callouts, attention blocks, math notes
- Tables → GFM pipe syntax (so MDX component overrides apply consistent styling)
- Inline math `\(...\)` → `$...$`, display math `\[...\]` → `$$...$$`
- Placeholders with `component:` field → direct component emission
- Escaped JSX chars in titles: `{`, `}`, `<`, `>` → HTML entities

## Customization

### Adding Global Styles

Edit `src/app/globals.css` — contains design tokens, Tailwind overrides, and theme variables.

### MDX Component Overrides

Styled components for HTML elements (headings, tables, code blocks, etc.) live in `src/app/blog/[slug]/page.tsx` (lines 45–246).

### Post-Specific Components

Create `src/content/posts/{slug}/components.tsx` with named exports:

```tsx
"use client";
export function MyChart() { return <div>...</div>; }
export function MyVisualization() { return <div>...</div>; }
```

Each named export becomes an MDX tag: `<MyChart />`, `<MyVisualization />`.

## File Structure

```
.
├── README.md                          # This file
├── GETTING_STARTED.md                 # Quick start guide
├── ARTICLEML_SYNTAX.md                # ArticleML reference
├── PROJECT_STRUCTURE.md               # Codebase layout
├── ARCHITECTURE.md                    # Technical decisions
├── BLOG-LIFECYCLE-PLAN.md            # Implementation roadmap
├── convert.mjs                        # ArticleML → MDX converter
├── scripts/
│   └── new-post.mjs                  # Blog post scaffolder
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (KaTeX/hljs CSS)
│   │   ├── globals.css               # Design tokens & base styles
│   │   ├── page.tsx                  # Home page
│   │   ├── blog/[slug]/page.tsx      # Blog post renderer
│   │   └── ...
│   ├── components/
│   │   ├── blog/                     # Blog-specific components
│   │   ├── home/                     # Homepage sections
│   │   ├── layout/                   # Navbar, Footer, etc.
│   │   └── ui/                       # Reusable UI components
│   ├── content/
│   │   └── posts/
│   │       ├── memory-llm-1/         # Published post
│   │       │   ├── page.mdx          # Generated MDX
│   │       │   └── components.tsx    # Interactive components
│   │       └── google-turboquant/
│   └── lib/
│       ├── posts.ts                  # Post metadata parsing
│       ├── load-post-components.ts   # Component auto-discovery
│       └── ...
└── package.json
```

## Contributing

Contributions welcome! See [Getting Started](./GETTING_STARTED.md) for development workflow.

---

**Built with ♦ by [Prajjwal Acharya](https://prajjwal.me)**
