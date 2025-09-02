import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notes — Minimal Personal Notes Manager",
  description: "Create, edit, and organize your personal notes with tags.",
  applicationName: "Notes",
  authors: [{ name: "Notes App" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="app-shell">
          <header className="header">
            <div className="container header-inner">
              <span className="brand" aria-label="Notes App">
                <span aria-hidden className="brand-mark" />
                Notes
              </span>
              <nav className="nav">
                <Link className="button ghost small" href="/">Home</Link>
                <Link className="button ghost small" href="/notes">Notes</Link>
                <Link className="button ghost small" href="/tags">Tags</Link>
                <Link className="button ghost small" href="/auth">Sign in</Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
