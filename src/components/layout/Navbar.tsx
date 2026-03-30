"use client";

/**
 * Navbar — glassmorphism fixed top bar.
 * Highlights the active route and provides dark-mode toggle + mobile menu.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Articles", href: "/blog" },
  { label: "Timeline", href: "/timeline" },
  { label: "Archive",  href: "/archive" },
  { label: "About",    href: "/about" },
];

export default function Navbar() {
  const pathname   = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted,      setMounted]  = useState(false);
  const [menuOpen,     setMenuOpen] = useState(false);
  const [scrolled,     setScrolled] = useState(false);

  // Avoid hydration mismatch for theme
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isDark = resolvedTheme === "dark";

  return (
    <nav
      className={[
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-surface)]/75 backdrop-blur-[20px] shadow-[var(--shadow-editorial)]"
          : "bg-transparent backdrop-blur-[8px]",
      ].join(" ")}
      aria-label="Main navigation"
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        {/* Logo / site name */}
        <Link
          href="/"
          className="font-headline font-bold text-[1.4rem] tracking-tight text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
          aria-label="Home"
        >
          Prajjwal<span className="text-[var(--color-primary)] italic">.</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "font-headline italic text-[1.05rem] tracking-tight transition-colors",
                  active
                    ? "text-[var(--color-primary)] border-b border-[var(--color-primary)]/40 pb-0.5"
                    : "text-[var(--color-on-surface)]/55 hover:text-[var(--color-on-surface)]",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)] transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="material-symbols-outlined text-[1.2rem]">
                {isDark ? "light_mode" : "dark_mode"}
              </span>
            </button>
          )}

          {/* RSS */}
          <a
            href="/rss.xml"
            className="hidden sm:block p-2 text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)] transition-colors"
            aria-label="RSS Feed"
          >
            <span className="material-symbols-outlined text-[1.2rem]">rss_feed</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-on-surface)]/60 hover:text-[var(--color-primary)] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[1.3rem]">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-surface-container-low)] backdrop-blur-[20px] border-t border-[var(--color-outline-variant)]/20 px-6 py-6 space-y-5">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "block font-headline italic text-xl transition-colors",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-on-surface)]/70",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
