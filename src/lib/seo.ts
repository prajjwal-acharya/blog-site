/**
 * SEO utilities — generates Metadata objects for Next.js metadata API.
 * Import and use in each page's `generateMetadata` or static `metadata` export.
 */

import type { Metadata } from "next";
import type { PostMeta } from "./types";

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";
const SITE_NAME = "Prajjwal Acharya";
const SITE_DESC = "Exploring AI advances, math behind ML, algorithms, and personal builds.";

/** Base metadata shared across all pages. */
export const baseMeta: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  authors: [{ name: "Prajjwal Acharya" }],
  creator: "Prajjwal Acharya",
  openGraph: {
    type:       "website",
    locale:     "en_US",
    url:        SITE_URL,
    siteName:   SITE_NAME,
    description: SITE_DESC,
  },
  twitter: {
    card:    "summary_large_image",
    creator: "@pjxcharya",
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

/** Generate per-post Metadata. */
export function postMeta(post: PostMeta): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`
    : `${SITE_URL}/og-default.png`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type:        "article",
      url,
      title:       post.title,
      description: post.description,
      publishedTime: post.date,
      authors:     ["Prajjwal Acharya"],
      tags:        post.tags,
      images: [{ url: ogImage, alt: post.title }],
    },
    twitter: {
      card:  "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

/** JSON-LD structured data for a blog post. */
export function blogPostJsonLd(post: PostMeta) {
  return {
    "@context":       "https://schema.org",
    "@type":          "BlogPosting",
    headline:         post.title,
    description:      post.description,
    datePublished:    post.date,
    dateModified:     post.date,
    author: {
      "@type": "Person",
      name:    "Prajjwal Acharya",
      url:     SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name:    "Prajjwal Acharya",
    },
    url:     `${SITE_URL}/blog/${post.slug}`,
    image:   post.coverImage ?? `${SITE_URL}/og-default.png`,
    keywords: post.tags.join(", "),
  };
}

/** JSON-LD structured data for the site itself. */
export const siteJsonLd = {
  "@context":   "https://schema.org",
  "@type":      "Blog",
  name:         SITE_NAME,
  description:  SITE_DESC,
  url:          SITE_URL,
  author: {
    "@type": "Person",
    name:    "Prajjwal Acharya",
    url:     SITE_URL,
  },
};
