import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.76.233.80:8001";

async function getSessions() {
  try {
    const res = await fetch(`${API_URL}/api/sessions`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Dashboard() {
  const sessions = await getSessions();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Research Sessions</h1>
        <Link href="/research/new">
          <Button>New Research</Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <p className="text-muted-foreground">No research sessions yet. Start your first one.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: { id: string; goal: string; created_at: string; mode: string; budget: number | null; status: string }) => (
            <Link key={s.id} href={`/research/${s.id}`}>
              <Card className="p-4 hover:bg-accent/50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{s.goal}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(s.created_at).toLocaleDateString()} · {s.mode}
                      {s.budget ? ` · $${s.budget} budget` : ""}
                    </p>
                  </div>
                  <Badge variant={s.status === "decided" ? "default" : "secondary"}>
                    {s.status}
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
