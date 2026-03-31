#!/usr/bin/env node

/**
 * ArticleML to MDX Converter
 *
 * Uses:
 *   - gray-matter   → robust frontmatter parsing
 *   - unified + remark-parse + remark-gfm  → proper AST-based markdown parsing
 *   - state-machine → reliable multi-line ArticleML block detection
 *   - custom MDX serializer → AST → MDX string with JSX components
 *
 * Usage: node convert.mjs <input.articleml> [output.mdx]
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

// ─────────────────────────────────────────────────────────────
// 1. STATE-MACHINE BLOCK SEGMENTER
//    Splits the body into typed segments before remark sees it.
//    This is more reliable than regex for multi-line blocks.
// ─────────────────────────────────────────────────────────────

/**
 * Walk lines and split into typed segments:
 *   { type: 'markdown',  lines: [...] }
 *   { type: 'callout',   title, lines: [...] }
 *   { type: 'mathNote',  lines: [...] }
 *   { type: 'attention', lines: [...] }
 *   { type: 'table',     lines: [...] }
 */
function segmentBody(body) {
  const lines = body.split("\n");
  const segments = [];
  let state = "NORMAL";
  let current = { type: "markdown", lines: [] };

  function flush() {
    if (current.lines.length > 0) segments.push(current);
    current = { type: "markdown", lines: [] };
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (state === "NORMAL") {
      // Block start detection
      const calloutMatch = trimmed.match(/^!CALLOUT\s+title="([^"]+)"$/);
      if (calloutMatch) {
        flush();
        state = "CALLOUT";
        current = { type: "callout", title: calloutMatch[1], lines: [] };
        continue;
      }
      if (trimmed === "!MATH-NOTE") {
        flush();
        state = "MATH_NOTE";
        current = { type: "mathNote", lines: [] };
        continue;
      }
      if (trimmed === "!ATTENTION") {
        flush();
        state = "ATTENTION";
        current = { type: "attention", lines: [] };
        continue;
      }
      if (trimmed === "|TABLE") {
        flush();
        state = "TABLE";
        current = { type: "table", lines: [] };
        continue;
      }
      current.lines.push(line);
      continue;
    }

    // Inside a custom block — collect lines until end marker
    const endMarkers = {
      CALLOUT: "!END-CALLOUT",
      MATH_NOTE: "!END-MATH-NOTE",
      ATTENTION: "!END-ATTENTION",
      TABLE: "|END-TABLE",
    };

    if (trimmed === endMarkers[state]) {
      flush();
      state = "NORMAL";
      current = { type: "markdown", lines: [] };
    } else {
      current.lines.push(line);
    }
  }

  flush();
  return segments;
}

// ─────────────────────────────────────────────────────────────
// 2. CUSTOM MDX SERIALIZER
//    Converts a remark AST node → MDX string.
//    Handles all standard markdown node types + preserves inline MDX.
// ─────────────────────────────────────────────────────────────

function escapeForJSX(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serializeChildren(children) {
  return (children || []).map(nodeToMDX).join("");
}

function nodeToMDX(node) {
  switch (node.type) {
    case "root":
      return node.children.map(nodeToMDX).join("\n\n").replace(/\n{3,}/g, "\n\n");

    case "heading":
      return `${"#".repeat(node.depth)} ${serializeChildren(node.children)}`;

    case "paragraph":
      return serializeChildren(node.children);

    case "text":
      return node.value;

    case "strong":
      return `**${serializeChildren(node.children)}**`;

    case "emphasis":
      return `*${serializeChildren(node.children)}*`;

    case "delete":
      return `~~${serializeChildren(node.children)}~~`;

    case "inlineCode":
      return `\`${node.value}\``;

    case "code":
      return `\`\`\`${node.lang || ""}\n${node.value}\n\`\`\``;

    case "list": {
      return node.children
        .map((item, i) => {
          const marker = node.ordered ? `${(node.start ?? 1) + i}.` : "-";
          const lines = serializeListItem(item);
          const [first, ...rest] = lines.split("\n");
          const indented = rest.map((l) => `  ${l}`).join("\n");
          return rest.length > 0 ? `${marker} ${first}\n${indented}` : `${marker} ${first}`;
        })
        .join(node.spread ? "\n\n" : "\n");
    }

    case "listItem": {
      return serializeListItem(node);
    }

    case "blockquote":
      return node.children
        .map((child) => nodeToMDX(child).split("\n").map((l) => `> ${l}`).join("\n"))
        .join("\n>\n");

    case "thematicBreak":
      return "---";

    case "html":
      return node.value;

    case "link":
      return `[${serializeChildren(node.children)}](${node.url}${node.title ? ` "${node.title}"` : ""})`;

    case "image":
      return `![${node.alt || ""}](${node.url}${node.title ? ` "${node.title}"` : ""})`;

    case "break":
      return "\\\n";

    case "table": {
      // GFM table node
      const [head, ...rows] = node.children;
      const align = node.align || [];
      const headerCells = head.children.map((cell, i) => {
        const a = align[i];
        return { text: serializeChildren(cell.children), align: a };
      });
      const colWidths = headerCells.map((c) => Math.max(c.text.length, 3));
      rows.forEach((row) => {
        row.children.forEach((cell, i) => {
          const len = serializeChildren(cell.children).length;
          colWidths[i] = Math.max(colWidths[i] || 3, len);
        });
      });

      const pad = (text, width) => text.padEnd(width, " ");
      const separator = (i) => {
        const a = align[i];
        const w = colWidths[i];
        if (a === "center") return `:${"-".repeat(w - 2)}:`;
        if (a === "right") return `${"-".repeat(w - 1)}:`;
        if (a === "left") return `:${"-".repeat(w - 1)}`;
        return "-".repeat(w);
      };

      const headerRow = `| ${headerCells.map((c, i) => pad(c.text, colWidths[i])).join(" | ")} |`;
      const sepRow = `| ${colWidths.map((_, i) => separator(i)).join(" | ")} |`;
      const dataRows = rows.map(
        (row) =>
          `| ${row.children
            .map((cell, i) => pad(serializeChildren(cell.children), colWidths[i]))
            .join(" | ")} |`
      );

      return [headerRow, sepRow, ...dataRows].join("\n");
    }

    case "tableRow":
    case "tableCell":
      return serializeChildren(node.children);

    default:
      // Pass through unknown nodes by their value (handles raw HTML etc.)
      return node.value || "";
  }
}

function serializeListItem(node) {
  if (!node.spread) {
    // Tight list: unwrap single paragraph
    return node.children
      .map((child) =>
        child.type === "paragraph" ? serializeChildren(child.children) : nodeToMDX(child)
      )
      .join("\n");
  }
  return node.children.map(nodeToMDX).join("\n\n");
}

// ─────────────────────────────────────────────────────────────
// 3. INLINE MATH PREPROCESSOR
//    \(...\) → $...$ and \[...\] → $$...$$ before remark sees the text.
//    remark-parse treats \( as an escaped paren and discards the backslash.
// ─────────────────────────────────────────────────────────────

function preprocessInlineMath(text) {
  // \[ ... \]  →  $$\n...\n$$  (display math — process first to avoid conflicts)
  const withDisplay = text.replace(/\\\[(.+?)\\\]/gs, (_, inner) => `$$\n${inner.trim()}\n$$`);
  // \( ... \)  →  $ ... $   (inline math)
  return withDisplay.replace(/\\\((.+?)\\\)/gs, (_, inner) => `$${inner.trim()}$`);
}

// ─────────────────────────────────────────────────────────────
// 4. PLACEHOLDER TRANSFORMER
//    [!TYPE] : {desc: "..."} → <Placeholder type="..." ... />
//    Single-line pattern — regex is fine here.
// ─────────────────────────────────────────────────────────────

function transformPlaceholders(text) {
  const pattern = /\[\!([A-Z]+)\]\s*:\s*\{desc:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*component:\s*"([^"]*)")?\s*\}/g;
  return text.replace(pattern, (_, type, desc, component) => {
    // When a component name is provided, emit the component directly
    if (component) {
      return `<${component} />`;
    }
    const typeMap = { IMAGE: "image", VIDEO: "video", SIMULATION: "simulation", CODE: "code" };
    const mapped = typeMap[type.toUpperCase()];
    if (!mapped) {
      console.warn(`⚠️  Unknown placeholder type: ${type}`);
      return _;
    }
    const title = type.charAt(0) + type.slice(1).toLowerCase();
    return `<Placeholder type="${mapped}" title="${escapeForJSX(title)}" description="${escapeForJSX(desc)}" />`;
  });
}

// ─────────────────────────────────────────────────────────────
// 5. SEGMENT → MDX CONVERTER
//    Processes each segment from the state machine.
// ─────────────────────────────────────────────────────────────

const processor = unified().use(remarkParse).use(remarkGfm);

function processMarkdownSegment(lines) {
  const raw = lines.join("\n");
  // Preprocess inline math BEFORE remark so \(...\) isn't stripped
  const withMath = preprocessInlineMath(raw);
  const withPlaceholders = transformPlaceholders(withMath);
  // Parse with remark for proper AST, serialize back to MDX
  const tree = processor.parse(withPlaceholders);
  return nodeToMDX(tree).trim();
}

function processTableSegment(lines) {
  const rows = lines
    .map((l) =>
      l
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c)
    )
    .filter((r) => r.length > 0);

  // Remove GFM separator rows (---  :---  etc.)
  const dataRows = rows.filter((r) => !r.every((c) => /^[-:]+$/.test(c)));

  if (dataRows.length < 2) return "<!-- Invalid table: need at least header + 1 data row -->";

  const [header, ...body] = dataRows;

  const escapeCell = (s) => s.replace(/\|/g, "\\|");

  const colWidths = header.map((h, i) => {
    const maxData = body.reduce((m, row) => Math.max(m, (row[i] || "").length), 0);
    return Math.max(h.length, maxData, 3);
  });
  const pad = (s, w) => (s || "").padEnd(w, " ");

  const headerRow = `| ${header.map((h, i) => pad(escapeCell(h), colWidths[i])).join(" | ")} |`;
  const sepRow = `| ${colWidths.map((w) => "-".repeat(w)).join(" | ")} |`;
  const dataRows2 = body.map(
    (row) =>
      `| ${header.map((_, i) => pad(escapeCell(row[i] || ""), colWidths[i])).join(" | ")} |`
  );

  return [headerRow, sepRow, ...dataRows2].join("\n");
}

function segmentsToMDX(segments) {
  const parts = [];

  for (const seg of segments) {
    let mdx = "";

    if (seg.type === "markdown") {
      mdx = processMarkdownSegment(seg.lines);
    } else if (seg.type === "callout") {
      const inner = processMarkdownSegment(seg.lines);
      mdx = `<Callout title="${escapeForJSX(seg.title)}">\n${inner}\n</Callout>`;
    } else if (seg.type === "mathNote") {
      // Math content: preserve as-is for KaTeX
      mdx = `<MathNote>\n${seg.lines.join("\n").trim()}\n</MathNote>`;
    } else if (seg.type === "attention") {
      const inner = processMarkdownSegment(seg.lines);
      mdx = `<EditorialAccent>\n${inner}\n</EditorialAccent>`;
    } else if (seg.type === "table") {
      mdx = processTableSegment(seg.lines);
    }

    if (mdx.trim()) parts.push(mdx.trim());
  }

  return parts.join("\n\n");
}

// ─────────────────────────────────────────────────────────────
// 6. FRONTMATTER BUILDER
//    Uses gray-matter data to produce a valid YAML frontmatter block.
// ─────────────────────────────────────────────────────────────

const REQUIRED = ["title", "date", "description", "category", "tags"];

function buildFrontMatter(data) {
  const missing = REQUIRED.filter((f) => !data[f] && data[f] !== 0);
  if (missing.length > 0) {
    throw new Error(`Missing required front matter fields: ${missing.join(", ")}`);
  }

  const tags = (data.tags || []).map((t) => `"${t}"`).join(", ");

  let fm = "---\n";
  fm += `title: "${escapeForJSX(data.title)}"\n`;
  fm += `date: "${data.date}"\n`;
  fm += `description: "${escapeForJSX(data.description)}"\n`;
  fm += `category: "${escapeForJSX(data.category)}"\n`;
  fm += `tags: [${tags}]\n`;
  if (data.featured) fm += `featured: ${data.featured}\n`;
  if (data.readingTime) fm += `readingTime: "${escapeForJSX(data.readingTime)}"\n`;
  if (data.series) fm += `series: "${escapeForJSX(data.series)}"\n`;
  if (data.seriesOrder !== undefined) fm += `seriesOrder: ${data.seriesOrder}\n`;
  fm += "---\n";
  return fm;
}

// ─────────────────────────────────────────────────────────────
// 7. MAIN
// ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log("Usage: node convert.mjs <input.articleml> [--slug <name>] [output.mdx]");
  console.log("");
  console.log("Options:");
  console.log("  --slug <name>   Override the output folder name (default: inferred from filename)");
  console.log("");
  console.log("Examples:");
  console.log("  node convert.mjs my-article.articleml");
  console.log("  node convert.mjs draft-v2.articleml --slug my-article");
  console.log("  node convert.mjs my-article.articleml custom/path/page.mdx");
  process.exit(args.length === 0 ? 1 : 0);
}

const inputPath = args[0];

// Parse --slug option
const slugFlagIdx = args.indexOf("--slug");
const slugOverride = slugFlagIdx !== -1 ? args[slugFlagIdx + 1] : null;
if (slugFlagIdx !== -1 && (!slugOverride || slugOverride.startsWith("-"))) {
  console.error("❌ --slug requires a value, e.g. --slug my-post");
  process.exit(1);
}

// Output path: skip args that are flags or flag values
const positionalArgs = args.slice(1).filter((a, i, arr) => {
  if (a.startsWith("-")) return false;
  if (i > 0 && arr[i - 1] === "--slug") return false;
  return true;
});
const explicitOutputPath = positionalArgs[0] || null;

const resolvedInput = path.resolve(process.cwd(), inputPath);

if (!fs.existsSync(resolvedInput)) {
  console.error(`❌ Input file not found: ${resolvedInput}`);
  process.exit(1);
}

try {
  const source = fs.readFileSync(resolvedInput, "utf-8");

  console.log(`📖 Parsing:    ${inputPath}`);

  // Step 1: Extract frontmatter + body via gray-matter
  const { content: body, data } = matter(source);

  // Derive slug: --slug flag > frontmatter slug: field > title-based > filename
  const filenameSlug =
    inputPath.match(/([^/\\]+)\.articleml$/i)?.[1] ??
    path.basename(inputPath, path.extname(inputPath));
  const titleSlug = data.title
    ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : null;
  const slug = slugOverride ?? data.slug ?? titleSlug ?? filenameSlug;

  const resolvedOutput = path.resolve(
    process.cwd(),
    explicitOutputPath || `src/content/posts/${slug}/page.mdx`
  );

  // Step 2: Validate + build frontmatter string
  const frontMatterStr = buildFrontMatter(data);

  // Step 3: Segment body (state machine)
  const segments = segmentBody(body);

  // Step 4: Convert segments → MDX body
  console.log(`🔄 Converting: ${segments.length} segment(s) through remark pipeline…`);
  const mdxBody = segmentsToMDX(segments);

  // Step 5: Combine
  const mdx = `${frontMatterStr}\n${mdxBody}\n`;

  // Step 6: Write output
  const outputDir = path.dirname(resolvedOutput);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created:    ${path.relative(process.cwd(), outputDir)}`);
  }

  fs.writeFileSync(resolvedOutput, mdx, "utf-8");

  console.log(`✅ Output:     ${path.relative(process.cwd(), resolvedOutput)}`);
  console.log("");
  console.log("Front matter:");
  console.log(`  Title:    ${data.title}`);
  console.log(`  Date:     ${data.date}`);
  console.log(`  Category: ${data.category}`);
  console.log(`  Tags:     ${(data.tags || []).join(", ")}`);
  if (data.series) {
    console.log(`  Series:   ${data.series} (#${data.seriesOrder ?? "?"})`);
  }
} catch (error) {
  console.error("❌ Conversion failed:");
  console.error(error.message || String(error));
  process.exit(1);
}
