# ArticleML — Simple Content Format for Blog Articles

ArticleML is a lightweight markup format for writing blog posts. It combines the simplicity of markdown with structured templates for common content patterns.

**Key Feature:** Write in ArticleML, parse to MDX, manually fill in rich media placeholders.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **`ARTICLEML_GUIDE.md`** | Complete syntax reference and examples |
| **`PLACEHOLDER_EXAMPLES.md`** | How to use and replace placeholders in MDX |
| **`PARSING_SIMPLIFICATION_COMPLETE.md`** | Overview of the simplified parser |
| **`SIMPLIFICATION_SUMMARY.md`** | Technical details of what changed |

---

## 🚀 Quick Start

### 1. Write Article
Create `my-article.articleml`:
```yaml
---
title: "My Article"
date: "2026-03-30"
description: "Brief description"
category: "Category"
tags: ["tag1", "tag2"]
featured: true
readingTime: "5 min"
---

## Section 1

Some **bold** and *italic* text.

!CALLOUT title="Important"
Key information here
!END-CALLOUT

[!IMAGE] : {desc: "What the image shows"}
```

### 2. Parse to MDX
```bash
node convert.js my-article.articleml
```

Output: `src/content/posts/my-article.mdx`

### 3. Edit (Optional)
Open the generated MDX and replace placeholders with actual content.

### 4. Deploy
```bash
npm run build && npm run dev
```

---

## 📖 ArticleML Syntax

### Text Markup
```markdown
## Headings
**Bold** and *italic* text
[Links](https://example.com)
* Lists
1. Numbered lists
```

### Structured Content
```
!CALLOUT title="Title"
Content here
!END-CALLOUT

!ATTENTION
Important note
!END-ATTENTION

!MATH-NOTE
Math equations with $$
!END-MATH-NOTE

|TABLE
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
|END-TABLE
```

### Placeholders
```
[!IMAGE] : {desc: "Description of image"}
[!VIDEO] : {desc: "Description of video"}
[!CODE] : {desc: "Description of code example"}
[!SIMULATION] : {desc: "Description of interactive content"}
```

---

## 🔄 Workflow

```
ArticleML (.articleml)
       ↓
   [Parse]  ← node convert.js
       ↓
MDX (.mdx) with Placeholders
       ↓
   [Optional: Manual edits to replace placeholders]
       ↓
Final MDX with Rich Content
       ↓
   [Build]  ← npm run build
       ↓
Published Blog Post
```

---

## 💡 Why This Design?

✅ **Simple parser** — Focus on text-based markup
✅ **Clear separation** — Content (ArticleML) vs. presentation (MDX)
✅ **Flexible** — Manual editing gives you full control
✅ **Fast** — Parse quickly without complex setup
✅ **Maintainable** — Easy to understand and extend

---

## 📋 Example: Complete Article

See `google-turboquant.articleml` for a real example.

Convert it:
```bash
node convert.js google-turboquant.articleml
```

View the generated MDX:
```bash
cat src/content/posts/google-turboquant.mdx
```

---

## 🛠️ Advanced Usage

### Use Placeholders for Complex Content
Instead of trying to embed everything in ArticleML:

❌ Don't try:
```
!SIMULATION language="python" type="code-sandbox" code="..."
```

✅ Do this:
```
[!CODE] : {desc: "NumPy implementation"}
```

Then replace in MDX:
```tsx
<CodeBlock language="python">
{`import numpy as np\n...`}
</CodeBlock>
```

### Mix Text and Media
```
Some introductory text here explaining the concept.

[!IMAGE] : {desc: "Diagram showing the architecture"}

Now we discuss the architecture more deeply...

[!CODE] : {desc: "Python implementation"}

Here's how to use the code...
```

---

## 📁 File Structure

```
blog-site/
├── *.articleml              # Your article sources
├── convert.js               # Parser (ArticleML → MDX)
├── ARTICLEML_GUIDE.md       # Syntax reference
├── ARTICLEML_README.md      # This file
├── PLACEHOLDER_EXAMPLES.md  # How to use placeholders
├── PARSING_SIMPLIFICATION_COMPLETE.md
├── SIMPLIFICATION_SUMMARY.md
└── src/
    ├── content/posts/
    │   └── *.mdx           # Generated MDX files
    └── components/blog/
        └── Placeholder.tsx # Placeholder component
```

---

## ✨ Features

### Supported Markdown
- Headings (h2-h6)
- **Bold** and *italic*
- [Links](https://example.com)
- Unordered and ordered lists
- Blockquotes (>)
- Inline code (`)
- Line breaks and spacing

### Structured Components
- **Callout boxes** — Highlighted information
- **Editorial accents** — Emphasized text
- **Math notes** — LaTeX equations with KaTeX
- **Tables** — Data in tabular format

### Placeholders
- **Images** — For diagrams, screenshots, charts
- **Videos** — For embedded videos, tutorials
- **Code** — For code examples in any language
- **Simulations** — For interactive content, Bokeh plots

---

## 🎯 Best Practices

1. **Clear descriptions** — Make placeholders descriptive so you remember what to add
2. **Consistent formatting** — Use consistent spacing and structure
3. **Test locally** — Always run `npm run dev` to preview
4. **Organize files** — Keep images in `public/images/`, Bokeh plots in `public/bokeh/`, etc.
5. **Use placeholders** — Don't force complex content into ArticleML

---

## 🤔 FAQ

**Q: Can I use ArticleML for everything?**
A: ArticleML handles text-based content well. For images, videos, and interactive content, use placeholders and fill them in manually.

**Q: How do I add custom HTML?**
A: Edit the MDX file directly. The parser produces valid MDX, and you can add any React components.

**Q: Can I embed JavaScript?**
A: Yes, in the MDX file. ArticleML doesn't support it, so use placeholders and replace them with custom components.

**Q: How do I add metadata like og:image?**
A: Use the `featured` field in front matter or edit the blog post component.

---

## 📚 Learn More

- **Syntax Reference:** See `ARTICLEML_GUIDE.md`
- **Replace Placeholders:** See `PLACEHOLDER_EXAMPLES.md`
- **Technical Details:** See `SIMPLIFICATION_SUMMARY.md`
- **Complete Overview:** See `PARSING_SIMPLIFICATION_COMPLETE.md`

---

## 🎉 Ready?

```bash
# Create your article
vim my-article.articleml

# Parse to MDX
node convert.js my-article.articleml

# Preview locally
npm run dev

# Edit & enhance
vim src/content/posts/my-article.mdx

# Build & deploy
npm run build
```

Happy writing! 📝
