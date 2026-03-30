/**
 * Tag — category / metadata chip.
 * Two styles: "outlined" (default) and "filled".
 */

interface TagProps {
  label:    string;
  variant?: "outlined" | "filled";
  size?:    "sm" | "md";
  href?:    string;
}

import Link from "next/link";

export default function Tag({
  label,
  variant = "outlined",
  size    = "md",
  href,
}: TagProps) {
  const base =
    "inline-block font-label uppercase font-medium rounded-[0.125rem] leading-none";

  const sizeClass  = size === "sm" ? "text-[0.6rem] tracking-[0.15em] px-2 py-1" : "text-[0.65rem] tracking-[0.15em] px-3 py-1.5";
  const colorClass =
    variant === "filled"
      ? "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]"
      : "border border-[var(--color-outline)]/25 text-[var(--color-secondary)]";

  const classes = [base, sizeClass, colorClass].join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={[classes, "hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-colors"].join(" ")}
      >
        {label}
      </Link>
    );
  }

  return <span className={classes}>{label}</span>;
}
