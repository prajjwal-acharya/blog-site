import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import GrainOverlay from "@/components/layout/GrainOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { baseMeta, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = baseMeta;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full scroll-smooth">
      <head>
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {/* Google Fonts — loaded via <link> so Turbopack doesn't strip them */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Text fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,300;1,6..72,400;1,6..72,600&family=Manrope:wght@200..800&display=swap"
        />
        {/* Material Symbols icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* Math rendering */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.44/dist/katex.min.css" />
        {/* Code syntax highlighting */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css" />
        <meta name="theme-color" content="#FAF9F4" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0D150F" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Texture overlay — sits on top of everything, pointer-events none */}
          <GrainOverlay />

          {/* Navigation */}
          <Navbar />

          {/* Page content — padded top to clear fixed navbar */}
          <main className="flex-1 pt-[88px]" id="main-content">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
