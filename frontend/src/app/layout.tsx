import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResearchOS",
  description: "AI-powered product research for the AI Operating System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <header className="border-b px-6 py-3 flex items-center justify-between">
          <a href="/" className="text-lg font-semibold">ResearchOS</a>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a href="/">Dashboard</a>
            <a href="/research/new">New Research</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
