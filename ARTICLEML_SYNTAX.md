# ArticleML Syntax Reference

ArticleML is a lightweight markup format for blog posts. It extends Markdown with semantic blocks for callouts, math notes, attention blocks, tables, and component placeholders.

## File Structure

```
---
frontmatter here
---

Body content here
```

---

## Frontmatter (YAML)

All articles begin with YAML frontmatter delimited by `---`.

### Required Fields

```yaml
title: "Article Title"
date: "YYYY-MM-DD"
description: "Brief summary (1-2 sentences)"
category: "Category Name"
tags: ["tag1", "tag2", "tag3"]
```

### Optional Fields

```yaml
slug: "custom-slug-override"           # Auto-inferred from title if omitted
series: "Series Name"                  # For multi-part articles
seriesOrder: 1                         # Position in series
featured: true                         # Highlight on homepage
readingTime: "8 min"                   # Estimated reading time
```

### Complete Example

```yaml
---
title: "How Transformers Really Work"
date: "2026-03-31"
description: "A deep dive into the self-attention mechanism and why it matters."
category: "AI Advances"
tags: ["transformers", "attention", "deep-learning"]
slug: "transformers-explained"
series: "Large Language Models"
seriesOrder: 2
featured: true
readingTime: "10 min"
---
```

---

## Body Content

The body supports Markdown plus ArticleML-specific blocks.

### Markdown (Standard)

All standard Markdown features work:

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold** *italic* ***bold italic***

`inline code`

[Link text](https://example.com)

- Bullet list
- Another item

1. Numbered list
2. Another item

> Blockquote
> Continued quote

---
```

### Math (Inline)

Inline math uses `\(` and `\)`:

```
The formula \(E = mc^2\) revolutionized physics.
```

Renders as: `$E = mc^2$` (processed by KaTeX)

### Math (Display)

Display math uses `\[` and `\]`:

```
\[
f(x) = \int_{-\infty}^{\infty} e^{-x^2/2} \, dx = \sqrt{2\pi}
\]
```

Renders as centered, line-broken equation.

### Callout Block

Highlight important insights or tips:

```
!CALLOUT title="Key Insight"
This is a callout with **markdown support**.

- Bullet points work
- So do [links](url)
!END-CALLOUT
```

**Styling:** Colored left border, muted background.

### Attention Block

Emphasize warnings or critical information:

```
!ATTENTION
LLMs do not store memory between requests. They recompute it.
!END-ATTENTION
```

**Styling:** Accent color, bold typography.

### Math Note

A container for equations and surrounding text:

```
!MATH-NOTE
The Fourier Transform:

$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} dx
$$

This decomposes a function into its frequency components.
!END-MATH-NOTE
```

**Styling:** Subtle background, suitable for equation-heavy sections.

### Tables

Pipe-delimited tables (GFM syntax):

```
|TABLE
| Header 1    | Header 2    | Header 3 |
|-------------|-------------|----------|
| Data 1      | Data 2      | Data 3   |
| Data 4      | Data 5      | Data 6   |
|END-TABLE
```

**Processing:**
1. Parsed as pipe-separated rows
2. Converted to GFM markdown: `| col | col |`
3. Styled via MDX component overrides
4. Supports alignment with `:---:` (center), `---:` (right)

**Example with alignment:**
```
|TABLE
| Left   | Center | Right |
|:-------|:------:|------:|
| L1     | C1     | R1    |
| L2     | C2     | R2    |
|END-TABLE
```

### Placeholder (Stub Content)

Use when content is planned but not yet written:

```
[!IMAGE] : {desc: "A diagram showing attention mechanism"}
```

**Types:** `IMAGE`, `VIDEO`, `SIMULATION`, `CODE`

Renders as a placeholder box with the description. Replace with actual content later.

### Component Placeholder

Directly emit a React component instead of a placeholder:

```
[!SIMULATION] : {desc: "Interactive attention visualizer", component: "AttentionFlow"}
```

This emits `<AttentionFlow />` directly.

**Convention:** Component name must match a named export in `src/content/posts/{slug}/components.tsx`.

---

## Block Summary

| Block | Syntax | Purpose |
|-------|--------|---------|
| Callout | `!CALLOUT title="..."` ... `!END-CALLOUT` | Highlight insights |
| Attention | `!ATTENTION` ... `!END-ATTENTION` | Emphasize critical info |
| Math Note | `!MATH-NOTE` ... `!END-MATH-NOTE` | Equation container |
| Table | `\|TABLE` ... `\|END-TABLE` | Data in rows/columns |
| Placeholder | `[!TYPE] : {desc: "..."}` | Stub for future content |
| Component | `[!TYPE] : {desc: "...", component: "Name"}` | Embed React component |

---

## Character Escaping

ArticleML handles escaping of JSX-critical characters automatically:

| Character | Escaped As | Context |
|-----------|-----------|---------|
| `{` | `&#123;` | In callout/attention titles |
| `}` | `&#125;` | In callout/attention titles |
| `<` | `&lt;` | In callout/attention titles |
| `>` | `&gt;` | In callout/attention titles |
| `"` | `\"` | In JSON-like attributes |
| `\` | `\\` | Literal backslash |

**Example:**
```
!CALLOUT title="Function: f(x) = {2x + 1}"
Content here.
!END-CALLOUT
```

The `{` and `}` in the title are automatically escaped to `&#123;` and `&#125;`.

---

## Conversion Pipeline

When you run `npm run convert -- file.articleml`:

1. **Parse frontmatter** via gray-matter (YAML extraction)
2. **Validate frontmatter** (check required fields)
3. **Segment body** via state machine (identify blocks)
4. **Process segments:**
   - Markdown → remark AST → MDX serialization
   - Tables → GFM pipe syntax
   - Math → preprocess `\(...\)` and `\[...\]`
   - Placeholders → transform to components or stubs
5. **Combine** frontmatter + body → `page.mdx`
6. **Write output** to `src/content/posts/{slug}/page.mdx`

**Auto-slug inference:**
1. `--slug` flag (if provided)
2. `slug:` field in frontmatter
3. `title:` field (converted to kebab-case)
4. Filename (fallback)

---

## Complete Example

```yaml
---
title: "The Hidden Cost of Attention"
date: "2026-03-31"
description: "Why attention mechanism complexity matters for LLM inference."
category: "AI Advances"
tags: ["transformers", "scaling", "inference"]
series: "LLM Internals"
seriesOrder: 3
featured: true
readingTime: "12 min"
---

Every new token forces the model to recompute attention over all previous tokens.

## The Quadratic Scaling Problem

At each generation step:

\[
\text{Complexity} = O(n^2 \cdot d)
\]

where \( n \) is sequence length and \( d \) is embedding dimension.

!ATTENTION
Quadratic complexity in sequence length is a fundamental bottleneck in inference.
!END-ATTENTION

## Why This Matters

!CALLOUT title="Real-world Impact"
For a 10K token context window, attention computation dominates inference latency.
The cost grows super-linearly with context size.
!END-CALLOUT

### Visualizing the Growth

|TABLE
| Context Length | Attention Ops | Memory (GB) |
|---|---|---|
| 1K  | 1M    | 0.02  |
| 4K  | 16M   | 0.3   |
| 16K | 256M  | 4.8   |
| 64K | 4.1B  | 76.8  |
|END-TABLE

## Solutions

The field has explored:

- KV-cache quantization
- Sparse attention patterns
- Hierarchical attention

!MATH-NOTE
Scaled dot-product attention:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V
$$

Each operation is O(n²) in sequence length.
!END-MATH-NOTE

## Interactive Demo

[!SIMULATION] : {desc: "Visualize how attention complexity scales with context length", component: "AttentionComplexityDemo"}

This would reference a component in `components.tsx`.

## Conclusion

Understanding attention's computational cost is key to building efficient LLMs.

> "We must optimize what we measure." — Profile before optimizing.
```

---

## Escaping Special Characters

If you need literal `!CALLOUT` or `[!IMAGE]` in your content, use escaping:

```
Use the \!CALLOUT syntax to reference the block type.

Reference \[!IMAGE] placeholders.
```

The converter will output them as literal text.

---

## Tips & Tricks

### Math with Code

Combine inline code and math:

```
The function \(f(x) = x^2\) computes `Math.pow(x, 2)` in JavaScript.
```

### Links in Callouts

```
!CALLOUT title="Further Reading"
Check out [this paper](https://arxiv.org/abs/2109.10685) for details.
!END-CALLOUT
```

### Nested Lists in Markdown

```
- Item 1
  - Nested item 1a
  - Nested item 1b
- Item 2
  1. Numbered sub-item
  2. Another numbered
```

### Long Tables

Tables support multiple rows without issue. Keep cells concise.

```
|TABLE
| Algorithm | Time    | Space | Notes        |
|-----------|---------|-------|--------------|
| Attention | O(n²d)  | O(nd) | Quadratic    |
| Linear    | O(nd)   | O(nd) | Approximate  |
|END-TABLE
```

---

## Limitations

- No nested block structures (can't put a callout inside another block)
- Math mode escaping: use `\\(` for literal `\(` in text
- Component names must be valid JSX identifiers (alphanumeric + underscore)
- Frontmatter must be valid YAML (strings with special chars need quotes)

---

## Next Steps

- **[Getting Started](./GETTING_STARTED.md)** — Workflow guide
- **[Project Structure](./PROJECT_STRUCTURE.md)** — Codebase overview
- **[Architecture](./ARCHITECTURE.md)** — Implementation details
