"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResearchSession } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

function DecideContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [rationale, setRationale] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [result, setResult] = useState<{ wiki_path: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedIds = searchParams.get("selected")?.split(",").filter(Boolean) || [];

  useEffect(() => {
    fetch(`${API_URL}/api/sessions/${id}`).then(r => r.json()).then(setSession);
  }, [id]);

  const selectedProducts = session?.needs.flatMap(n => n.products).filter(p => selectedIds.includes(p.id)) || [];
  const totalCost = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  async function handleDecide() {
    setSubmitting(true);
    const res = await fetch(`${API_URL}/api/sessions/${id}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selected_product_ids: selectedIds,
        rationale,
        project_slug: projectSlug || null,
        budget_category: budgetCategory || null,
      }),
    });
    const data = await res.json();
    setResult(data);
    setSubmitting(false);
  }

  if (!session) return <p>Loading...</p>;

  if (result) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Decision Saved</h1>
        <p className="text-green-400 mb-2">Wiki page written to:</p>
        <code className="bg-muted p-2 rounded block mb-4">{result.wiki_path}</code>
        <a href="/" className="text-blue-400">Back to dashboard</a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Finalize Decision</h1>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-3">Selected Products</h2>
        {selectedProducts.map(p => (
          <div key={p.id} className="flex justify-between py-2 border-b last:border-0">
            <span>{p.name}</span>
            <span>{p.price ? `$${p.price.toFixed(2)}` : "N/A"}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-semibold">
          <span>Total</span>
          <span>${totalCost.toFixed(2)}{session.budget ? ` / $${session.budget} budget` : ""}</span>
        </div>
      </Card>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Rationale</label>
          <Textarea value={rationale} onChange={e => setRationale(e.target.value)}
            placeholder="Why are you choosing these products?" rows={3} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Project (wiki slug)</label>
          <Input value={projectSlug} onChange={e => setProjectSlug(e.target.value)}
            placeholder="project-eve-humanoid-robot" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Budget Category</label>
          <Input value={budgetCategory} onChange={e => setBudgetCategory(e.target.value)}
            placeholder="robotics-rd" />
        </div>

        <Button onClick={handleDecide} disabled={selectedIds.length === 0 || submitting}>
          {submitting ? "Writing to wiki..." : "Approve & Write to Wiki"}
        </Button>
      </div>
    </div>
  );
}

export default function DecidePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DecideContent />
    </Suspense>
  );
}
