"use client";

import { Compass, ExternalLink, MessageSquare } from "lucide-react";
import type { ApproachBrief } from "@/lib/types";

/** Community-sourced methods brief from gap analysis — shown before products
 * so the user sees WHY the needs list assumes a particular method. */
export function ApproachCard({ approach, compact = false }: { approach: ApproachBrief; compact?: boolean }) {
  if (!approach.methods.length) return null;
  const recommended = approach.methods.find(m => m.name === approach.recommended) ?? approach.methods[0];
  const others = approach.methods.filter(m => m !== recommended);

  if (compact) {
    return (
      <div
        className="rounded-[var(--radius-xl)] px-4 py-3 mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--brand-periwinkle)" }}>
          <Compass size={11} className="inline mr-1 -mt-0.5" aria-hidden="true" />
          Method
        </span>
        <span className="text-sm font-semibold">{recommended.name}</span>
        <span className="text-[13px] text-muted-foreground">{approach.why}</span>
        {others.length > 0 && (
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
            also considered: {others.map(m => m.name).join(", ")}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-[var(--radius-xl)] p-5 mb-6"
      style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
    >
      <div className="ros-eyebrow mb-3" style={{ color: "var(--brand-periwinkle)" }}>
        <Compass size={12} className="inline mr-1.5 -mt-0.5" aria-hidden="true" />
        Recommended approach
      </div>

      <div className="mb-3">
        <span className="text-base font-semibold">{recommended.name}</span>
        <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{recommended.summary}</p>
        {recommended.community_take && (
          <p className="text-[13px] mt-1.5 leading-relaxed flex gap-1.5 items-start" style={{ color: "var(--text-secondary)" }}>
            <MessageSquare size={12} className="shrink-0 mt-0.5" style={{ color: "var(--brand-periwinkle)" }} aria-label="Community take" role="img" />
            {recommended.community_take}
          </p>
        )}
        {approach.why && (
          <p className="text-[13px] mt-2 leading-relaxed">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mr-2">Why</span>
            {approach.why}
          </p>
        )}
      </div>

      {others.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-3" style={{ borderTop: "1px solid var(--hairline)" }}>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Also considered</span>
          {others.map(m => (
            <p key={m.name} className="text-[13px] leading-relaxed">
              <span className="font-medium">{m.name}</span>
              <span className="text-muted-foreground"> — {m.summary}{m.community_take ? ` ${m.community_take}` : ""}</span>
            </p>
          ))}
        </div>
      )}

      {approach.sources.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3" style={{ borderTop: "1px solid var(--hairline)" }}>
          {approach.sources.map(s => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs inline-flex items-center gap-1 hover:underline max-w-[260px] truncate"
              style={{ color: "var(--info-text)" }}
            >
              {s.title || s.url} <ExternalLink size={9} aria-label="Opens in new tab" role="img" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
