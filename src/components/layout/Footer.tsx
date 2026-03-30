/**
 * Footer — site-wide footer with links and status indicator.
 * Server component; no interactivity needed.
 */

import Link from "next/link";

const SOCIAL_LINKS = [
  { label: "Twitter",  href: "https://twitter.com/pjxcharya" },
  { label: "GitHub",   href: "https://github.com/pjxcharya" },
  { label: "LinkedIn", href: "https://linkedin.com/in/pjxcharya" },
];

const SITE_LINKS = [
  { label: "Blog",     href: "/blog" },
  { label: "Timeline", href: "/timeline" },
  { label: "Archive",  href: "/archive" },
  { label: "About",    href: "/about" },
  { label: "RSS",      href: "/rss.xml" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-surface-container-low)] mt-32 w-full">
      {/* Main footer content */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <Link
            href="/"
            className="font-headline font-bold text-xl text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
          >
            Prajjwal<span className="text-[var(--color-primary)] italic">.</span>
          </Link>
          <p className="text-sm text-[var(--color-secondary)] leading-relaxed font-light max-w-xs">
            Exploring AI advances, the math behind ML, algorithms, and personal builds.
          </p>
        </div>

        {/* Site links */}
        <div className="space-y-4">
          <h3 className="eyebrow text-[0.65rem]">Navigate</h3>
          <ul className="space-y-2">
            {SITE_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors tracking-wide"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-4">
          <h3 className="eyebrow text-[0.65rem]">Find me</h3>
          <ul className="space-y-2">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors hover:underline underline-offset-4 decoration-[var(--color-primary)]/30"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-outline-variant)]/15 max-w-screen-xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"
            aria-hidden="true"
          />
          <span className="font-label text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-secondary)]">
            All systems operational
          </span>
        </div>
        <p className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-secondary)]/60">
          © {year} Prajjwal Acharya · Built with Next.js
        </p>
      </div>
    </footer>
  );
}
