#!/usr/bin/env node

/**
 * ArticleML to MDX Converter CLI
 * Usage: npx ts-node scripts/convert-articleml.ts <input-file> [output-file]
 */

import fs from "fs";
import path from "path";
import { parseArticleML, articleMLToMDX } from "../src/lib/articleml-parser.js";
import { validateArticleML, validateMDX, printValidationResults } from "../src/lib/articleml-validator.js";

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

const resolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedOutput = path.resolve(process.cwd(), outputPath);

if (!fs.existsSync(resolvedInput)) {
  console.error(`❌ Input file not found: ${resolvedInput}`);
  process.exit(1);
}

try {
  const source = fs.readFileSync(resolvedInput, "utf-8");

  console.log(`📖 Validating: ${inputPath}`);
  const validation = validateArticleML(source);
  printValidationResults(validation, "ArticleML");

  if (!validation.isValid) {
    console.error("❌ ArticleML validation failed. Please fix the errors above.");
    process.exit(1);
  }

  console.log(`🔄 Parsing ArticleML...`);
  let article;
  try {
    article = parseArticleML(source);
  } catch (parseError) {
    console.error(`❌ Parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    process.exit(1);
  }

  console.log(`🔄 Converting to MDX...`);
  const mdx = articleMLToMDX(article);

  console.log(`🔄 Validating MDX output...`);
  const mdxValidation = validateMDX(mdx);
  printValidationResults(mdxValidation, "MDX");

  if (!mdxValidation.isValid) {
    console.warn("⚠️  MDX validation issues detected. Conversion will proceed but review the output carefully.");
  }

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
  console.log("");
  console.log(`📋 Next steps:`);
  console.log(`  1. Run: npm run dev`);
  console.log(`  2. Visit: http://localhost:3000/blog/${resolvedOutput.split("/").pop()?.replace(".mdx", "") || "article"}`);
  console.log(`  3. Review rendering and fix any issues in the ArticleML source`);
  console.log(`  4. Re-run this converter when done`);
} catch (error) {
  console.error("❌ Conversion failed:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
