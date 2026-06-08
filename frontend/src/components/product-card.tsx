import { ExternalLink, MessageSquare, Package, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FitScore } from "@/components/fit-score";
import type { ProductCard as ProductCardType } from "@/lib/types";

export function ProductCard({
  product, onToggle, checked,
}: {
  product: ProductCardType; onToggle: (id: string) => void; checked: boolean;
}) {
  return (
    <div
      className="rounded-[var(--radius-xl)] p-4"
      style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
    >
      <div className="flex gap-3 items-start">
        <Checkbox checked={checked} onCheckedChange={() => onToggle(product.id)} className="mt-[3px]" />
        <div
          className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center"
          style={{ background: "var(--surface-soft)", color: "var(--text-faint)", boxShadow: "var(--ring-hairline)" }}
        >
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <Package size={18} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <FitScore score={product.fit_score} showLabel={false} />
              <a
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis hover:underline"
                style={{ color: "var(--text)" }}
              >
                {product.name}
              </a>
            </div>
            <span className="ros-mono text-[13px] text-[var(--text-secondary)] whitespace-nowrap shrink-0">
              {product.price != null ? `$${product.price.toFixed(2)}` : "Price N/A"}
            </span>
          </div>
          <a
            href={product.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[3px] text-xs inline-flex items-center gap-1 hover:underline"
            style={{ color: "var(--info-text)" }}
          >
            {product.source_name} <ExternalLink size={10} />
          </a>
          <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{product.fit_rationale}</p>
          {product.community_note && (
            <div
              className="mt-2 px-3 py-2 rounded-lg text-[13px] leading-relaxed flex gap-2 items-start"
              style={{ background: "rgba(189, 187, 255, 0.08)", border: "1px solid rgba(189, 187, 255, 0.15)" }}
            >
              <MessageSquare size={13} className="shrink-0 mt-0.5" style={{ color: "var(--brand-periwinkle)" }} />
              <span style={{ color: "var(--text-secondary)" }}>{product.community_note}</span>
            </div>
          )}
          {product.risks.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {product.risks.map((r, i) => (
                <Badge key={i} variant="outline" className="text-xs rounded-full border-[var(--hairline-strong)]">
                  <TriangleAlert size={11} /> {r}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
