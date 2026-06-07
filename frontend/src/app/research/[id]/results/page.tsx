"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { PriceChart } from "@/components/price-chart";
import { ResearchStatus } from "@/components/research-status";
import type { ResearchSession } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [researching, setResearching] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const loadSession = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/sessions/${id}`);
    const s = await res.json();
    setSession(s);
    if (s.status === "complete" || s.status === "decided") setResearching(false);
  }, [id]);

  useEffect(() => { loadSession(); }, [loadSession]);

  function toggleProduct(productId: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }

  async function handleRetry() {
    setRetrying(true);
    await fetch(`${API_URL}/api/sessions/${id}/retry`, { method: "POST" });
    setResearching(true);
    setRetrying(false);
  }

  if (!session) return <p className="text-muted-foreground animate-pulse">Loading…</p>;

  if (session.mode === "direct-lookup" && session.lookup_result) {
    return (
      <div>
        <div className="ros-eyebrow mb-2">Direct lookup</div>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Answer</h1>
        <p className="mb-4">{session.lookup_result.answer}</p>
        {session.lookup_result.part_numbers.length > 0 && (
          <p className="ros-mono text-sm mb-4">Part numbers: {session.lookup_result.part_numbers.join(", ")}</p>
        )}
        <div className="flex flex-col gap-2">
          {session.lookup_result.citations.map((c, i) => (
            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer"
              className="text-sm" style={{ color: "var(--info-text)" }}>
              {c.title}
            </a>
          ))}
        </div>
      </div>
    );
  }

  const allProducts = session.needs.flatMap(n => n.products);
  const hasProducts = allProducts.length > 0;
  const needsWithProducts = session.needs.filter(n => n.products.length > 0);

  return (
    <div>
      <div className="mb-6">
        <div className="ros-eyebrow mb-2">Results</div>
        <h1 className="text-2xl font-semibold tracking-tight">Products found</h1>
        <p className="text-sm text-muted-foreground mt-2">{session.goal} · scored against your goal and budget</p>
      </div>

      {researching && <ResearchStatus sessionId={id} onComplete={loadSession} />}

      {!researching && !hasProducts && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No products found. The searches may have timed out.</p>
          <Button variant="outline" onClick={handleRetry} disabled={retrying}>
            <RotateCw size={14} /> {retrying ? "Retrying…" : "Retry Research"}
          </Button>
        </div>
      )}

      {needsWithProducts.map(need => (
        <div key={need.id} className="mb-[30px]">
          <div className="flex items-baseline gap-2.5 mb-3">
            <h2 className="text-base font-semibold min-w-0">{need.description}</h2>
            <span className="shrink-0">
              <Badge variant="outline" className="rounded-full border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--text-secondary)]">
                {need.products.length} found
              </Badge>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {need.products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                checked={selectedIds.has(p.id)}
                onToggle={toggleProduct}
              />
            ))}
          </div>
          <PriceChart products={need.products} />
          <Separator className="mt-6" />
        </div>
      ))}

      {!researching && hasProducts && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-[13px] text-muted-foreground">{selectedIds.size} products selected</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRetry} disabled={retrying}>
              <RotateCw size={14} /> {retrying ? "Retrying…" : "Re-research"}
            </Button>
            <Button
              onClick={() => router.push(`/research/${id}/decide?selected=${Array.from(selectedIds).join(",")}`)}
              className="text-white border-none"
              style={{ background: "var(--brand-gradient-h)", boxShadow: "var(--glow-brand)" }}
            >
              Decide on Winners <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
