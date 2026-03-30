/**
 * EditorialAccent — 4px left pillar accent for featured / active sections.
 * Wraps children; the left border provides the accent without a wrapper div.
 */

import type { ReactNode } from "react";

interface Props {
  children:   ReactNode;
  className?: string;
}

export default function EditorialAccent({ children, className = "" }: Props) {
  return (
    <div className={["editorial-accent", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
