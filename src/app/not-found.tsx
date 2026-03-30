/**
 * 404 Not Found page — editorial style.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-32 text-center">
      <span className="font-headline text-[10rem] font-bold text-[var(--color-outline-variant)]/20 block leading-none select-none mb-8">
        404
      </span>
      <h1 className="font-headline text-5xl font-bold mb-5 tracking-tight">
        Page not found
      </h1>
      <p className="text-[var(--color-secondary)] text-xl italic max-w-md mx-auto leading-relaxed mb-10">
        The page you're looking for has been moved, deleted, or never existed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-label text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-primary)] hover:underline underline-offset-6"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to home
      </Link>
    </div>
  );
}
