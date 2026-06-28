"use client";

import { useId } from "react";

export function Logo({
  variant = "full",
  size = 28,
  showTagline = false,
  className = "",
}: {
  variant?: "full" | "mark" | "wordmark";
  size?: number;
  showTagline?: boolean;
  className?: string;
}) {
  const gid = useId();

  const mark = (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" className="block shrink-0">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fc4c02" />
          <stop offset="50%" stopColor="#ef2cc1" />
          <stop offset="100%" stopColor="#bdbbff" />
        </linearGradient>
      </defs>
      <g transform="translate(64,62)">
        <circle cx="-12" cy="-12" r="40" fill="none" stroke={`url(#${gid})`} strokeWidth="3" />
        <line x1="16" y1="16" x2="42" y2="42" stroke={`url(#${gid})`} strokeWidth="3" strokeLinecap="round" />
        <circle cx="-24" cy="-20" r="3" fill="#fc4c02" opacity="0.9" />
        <circle cx="-4" cy="-28" r="2.5" fill="#ef2cc1" opacity="0.9" />
        <circle cx="-18" cy="-4" r="2" fill="#bdbbff" opacity="0.9" />
        <line x1="-24" y1="-20" x2="-4" y2="-28" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
        <line x1="-4" y1="-28" x2="-18" y2="-4" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
        <line x1="-18" y1="-4" x2="-24" y2="-20" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      </g>
    </svg>
  );

  if (variant === "mark") return <span className={className}>{mark}</span>;

  const wordSize = size * 0.62;
  const wordmark = (
    <span className="flex flex-col leading-none">
      <span
        className="font-semibold"
        style={{ fontSize: wordSize, letterSpacing: "-0.02em" }}
      >
        Research<span className="ros-gradient-text">OS</span>
      </span>
      {showTagline && (
        <span
          className="font-mono uppercase"
          style={{ fontSize: wordSize * 0.34, letterSpacing: "0.22em", color: "var(--text-muted-val)", marginTop: 4 }}
        >
          AI Procurement Advisor
        </span>
      )}
    </span>
  );

  if (variant === "wordmark") return <span className={className}>{wordmark}</span>;

  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.34 }}>
      {mark}
      {wordmark}
    </span>
  );
}
