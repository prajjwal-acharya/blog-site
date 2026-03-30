/**
 * Button — primary, secondary, and ghost variants.
 * Follows the editorial design: architectural (0.25rem radius), no pill shapes.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  href?:    string;
  external?: boolean;
  icon?:    string;   // Material Symbol name
  iconRight?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 active:opacity-80",
  secondary:
    "bg-transparent text-[var(--color-primary)] border border-[var(--color-outline-variant)]/40 hover:bg-[var(--color-surface-container-high)] transition-colors",
  ghost:
    "bg-transparent text-[var(--color-on-surface)] hover:text-[var(--color-primary)] underline underline-offset-4 decoration-transparent hover:decoration-[var(--color-primary)]/30 transition-colors",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-[0.12em]",
  md: "px-6 py-3 text-xs tracking-[0.15em]",
  lg: "px-8 py-4 text-sm tracking-[0.15em]",
};

const base =
  "inline-flex items-center gap-2 font-label font-bold uppercase rounded-[0.25rem] transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export default function Button({
  variant = "primary",
  size    = "md",
  href,
  external,
  icon,
  iconRight,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = [base, variantClasses[variant], sizeClasses[size], className].join(" ");

  const content = (
    <>
      {icon && !iconRight && (
        <span className="material-symbols-outlined text-[1rem]">{icon}</span>
      )}
      {children}
      {icon && iconRight && (
        <span className="material-symbols-outlined text-[1rem] transition-transform group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={[classes, "group"].join(" ")}
      >
        {content}
      </a>
    ) : (
      <Link href={href} className={[classes, "group"].join(" ")}>
        {content}
      </Link>
    );
  }

  return (
    <button className={[classes, "group"].join(" ")} {...rest}>
      {content}
    </button>
  );
}
