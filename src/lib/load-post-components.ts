import fs from "fs";
import path from "path";
import type React from "react";

/**
 * Dynamically loads post-specific components from
 * `src/content/posts/{slug}/components.tsx` if it exists.
 *
 * All named PascalCase exports become available as MDX component tags.
 * If the file doesn't exist, returns an empty object.
 */
export async function getPostComponents(
  slug: string
): Promise<Record<string, React.ComponentType>> {
  const componentsPath = path.join(
    process.cwd(),
    "src",
    "content",
    "posts",
    slug,
    "components.tsx"
  );

  if (!fs.existsSync(componentsPath)) {
    return {};
  }

  try {
    // Dynamic import resolves at build/render time in RSC via Turbopack
    const mod = await import(`../content/posts/${slug}/components.tsx`);
    const components: Record<string, React.ComponentType> = {};

    for (const [key, value] of Object.entries(mod)) {
      // Include PascalCase named exports and the default export (if named)
      if (typeof value === "function" && /^[A-Z]/.test(key)) {
        components[key] = value as React.ComponentType;
      }
    }

    return components;
  } catch (err) {
    console.warn(`[load-post-components] Failed to load components for "${slug}":`, err);
    return {};
  }
}
