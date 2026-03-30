/**
 * ArticleML Parser — converts custom markup syntax to MDX
 * Handles: headings, math, tables, callouts, and interactive simulations
 */

interface FrontMatter {
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  featured?: boolean;
  readingTime?: string;
}

interface ParsedArticle {
  frontMatter: FrontMatter;
  mdxContent: string;
}

/**
 * Parse ArticleML source and convert to MDX
 */
export function parseArticleML(source: string): ParsedArticle {
  // Split front matter from body
  const [frontMatterStr, ...bodyLines] = source.split('\n');

  if (!frontMatterStr.startsWith('---')) {
    throw new Error('Article must start with front matter (---)');
  }

  // Extract front matter
  let endIdx = 1;
  while (endIdx < source.split('\n').length && !source.split('\n')[endIdx].startsWith('---')) {
    endIdx++;
  }
  const fmLines = source.split('\n').slice(1, endIdx).join('\n');
  const frontMatter = parseFrontMatter(fmLines);

  // Extract body
  const bodyStart = endIdx + 1;
  const body = source.split('\n').slice(bodyStart).join('\n');

  // Parse body content
  const mdxContent = parseBody(body);

  return { frontMatter, mdxContent };
}

/**
 * Parse YAML front matter
 */
function parseFrontMatter(yaml: string): FrontMatter {
  const fm: any = {};

  yaml.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim();

    if (key === 'title') fm.title = value.replace(/^["']|["']$/g, '');
    if (key === 'date') fm.date = value.replace(/^["']|["']$/g, '');
    if (key === 'description') fm.description = value.replace(/^["']|["']$/g, '');
    if (key === 'category') fm.category = value.replace(/^["']|["']$/g, '');
    if (key === 'featured') fm.featured = value === 'true';
    if (key === 'readingTime') fm.readingTime = value.replace(/^["']|["']$/g, '');
    if (key === 'tags') {
      const tagsStr = value.replace(/^\[|\]$/g, '');
      fm.tags = tagsStr.split(',').map((t: string) => t.trim().replace(/^["']|["']$/g, ''));
    }
  });

  return fm;
}

/**
 * Parse article body — handles sections, math, tables, callouts, simulations
 */
function parseBody(body: string): string {
  let mdx = body;

  // Process simulations first (preserve exact content)
  mdx = processSimulations(mdx);

  // Process callouts
  mdx = processCallouts(mdx);

  // Process math notes
  mdx = processMathNotes(mdx);

  // Process tables
  mdx = processTables(mdx);

  // Process attention blocks
  mdx = processAttentionBlocks(mdx);

  // Normalize inline math and display math
  mdx = normalizeMath(mdx);

  // Clean up extra whitespace
  mdx = mdx.replace(/\n{3,}/g, '\n\n');

  return mdx;
}

/**
 * Process !SIMULATION blocks → MDX component
 */
function processSimulations(content: string): string {
  const simPattern = /!SIMULATION\s+type="([^"]+)"\s+component="([^"]+)"\s+title="([^"]+)"\s+config=(\{[^}]+\})\s*!END-SIMULATION/gs;

  content = content.replace(simPattern, (match, type, component, title, configStr) => {
    try {
      // Safely parse config object
      const config = JSON.parse(configStr.replace(/'/g, '"'));
      return `<${component} title="${title}" config={${JSON.stringify(config)}} />`;
    } catch {
      console.warn(`Failed to parse simulation config: ${configStr}`);
      return `<!-- Simulation parsing failed: ${type} -->`;
    }
  });

  // Handle code sandbox variant with multiline code
  const sandboxPattern = /!SIMULATION\s+type="code-sandbox"\s+language="([^"]+)"\s+title="([^"]+)"\s+code="""([\s\S]*?)"""\s*!END-SIMULATION/g;
  content = content.replace(sandboxPattern, (match, lang, title, code) => {
    const escapedCode = code.trim().replace(/\\/g, '\\\\').replace(/`/g, '\\`');
    return `<CodeSandbox language="${lang}" title="${title}" code={\`${escapedCode}\`} />`;
  });

  return content;
}

/**
 * Process !CALLOUT blocks → MDX Callout component
 */
function processCallouts(content: string): string {
  const calloutPattern = /!CALLOUT\s+title="([^"]+)"\s*\n([\s\S]*?)\n!END-CALLOUT/g;

  content = content.replace(calloutPattern, (match, title, body) => {
    return `<Callout title="${title}">\n${body.trim()}\n</Callout>`;
  });

  return content;
}

/**
 * Process !MATH-NOTE blocks → MathNote component
 */
function processMathNotes(content: string): string {
  const mathNotePattern = /!MATH-NOTE\n([\s\S]*?)\n!END-MATH-NOTE/g;

  content = content.replace(mathNotePattern, (match, math) => {
    return `<MathNote>${math.trim()}</MathNote>`;
  });

  return content;
}

/**
 * Process !ATTENTION blocks → EditorialAccent wrapper
 */
function processAttentionBlocks(content: string): string {
  const attentionPattern = /!ATTENTION\n([\s\S]*?)\n!END-ATTENTION/g;

  content = content.replace(attentionPattern, (match, body) => {
    return `<EditorialAccent>\n${body.trim()}\n</EditorialAccent>`;
  });

  return content;
}

/**
 * Process markdown tables → HTML table with Tailwind classes
 */
function processTables(content: string): string {
  const tablePattern = /\|TABLE\n([\s\S]*?)\n\|END-TABLE/g;

  content = content.replace(tablePattern, (match, tableContent) => {
    const lines = tableContent.trim().split('\n');
    const headerRow = lines[0].split('|').map(c => c.trim()).filter(c => c);
    const separatorRow = lines[1]; // ignored; just marks header
    const bodyRows = lines.slice(2).map(row =>
      row.split('|').map(c => c.trim()).filter(c => c)
    );

    let html = '<div className="overflow-x-auto my-8">\n';
    html += '<table className="w-full border-collapse text-sm">\n';

    // Header
    html += '<thead className="bg-[var(--color-surface-container-high)] border-b border-[var(--color-outline-variant)]/30">\n';
    html += '<tr>\n';
    headerRow.forEach(cell => {
      html += `  <th className="px-4 py-2 text-left font-semibold text-[var(--color-on-surface)]">${cell}</th>\n`;
    });
    html += '</tr>\n';
    html += '</thead>\n';

    // Body
    html += '<tbody>\n';
    bodyRows.forEach((row, idx) => {
      const bgClass = idx % 2 === 0
        ? 'bg-[var(--color-surface)]'
        : 'bg-[var(--color-surface-container-low)]';
      html += `<tr className="${bgClass} border-b border-[var(--color-outline-variant)]/15">\n`;
      row.forEach(cell => {
        html += `  <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">${cell}</td>\n`;
      });
      html += '</tr>\n';
    });
    html += '</tbody>\n';
    html += '</table>\n';
    html += '</div>\n';

    return html;
  });

  return content;
}

/**
 * Normalize math delimiters — ensure LaTeX syntax is preserved for KaTeX
 * Inline: $...$ → $...$
 * Display: $$...$$ → $$...$$
 */
function normalizeMath(content: string): string {
  // Ensure display math ($$) stays intact
  // Already in correct format if from source

  // Ensure inline math ($) stays intact
  // Already in correct format if from source

  return content;
}

/**
 * Export parsed article as string ready for writing to .mdx file
 */
export function articleMLToMDX(article: ParsedArticle): string {
  const fm = article.frontMatter;
  const tags = fm.tags.map(t => `"${t}"`).join(', ');

  let mdx = '---\n';
  mdx += `title: "${fm.title}"\n`;
  mdx += `date: "${fm.date}"\n`;
  mdx += `description: "${fm.description}"\n`;
  mdx += `category: "${fm.category}"\n`;
  mdx += `tags: [${tags}]\n`;
  if (fm.featured) mdx += `featured: ${fm.featured}\n`;
  if (fm.readingTime) mdx += `readingTime: "${fm.readingTime}"\n`;
  mdx += '---\n\n';
  mdx += article.mdxContent;

  return mdx;
}
