/**
 * ArticleML Parser — converts custom markup syntax to MDX
 * Handles: headings, text, callouts, math, tables, placeholders
 * Robust error handling and validation included
 */

interface FrontMatter {
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  featured?: boolean;
  readingTime?: string;
  series?: string;        // Optional series name
  seriesOrder?: number;   // Optional position in series
}

interface ParsedArticle {
  frontMatter: FrontMatter;
  mdxContent: string;
}

/**
 * Safely escape strings for JSON in JSX
 */
function escapeForJSON(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Parse ArticleML source and convert to MDX
 */
export function parseArticleML(source: string): ParsedArticle {
  if (!source || typeof source !== 'string') {
    throw new Error('ArticleML source must be a non-empty string');
  }

  // Split front matter from body
  const lines = source.split('\n');

  if (!lines[0].startsWith('---')) {
    throw new Error('Article must start with front matter (---)');
  }

  // Find end of front matter
  let endIdx = 1;
  while (endIdx < lines.length && !lines[endIdx].startsWith('---')) {
    endIdx++;
  }

  if (endIdx >= lines.length) {
    throw new Error('Front matter is not properly closed (missing closing ---)');
  }

  const fmLines = lines.slice(1, endIdx).join('\n');
  const frontMatter = parseFrontMatter(fmLines);

  // Extract body
  const body = lines.slice(endIdx + 1).join('\n');

  // Parse body content
  const mdxContent = parseBody(body);

  return { frontMatter, mdxContent };
}

/**
 * Parse YAML front matter with validation
 */
function parseFrontMatter(yaml: string): FrontMatter {
  const fm: any = {};

  const requiredFields = ['title', 'date', 'description', 'category', 'tags'];

  yaml.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim();

    if (!key || !value) return;

    if (key === 'title') fm.title = value.replace(/^["']|["']$/g, '');
    if (key === 'date') fm.date = value.replace(/^["']|["']$/g, '');
    if (key === 'description') fm.description = value.replace(/^["']|["']$/g, '');
    if (key === 'category') fm.category = value.replace(/^["']|["']$/g, '');
    if (key === 'featured') fm.featured = value === 'true';
    if (key === 'readingTime') fm.readingTime = value.replace(/^["']|["']$/g, '');
    if (key === 'series') fm.series = value.replace(/^["']|["']$/g, '');
    if (key === 'seriesOrder') fm.seriesOrder = parseInt(value, 10);
    if (key === 'tags') {
      const tagsStr = value.replace(/^\[|\]$/g, '');
      fm.tags = tagsStr
        .split(',')
        .map((t: string) => t.trim().replace(/^["']|["']$/g, ''))
        .filter((t: string) => t);
    }
  });

  // Validate required fields
  const missingFields = requiredFields.filter((field) => !fm[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required front matter fields: ${missingFields.join(', ')}`);
  }

  return fm;
}

/**
 * Parse article body — handles text blocks, callouts, math, tables, placeholders
 */
function parseBody(body: string): string {
  let mdx = body;

  // Process in order: text-based first, then placeholders
  mdx = processCallouts(mdx);
  mdx = processMathNotes(mdx);
  mdx = processAttentionBlocks(mdx);
  mdx = processTables(mdx);
  mdx = processPlaceholders(mdx);
  mdx = normalizeMath(mdx);

  // Clean up extra whitespace
  mdx = mdx.replace(/\n{3,}/g, '\n\n').trim();

  return mdx;
}

/**
 * Process [!PLACEHOLDER] syntax → MDX Placeholder component
 * Format: [!IMAGE] : {desc: "Description here"}
 * Supports: IMAGE, VIDEO, SIMULATION, CODE
 */
function processPlaceholders(content: string): string {
  // Pattern: [!TYPE] : {desc: "..."}
  const placeholderPattern = /\[\!([A-Z]+)\]\s*:\s*\{desc:\s*"([^"]*)"\s*\}/g;

  content = content.replace(placeholderPattern, (match, type, desc) => {
    try {
      const typeMap: Record<string, string> = {
        IMAGE: 'image',
        VIDEO: 'video',
        SIMULATION: 'simulation',
        CODE: 'code',
      };

      const mappedType = typeMap[type.toUpperCase()];
      if (!mappedType) {
        console.warn(`⚠️  Unknown placeholder type: ${type}`);
        return match; // Return original if unknown
      }

      const title = type.charAt(0) + type.slice(1).toLowerCase();
      return `<Placeholder type="${mappedType}" title="${escapeForJSON(title)}" description="${escapeForJSON(desc)}" />`;
    } catch (e) {
      console.warn(`⚠️  Failed to parse placeholder: ${type}`);
      return match;
    }
  });

  return content;
}

/**
 * Process !CALLOUT blocks → MDX Callout component
 */
function processCallouts(content: string): string {
  const calloutPattern = /!CALLOUT\s+title="([^"]+)"\s*\n([\s\S]*?)\n!END-CALLOUT/g;

  content = content.replace(calloutPattern, (match, title, body) => {
    const cleanBody = body.trim();
    return `<Callout title="${escapeForJSON(title)}">\n${cleanBody}\n</Callout>`;
  });

  return content;
}

/**
 * Process !MATH-NOTE blocks → MathNote component
 */
function processMathNotes(content: string): string {
  const mathNotePattern = /!MATH-NOTE\s*\n([\s\S]*?)\n!END-MATH-NOTE/g;

  content = content.replace(mathNotePattern, (match, math) => {
    return `<MathNote>${math.trim()}</MathNote>`;
  });

  return content;
}

/**
 * Process !ATTENTION blocks → EditorialAccent wrapper
 */
function processAttentionBlocks(content: string): string {
  const attentionPattern = /!ATTENTION\s*\n([\s\S]*?)\n!END-ATTENTION/g;

  content = content.replace(attentionPattern, (match, body) => {
    const cleanBody = body.trim();
    return `<EditorialAccent>\n${cleanBody}\n</EditorialAccent>`;
  });

  return content;
}

/**
 * Process markdown tables → HTML table with Tailwind classes
 */
function processTables(content: string): string {
  const tablePattern = /\|TABLE\s*\n([\s\S]*?)\n\|END-TABLE/g;

  content = content.replace(tablePattern, (match, tableContent) => {
    try {
      const lines = tableContent.trim().split('\n').filter((l: string) => l.trim());

      if (lines.length < 3) {
        console.warn('⚠️  Table must have at least header and separator rows');
        return `<!-- Invalid table format -->`;
      }

      const headerRow = lines[0]
        .split('|')
        .map((c: string) => c.trim())
        .filter((c: string) => c);

      const bodyRows = lines
        .slice(2)
        .map((row: string) =>
          row
            .split('|')
            .map((c: string) => c.trim())
            .filter((c: string) => c)
        );

      if (bodyRows.some((row: string[]) => row.length !== headerRow.length)) {
        console.warn('⚠️  All table rows must have same number of columns');
        return `<!-- Invalid table: inconsistent column count -->`;
      }

      let html = '<table>\n';
      html += '<thead>\n<tr>\n';
      headerRow.forEach((cell: string) => {
        html += `  <th>${cell}</th>\n`;
      });
      html += '</tr>\n</thead>\n';

      html += '<tbody>\n';
      bodyRows.forEach((row: string[]) => {
        html += '<tr>\n';
        row.forEach((cell: string) => {
          html += `  <td>${cell}</td>\n`;
        });
        html += '</tr>\n';
      });
      html += '</tbody>\n';
      html += '</table>\n';

      return html;
    } catch (e) {
      console.warn(`⚠️  Failed to parse table: ${e instanceof Error ? e.message : String(e)}`);
      return `<!-- Failed to parse table -->`;
    }
  });

  return content;
}

/**
 * Normalize math delimiters — ensure LaTeX syntax is preserved for KaTeX
 */
function normalizeMath(content: string): string {
  // Ensure display math ($$) has proper spacing
  content = content.replace(/\$\$\n/g, '$$\n');
  content = content.replace(/\n\$\$/g, '\n$$');

  return content;
}

/**
 * Export parsed article as string ready for writing to .mdx file
 */
export function articleMLToMDX(article: ParsedArticle): string {
  const fm = article.frontMatter;
  const tags = fm.tags.map((t) => `"${t}"`).join(', ');

  let mdx = '---\n';
  mdx += `title: "${escapeForJSON(fm.title)}"\n`;
  mdx += `date: "${fm.date}"\n`;
  mdx += `description: "${escapeForJSON(fm.description)}"\n`;
  mdx += `category: "${escapeForJSON(fm.category)}"\n`;
  mdx += `tags: [${tags}]\n`;
  if (fm.featured) mdx += `featured: ${fm.featured}\n`;
  if (fm.readingTime) mdx += `readingTime: "${escapeForJSON(fm.readingTime)}"\n`;
  if (fm.series) mdx += `series: "${escapeForJSON(fm.series)}"\n`;
  if (fm.seriesOrder !== undefined) mdx += `seriesOrder: ${fm.seriesOrder}\n`;
  mdx += '---\n\n';
  mdx += article.mdxContent;

  return mdx;
}
