# Project Structure

Overview of the codebase architecture and file organization.

## Directory Layout

```
blog-site/
├── README.md                           # Main overview
├── GETTING_STARTED.md                  # Quickstart & workflow
├── ARTICLEML_SYNTAX.md                 # ArticleML reference
├── PROJECT_STRUCTURE.md                # This file
├── ARCHITECTURE.md                     # Technical design
├── BLOG-LIFECYCLE-PLAN.md             # Implementation roadmap
│
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript config
├── tailwind.config.js                  # Tailwind CSS config
├── next.config.js                      # Next.js config
│
├── convert.mjs                         # ArticleML → MDX converter
├── scripts/
│   └── new-post.mjs                   # Post scaffolding script
│
├── src/
│   ├── app/                           # App directory (Next.js)
│   │   ├── layout.tsx                 # Root layout, theme provider, KaTeX/hljs CSS
│   │   ├── globals.css                # Design tokens, base styles, animations
│   │   │
│   │   ├── page.tsx                   # Homepage (/)
│   │   ├── archive/
│   │   │   └── page.tsx              # All posts archive
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Blog post renderer (MDXRemote)
│   │   ├── series/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Series page
│   │   ├── timeline/
│   │   │   └── page.tsx              # Post timeline view
│   │   ├── about/
│   │   │   └── page.tsx              # About page
│   │   └── ...other routes
│   │
│   ├── components/                    # React components
│   │   ├── blog/                      # Blog-specific components
│   │   │   ├── ArticleHeader.tsx     # Post title, meta, date
│   │   │   ├── TableOfContents.tsx   # Auto-generated TOC
│   │   │   ├── ConceptCard.tsx       # Inline concept boxes
│   │   │   ├── Placeholder.tsx       # Stub content placeholder
│   │   │   ├── RelatedPosts.tsx      # Post suggestions
│   │   │   ├── RecomputationSim.tsx  # Interactive component (example)
│   │   │   ├── AttentionFlow.tsx     # Interactive component (example)
│   │   │   └── MemoryLayersDiagram.tsx  # Interactive component (example)
│   │   │
│   │   ├── home/                     # Homepage sections
│   │   │   ├── Hero.tsx              # Hero section + canvas animation
│   │   │   ├── HeroCanvas.tsx        # Canvas rendering (client)
│   │   │   └── FeaturedGrid.tsx      # Featured posts grid
│   │   │
│   │   ├── layout/                   # Persistent layout components
│   │   │   ├── Navbar.tsx            # Top navigation
│   │   │   ├── Footer.tsx            # Footer
│   │   │   ├── GrainOverlay.tsx      # Texture overlay
│   │   │   └── ReadingProgress.tsx   # Scroll progress bar
│   │   │
│   │   └── ui/                       # Reusable UI primitives
│   │       ├── Tag.tsx               # Category/tag badge
│   │       ├── ScrollReveal.tsx      # Scroll animation
│   │       └── EditorialAccent.tsx   # Accent box
│   │
│   ├── content/                       # Static content (posts)
│   │   └── posts/
│   │       ├── memory-llm-1/         # Published post
│   │       │   ├── page.mdx          # Generated MDX file
│   │       │   └── components.tsx    # Post-specific components
│   │       ├── google-turboquant/
│   │       │   ├── page.mdx
│   │       │   └── components.tsx    # (Optional)
│   │       └── ...more posts
│   │
│   └── lib/                           # Utilities & logic
│       ├── posts.ts                  # Post loading & metadata extraction
│       ├── load-post-components.ts   # Auto-discovery of post components
│       ├── seo.ts                    # SEO metadata builders
│       ├── types.ts                  # TypeScript type definitions
│       └── ...utilities
│
└── public/                            # Static assets
    └── (favicon, etc.)
```

---

## Key Files

### Root Level

| File | Purpose |
|------|---------|
| `convert.mjs` | CLI tool: ArticleML → MDX conversion |
| `scripts/new-post.mjs` | CLI tool: Scaffold new blog posts |
| `package.json` | Node.js dependencies, npm scripts |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind CSS theme & plugins |
| `next.config.js` | Next.js build & runtime config |

### App Directory (`src/app/`)

**Layout:**
- `layout.tsx` — Root layout; wraps all pages with Navbar, Footer, theme provider, and global CSS links (KaTeX, highlight.js)
- `globals.css` — Design tokens (colors, fonts, spacing), Tailwind overrides, animations, dark mode

**Pages:**
- `page.tsx` — Homepage with Hero section, Featured Grid, post stats
- `blog/[slug]/page.tsx` — Individual blog post renderer; uses MDXRemote with styled component overrides
- `archive/page.tsx` — All posts listed chronologically
- `series/[slug]/page.tsx` — Posts grouped by series
- `timeline/page.tsx` — Visual timeline of posts
- `about/page.tsx` — About page

### Components (`src/components/`)

**blog/** — Blog-specific components
- `ArticleHeader.tsx` — Post title, author, date, reading time
- `TableOfContents.tsx` — Auto-generated sidebar TOC (from MDX headings)
- `ConceptCard.tsx` — Concept boxes on right sidebar
- `Placeholder.tsx` — Gray box for stub content (awaiting implementation)
- `RelatedPosts.tsx` — Suggested next posts
- `RecomputationSim.tsx`, `AttentionFlow.tsx`, `MemoryLayersDiagram.tsx` — Example interactive components

**home/** — Homepage sections
- `Hero.tsx` — Hero text + announcement
- `HeroCanvas.tsx` — Animated background canvas ("use client")
- `FeaturedGrid.tsx` — Asymmetric grid of featured posts

**layout/** — Persistent UI
- `Navbar.tsx` — Fixed top navigation with theme toggle ("use client")
- `Footer.tsx` — Bottom footer with links
- `GrainOverlay.tsx` — Fixed texture overlay (decorative)
- `ReadingProgress.tsx` — Scroll progress bar (bottom-left)

**ui/** — Reusable primitives
- `Tag.tsx` — Category/tag badge
- `ScrollReveal.tsx` — Fade-in animation on scroll
- `EditorialAccent.tsx` — Styled accent box

### Content & Library

**`src/content/posts/`**
- Each post lives in `{slug}/` folder
- `page.mdx` — Generated MDX file (from `.articleml` via converter)
- `components.tsx` — Optional; post-specific React components

**`src/lib/`**
- `posts.ts` — Parses post metadata from MDX frontmatter; builds post lists
- `load-post-components.ts` — Dynamic import of `components.tsx` for auto-discovery
- `seo.ts` — Builds metadata objects (title, description, JSON-LD)
- `types.ts` — TypeScript interfaces (PostMeta, ConceptCard, etc.)

---

## Data Flow

### Post Publishing Flow

```
{slug}.articleml (source)
    ↓
npm run convert -- {slug}.articleml
    ↓
convert.mjs (ArticleML parser → MDX generator)
    ↓
src/content/posts/{slug}/page.mdx (generated)
    ↓
src/lib/posts.ts (reads frontmatter)
    ↓
PostMeta objects (available to pages/components)
```

### Page Rendering Flow

```
User visits /blog/memory-llm-1
    ↓
Next.js: blog/[slug]/page.tsx (ArticlePage)
    ↓
getPostBySlug("memory-llm-1") → PostMeta + MDX source
    ↓
getPostComponents("memory-llm-1") → auto-loads components.tsx
    ↓
MDXRemote renders page.mdx with styled component overrides
    ↓
HTML sent to browser
```

---

## Component Discovery

When rendering a blog post:

1. `ArticlePage` component calls `getPostComponents(slug)`
2. `load-post-components.ts` checks: does `src/content/posts/{slug}/components.tsx` exist?
3. If yes: dynamically `import()` it (resolves at build time via Turbopack)
4. Collects all named PascalCase exports
5. Merges with default MDX component overrides (headings, tables, code, etc.)
6. Passes merged set to `<MDXRemote components={allComponents} />`

**Result:** Post components are referenced directly in MDX (e.g., `<MyChart />`) with no manual imports.

---

## Styling Hierarchy

1. **CSS Variables** (`globals.css`) — Design tokens (colors, fonts, spacing)
2. **Tailwind Base** — Utility classes (`py-6`, `bg-blue-500`, etc.)
3. **MDX Component Overrides** (`page.tsx` lines 45–246) — Styled HTML elements for posts
4. **Prose Classes** (`.prose-editorial`) — Editorial-specific typography
5. **Dark Mode** (`.dark` selector in globals.css) — Theme overrides

All color/spacing decisions use CSS variables, so dark mode themes apply automatically.

---

## Build & Deployment

### Development

```bash
npm run dev
```

Starts Turbopack dev server on `localhost:3000`.

### Production Build

```bash
npm run build
```

Generates:
1. TypeScript type checking
2. Static site generation (SSG) for all routes
3. Optimized bundles
4. Outputs to `.next/`

```bash
npm start
```

Runs production server using pre-built assets.

---

## Environment & Config

- **TypeScript:** Strict mode, React 19 with JSX runtime
- **Tailwind CSS 4:** New syntax (`@theme`, `@plugin`), dark mode support
- **Next.js 16:** App Router, React Server Components, Turbopack
- **MDX:** `next-mdx-remote` v6 with server component support

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ArticleHeader.tsx`, `MyChart.tsx` |
| Functions/utilities | camelCase | `getPostBySlug()`, `escapeForJSX()` |
| CSS Classes | kebab-case | `prose-editorial`, `glass-card` |
| Types | PascalCase | `PostMeta`, `ConceptCard` |
| Files | kebab-case or PascalCase (components) | `article-header.tsx`, `ArticleHeader.tsx` |

---

## Next Steps

- **[Getting Started](./GETTING_STARTED.md)** — How to create posts
- **[ArticleML Syntax](./ARTICLEML_SYNTAX.md)** — Writing syntax reference
- **[Architecture](./ARCHITECTURE.md)** — Technical design decisions
