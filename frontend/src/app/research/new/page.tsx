"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BudgetPill } from "@/components/budget-pill";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function NewResearch() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          budget: budget ? parseFloat(budget) : null,
        }),
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
          One goal, one budget. The advisor handles the rest.
        </p>
      </div>

      <div
        className="rounded-[var(--radius-xl)] p-6"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end mb-3.5">
            <BudgetPill amount={4200} />
          </div>

          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            What are you looking for?
          </label>
          <Textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="upgrade my robotics fab setup to build tendon-driven actuators…"
            rows={4}
            required
            className="bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Describe a goal, a product to research, or a part to look up.
          </p>

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
              disabled={!goal.trim() || loading}
              className="text-white border-none h-[2.625rem] px-5"
              style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
            >
              <Sparkles size={16} />
              {loading ? "Starting…" : "Start Research"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
