# ArticleML Guide — Simplified Markup for Blog Articles

ArticleML is a lightweight markup format for writing blog articles that get converted to MDX. It focuses on **text-based content** and uses placeholders for rich media content that you can fill in manually.

## Quick Syntax Reference

### Front Matter

Every article starts with YAML front matter between `---` markers:

```yaml
---
title: "Your Article Title"
date: "2026-03-30"
description: "Brief summary of the article"
category: "Category Name"
tags: ["tag1", "tag2", "tag3"]
featured: true
readingTime: "5 min"
series: "Series Name"
seriesOrder: 1
---
```

**Required fields:** title, date, description, category, tags
**Optional fields:** featured, readingTime, series, seriesOrder

**Series Fields:**
- `series` — Name of the series this article belongs to (optional)
- `seriesOrder` — Position in the series (1, 2, 3, etc.) — required if `series` is specified

---

## Series — Organizing Articles into Collections

### What are Series?

Series allow you to group related articles together, creating a structured learning path. Each series automatically generates:
- **Series Index Page** — Shows all available series with previews
- **Series Detail Page** — Displays a flowchart visualization of articles in order
- **Navigation** — Links between articles within a series

### Assigning Articles to a Series

To add an article to a series, add two fields to the front matter:

```yaml
---
title: "Article 1: Fundamentals"
series: "Machine Learning Basics"
seriesOrder: 1
---
```

```yaml
---
title: "Article 2: Deep Learning"
series: "Machine Learning Basics"
seriesOrder: 2
---
```

### How Series Work

1. **Auto-Detection** — When you parse articles with `series` fields, the system automatically:
   - Groups articles by series name
   - Sorts them by `seriesOrder`
   - Generates series index pages
   - Creates navigation flowcharts

2. **Access Series**
   - Browse all series at `/series`
   - View a specific series at `/series/series-name-slug`
   - Navigate between articles in a series using the flowchart

3. **Series Naming**
   - Series names are converted to URL-safe slugs automatically
   - Example: "Machine Learning Basics" → `/series/machine-learning-basics`

### Example: Multi-Article Series

**Article 1:**
```yaml
---
title: "Understanding Neural Networks"
series: "Deep Learning Foundations"
seriesOrder: 1
readingTime: "10 min"
---
```

**Article 2:**
```yaml
---
title: "Backpropagation Explained"
series: "Deep Learning Foundations"
seriesOrder: 2
readingTime: "12 min"
---
```

**Article 3:**
```yaml
---
title: "Training Your First Model"
series: "Deep Learning Foundations"
seriesOrder: 3
readingTime: "15 min"
---
```

After parsing these articles, they'll be grouped into a single series with:
- A series index page showing the 3-article collection
- An interactive flowchart at `/series/deep-learning-foundations`
- Automatic reading time calculation (37 min total)
- Navigation links between articles

---

## Text-Based Markup

### Headings
```markdown
## Heading Level 2
### Heading Level 3
#### Heading Level 4
```

### Bold & Italic
```markdown
**bold text** or ***bold italic***
*italic text*
```

### Lists
```markdown
* Bullet point 1
* Bullet point 2
  * Nested bullet

1. Numbered item 1
2. Numbered item 2
```

### Callout Box
Highlighted box for important information:

```
!CALLOUT title="Box Title"
Your content here with **formatting** supported.
* Bullet points work
* Multiple lines too
!END-CALLOUT
```

**Example:**
```
!CALLOUT title="Key Insight"
This is an important point that deserves emphasis.
* It can contain multiple lines
* And bullet points
!END-CALLOUT
```

### Editorial Accent
For emphasized/attention-grabbing content:

```
!ATTENTION
Your content here with **formatting** supported.
!END-ATTENTION
```

### Math Equations
Use LaTeX/KaTeX syntax for mathematics:

```
!MATH-NOTE
Display math (block):
$$ E = mc^2 $$

Inline math would be: $x = 5$
!END-MATH-NOTE
```

### Tables
Tables with pipe-delimited columns:

```
|TABLE
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
|END-TABLE
```

**Requirements:**
- Second row must be separators (dashes)
- All rows must have same number of columns

---

## Placeholders for Rich Content

For images, videos, code examples, and interactive simulations, use placeholders with this syntax:

```
[!TYPE] : {desc: "Description of the content"}
```

### Placeholder Types

#### 1. Images
```
[!IMAGE] : {desc: "A description of what the image shows"}
```

**When to use:** For diagrams, charts, visualizations, screenshots, etc.

#### 2. Videos
```
[!VIDEO] : {desc: "What the video demonstrates or teaches"}
```

**When to use:** For embedded videos, tutorials, demonstrations

#### 3. Code Examples
```
[!CODE] : {desc: "What this code example does and its purpose"}
```

**When to use:** For Python, JavaScript, Go, Rust, or other code examples

#### 4. Simulations
```
[!SIMULATION] : {desc: "What the interactive simulation does"}
```

**When to use:** For interactive visualizations, Bokeh plots, animations

---

## Example Article

```markdown
---
title: "Understanding Quantization"
date: "2026-03-25"
description: "A deep dive into neural network quantization techniques"
category: "Machine Learning"
tags: ["ml", "optimization", "quantization"]
featured: true
readingTime: "7 min"
---

Quantization is a key technique for optimizing neural networks.

!CALLOUT title="What is Quantization?"
Quantization reduces the precision of model weights and activations,
typically from 32-bit floats to 8-bit integers or lower.
!END-CALLOUT

## The Basics

Neural networks normally use 32-bit floating-point numbers. Quantization
converts these to lower-precision formats like:

* 8-bit integers (INT8)
* 4-bit integers (INT4)
* Binary values (1-bit)

## Visual Explanation

[!IMAGE] : {desc: "Diagram showing 32-bit float vs 8-bit quantized values"}

## Python Implementation

Here's how to implement quantization:

[!CODE] : {desc: "PyTorch example of post-training quantization"}

## Results

Our tests show significant improvements:

|TABLE
| Metric | Baseline | Quantized |
|--------|----------|-----------|
| Model Size | 100 MB | 25 MB |
| Latency | 50 ms | 12 ms |
| Accuracy | 92.5% | 92.3% |
|END-TABLE

## Interactive Demo

[!SIMULATION] : {desc: "Interactive tool to experiment with different quantization levels"}

!ATTENTION
Note: Quantization reduces accuracy slightly, but the speed gains
often make this trade-off worthwhile for production deployments.
!END-ATTENTION

## Conclusion

Quantization is essential for efficient ML deployment.
```

---

## Workflow

### 1. Write Your Article
Create a `.articleml` file with your content using the syntax above.

```bash
vim my-article.articleml
```

### 2. Parse to MDX
Convert the ArticleML file to MDX:

```bash
node convert.js my-article.articleml
```

This creates `src/content/posts/my-article.mdx` with:
- ✅ Parsed markdown
- ✅ Callouts, tables, math equations rendered
- ✅ Placeholder components for images, code, videos, simulations

### 3. Fill in Placeholders (Optional)
Open the generated `.mdx` file and replace placeholder components:

**Before:**
```tsx
<Placeholder type="image" title="Image" description="My diagram" />
```

**After:**
```tsx
<Image src="/images/my-diagram.png" alt="My diagram" width={800} height={600} />
```

Or for code, you could add a code block, etc.

### 4. Build & Deploy
```bash
npm run build
npm run dev
```

---

## Supported Markdown

Inside text content, you can use standard markdown:

- **Bold:** `**text**`
- *Italic:* `*text*`
- `Inline code`: `` `code` ``
- [Links:](https://example.com) `[text](url)`
- Strikethrough: `~~text~~`
- Blockquotes: `> quote`

---

## Tips

1. **Keep it simple** — ArticleML is meant for text-based content
2. **Use placeholders for complexity** — Rich media gets filled in manually
3. **Test locally** — Run `npm run dev` to see how it renders
4. **Consistent formatting** — Use the provided syntax consistently
5. **Descriptions matter** — Placeholder descriptions help you remember what to add later

---

## Common Issues

### "Invalid front matter"
- ✅ Ensure the article starts with `---`
- ✅ Ensure all required fields (title, date, description, category, tags) are present
- ✅ Ensure front matter ends with `---` on its own line

### Table not parsing
- ✅ Second row must be separators: `|------|------|`
- ✅ All rows must have the same number of columns
- ✅ No extra pipes at the beginning or end of rows

### Math not rendering
- ✅ Use `$$ ... $$` for display math (should be on separate lines)
- ✅ Use `$ ... $` for inline math
- ✅ Escape special characters if needed

### Callout or attention block not working
- ✅ Content must be between `!CALLOUT title="..."` and `!END-CALLOUT`
- ✅ There should be a blank line before `!END-CALLOUT`

---

## Examples in Your Project

See `google-turboquant.articleml` for a complete example using all features.

Convert it:
```bash
node convert.js google-turboquant.articleml
```

View the output:
```
cat src/content/posts/google-turboquant.mdx
```

---

Happy writing! 📝
