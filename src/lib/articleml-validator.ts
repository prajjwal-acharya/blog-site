/**
 * ArticleML Validator — validates ArticleML syntax and generated MDX
 * Helpful for debugging conversion issues
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate ArticleML source syntax
 */
export function validateArticleML(source: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check front matter
  const lines = source.split('\n');
  if (!lines[0].startsWith('---')) {
    errors.push('Article must start with front matter (---)');
  }

  let fmEndIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith('---')) {
      fmEndIdx = i;
      break;
    }
  }

  if (fmEndIdx === -1) {
    errors.push('Front matter is not properly closed (missing closing ---)');
    return { isValid: false, errors, warnings };
  }

  const fmSection = lines.slice(1, fmEndIdx).join('\n');

  // Validate required front matter fields
  const requiredFields = ['title', 'date', 'description', 'category', 'tags'];
  const presentFields = requiredFields.filter((field) => fmSection.includes(field + ':'));

  const missingFields = requiredFields.filter((field) => !presentFields.includes(field));
  if (missingFields.length > 0) {
    errors.push(`Missing required front matter fields: ${missingFields.join(', ')}`);
  }

  // Validate category
  const categoryMatch = fmSection.match(/category:\s*"([^"]+)"/);
  const validCategories = ['AI Advances', 'Math & ML', 'Algorithms', 'Builds'];
  if (categoryMatch && !validCategories.includes(categoryMatch[1])) {
    warnings.push(
      `Category "${categoryMatch[1]}" is not standard. Valid categories: ${validCategories.join(', ')}`
    );
  }

  // Check for unmatched block delimiters
  const blockDelimiters = [
    { start: '!CALLOUT', end: '!END-CALLOUT' },
    { start: '!ATTENTION', end: '!END-ATTENTION' },
    { start: '!MATH-NOTE', end: '!END-MATH-NOTE' },
    { start: '!SIMULATION', end: '!END-SIMULATION' },
    { start: '|TABLE', end: '|END-TABLE' },
  ];

  const body = lines.slice(fmEndIdx + 1).join('\n');

  blockDelimiters.forEach(({ start, end }) => {
    const startCount = (body.match(new RegExp(start, 'g')) || []).length;
    const endCount = (body.match(new RegExp(end, 'g')) || []).length;

    if (startCount !== endCount) {
      errors.push(`Unmatched block delimiters: ${startCount} "${start}" but ${endCount} "${end}"`);
    }
  });

  // Check for inline math without escaping
  const inlineMathPattern = /\$[^\$]+\$/g;
  const inlineMathMatches = body.match(inlineMathPattern) || [];
  inlineMathMatches.forEach((match) => {
    if (match.includes('\n')) {
      warnings.push(`Inline math with newlines may not render correctly: ${match.substring(0, 50)}...`);
    }
  });

  // Check for table format
  const tablePattern = /\|TABLE\s*\n([\s\S]*?)\n\|END-TABLE/g;
  let tableMatch;
  let tableCount = 0;
  while ((tableMatch = tablePattern.exec(body)) !== null) {
    tableCount++;
    const tableContent = tableMatch[1];
    const tableLines = tableContent
      .trim()
      .split('\n')
      .filter((l) => l.trim());

    if (tableLines.length < 3) {
      errors.push(`Table ${tableCount} must have at least header, separator, and one data row`);
    }

    const headerCols = tableLines[0].split('|').filter((c) => c.trim()).length;
    for (let i = 2; i < tableLines.length; i++) {
      const rowCols = tableLines[i].split('|').filter((c) => c.trim()).length;
      if (rowCols !== headerCols) {
        errors.push(
          `Table ${tableCount} row ${i - 1} has ${rowCols} columns but header has ${headerCols}`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate generated MDX content
 */
export function validateMDX(mdx: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check front matter
  if (!mdx.startsWith('---')) {
    errors.push('MDX must start with front matter (---)');
  }

  const fmMatch = mdx.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    errors.push('Front matter is not properly formatted');
    return { isValid: false, errors, warnings };
  }

  // Check for unmatched JSX tags
  const componentTags = ['Callout', 'MathNote', 'EditorialAccent', 'MatrixVisualization', 'GraphVisualizer', 'CodeSandbox'];

  componentTags.forEach((tag) => {
    const openCount = (mdx.match(new RegExp(`<${tag}[\\s/>]`, 'g')) || []).length;
    const closeCount = (mdx.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    const selfCloseCount = (mdx.match(new RegExp(`<${tag}[^>]*/>`, 'g')) || []).length;

    if (openCount !== closeCount + selfCloseCount) {
      warnings.push(
        `Potential unmatched ${tag} tags: ${openCount} opens, ${closeCount} closes, ${selfCloseCount} self-closes`
      );
    }
  });

  // Check for common JSX syntax errors
  const invalidJSXPatterns = [
    { pattern: /,\s*}/g, message: 'Trailing commas in objects' },
    { pattern: /\{\s*\}/g, message: 'Empty braces' },
    { pattern: /<[A-Z]\w+\s+[^>]*[^=]=[^>]*>/g, message: 'Invalid JSX prop syntax' },
  ];

  invalidJSXPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(mdx)) {
      warnings.push(`Possible JSX syntax issue: ${message}`);
    }
  });

  // Check for LaTeX math delimiters
  const displayMathCount = (mdx.match(/\$\$/g) || []).length;
  if (displayMathCount % 2 !== 0) {
    warnings.push('Unmatched display math delimiters ($$)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Print validation results in a readable format
 */
export function printValidationResults(validation: ValidationResult, type: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${type} Validation Results`);
  console.log(`${'='.repeat(60)}`);

  if (validation.isValid && validation.warnings.length === 0) {
    console.log('✅ All checks passed!');
  } else {
    if (validation.errors.length > 0) {
      console.log(`\n❌ Errors (${validation.errors.length}):`);
      validation.errors.forEach((error) => console.log(`  - ${error}`));
    }

    if (validation.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${validation.warnings.length}):`);
      validation.warnings.forEach((warning) => console.log(`  - ${warning}`));
    }
  }

  console.log(`${'='.repeat(60)}\n`);
}
