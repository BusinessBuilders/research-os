import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { geistSans, geistMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResearchOS",
  description: "AI-powered product research — AI Procurement Advisor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground font-sans`}>
        <header
          className="sticky top-0 z-10 flex items-center justify-between px-6 border-b border-border"
          style={{
            height: "var(--header-h)",
            background: "rgba(1, 1, 32, 0.72)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-base no-underline">
            <svg width={24} height={24} viewBox="0 0 120 120" aria-hidden="true" className="block shrink-0">
              <defs>
                <linearGradient id="hdr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fc4c02" />
                  <stop offset="50%" stopColor="#ef2cc1" />
                  <stop offset="100%" stopColor="#bdbbff" />
                </linearGradient>
              </defs>
              <g transform="translate(64,62)">
                <circle cx="-12" cy="-12" r="40" fill="none" stroke="url(#hdr-grad)" strokeWidth="3" />
                <line x1="16" y1="16" x2="42" y2="42" stroke="url(#hdr-grad)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="-24" cy="-20" r="3" fill="#fc4c02" opacity="0.9" />
                <circle cx="-4" cy="-28" r="2.5" fill="#ef2cc1" opacity="0.9" />
                <circle cx="-18" cy="-4" r="2" fill="#bdbbff" opacity="0.9" />
                <line x1="-24" y1="-20" x2="-4" y2="-28" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
                <line x1="-4" y1="-28" x2="-18" y2="-4" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
                <line x1="-18" y1="-4" x2="-24" y2="-20" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
              </g>
            </svg>
            <span>Research<span className="ros-gradient-text">OS</span></span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/research/new" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
              New Research
            </Link>
            <Link
              href="/research/new"
              className="inline-flex items-center gap-1.5 h-7 px-3 text-sm font-medium text-white rounded-[var(--radius-lg)] transition-all hover:brightness-110"
              style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
            >
              <Plus size={14} />
              New
            </Link>
          </nav>
        </header>
        <main className="max-w-[var(--container-max)] mx-auto px-6 py-8 pb-24">
          {children}
        </main>
        {/* Floating advisor orb */}
        <button
          title="Ask the advisor"
          aria-label="Ask the advisor"
          className="fixed right-6 bottom-6 w-[52px] h-[52px] rounded-full border-none cursor-pointer text-white flex items-center justify-center transition-transform hover:scale-105"
          style={{
            background: "var(--brand-gradient)",
            boxShadow: "var(--glow-brand), var(--elev-2)",
          }}
        >
          <Sparkles size={22} />
        </button>
      </body>
    </html>
  );
}
