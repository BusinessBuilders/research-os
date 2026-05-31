"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.76.233.80:8001";

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function process() {
      const res = await fetch(`${API_URL}/api/sessions/${id}`);
      if (!res.ok) { setStatus("Session not found"); return; }
      const session = await res.json();

      if (session.status === "decided") { router.push(`/research/${id}/decide`); return; }
      if (session.status === "complete" || session.status === "researching") { router.push(`/research/${id}/results`); return; }
      if (session.status === "analyzing" && session.needs?.length > 0) { router.push(`/research/${id}/gaps`); return; }

      if (session.mode === "goal-driven") {
        setStatus("Running gap analysis with Qwen...");
        await fetch(`${API_URL}/api/sessions/${id}/analyze`, { method: "POST" });
        router.push(`/research/${id}/gaps`);
        return;
      }

      setStatus("Starting research...");
      await fetch(`${API_URL}/api/sessions/${id}/research`, { method: "POST" });
      router.push(`/research/${id}/results`);
    }
    process();
  }, [id, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Processing</h1>
      <p className="text-muted-foreground">{status}</p>
    </div>
  );
}
