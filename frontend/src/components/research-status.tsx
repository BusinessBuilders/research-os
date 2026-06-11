"use client";

import { useEffect, useRef, useState } from "react";
import { X, CircleCheck, CircleX, Circle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { JobStatus, NeedStatus } from "@/lib/types";
import { API_URL } from "@/lib/api";

function NeedIcon({ status }: { status: NeedStatus["status"] }) {
  switch (status) {
    case "complete": return <span style={{ color: "var(--success-text)" }}><CircleCheck size={16} /></span>;
    case "failed": return <span style={{ color: "var(--danger-text)" }}><CircleX size={16} /></span>;
    case "searching": return <span className="ros-spin" style={{ color: "var(--info-text)" }}><Loader size={16} /></span>;
    case "evaluating": return <span className="ros-spin" style={{ color: "var(--warning-text)" }}><Loader size={16} /></span>;
    default: return <span style={{ color: "var(--text-faint)" }}><Circle size={16} /></span>;
  }
}

export function ResearchStatus({ sessionId, onComplete }: { sessionId: string; onComplete: () => void }) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Hold onComplete in a ref so the polling interval never restarts when the
  // parent re-renders with a new callback identity.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/${sessionId}/status`, { signal: controller.signal });
        if (!mounted) return;
        if (res.ok) {
          const data: JobStatus = await res.json();
          if (!mounted) return;
          setJob(data);
          if (data.status === "complete" || data.status === "failed" || data.status === "cancelled") {
            clearInterval(interval);
            onCompleteRef.current();
          }
        }
      } catch { /* polling */ }
    }, 3000);
    return () => {
      mounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [sessionId]);

  // Depend on the boolean, not the job object — each 3s poll creates a new
  // job object, and re-running the effect per poll would reset the 1s timer's
  // phase and undercount elapsed time.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jobRunning = !!job && !["complete", "failed", "cancelled"].includes(job.status);
  useEffect(() => {
    if (!jobRunning) {
      if (timerRef.current != null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (timerRef.current != null) return; // a timer is already running
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => {
      if (timerRef.current != null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [jobRunning]);

  async function handleCancel() {
    setCancelling(true);
    try {
      await fetch(`${API_URL}/api/sessions/${sessionId}/cancel`, { method: "POST" });
    } catch {
      setCancelling(false); // let the user try again if the request failed
    }
  }

  if (!job) {
    return <p className="text-muted-foreground animate-pulse mb-6">Connecting to research pipeline…</p>;
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div
      className="rounded-[var(--radius-xl)] p-6 mb-6"
      style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-base font-semibold">
            {job.status === "complete" ? "Research Complete" :
             job.status === "failed" ? "Research Failed" :
             job.status === "cancelled" ? "Research Cancelled" :
             "Researching…"}
          </p>
          <p className="ros-mono text-[13px] text-muted-foreground mt-1">
            {job.needs_completed}/{job.needs_total} needs complete
            {elapsed > 0 && ` · ${minutes}m ${seconds}s elapsed`}
          </p>
        </div>
        {!["complete", "failed", "cancelled"].includes(job.status) && (
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelling}>
            <X size={14} /> {cancelling ? "Cancelling…" : "Cancel"}
          </Button>
        )}
      </div>

      {job.error && <p className="text-sm mb-4" style={{ color: "var(--danger-text)" }}>{job.error}</p>}

      <div className="flex flex-col gap-2">
        {job.need_statuses.map((ns) => (
          <div key={ns.need_id} className="flex items-center gap-3 py-1">
            <NeedIcon status={ns.status} />
            <span className={`text-sm flex-1 ${ns.status === "complete" ? "text-foreground" : "text-[var(--text-secondary)]"}`}>
              {ns.description}
            </span>
            {ns.status === "complete" && (
              <span className="ros-mono text-xs text-muted-foreground">{ns.product_count} products</span>
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
        ))}
      </div>
    </div>
  );
}
