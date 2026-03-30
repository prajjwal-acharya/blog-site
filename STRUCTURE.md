# Blog Site — Structure & Reference

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-based config via `@theme` in `globals.css`) |
| Theme | next-themes (dark / light / system) |
| Content | MDX via next-mdx-remote + gray-matter |
| Math | KaTeX via rehype-katex + remark-math |
| Syntax | rehype-highlight |
| Animations | CSS Intersection Observer (no Framer dep on hot path) |

---

## Folder Structure

```
blog-site/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout — ThemeProvider, Navbar, Footer, GrainOverlay
│   │   ├── globals.css               # Tailwind v4 @theme tokens + global styles
│   │   ├── page.tsx                  # Home page (Hero + FeaturedGrid + ArticleList + Quote)
│   │   ├── not-found.tsx             # 404 page
│   │   ├── about/page.tsx            # About + subscribe section
│   │   ├── archive/page.tsx          # Full archive with year-filter scrubber (server → client)
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog listing with search + category filter
│   │   │   └── [slug]/page.tsx       # Individual post: TOC | article body | concept cards
│   │   └── timeline/page.tsx         # AI milestone timeline (1950 → present)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Glassmorphism fixed navbar; active route, dark toggle, mobile menu
│   │   │   ├── Footer.tsx            # Site links, social links, status dot
│   │   │   ├── GrainOverlay.tsx      # Fixed 3.5% noise texture (pointer-events: none)
│   │   │   └── ReadingProgress.tsx   # Thin progress bar tracking scroll % (client)
│   │   │
│   │   ├── ui/                       # Atomic, zero-coupling primitives
│   │   │   ├── Button.tsx            # primary / secondary / ghost variants; supports href
│   │   │   ├── Tag.tsx               # Category chip; outlined or filled
│   │   │   ├── GlassCard.tsx         # Backdrop-blur glass container
│   │   │   ├── EditorialAccent.tsx   # 4px left-border pillar for featured content
│   │   │   └── ScrollReveal.tsx      # Intersection Observer fade-up wrapper (client)
│   │   │
│   │   ├── home/
│   │   │   ├── Hero.tsx              # Asymmetric headline + neural-network SVG banner
│   │   │   ├── FeaturedGrid.tsx      # Bento grid: 1 large card + 2 side cards + CTA
│   │   │   ├── ArticleListItem.tsx   # Glass-card row used on home and /blog
│   │   │   └── QuoteCallout.tsx      # Centered large editorial quote
│   │   │
│   │   ├── blog/
│   │   │   ├── ArticleHeader.tsx     # Centered post title, description, meta bar
│   │   │   ├── TableOfContents.tsx   # Sticky TOC; reads h2/h3 from DOM; active tracking (client)
│   │   │   ├── ConceptCard.tsx       # Sidebar glass card with icon + short explanation
│   │   │   ├── RelatedPosts.tsx      # 3-col grid of same-category posts
│   │   │   ├── SearchBar.tsx         # Controlled search input (client)
│   │   │   └── BlogClientContent.tsx # Search + category filter shell for /blog (client)
│   │   │
│   │   ├── timeline/
│   │   │   └── TimelineItem.tsx      # Single alternating timeline event card
│   │   │
│   │   ├── archive/
│   │   │   ├── ArchiveGrid.tsx       # Swiss-grid: featured 8-col + standard 4-col cards
│   │   │   └── ArchiveClientPage.tsx # Year-filter + floating scrubber bar (client)
│   │   │
│   │   └── about/
│   │       └── SubscribeForm.tsx     # Email subscribe form with local submitted state (client)
│   │
│   ├── lib/                          # Pure utilities — no UI, no React
│   │   ├── types.ts                  # Shared types: PostMeta, Post, TimelineEvent, ConceptCard
│   │   ├── posts.ts                  # FS helpers: getAllPosts, getPostBySlug, getFeaturedPosts, etc.
│   │   └── seo.ts                    # Metadata generators: baseMeta, postMeta(), blogPostJsonLd()
│   │
│   └── content/
│       └── posts/                    # MDX blog posts (add new ones here)
│           ├── attention-is-all-you-need.mdx
│           ├── backprop-from-scratch.mdx
│           ├── building-a-rag-pipeline.mdx
│           ├── a-star-algorithm.mdx
│           └── gpt4o-analysis.mdx
│
├── public/                           # Static assets (images, og-default.png, rss.xml, etc.)
├── package.json
└── STRUCTURE.md                      # This file
```

---

## Pages at a Glance

| Route | Type | What it does |
|-------|------|-------------|
| `/` | Server | Hero banner, featured bento grid (3 posts), latest posts list, editorial quote |
| `/blog` | Server + Client | Full post list with live search and category filter |
| `/blog/[slug]` | SSG | Article view: sticky TOC left, MDX body center, concept cards right, related posts below |
| `/timeline` | Server | Alternating left/right AI milestone cards (1950 → present) with central axis |
| `/archive` | Server + Client | Swiss-grid of all posts; floating year-scrubber bar filters by publication year |
| `/about` | Server | Intro, content categories, subscribe form |
| `/_not-found` | Server | 404 page |

---

## Adding Content

### New blog post
Create `src/content/posts/your-slug.mdx` with this front-matter:

```mdx
---
title: "Your Post Title"
date: "2025-04-01"
description: "One sentence summary shown in cards and meta tags."
category: "AI Advances"        # AI Advances | Math & ML | Algorithms | Builds
tags: ["tag1", "tag2"]
featured: true                 # shows in homepage bento grid
---

Your MDX content here. Supports $inline math$ and $$display math$$.

<Callout title="Key Insight">
Custom callout box with left accent border.
</Callout>
```

The post is automatically picked up by `getAllPosts()` — no registration needed.

### Available MDX components

| Component | Usage |
|-----------|-------|
| `<Callout title="...">` | Highlighted callout box with optional title |
| `<MathNote>` | Inline highlight for math expressions |
| Standard markdown | headings, blockquotes, code fences, tables |

---

## Design System Quick Reference

### Color tokens (defined in `globals.css` `@theme`)

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--color-surface` | `#FAF9F4` | `#0D150F` | Page background |
| `--color-on-surface` | `#1B1C19` | `#DBE5D9` | Body text |
| `--color-primary` | `#994121` | `#E9C349` | Accent / links |
| `--color-secondary` | `#615E54` | `#C7C7C2` | Muted text |
| `--color-surface-container-low` | `#F5F4EF` | `#151E16` | Section backgrounds |
| `--color-outline-variant` | `#DCC1B8` | `#444843` | Subtle borders |

### Typography

| Font | Variable | Used for |
|------|----------|---------|
| Newsreader | `font-headline` | All headings, display text, article titles |
| Inter | `font-body` / `font-label` | Body copy, UI labels, metadata |
| Manrope | `font-manrope` | Available as alt sans (archive mode) |

### Key CSS classes

| Class | What it does |
|-------|-------------|
| `.grain-overlay` | Fixed noise texture, pointer-events none |
| `.glass-card` | `backdrop-blur(20px)` + semi-transparent bg |
| `.editorial-accent` | 4px left border in `--color-primary` |
| `.eyebrow` | Uppercase label style (small, tracked, primary color) |
| `.drop-cap` | Large decorative first letter on article paragraphs |
| `.reveal` / `.reveal.visible` | Fade-up animation driven by `ScrollReveal.tsx` |
| `.prose-editorial` | Tailwind Typography overrides for article body |

### Component coupling rules
- **`src/lib/`** — no React, no UI. Pure functions only.
- **`src/components/ui/`** — no data fetching, no route awareness. Props only.
- **Server pages** fetch data via `src/lib/posts.ts` and pass serializable props to client components.
- **Client components** (`"use client"`) handle interactivity: search, filter, theme toggle, scroll tracking.

---

## SEO Setup

- `src/lib/seo.ts` exports `baseMeta` (site-wide), `postMeta(post)` (per-article), `blogPostJsonLd(post)` (structured data)
- Set `NEXT_PUBLIC_SITE_URL` in `.env.local` for canonical URLs and OpenGraph
- JSON-LD injected in `layout.tsx` (site-level) and `blog/[slug]/page.tsx` (article-level)

---

## Commands

```bash
npm run dev      # development server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```
