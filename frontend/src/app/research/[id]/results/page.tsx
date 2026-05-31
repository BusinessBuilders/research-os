"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { PriceChart } from "@/components/price-chart";
import { ResearchStatus } from "@/components/research-status";
import type { ResearchSession } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.76.233.80:8001";

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

  if (!session) return <p>Loading...</p>;

  if (session.mode === "direct-lookup" && session.lookup_result) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Answer</h1>
        <p className="mb-4">{session.lookup_result.answer}</p>
        {session.lookup_result.part_numbers.length > 0 && (
          <p className="font-mono text-sm mb-4">Part numbers: {session.lookup_result.part_numbers.join(", ")}</p>
        )}
        <div className="space-y-2">
          {session.lookup_result.citations.map((c, i) => (
            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-400">
              {c.title}
            </a>
          ))}
        </div>
      </div>
    );
  }

  const allProducts = session.needs.flatMap(n => n.products);
  const hasProducts = allProducts.length > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Results</h1>
      <p className="text-muted-foreground mb-6">{session.goal}</p>

      {researching && <ResearchStatus sessionId={id} onComplete={loadSession} />}

      {!researching && !hasProducts && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No products found. The searches may have timed out.</p>
          <Button onClick={handleRetry} disabled={retrying}>
            {retrying ? "Retrying..." : "Retry Research"}
          </Button>
        </div>
      )}

      {session.needs.filter(n => n.products.length > 0).map(need => (
        <div key={need.id} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{need.description}</h2>
          <div className="space-y-3">
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
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground">{selectedIds.size} products selected</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRetry} disabled={retrying}>
              {retrying ? "Retrying..." : "Re-research"}
            </Button>
            <Button onClick={() => router.push(`/research/${id}/decide?selected=${Array.from(selectedIds).join(",")}`)}>
              Decide on Winners
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
