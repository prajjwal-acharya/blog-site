"use client";

/**
 * ScrollReveal — wraps children with an Intersection Observer fade-up animation.
 * Zero framer-motion dependency; uses the CSS .reveal / .visible classes from globals.css.
 */

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children:   ReactNode;
  className?: string;
  delay?:     number;   // ms delay before transition starts
  threshold?: number;   // 0–1, portion of element visible before triggering
}

export default function ScrollReveal({
  children,
  className   = "",
  delay       = 0,
  threshold   = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={["reveal", className].filter(Boolean).join(" ")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
