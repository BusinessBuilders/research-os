"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/components/priority-badge";
import type { ResearchSession, Need } from "@/lib/types";
import { API_URL } from "@/lib/api";

export default function GapsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/sessions/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Session fetch failed (${res.status})`);
        return res.json();
      })
      .then((s: ResearchSession) => {
        setLoadError(null);
        setSession(s);
        setSelected(new Set(s.needs?.filter((n: Need) => n.selected || n.priority !== "nice-to-have").map((n: Need) => n.id) || []));
      })
      .catch(() => setLoadError("Couldn't load this session. The research service may be unreachable."));
  }, [id]);

  async function handleResearch() {
    setStarting(true);
    setResearchError(null);
    try {
      const res = await fetch(`${API_URL}/api/sessions/${id}/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need_ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error(`Research start failed (${res.status})`);
      router.push(`/research/${id}/results`);
    } catch {
      setResearchError("Couldn't start research. Check the research service and try again.");
      setStarting(false);
    }
  }

  if (loadError) {
    return (
      <div
        className="rounded-[var(--radius-xl)] p-6 max-w-[560px]"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <div className="ros-eyebrow mb-2" style={{ color: "var(--danger-text)" }}>Error</div>
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </div>
    );
  }

  if (!session) {
    return <p className="text-muted-foreground animate-pulse">Loading…</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="ros-eyebrow mb-2">Gap analysis</div>
        <h1 className="text-2xl font-semibold tracking-tight">What you&apos;ll need</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-[620px]">
          Qwen broke the goal into needs and scored each against your budget. Pick the ones to research.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 mb-[22px]">
        {session.needs.map((need) => (
          <div
            key={need.id}
            className="rounded-[var(--radius-xl)] p-4"
            style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
          >
            <div className="flex gap-3 items-start">
              <Checkbox
                checked={selected.has(need.id)}
                onCheckedChange={() => {
                  const next = new Set(selected);
                  next.has(need.id) ? next.delete(need.id) : next.add(need.id);
                  setSelected(next);
                }}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex-1 min-w-0 text-sm font-semibold leading-relaxed">
                    {need.description}
                    <span className="inline-flex align-middle ml-2">
                      <PriorityBadge priority={need.priority} />
                    </span>
                  </div>
                  <span className="ros-mono text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                    {need.estimated_cost_range}
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{need.rationale}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {researchError && (
        <p className="text-sm mb-3" style={{ color: "var(--danger-text)" }}>{researchError}</p>
      )}

      <div className="flex justify-between items-center">
        <span className="text-[13px] text-muted-foreground">
          {selected.size} of {session.needs.length} selected
        </span>
        <Button
          onClick={handleResearch}
          disabled={selected.size === 0 || starting}
          className="text-white border-none"
          style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
        >
          <Search size={15} /> {starting ? "Starting…" : `Research ${selected.size} Selected`}
        </Button>
      </div>
    </div>
  );
}
