/**
 * Archive page — server component that fetches all posts and hands off to the
 * interactive client wrapper.
 */

import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import ArchiveClientPage from "@/components/archive/ArchiveClientPage";

export const metadata: Metadata = {
  title: "Archive",
  description: "Complete archive of all posts, filterable by year and category.",
};

export default function ArchivePage() {
  const posts = getAllPosts();
  return <ArchiveClientPage posts={posts} />;
}
