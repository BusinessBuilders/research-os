"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function NewResearch() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${API_URL}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal,
        budget: budget ? parseFloat(budget) : null,
      }),
    });

    const session = await res.json();
    router.push(`/research/${session.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Research</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              What are you looking for?
            </label>
            <Textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="upgrade my robotics fab setup to build tendon-driven actuators..."
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Describe a goal, a product to research, or a part to look up.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Budget (optional)</label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="500"
              min={0}
              step={0.01}
            />
          </div>

          <Button type="submit" disabled={!goal.trim() || loading}>
            {loading ? "Starting..." : "Start Research"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
