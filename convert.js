#!/usr/bin/env node

/**
 * ArticleML to MDX Converter (Pure JavaScript)
 * Usage: node convert.js <input-file> [output-file]
 */

const fs = require("fs");
const path = require("path");

// ============= Parser Functions =============

function escapeForJSON(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function parseFrontMatter(yaml) {
  const fm = {};
  const requiredFields = ["title", "date", "description", "category", "tags"];

  yaml.split("\n").forEach((line) => {
    if (!line.trim()) return;
    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":").trim();

    if (!key || !value) return;

    if (key === "title") fm.title = value.replace(/^["']|["']$/g, "");
    if (key === "date") fm.date = value.replace(/^["']|["']$/g, "");
    if (key === "description") fm.description = value.replace(/^["']|["']$/g, "");
    if (key === "category") fm.category = value.replace(/^["']|["']$/g, "");
    if (key === "featured") fm.featured = value === "true";
    if (key === "readingTime") fm.readingTime = value.replace(/^["']|["']$/g, "");
    if (key === "tags") {
      const tagsStr = value.replace(/^\[|\]$/g, "");
      fm.tags = tagsStr
        .split(",")
        .map((t) => t.trim().replace(/^["']|["']$/g, ""))
        .filter((t) => t);
    }
  });

  const missingFields = requiredFields.filter((field) => !fm[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required front matter fields: ${missingFields.join(", ")}`);
  }

  return fm;
}

function processSimulations(content) {
  const simPattern = /!SIMULATION\s+type="([^"]+)"\s+component="([^"]+)"\s+title="([^"]+)"\s+config=(\{[\s\S]*?\})\s*!END-SIMULATION/g;

  content = content.replace(simPattern, (match, type, component, title, configStr) => {
    try {
      const cleanConfig = configStr.replace(/'/g, '"').replace(/,\s*}/g, "}");
      const config = JSON.parse(cleanConfig);
      const configJSON = JSON.stringify(config);
      return `<${component} title="${escapeForJSON(title)}" config={${configJSON}} />`;
    } catch (e) {
      console.warn(`⚠️  Failed to parse ${component} config`);
      return `<!-- Failed to parse ${component} simulation -->`;
    }
  });

  const sandboxPattern = /!SIMULATION\s+type="code-sandbox"\s+language="([^"]+)"\s+title="([^"]+)"\s+code="""([\s\S]*?)"""\s*!END-SIMULATION/g;
  content = content.replace(sandboxPattern, (match, lang, title, code) => {
    try {
      const trimmedCode = code.trim().replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
      return `<CodeSandbox language="${escapeForJSON(lang)}" title="${escapeForJSON(title)}" code={\`${trimmedCode}\`} />`;
    } catch (e) {
      console.warn(`⚠️  Failed to parse CodeSandbox`);
      return `<!-- Failed to parse CodeSandbox -->`;
    }
  });

  return content;
}

function processCallouts(content) {
  const calloutPattern = /!CALLOUT\s+title="([^"]+)"\s*\n([\s\S]*?)\n!END-CALLOUT/g;
  return content.replace(calloutPattern, (match, title, body) => {
    return `<Callout title="${escapeForJSON(title)}">\n${body.trim()}\n</Callout>`;
  });
}

function processMathNotes(content) {
  const mathNotePattern = /!MATH-NOTE\s*\n([\s\S]*?)\n!END-MATH-NOTE/g;
  return content.replace(mathNotePattern, (match, math) => {
    return `<MathNote>${math.trim()}</MathNote>`;
  });
}

function processAttentionBlocks(content) {
  const attentionPattern = /!ATTENTION\s*\n([\s\S]*?)\n!END-ATTENTION/g;
  return content.replace(attentionPattern, (match, body) => {
    return `<EditorialAccent>\n${body.trim()}\n</EditorialAccent>`;
  });
}

function processTables(content) {
  const tablePattern = /\|TABLE\s*\n([\s\S]*?)\n\|END-TABLE/g;
  return content.replace(tablePattern, (match, tableContent) => {
    try {
      const lines = tableContent
        .trim()
        .split("\n")
        .filter((l) => l.trim());

      if (lines.length < 3) return `<!-- Invalid table format -->`;

      const headerRow = lines[0].split("|").map((c) => c.trim()).filter((c) => c);
      const bodyRows = lines.slice(2).map((row) =>
        row
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c)
      );

      if (bodyRows.some((row) => row.length !== headerRow.length)) {
        return `<!-- Invalid table: inconsistent column count -->`;
      }

      let html = "<table>\n<thead>\n<tr>\n";
      headerRow.forEach((cell) => (html += `  <th>${cell}</th>\n`));
      html += "</tr>\n</thead>\n<tbody>\n";

      bodyRows.forEach((row) => {
        html += "<tr>\n";
        row.forEach((cell) => (html += `  <td>${cell}</td>\n`));
        html += "</tr>\n";
      });

      html += "</tbody>\n</table>\n";
      return html;
    } catch (e) {
      console.warn(`⚠️  Failed to parse table`);
      return `<!-- Failed to parse table -->`;
    }
  });
}

function parseBody(body) {
  let mdx = body;
  mdx = processSimulations(mdx);
  mdx = processCallouts(mdx);
  mdx = processMathNotes(mdx);
  mdx = processAttentionBlocks(mdx);
  mdx = processTables(mdx);
  mdx = mdx.replace(/\n{3,}/g, "\n\n").trim();
  return mdx;
}

function parseArticleML(source) {
  if (!source || typeof source !== "string") {
    throw new Error("ArticleML source must be a non-empty string");
  }

  const lines = source.split("\n");

  if (!lines[0].startsWith("---")) {
    throw new Error("Article must start with front matter (---)");
  }

  let endIdx = 1;
  while (endIdx < lines.length && !lines[endIdx].startsWith("---")) {
    endIdx++;
  }

  if (endIdx >= lines.length) {
    throw new Error("Front matter is not properly closed");
  }

  const fmLines = lines.slice(1, endIdx).join("\n");
  const frontMatter = parseFrontMatter(fmLines);
  const body = lines.slice(endIdx + 1).join("\n");
  const mdxContent = parseBody(body);

  return { frontMatter, mdxContent };
}

function articleMLToMDX(article) {
  const fm = article.frontMatter;
  const tags = fm.tags.map((t) => `"${t}"`).join(", ");

  let mdx = "---\n";
  mdx += `title: "${escapeForJSON(fm.title)}"\n`;
  mdx += `date: "${fm.date}"\n`;
  mdx += `description: "${escapeForJSON(fm.description)}"\n`;
  mdx += `category: "${escapeForJSON(fm.category)}"\n`;
  mdx += `tags: [${tags}]\n`;
  if (fm.featured) mdx += `featured: ${fm.featured}\n`;
  if (fm.readingTime) mdx += `readingTime: "${escapeForJSON(fm.readingTime)}"\n`;
  mdx += "---\n\n";
  mdx += article.mdxContent;

  return mdx;
}

// ============= Main =============

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Usage: node convert.js <input-file> [output-file]");
  console.error("");
  console.error("Examples:");
  console.error("  node convert.js my-article.articleml");
  console.error("  node convert.js my-article.articleml src/content/posts/my-article.mdx");
  process.exit(1);
}

const inputPath = args[0];
const outputPath =
  args[1] ||
  inputPath
    .replace(".articleml", ".mdx")
    .replace(/^(?!src\/content\/posts\/)/, "src/content/posts/");

const resolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedOutput = path.resolve(process.cwd(), outputPath);

if (!fs.existsSync(resolvedInput)) {
  console.error(`❌ Input file not found: ${resolvedInput}`);
  process.exit(1);
}

try {
  const source = fs.readFileSync(resolvedInput, "utf-8");

  console.log(`📖 Parsing: ${inputPath}`);
  const article = parseArticleML(source);

  console.log(`🔄 Converting to MDX...`);
  const mdx = articleMLToMDX(article);

  const outputDir = path.dirname(resolvedOutput);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  fs.writeFileSync(resolvedOutput, mdx, "utf-8");

  console.log(`✅ Successfully converted!`);
  console.log(`📄 Output: ${resolvedOutput}`);
  console.log("");
  console.log(`Front Matter:`);
  console.log(`  Title: ${article.frontMatter.title}`);
  console.log(`  Date: ${article.frontMatter.date}`);
  console.log(`  Category: ${article.frontMatter.category}`);
  console.log(`  Tags: ${article.frontMatter.tags.join(", ")}`);
  console.log(`  Featured: ${article.frontMatter.featured ? "Yes" : "No"}`);
} catch (error) {
  console.error("❌ Conversion failed:");
  console.error(error.message || String(error));
  process.exit(1);
}
