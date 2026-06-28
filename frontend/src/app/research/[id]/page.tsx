"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, CircleCheck, CircleX, Circle, Loader, RotateCw, Search, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ResearchSession, JobStatus, NeedStatus } from "@/lib/types";
import { API_URL } from "@/lib/api";

const PIPELINE_STEPS = [
  { id: "analyzing", label: "Analyzing\nNeeds", icon: Sparkles },
  { id: "searching", label: "Searching\nSources", icon: Search },
  { id: "scoring", label: "Scoring\nFit", icon: Target },
  { id: "complete", label: "Complete", icon: CircleCheck },
];

/** Returns the index of the currently ACTIVE pipeline stage (-1 = none). */
function pipelineStageIndex(status: string, evaluating = false): number {
  if (status === "created" || status === "analyzing") return 0;
  if (status === "researching") return evaluating ? 2 : 1;
  if (status === "complete" || status === "decided") return 3;
  return -1;
}

function NeedStatusRow({ ns }: { ns: NeedStatus }) {
  const iconMap = {
    complete: { Icon: CircleCheck, color: "var(--success-text)" },
    failed: { Icon: CircleX, color: "var(--danger-text)" },
    searching: { Icon: Loader, color: "var(--info-text)", spin: true },
    evaluating: { Icon: Loader, color: "var(--warning-text)", spin: true },
    pending: { Icon: Circle, color: "var(--text-faint)" },
  };
  const m = iconMap[ns.status] || iconMap.pending;
  const spin = "spin" in m && m.spin;

  return (
    <div
      className="rounded-[var(--radius-xl)] p-4 flex items-center gap-3"
      style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
    >
      <span style={{ color: m.color }} className={`inline-flex ${spin ? "ros-spin" : ""}`}>
        <m.Icon size={16} />
      </span>
      <span className={`flex-1 min-w-0 text-sm ${ns.status === "complete" ? "text-foreground" : "text-[var(--text-secondary)]"}`}>
        {ns.description}
      </span>
      {ns.status === "complete" && (
        <span className="ros-mono text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {ns.product_count} products
        </span>
      )}
      {(ns.status === "searching" || ns.status === "evaluating") && (
        <Badge
          variant="outline"
          className={`font-mono text-xs uppercase tracking-[0.08em] rounded-full border ${
            ns.status === "evaluating"
              ? "bg-[var(--warning-soft)] text-[var(--warning-text)] border-[rgba(245,158,11,0.3)]"
              : "bg-[var(--info-soft)] text-[var(--info-text)] border-[rgba(59,130,246,0.3)]"
          }`}
        >
          {ns.status}
        </Badge>
      )}
      {ns.status === "failed" && ns.error && (
        <span className="text-xs" style={{ color: "var(--danger-text)" }}>failed</span>
      )}
    </div>
  );
}

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [processing, setProcessing] = useState(false);

  const loadSession = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/${id}`, { signal });
      if (!res.ok) return;
      const s: ResearchSession = await res.json();
      if (signal?.aborted) return;
      setSession(s);
      return s;
    } catch {
      return; // aborted or unreachable
    }
  }, [id]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function init() {
      try {
        const s = await loadSession(controller.signal);
        if (!mounted || !s) return;

        if (s.status === "decided") { router.push(`/research/${id}/decide`); return; }
        if (s.status === "complete" || s.status === "researching") { router.push(`/research/${id}/results`); return; }

        if (s.status === "analyzing" && s.needs?.length > 0) {
          router.push(`/research/${id}/gaps`);
          return;
        }

        if (s.status === "created" && s.mode === "goal-driven") {
          setProcessing(true);
          await fetch(`${API_URL}/api/sessions/${id}/analyze`, { method: "POST", signal: controller.signal });
          const updated = await loadSession(controller.signal);
          if (!mounted) return;
          setProcessing(false);
          if (updated && updated.needs?.length > 0) {
            router.push(`/research/${id}/gaps`);
          }
          return;
        }

        if (s.status === "created") {
          setProcessing(true);
          await fetch(`${API_URL}/api/sessions/${id}/research`, { method: "POST", signal: controller.signal });
          if (!mounted) return;
          setProcessing(false);
          router.push(`/research/${id}/results`);
          return;
        }
      } catch { /* aborted or unreachable */ }
    }
    init();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, router, loadSession]);

  useEffect(() => {
    if (!session || cancelled) return;
    if (session.status === "complete" || session.status === "decided") return;

    let mounted = true;
    const controller = new AbortController();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/${id}/status`, { signal: controller.signal });
        if (!mounted) return;
        if (res.ok) {
          const data: JobStatus = await res.json();
          if (!mounted) return;
          setJob(data);
          if (data.status === "complete" || data.status === "failed" || data.status === "cancelled") {
            clearInterval(interval);
            await loadSession(controller.signal);
          }
        }
      } catch { /* polling */ }
    }, 3000);

    return () => {
      mounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [id, session, cancelled, loadSession]);

  useEffect(() => {
    if (cancelled || !session) return;
    if (session.status === "complete" || session.status === "decided") return;
    const i = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(i);
  }, [cancelled, session]);

  async function handleCancel() {
    setCancelled(true);
    await fetch(`${API_URL}/api/sessions/${id}/cancel`, { method: "POST" });
  }

  if (!session) {
    return (
      <div>
        <div className="ros-eyebrow mb-2">Loading</div>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Processing</h1>
        <p className="text-muted-foreground animate-pulse">Connecting to research pipeline…</p>
      </div>
    );
  }

  const anyEvaluating = session.status === "researching" &&
    (job?.need_statuses?.some(ns => ns.status === "evaluating") ?? false);
  const stageIdx = pipelineStageIndex(
    job?.status === "complete" ? "complete" : session.status,
    anyEvaluating,
  );
  const isComplete = session.status === "complete" || session.status === "decided";
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="ros-eyebrow mb-2">{session.mode} · {isComplete ? "complete" : cancelled ? "cancelled" : "running"}</div>
        <h1 className="text-2xl font-semibold tracking-tight">{session.goal?.slice(0, 40) || "Research Session"}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {session.goal?.slice(40) ? `${session.goal.slice(0, 60)}…` : ""}
          {session.budget ? ` · $${session.budget.toLocaleString()} budget` : ""}
        </p>
      </div>

      {/* Pipeline rail */}
      <div
        className="rounded-[var(--radius-xl)] p-6 mb-[18px]"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <div className="flex justify-between items-center mb-[18px]">
          <div>
            <p className="text-base font-semibold">
              {cancelled ? "Research cancelled" : isComplete ? "Pipeline complete" : processing ? "Analyzing needs…" : "Researching…"}
            </p>
            <p className="ros-mono text-[13px] text-muted-foreground mt-1">
              {job ? `${job.needs_completed}/${job.needs_total} needs` : session.needs?.length ? `${session.needs.length} needs` : "0 needs"}
              {" · "}{minutes}m {seconds}s elapsed
            </p>
          </div>
          {!isComplete && !cancelled ? (
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X size={14} /> Cancel
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => { setCancelled(false); setElapsed(0); router.refresh(); }}>
              <RotateCw size={14} /> Re-run
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {PIPELINE_STEPS.map((step, i) => {
            const state = cancelled ? "idle" : (i < stageIdx || isComplete) ? "done" : i === stageIdx ? "active" : "idle";
            const color = state === "done" ? "var(--success-text)" : state === "active" ? "var(--brand-periwinkle)" : "var(--text-faint)";
            return (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div
                  className="h-[3px] rounded-sm"
                  style={{
                    background: state === "idle" ? "var(--surface-soft)" : color,
                    opacity: state === "active" ? 0.9 : 1,
                  }}
                />
                <div className="flex items-center gap-[7px] text-xs" style={{ color }}>
                  <step.icon size={14} className={state === "active" ? "ros-spin" : ""} />
                  <span className="font-mono uppercase tracking-[0.08em] text-[10px]">
                    {step.label.split("\n")[0]}
                    {step.label.includes("\n") && <><br />{step.label.split("\n")[1]}</>}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Need list */}
      {job?.need_statuses && job.need_statuses.length > 0 && (
        <>
          <div className="ros-eyebrow mb-2.5">Identified needs</div>
          <div className="flex flex-col gap-2">
            {job.need_statuses.map(ns => (
              <NeedStatusRow key={ns.need_id} ns={ns} />
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <div className="flex justify-end mt-[22px]">
        <Button
          disabled={!isComplete && !cancelled}
          onClick={() => router.push(`/research/${id}/gaps`)}
          className={isComplete ? "text-white border-none" : ""}
          style={isComplete ? { background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" } : {}}
        >
          Continue to gap analysis <ChevronRight size={15} />
        </Button>
      </div>
    </div>
  );
}
