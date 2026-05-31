"use client";

import { useEffect, useState } from "react";
import type { ResearchJob } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.76.233.80:8001";

export function ResearchStatus({ sessionId, onComplete }: { sessionId: string; onComplete: () => void }) {
  const [job, setJob] = useState<ResearchJob | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/${sessionId}/status`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
          if (data.status === "complete" || data.status === "failed") {
            clearInterval(interval);
            onComplete();
          }
        }
      } catch { /* polling, ignore errors */ }
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId, onComplete]);

  if (!job) return <p className="text-muted-foreground">Starting research...</p>;

  return (
    <div className="space-y-2">
      <p className="font-medium">Status: {job.status}</p>
      {job.current_need && <p className="text-sm text-muted-foreground">Researching: {job.current_need}</p>}
      <p className="text-sm text-muted-foreground">
        Progress: {job.needs_completed}/{job.needs_total} needs · Round {job.current_round}
      </p>
      {job.error && <p className="text-sm text-red-400">Error: {job.error}</p>}
    </div>
  );
}
