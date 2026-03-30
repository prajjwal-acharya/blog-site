# ArticleML & MDX Rendering Troubleshooting Guide

Comprehensive guide for fixing rendering issues when converting ArticleML to MDX.

---

## 🔍 Diagnosis Process

### Step 1: Validate ArticleML Syntax
```bash
npm run convert my-article.articleml
```

The script now includes validation and will report:
- ✅ Syntax errors (missing fields, unmatched delimiters)
- ⚠️  Warnings (non-standard categories, formatting issues)
- 🔧 Details about what was converted

**If validation fails:** Fix the errors before proceeding.

### Step 2: Check Generated MDX
After conversion, examine the generated `.mdx` file:
```bash
cat src/content/posts/my-article.mdx | head -50
```

Look for:
- Properly formatted front matter (YAML between `---` markers)
- Correct JSX component tags: `<Callout>`, `<MatrixVisualization>`, etc.
- Proper closing tags: `</Callout>`, `</MatrixVisualization>`

### Step 3: Test Locally
```bash
npm run dev
```

Visit: `http://localhost:3000/blog/my-article`

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module" Error

**Symptom:**
```
Module not found: Can't resolve '@/components/blog/MatrixVisualization'
```

**Cause:** Component file doesn't exist or is in wrong location

**Fix:**
```bash
# Check files exist
ls -la src/components/blog/

# Should see:
# MatrixVisualization.tsx
# GraphVisualizer.tsx
# CodeSandbox.tsx
```

If missing, recreate them using the setup files provided.

---

### Issue 2: "Cannot find module" for Parser

**Symptom:**
```
Module not found: Can't resolve '@/lib/articleml-parser'
```

**Cause:** Parser file missing

**Fix:**
```bash
ls -la src/lib/
# Should see: articleml-parser.ts
```

Verify the file exists and has the export functions.

---

### Issue 3: Components Render as Text

**Symptom:**
```
<Callout title="..."> renders as plain text instead of styled box
```

**Cause:** Component not registered in mdxComponents mapping

**Fix:**

Check `src/app/blog/[slug]/page.tsx` includes all components in `mdxComponents`:

```tsx
const mdxComponents = {
  // ... other components ...
  Callout: ({ children, title }) => ( ... ),
  MathNote: ({ children }) => ( ... ),
  EditorialAccent: ({ children }) => ( ... ),
  MatrixVisualization: (props) => <MatrixVisualization {...props} />,
  GraphVisualizer: (props) => <GraphVisualizer {...props} />,
  CodeSandbox: (props) => <CodeSandbox {...props} />,
};
```

All component names must be **exactly** as they appear in the JSX.

---

### Issue 4: Interactive Component Doesn't Load

**Symptom:**
```
<MatrixVisualization title="..." config={...} /> appears but nothing shows
```

**Cause:** Props not being passed correctly to component

**Fix:**

Verify the generated MDX has valid JSX:
```bash
grep -A 2 "MatrixVisualization" src/content/posts/my-article.mdx
```

Should see:
```jsx
<MatrixVisualization title="Matrix Multiplication" config={{"matrixA":[[1,2],[3,4]],...}} />
```

**NOT**:
```jsx
<MatrixVisualization title="Matrix Multiplication" config={'...'} />  ❌ Wrong quotes
<MatrixVisualization title=Matrix .../>                             ❌ Missing quotes
<MatrixVisualization ...config={undefined} />                       ❌ Invalid config
```

---

### Issue 5: Math Not Rendering

**Symptom:**
```
$E = mc^2$ shows as literal text instead of equation
```

**Cause:** Math delimiters not preserved during conversion

**Fix:**

Check ArticleML source:
```articleml
The formula $E = mc^2$ shows energy.   ✅ Correct

The formula E = mc^2 shows energy.     ❌ Missing $ delimiters
```

**For display math:**
```articleml
$$
E = mc^2
$$
```

NOT: `$$E = mc^2$$` on single line

---

### Issue 6: Table Not Formatting

**Symptom:**
```
Table appears as HTML but without styling
```

**Cause:** Missing table CSS or incorrect HTML structure

**Fix:**

Check `src/app/globals.css` includes table styling:
```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
}

th, td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--color-outline-variant);
}

th {
  background-color: var(--color-surface-container-high);
  font-weight: 600;
}
```

Verify the generated table HTML:
```bash
grep -A 10 "<table>" src/content/posts/my-article.mdx
```

Should see proper `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` tags.

---

### Issue 7: Code Sandbox Doesn't Execute

**Symptom:**
```
"Run Code" button appears but clicking does nothing
```

**Cause:** JavaScript execution issue or props not set

**Fix:**

1. Check browser console for errors (F12 → Console)
2. Verify the code is valid JavaScript:
   ```javascript
   function test() {
     console.log("Hello");
   }
   test();  // Make sure to call functions
   ```

3. Check the generated MDX has valid code:
   ```bash
   grep -A 5 "CodeSandbox" src/content/posts/my-article.mdx
   ```

---

### Issue 8: Graph Diagram Doesn't Render

**Symptom:**
```
GraphVisualizer component appears but SVG canvas is empty
```

**Cause:** Config object malformed or nodes/edges arrays invalid

**Fix:**

**Correct format:**
```articleml
!SIMULATION type="diagram"
component="GraphVisualizer"
title="Network"
config={
  "nodes": [
    {"id": "A", "label": "Node A"},
    {"id": "B", "label": "Node B"}
  ],
  "edges": [
    {"from": "A", "to": "B", "weight": 5}
  ]
}
!END-SIMULATION
```

**Common errors:**
```articleml
"nodes": [                                  ✅ Double quotes
"nodes": [                                  ✅ Proper array syntax
{"id": 'A', "label": "Node A"}             ❌ Single quotes in JSON
{"id": "A" "label": "Node A"}              ❌ Missing comma
```

---

### Issue 9: "Unmatched Block Delimiters" Error

**Symptom:**
```
❌ Validation: Unmatched block delimiters: 1 "!CALLOUT" but 0 "!END-CALLOUT"
```

**Cause:** Missing closing delimiter

**Fix:**

Every opening block must have a closing:
```articleml
!CALLOUT title="Key Point"
Content here
!END-CALLOUT                    ✅ Must close

!CALLOUT title="Key Point"
Content here
                                ❌ Missing !END-CALLOUT
```

Check all blocks:
- `!CALLOUT ... !END-CALLOUT`
- `!ATTENTION ... !END-ATTENTION`
- `!MATH-NOTE ... !END-MATH-NOTE`
- `!SIMULATION ... !END-SIMULATION`
- `|TABLE ... |END-TABLE`

---

### Issue 10: Missing Front Matter Fields

**Symptom:**
```
❌ Validation: Missing required front matter fields: category, tags
```

**Cause:** Incomplete YAML header

**Fix:**

Ensure all required fields:
```yaml
---
title: "Article Title"          ✅ Required
date: "2025-03-30"              ✅ Required
description: "Short summary"    ✅ Required
category: "AI Advances"         ✅ Required (must be valid)
tags: ["ai", "ml"]              ✅ Required (array of strings)
featured: false                 ⭐ Optional
readingTime: "8 min read"       ⭐ Optional
---
```

---

## 🔧 Advanced Troubleshooting

### Check Parser Output Directly

Create a test file to see parsed output:
```bash
cat > test-parser.js << 'EOF'
const { parseArticleML, articleMLToMDX } = require('./dist/lib/articleml-parser.js');
const fs = require('fs');

const source = fs.readFileSync('my-article.articleml', 'utf-8');
const article = parseArticleML(source);

console.log('Front Matter:', JSON.stringify(article.frontMatter, null, 2));
console.log('\nBody (first 500 chars):');
console.log(article.mdxContent.substring(0, 500));
EOF

node test-parser.js
```

### Enable Debug Logging

Modify the CLI to show more details:
```bash
npm run convert my-article.articleml 2>&1 | grep -E "(Error|Warning|Failed|Successfully)"
```

### Validate HTML Entities

Some special characters need escaping:
- `&` → `&amp;`
- `<` → `&lt;` (in text, not JSX)
- `>` → `&gt;` (in text, not JSX)
- `"` → `&quot;` (in attributes)

### Check Component Exports

Verify components are properly exported:
```bash
grep -n "export" src/components/blog/MatrixVisualization.tsx
# Should see: export default function MatrixVisualization
```

---

## 📋 Complete Validation Checklist

Before publishing, verify:

- [ ] ArticleML passes validation (`npm run convert`)
- [ ] Generated MDX file exists and is readable
- [ ] All component tags are properly closed
- [ ] Math delimiters are correct (`$...$` or `$$...$$`)
- [ ] Tables have matching column counts
- [ ] All block delimiters are matched (!CALLOUT ... !END-CALLOUT)
- [ ] Front matter has all required fields
- [ ] No trailing commas in JSON objects
- [ ] All component names match exactly (case-sensitive)
- [ ] Code sandbox has valid JavaScript
- [ ] Graph/matrix config JSON is valid
- [ ] Localhost preview loads correctly
- [ ] No console errors (F12 → Console)
- [ ] Dark mode works (click theme toggle)
- [ ] Mobile responsive (F12 → Device toggle)

---

## 🚨 If All Else Fails

### 1. Clean and Rebuild
```bash
rm -rf .next
npm run build
npm run dev
```

### 2. Check Dependencies
```bash
npm list
# Verify versions match package.json
```

### 3. Check Node Version
```bash
node --version
# Should be v18+ for Next.js 16
```

### 4. Regenerate from Source
```bash
# Delete the problematic MDX
rm src/content/posts/my-article.mdx

# Regenerate
npm run convert my-article.articleml
```

### 5. Check File Encoding
```bash
# Ensure UTF-8 encoding
file -i src/content/posts/my-article.mdx
# Should show: UTF-8 Unicode

# If not, convert:
iconv -f ISO-8859-1 -t UTF-8 src/content/posts/my-article.mdx > temp.mdx
mv temp.mdx src/content/posts/my-article.mdx
```

### 6. Inspect the Build Error
```bash
npm run build 2>&1 | tee build.log
# Review build.log for detailed error messages
```

---

## 📞 Getting Help

When reporting an issue, provide:

1. **ArticleML source** (the `.articleml` file)
2. **Generated MDX** (the `.mdx` file)
3. **Error message** (full text, not just a screenshot)
4. **Browser console** errors (F12 → Console)
5. **Build output** (run `npm run build` and paste the error)

---

## ✅ You're Good When

- ✅ ArticleML validation passes with no errors
- ✅ MDX validation passes with no errors
- ✅ Website loads without console errors
- ✅ Article renders with correct styling
- ✅ Math displays as equations, not text
- ✅ Tables format with proper borders and colors
- ✅ Interactive components are clickable and responsive
- ✅ Dark mode works correctly
- ✅ Mobile layout looks good

Happy writing! 🎉
