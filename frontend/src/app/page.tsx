import Link from "next/link";
import { Calendar, ListChecks, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Logo } from "@/components/logo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function getSessions() {
  try {
    const res = await fetch(`${API_URL}/api/sessions`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const MODE_LABEL: Record<string, string> = {
  "goal-driven": "GOAL-DRIVEN",
  "product-research": "PRODUCT RESEARCH",
  "direct-lookup": "DIRECT LOOKUP",
};

export default async function Dashboard() {
  const sessions = await getSessions();

  return (
    <div>
      <div className="flex justify-between items-start gap-4 mb-6">
        <div>
          <div className="ros-eyebrow mb-2">Sessions</div>
          <h1 className="text-2xl font-semibold tracking-tight">Research Sessions</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/research/new">
            <Button
              className="text-white border-none"
              style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
            >
              <Plus size={15} /> New Research
            </Button>
          </Link>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div
          className="rounded-[var(--radius-xl)] text-center py-14 px-6"
          style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
        >
          <div className="inline-flex mb-4">
            <Logo variant="mark" size={40} />
          </div>
          <h2 className="text-lg font-semibold mb-1.5">No research sessions yet</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            Describe a goal and the advisor will identify what you need, search sources, and score the fit.
          </p>
          <Link href="/research/new">
            <Button
              className="text-white border-none"
              style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
            >
              <Sparkles size={15} /> Start your first research
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-3.5">
          {sessions.map((s: { id: string; goal: string; created_at: string; mode: string; budget: number | null; status: string; needs: { length: number } | unknown[] }) => {
            const needCount = Array.isArray(s.needs) ? s.needs.length : 0;
            return (
              <Link key={s.id} href={s.status === "complete" || s.status === "decided" ? `/research/${s.id}/results` : `/research/${s.id}`}>
                <div
                  className="rounded-[var(--radius-xl)] p-[18px] flex flex-col gap-3 h-full cursor-pointer transition-all duration-150 hover:bg-[var(--surface-3)]"
                  style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
                >
                  <div className="flex justify-between items-start gap-2.5">
                    <span className="ros-eyebrow">{MODE_LABEL[s.mode] || s.mode}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-[15px] font-semibold leading-snug tracking-tight flex-1">{s.goal}</p>
                  <div className="h-px bg-border" />
                  <div className="flex items-center gap-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date(s.created_at).toISOString().slice(0, 10)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ListChecks size={13} />
                      {needCount} {needCount === 1 ? "need" : "needs"}
                    </span>
                    {s.budget != null && (
                      <span className="ml-auto ros-mono">${s.budget.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
