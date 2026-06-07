"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, CircleCheck, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FitScore } from "@/components/fit-score";
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

  if (!session) return <p className="text-muted-foreground animate-pulse">Loading…</p>;

  if (result) {
    return (
      <div className="max-w-[560px] mx-auto text-center pt-6">
        <div
          className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-[18px]"
          style={{
            background: "var(--success-soft)",
            color: "var(--success-text)",
            boxShadow: "0 0 24px rgba(34, 197, 94, 0.25)",
          }}
        >
          <CircleCheck size={28} />
        </div>
        <h1 className="text-[22px] font-semibold mb-2">Decision written to wiki</h1>
        <p className="text-sm text-muted-foreground mb-[18px]">
          A durable record was committed for the next person (or agent) who searches this.
        </p>
        <code
          className="block font-mono text-[13px] px-3.5 py-2.5 rounded-lg mb-5"
          style={{
            color: "var(--brand-periwinkle)",
            background: "var(--surface-input)",
            boxShadow: "var(--ring-hairline)",
          }}
        >
          {result.wiki_path}
        </code>
        <a href="/">
          <Button variant="outline">
            <ArrowLeft size={14} /> Back to dashboard
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="mb-6">
        <div className="ros-eyebrow mb-2">Decision</div>
        <h1 className="text-2xl font-semibold tracking-tight">Finalize & commit</h1>
        <p className="text-sm text-muted-foreground mt-2">Review the picks, then write a decision record to the wiki.</p>
      </div>

      {/* Selected products card */}
      <div
        className="rounded-[var(--radius-xl)] p-6 mb-[18px]"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <div className="ros-eyebrow mb-3">Selected products</div>
        {selectedProducts.length === 0 && (
          <p className="text-sm text-muted-foreground">No products selected.</p>
        )}
        {selectedProducts.map(p => (
          <div key={p.id} className="flex items-center gap-3 py-[9px] border-b border-border">
            <FitScore score={p.fit_score} showLabel={false} />
            <span className="flex-1 text-sm">{p.name}</span>
            <span className="text-xs text-muted-foreground">{p.source_name}</span>
            <span className="ros-mono text-[13px] w-[78px] text-right">${(p.price || 0).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-3.5">
          <span className="text-sm font-semibold">Total</span>
          <span className="flex items-center gap-2.5">
            <span className="ros-mono text-base font-semibold">${totalCost.toFixed(2)}</span>
            {session.budget && (
              <Badge
                variant="outline"
                className={`rounded-full border ${
                  totalCost <= session.budget
                    ? "bg-[var(--success-soft)] text-[var(--success-text)] border-[rgba(34,197,94,0.3)]"
                    : "bg-[var(--danger-soft)] text-[var(--danger-text)] border-[rgba(239,68,68,0.3)]"
                }`}
              >
                {totalCost <= session.budget ? `under $${session.budget.toLocaleString()}` : "over budget"}
              </Badge>
            )}
          </span>
        </div>
      </div>

      {/* Decision record preview */}
      <div
        className="rounded-[var(--radius-xl)] p-6 mb-[18px]"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <div className="ros-eyebrow mb-2.5 flex items-center gap-1.5">
          <ScrollText size={12} /> Decision record preview
        </div>
        <ul className="m-0 pl-[18px] text-muted-foreground text-[13px] leading-[1.9]">
          <li>Goal, budget, and the {selectedProducts.length} chosen part{selectedProducts.length !== 1 ? "s" : ""} with prices & sources</li>
          <li>Fit score and rationale captured per product</li>
          <li>Your rationale + project slug, committed to the team wiki</li>
        </ul>
      </div>

      {/* Form fields */}
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Rationale</label>
      <Textarea
        value={rationale}
        onChange={e => setRationale(e.target.value)}
        placeholder="Why these picks? (e.g. encoder resolution justified the price premium)"
        rows={3}
        className="bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
      />

      <div className="grid grid-cols-2 gap-3 mt-3.5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Project (wiki slug)</label>
          <Input
            value={projectSlug}
            onChange={e => setProjectSlug(e.target.value)}
            placeholder="project-eve-humanoid-robot"
            className="font-mono bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Budget category</label>
          <Input
            value={budgetCategory}
            onChange={e => setBudgetCategory(e.target.value)}
            placeholder="robotics-rd"
            className="font-mono bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-[22px]">
        <a href={`/research/${id}/results`}>
          <Button variant="outline">
            <ArrowLeft size={14} /> Back
          </Button>
        </a>
        <Button
          onClick={handleDecide}
          disabled={selectedProducts.length === 0 || submitting}
          className="text-white border-none"
          style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
        >
          <Check size={15} /> {submitting ? "Writing to wiki…" : "Write Decision to Wiki"}
        </Button>
      </div>
    </div>
  );
}

export default function DecidePage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground animate-pulse">Loading…</p>}>
      <DecideContent />
    </Suspense>
  );
}
