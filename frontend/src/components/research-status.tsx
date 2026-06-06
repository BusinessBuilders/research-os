"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { JobStatus, NeedStatus } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

function NeedStatusIcon({ status }: { status: NeedStatus["status"] }) {
  switch (status) {
    case "complete": return <span className="text-green-400">✓</span>;
    case "failed": return <span className="text-red-400">✗</span>;
    case "searching": return <span className="text-blue-400 animate-pulse">⟳ Searching...</span>;
    case "evaluating": return <span className="text-yellow-400 animate-pulse">⟳ Evaluating...</span>;
    default: return <span className="text-muted-foreground">○</span>;
  }
}

export function ResearchStatus({ sessionId, onComplete }: { sessionId: string; onComplete: () => void }) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/${sessionId}/status`);
        if (res.ok) {
          const data: JobStatus = await res.json();
          setJob(data);
          if (data.status === "complete" || data.status === "failed" || data.status === "cancelled") {
            clearInterval(interval);
            onComplete();
          }
        }
      } catch { /* polling */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [sessionId, onComplete]);

  async function handleCancel() {
    setCancelling(true);
    await fetch(`${API_URL}/api/sessions/${sessionId}/cancel`, { method: "POST" });
  }

  if (!job) return <p className="text-muted-foreground animate-pulse">Connecting to research pipeline...</p>;

  const elapsed = job.started_at
    ? Math.round((Date.now() - new Date(job.started_at).getTime()) / 1000)
    : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-lg">
            {job.status === "complete" ? "Research Complete" :
             job.status === "failed" ? "Research Failed" :
             job.status === "cancelled" ? "Research Cancelled" :
             "Researching Products..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {job.needs_completed}/{job.needs_total} needs complete
            {elapsed > 0 && ` · ${minutes}m ${seconds}s elapsed`}
          </p>
        </div>
        {!["complete", "failed", "cancelled"].includes(job.status) && (
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? "Cancelling..." : "Cancel"}
          </Button>
        )}
      </div>

      {job.error && <p className="text-sm text-red-400 mb-4">{job.error}</p>}

      <div className="space-y-2">
        {job.need_statuses.map((ns) => (
          <div key={ns.need_id} className="flex items-center gap-3 py-1">
            <NeedStatusIcon status={ns.status} />
            <span className={`text-sm flex-1 ${ns.status === "complete" ? "text-foreground" : "text-muted-foreground"}`}>
              {ns.description}
            </span>
            {ns.status === "complete" && (
              <span className="text-xs text-muted-foreground">{ns.product_count} products</span>
            )}
            {ns.status === "failed" && ns.error && (
              <span className="text-xs text-red-400">failed</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
