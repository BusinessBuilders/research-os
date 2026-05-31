"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { ResearchSession, Need } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.76.233.80:8001";

export default function GapsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`${API_URL}/api/sessions/${id}`).then(r => r.json()).then(s => {
      setSession(s);
      setSelected(new Set(s.needs?.filter((n: Need) => n.selected).map((n: Need) => n.id) || []));
    });
  }, [id]);

  async function handleResearch() {
    await fetch(`${API_URL}/api/sessions/${id}/research`, { method: "POST" });
    router.push(`/research/${id}/results`);
  }

  if (!session) return <p>Loading...</p>;

  const priorityColors = { critical: "destructive", important: "default", "nice-to-have": "secondary" } as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Gap Analysis</h1>
      <p className="text-muted-foreground mb-6">{session.goal}</p>

      <div className="space-y-3 mb-6">
        {session.needs.map((need) => (
          <Card key={need.id} className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selected.has(need.id)}
                onCheckedChange={() => {
                  const next = new Set(selected);
                  next.has(need.id) ? next.delete(need.id) : next.add(need.id);
                  setSelected(next);
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{need.description}</span>
                  <Badge variant={priorityColors[need.priority]}>{need.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{need.rationale}</p>
                <p className="text-xs text-muted-foreground mt-1">{need.estimated_cost_range}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleResearch} disabled={selected.size === 0}>
        Research {selected.size} Selected Needs
      </Button>
    </div>
  );
}
