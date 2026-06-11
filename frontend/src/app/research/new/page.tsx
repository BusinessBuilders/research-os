"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { List, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BudgetPill } from "@/components/budget-pill";
import { API_URL } from "@/lib/api";

export default function NewResearch() {
  const router = useRouter();
  const [mode, setMode] = useState<"goal" | "list">("goal");
  const [goal, setGoal] = useState("");
  const [listText, setListText] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const listLines = listText.split("\n").filter(l => l.trim());
  const hasInput = mode === "goal" ? goal.trim() : listLines.length > 0;
  const budgetNum = parseFloat(budget);
  const hasBudget = Number.isFinite(budgetNum) && budgetNum > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body: Record<string, unknown> = {
        goal: mode === "goal" ? goal : `Research ${listLines.length} items from shopping list`,
        budget: budget ? parseFloat(budget) : null,
      };

      if (mode === "list") {
        body.needs_list = listLines;
      }

      const res = await fetch(`${API_URL}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to create session");
      const session = await res.json();
      router.push(`/research/${session.id}`);
    } catch {
      setError("Couldn't reach the research service.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="mb-6">
        <div className="ros-eyebrow mb-2">New session</div>
        <h1 className="text-2xl font-semibold tracking-tight">What are you researching?</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          {mode === "goal"
            ? "One goal, one budget. The advisor handles the rest."
            : "Paste a list of items — one per line. Each gets researched in parallel."}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("goal")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-lg)] text-sm font-medium transition-colors"
          style={{
            background: mode === "goal" ? "var(--surface-soft)" : "transparent",
            color: mode === "goal" ? "var(--text)" : "var(--text-muted-val)",
            border: `1px solid ${mode === "goal" ? "var(--hairline-strong)" : "transparent"}`,
          }}
        >
          <Sparkles size={14} /> Describe a goal
        </button>
        <button
          type="button"
          onClick={() => setMode("list")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-lg)] text-sm font-medium transition-colors"
          style={{
            background: mode === "list" ? "var(--surface-soft)" : "transparent",
            color: mode === "list" ? "var(--text)" : "var(--text-muted-val)",
            border: `1px solid ${mode === "list" ? "var(--hairline-strong)" : "transparent"}`,
          }}
        >
          <List size={14} /> Paste a list
        </button>
      </div>

      <div
        className="rounded-[var(--radius-xl)] p-6"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <form onSubmit={handleSubmit}>
          {hasBudget && (
            <div className="flex justify-end mb-3.5">
              <BudgetPill amount={budgetNum} />
            </div>
          )}

          {mode === "goal" ? (
            <>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                What are you looking for?
              </label>
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="upgrade my robotics fab setup to build tendon-driven actuators…"
                rows={4}
                className="bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Describe a goal, a product to research, or a part to look up.
              </p>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Paste your shopping list
              </label>
              <Textarea
                value={listText}
                onChange={(e) => setListText(e.target.value)}
                placeholder={"ER11 collet chuck set with collets\nCarbide end mill starter set 1/8\" shank\nV-bit engraving set 30° 60° 90°\nTool length setter probe\nSpoilboard surfacing bit"}
                rows={8}
                className="font-mono text-[13px] bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                One item per line. Each line becomes a separate research task — searched on Amazon, eBay, Reddit, and general web.
                {listLines.length > 0 && (
                  <span className="ros-mono ml-2" style={{ color: "var(--brand-periwinkle)" }}>
                    {listLines.length} {listLines.length === 1 ? "item" : "items"}
                  </span>
                )}
              </p>
            </>
          )}

          <div className="mt-[18px]">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Budget (optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] font-mono text-[13px]">$</span>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="500"
                min={0}
                step={0.01}
                className="pl-6 font-mono bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
              />
            </div>
          </div>

          {error && <p className="text-sm mt-3" style={{ color: "var(--danger-text)" }}>{error}</p>}

          <div className="mt-[22px] flex justify-end">
            <Button
              type="submit"
              disabled={!hasInput || loading}
              className="text-white border-none h-[2.625rem] px-5"
              style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
            >
              {mode === "list" ? <List size={16} /> : <Sparkles size={16} />}
              {loading
                ? "Starting…"
                : mode === "list"
                  ? `Research ${listLines.length} Items`
                  : "Start Research"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
