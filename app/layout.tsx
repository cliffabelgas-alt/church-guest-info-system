import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Church Guest Information System",
  description: "Welcome and track first-time guests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <header className="site-header">
            <div className="container">
              <Link href="/" className="brand">
                Guest Information System
              </Link>
            </div>
          </header>
          <main>
            <div className="container">{children}</div>
          </main>
          <footer className="site-footer">
            Church Guest Information System
          </footer>
        </div>
      </body>
    </html>
  );
}
