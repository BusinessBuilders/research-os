import { ExternalLink, MessageSquare, Package, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FitScore } from "@/components/fit-score";
import type { ProductCard as ProductCardType } from "@/lib/types";

/** URLs come from LLM/web extraction — only render http(s) links/images. */
function isSafeUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Community-derived quality rating (1.0–5.0 in 0.5 steps), distinct from fit_score. */
function QualityStars({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return (
    <span
      role="img"
      aria-label={`Community quality ${score} out of 5`}
      className="inline-flex items-center gap-1.5"
    >
      <span className="relative inline-block text-[11px] leading-none" aria-hidden="true">
        <span style={{ color: "var(--text-faint)", opacity: 0.5 }}>★★★★★</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
          style={{ width: `${pct}%`, color: "var(--warning-text)" }}
        >
          ★★★★★
        </span>
      </span>
      <span className="font-mono text-[11px] tracking-[0.04em]" style={{ color: "var(--text-secondary)" }}>
        {score.toFixed(1)}
      </span>
    </span>
  );
}

export function ProductCard({
  product, onToggle, checked,
}: {
  product: ProductCardType; onToggle: (id: string) => void; checked: boolean;
}) {
  const safeSourceUrl = isSafeUrl(product.source_url) ? product.source_url : null;
  const safeImageUrl = isSafeUrl(product.image_url) ? product.image_url : null;

  return (
    <div
      className="rounded-[var(--radius-xl)] p-4"
      style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
    >
      <div className="flex gap-3 items-start">
        <Checkbox
          checked={checked}
          onCheckedChange={() => onToggle(product.id)}
          className="mt-[3px]"
          aria-label={`Select ${product.name}`}
        />
        <div
          className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center"
          style={{ background: "var(--surface-soft)", color: "var(--text-faint)", boxShadow: "var(--ring-hairline)" }}
        >
          {safeImageUrl ? (
            <img src={safeImageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <Package size={18} aria-label="No product image" role="img" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <FitScore score={product.fit_score} showLabel={false} />
              {safeSourceUrl ? (
                <a
                  href={safeSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis hover:underline"
                  style={{ color: "var(--text)" }}
                >
                  {product.name}
                </a>
              ) : (
                <span
                  className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ color: "var(--text)" }}
                >
                  {product.name}
                </span>
              )}
            </div>
            <span className="flex items-center gap-3 shrink-0">
              {product.quality_score != null && <QualityStars score={product.quality_score} />}
              <span className="ros-mono text-[13px] text-[var(--text-secondary)] whitespace-nowrap">
                {product.price != null ? `$${product.price.toFixed(2)}` : "Price N/A"}
              </span>
            </span>
          </div>
          {safeSourceUrl ? (
            <a
              href={safeSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[3px] text-xs inline-flex items-center gap-1 hover:underline"
              style={{ color: "var(--info-text)" }}
            >
              {product.source_name} <ExternalLink size={10} aria-label="Opens in new tab" role="img" />
            </a>
          ) : (
            <span className="mt-[3px] text-xs inline-flex items-center gap-1" style={{ color: "var(--text-faint)" }}>
              {product.source_name}
            </span>
          )}
          <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{product.fit_rationale}</p>
          {product.community_note && (
            <div
              className="mt-2 px-3 py-2 rounded-lg text-[13px] leading-relaxed flex gap-2 items-start"
              style={{ background: "rgba(189, 187, 255, 0.08)", border: "1px solid rgba(189, 187, 255, 0.15)" }}
            >
              <MessageSquare
                size={13}
                className="shrink-0 mt-0.5"
                style={{ color: "var(--brand-periwinkle)" }}
                aria-label="Community note"
                role="img"
              />
              <span style={{ color: "var(--text-secondary)" }}>{product.community_note}</span>
            </div>
          )}
          {product.risks.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {product.risks.map((r, i) => (
                <Badge key={i} variant="outline" className="text-xs rounded-full border-[var(--hairline-strong)]">
                  <TriangleAlert size={11} aria-label="Risk" role="img" /> {r}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
