# ArticleML Parser Simplification Summary

## What Changed

### ✅ Kept (Text-Based Markup)

These features remain fully supported for automatic parsing:

1. **Callout Boxes** — `!CALLOUT title="..." ... !END-CALLOUT`
2. **Math Notes** — `!MATH-NOTE ... !END-MATH-NOTE` (with LaTeX)
3. **Editorial Accents** — `!ATTENTION ... !END-ATTENTION`
4. **Tables** — `|TABLE ... |END-TABLE`
5. **Standard Markdown** — Headings, bold, italic, links, lists, etc.

### ❌ Removed (Heavy Components)

These features no longer have direct ArticleML support:

- ❌ Code execution (CodeSandbox)
- ❌ Bokeh visualizations
- ❌ GraphVisualizer diagrams
- ❌ MatrixVisualization
- ❌ Direct image/video embeds

**Why?** These require complex setup and manual configuration. Better handled as post-parsing edits.

---

## New: Placeholder System

Instead of trying to auto-parse complex content, ArticleML now supports **placeholders** that you fill in manually:

### Syntax
```
[!TYPE] : {desc: "Description of content"}
```

### Supported Types

| Type | Usage | Example |
|------|-------|---------|
| `[!IMAGE]` | Diagrams, charts, screenshots | `[!IMAGE] : {desc: "KV Cache architecture"}` |
| `[!VIDEO]` | Embedded videos, tutorials | `[!VIDEO] : {desc: "How quantization works"}` |
| `[!CODE]` | Code examples (Python, JS, Go, Rust) | `[!CODE] : {desc: "NumPy quantization example"}` |
| `[!SIMULATION]` | Interactive content, Bokeh plots | `[!SIMULATION] : {desc: "Compression ratio demo"}` |

### Workflow

1. **ArticleML → MDX**: Parser creates placeholders
2. **Manual Fill**: You replace `<Placeholder>` components with actual content
3. **Build & Deploy**: Render with complete content

---

## Example

### Before (ArticleML)
```
[!CODE] : {desc: "TurboQuant Python implementation"}
```

### After Parsing (MDX - auto-generated)
```tsx
<Placeholder type="code" title="Code" description="TurboQuant Python implementation" />
```

### After Manual Edit (MDX - your changes)
```tsx
import CodeSandbox from "@/components/blog/CodeSandbox";

<CodeSandbox
  language="python"
  title="TurboQuant Implementation"
  code={`import numpy as np\n...\`}
/>
```

---

## Files Changed

### Updated
- `src/lib/articleml-parser.ts` — Simplified parser, removed simulation/bokeh/code execution
- `convert.js` — Matching JavaScript converter
- `src/app/blog/[slug]/page.tsx` — Now only registers `Placeholder` component
- `google-turboquant.articleml` — Updated example with placeholder syntax

### New
- `src/components/blog/Placeholder.tsx` — Visual placeholder component
- `ARTICLEML_GUIDE.md` — Complete syntax documentation
- `SIMPLIFICATION_SUMMARY.md` — This file

### Removed/Deprecated
- `CodeSandbox.tsx` — No longer used in parser (remove imports)
- `BokehVisualization.tsx` — No longer used in parser (remove imports)
- `GraphVisualizer.tsx` — No longer used in parser (remove imports)
- `MatrixVisualization.tsx` — No longer used in parser (remove imports)
- `BOKEH_GUIDE.md` — No longer relevant
- `BOKEH_SETUP.md` — No longer relevant

---

## Benefits of Simplification

✅ **Parser is simpler** — Only handles text-based markup
✅ **Easier to maintain** — No complex regex for code blocks, simulations
✅ **Faster conversion** — No package detection, no complex escaping
✅ **More flexible** — Manual edits give you full control over components
✅ **Less coupling** — ArticleML doesn't depend on React component details

---

## Adding Rich Content Now

### Adding an Image
1. Save image to `public/images/`
2. In MDX, replace:
   ```tsx
   <Placeholder type="image" title="Image" description="..." />
   ```
   With:
   ```tsx
   import Image from "next/image";
   <Image src="/images/my-image.png" alt="..." width={800} height={600} />
   ```

### Adding Code
1. In MDX, replace:
   ```tsx
   <Placeholder type="code" title="Code" description="..." />
   ```
   With your preferred code display component (Prism, Shiki, custom, etc.)

### Adding Bokeh Plot
1. Generate HTML: `python scripts/generate-bokeh-plot.py plots/my-plot.py my_plot`
2. Create placeholder component: `<BokehVisualization src="/bokeh/my_plot.html" />`
3. In MDX, replace the placeholder with the component

---

## Summary

The parser now focuses on what it does best: **parsing text and structural markup**. Rich media and interactive content are handled as a second pass, either:

- Automatically if you add them to the MDX manually, or
- Via placeholders that guide you on what content is expected

This is a cleaner separation of concerns and gives you more control over the final output.

See `ARTICLEML_GUIDE.md` for complete documentation.
