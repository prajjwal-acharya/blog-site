#!/usr/bin/env node

/**
 * ArticleML to MDX Converter CLI
 * Usage: npx ts-node scripts/convert-articleml.ts <input-file> [output-file]
 *
 * Example:
 *   npx ts-node scripts/convert-articleml.ts my-article.articleml
 *   npx ts-node scripts/convert-articleml.ts my-article.articleml src/content/posts/my-article.mdx
 */

import fs from "fs";
import path from "path";
import { parseArticleML, articleMLToMDX } from "../src/lib/articleml-parser";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Usage: convert-articleml <input-file> [output-file]");
  console.error("");
  console.error("Examples:");
  console.error("  convert-articleml my-article.articleml");
  console.error("  convert-articleml my-article.articleml src/content/posts/my-article.mdx");
  process.exit(1);
}

const inputPath = args[0];
const outputPath =
  args[1] ||
  inputPath.replace(".articleml", ".mdx").replace(/^(?!src\/content\/posts\/)/, "src/content/posts/");

// Resolve absolute paths
const resolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedOutput = path.resolve(process.cwd(), outputPath);

// Read input file
if (!fs.existsSync(resolvedInput)) {
  console.error(`❌ Input file not found: ${resolvedInput}`);
  process.exit(1);
}

try {
  const source = fs.readFileSync(resolvedInput, "utf-8");

  // Parse ArticleML
  console.log(`📖 Parsing: ${inputPath}`);
  const article = parseArticleML(source);

  // Convert to MDX
  console.log(`🔄 Converting to MDX...`);
  const mdx = articleMLToMDX(article);

  // Ensure output directory exists
  const outputDir = path.dirname(resolvedOutput);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  // Write output file
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
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
