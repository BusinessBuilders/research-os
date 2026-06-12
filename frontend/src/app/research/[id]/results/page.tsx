"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/product-card";
import { PriceChart } from "@/components/price-chart";
import { ResearchStatus } from "@/components/research-status";
import { ApproachCard } from "@/components/approach-card";
import type { ResearchSession, ProductCard as ProductCardType } from "@/lib/types";
import { API_URL } from "@/lib/api";

type SortMode = "best" | "price-asc" | "price-desc" | "quality";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "best", label: "Best fit" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
  { id: "quality", label: "Quality" },
];

const MIN_QUALITY_OPTIONS = [
  { value: "", label: "Any" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "4.5", label: "4.5+" },
];

function sortProducts(products: ProductCardType[], mode: SortMode): ProductCardType[] {
  if (mode === "best") return products;
  const sorted = [...products];
  if (mode === "price-asc") {
    sorted.sort((a, b) => {
      if (a.price == null && b.price == null) return 0;
      if (a.price == null) return 1;
      if (b.price == null) return -1;
      return a.price - b.price;
    });
  } else if (mode === "price-desc") {
    sorted.sort((a, b) => {
      if (a.price == null && b.price == null) return 0;
      if (a.price == null) return 1;
      if (b.price == null) return -1;
      return b.price - a.price;
    });
  } else if (mode === "quality") {
    sorted.sort((a, b) => {
      if (a.quality_score == null && b.quality_score == null) return 0;
      if (a.quality_score == null) return 1;
      if (b.quality_score == null) return -1;
      return b.quality_score - a.quality_score;
    });
  }
  return sorted;
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [researching, setResearching] = useState(true);
  const [retrying, setRetrying] = useState(false);

  // Sort & filter state (client-side only)
  const [sortMode, setSortMode] = useState<SortMode>("best");
  const [maxPrice, setMaxPrice] = useState("");
  const [minQuality, setMinQuality] = useState("");
  const [hasPriceOnly, setHasPriceOnly] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/${id}`);
      if (!res.ok) {
        setLoadError(`Couldn't load this session (HTTP ${res.status}).`);
        return;
      }
      const s: ResearchSession = await res.json();
      setLoadError(null);
      // Research hasn't started — there's no job to poll here; the session
      // detail page owns routing for pre-research states.
      if (s.status === "created" || s.status === "analyzing") {
        router.replace(`/research/${id}`);
        return;
      }
      setSession(s);
      if (s.status === "complete" || s.status === "decided" || s.status === "failed") {
        setResearching(false);
      }
    } catch {
      setLoadError("Couldn't reach the research service.");
    }
  }, [id, router]);

  useEffect(() => { loadSession(); }, [loadSession]);

  const maxPriceNum = useMemo(() => {
    const n = parseFloat(maxPrice);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }, [maxPrice]);

  const minQualityNum = useMemo(() => {
    const n = parseFloat(minQuality);
    return Number.isFinite(n) ? n : null;
  }, [minQuality]);

  const filterProducts = useCallback((products: ProductCardType[]) => {
    return products.filter(p => {
      if (hasPriceOnly && p.price == null) return false;
      // Max price excludes only products with a known price above the cap;
      // null-price products stay unless "Has price" is on.
      if (maxPriceNum != null && p.price != null && p.price > maxPriceNum) return false;
      if (minQualityNum != null && (p.quality_score == null || p.quality_score < minQualityNum)) return false;
      return true;
    });
  }, [hasPriceOnly, maxPriceNum, minQualityNum]);

  function toggleProduct(productId: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }

  async function handleRetry() {
    setRetrying(true);
    try {
      await fetch(`${API_URL}/api/sessions/${id}/retry`, { method: "POST" });
      setResearching(true);
    } catch { /* surfaced by polling / load error */ }
    setRetrying(false);
  }

  if (loadError) {
    return (
      <div
        className="rounded-[var(--radius-xl)] p-6 max-w-[560px]"
        style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
      >
        <div className="ros-eyebrow mb-2" style={{ color: "var(--danger-text)" }}>Error</div>
        <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
        <Button variant="outline" onClick={() => { setLoadError(null); loadSession(); }}>
          <RotateCw size={14} /> Retry
        </Button>
      </div>
    );
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
  const failed = session.status === "failed";
  const filtersActive = maxPriceNum != null || minQualityNum != null || hasPriceOnly;

  return (
    <div>
      <div className="mb-6">
        <div className="ros-eyebrow mb-2">Results</div>
        <h1 className="text-2xl font-semibold tracking-tight">Products found</h1>
        <p className="text-sm text-muted-foreground mt-2">{session.goal} · scored against your goal and budget</p>
      </div>

      {researching && <ResearchStatus sessionId={id} onComplete={loadSession} />}

      {failed && (
        <div
          className="rounded-[var(--radius-xl)] p-5 mb-6 flex items-start gap-3"
          style={{ background: "var(--danger-soft)", boxShadow: "var(--ring-hairline)" }}
        >
          <TriangleAlert size={16} className="shrink-0 mt-0.5" style={{ color: "var(--danger-text)" }} />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--danger-text)" }}>Research failed</p>
            <p className="text-[13px] text-muted-foreground mt-1">
              The research run did not complete.{hasProducts ? " Partial results are shown below." : ""} You can retry it.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry} disabled={retrying}>
            <RotateCw size={14} /> {retrying ? "Retrying…" : "Retry"}
          </Button>
        </div>
      )}

      {!researching && !failed && !hasProducts && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No products found. The searches may have timed out.</p>
          <Button variant="outline" onClick={handleRetry} disabled={retrying}>
            <RotateCw size={14} /> {retrying ? "Retrying…" : "Retry Research"}
          </Button>
        </div>
      )}

      {/* Methods first, then products */}
      {session.approach && hasProducts && <ApproachCard approach={session.approach} compact />}

      {/* Sort & filter toolbar */}
      {hasProducts && (
        <div
          className="rounded-[var(--radius-xl)] px-4 py-3 mb-6 flex flex-wrap items-center gap-x-6 gap-y-3"
          style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Sort</span>
            <div
              className="inline-flex rounded-[var(--radius-lg)] p-0.5"
              style={{ background: "var(--surface-input)", boxShadow: "var(--ring-hairline)" }}
              role="group"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortMode(opt.id)}
                  aria-pressed={sortMode === opt.id}
                  className="px-2.5 py-1 rounded-[calc(var(--radius-lg)-2px)] text-xs font-medium transition-colors"
                  style={{
                    background: sortMode === opt.id ? "var(--surface-soft)" : "transparent",
                    color: sortMode === opt.id ? "var(--text)" : "var(--text-secondary)",
                    border: `1px solid ${sortMode === opt.id ? "var(--hairline-strong)" : "transparent"}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="max-price" className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Max price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] font-mono text-xs">$</span>
              <Input
                id="max-price"
                type="number"
                min={0}
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="no limit"
                className="h-7 w-[110px] pl-5 font-mono text-xs bg-[var(--surface-input)] border-[var(--hairline-strong)] focus:border-[var(--brand-periwinkle)] focus:shadow-[var(--glow-focus)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="min-quality" className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Min quality
            </label>
            <select
              id="min-quality"
              value={minQuality}
              onChange={e => setMinQuality(e.target.value)}
              className="h-7 px-2 rounded-[var(--radius-lg)] font-mono text-xs outline-none"
              style={{
                background: "var(--surface-input)",
                color: "var(--text)",
                border: "1px solid var(--hairline-strong)",
              }}
            >
              {MIN_QUALITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={hasPriceOnly}
              onCheckedChange={() => setHasPriceOnly(v => !v)}
              aria-label="Show only products with a price"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Has price</span>
          </label>
        </div>
      )}

      {needsWithProducts.map(need => {
        const visible = sortProducts(filterProducts(need.products), sortMode);
        const hidden = need.products.length - visible.length;
        return (
          <div key={need.id} className="mb-[30px]">
            <div className="flex items-baseline gap-2.5 mb-3">
              <h2 className="text-base font-semibold min-w-0">{need.description}</h2>
              <span className="shrink-0">
                <Badge variant="outline" className="rounded-full border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--text-secondary)]">
                  {need.products.length} found
                </Badge>
              </span>
              {hidden > 0 && (
                <span className="ros-mono text-xs text-muted-foreground shrink-0">
                  {visible.length} of {need.products.length} shown
                </span>
              )}
            </div>
            {visible.length === 0 && filtersActive ? (
              <p className="text-[13px] text-muted-foreground py-2">All {need.products.length} products hidden by filters.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {visible.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    checked={selectedIds.has(p.id)}
                    onToggle={toggleProduct}
                  />
                ))}
              </div>
            )}
            <PriceChart products={visible} />
            <Separator className="mt-6" />
          </div>
        );
      })}

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
