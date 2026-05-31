import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductCard as ProductCardType } from "@/lib/types";

const fitColors = { strong: "bg-green-500", partial: "bg-yellow-500", poor: "bg-red-500" };

export function ProductCard({
  product, onToggle, checked,
}: {
  product: ProductCardType; onToggle: (id: string) => void; checked: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Checkbox checked={checked} onCheckedChange={() => onToggle(product.id)} className="mt-1" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${fitColors[product.fit_score]}`} />
            <span className="font-medium">{product.name}</span>
            <span className="text-muted-foreground">
              {product.price ? `$${product.price.toFixed(2)}` : "Price N/A"}
            </span>
            <span className="text-xs text-muted-foreground">— {product.source_name}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{product.fit_rationale}</p>
          {product.risks.length > 0 && (
            <div className="flex gap-1 mt-2">
              {product.risks.map((r, i) => (
                <Badge key={i} variant="outline" className="text-xs">{r}</Badge>
              ))}
            </div>
          )}
          <a href={product.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 mt-1 inline-block">
            View source
          </a>
        </div>
      </div>
    </Card>
  );
}
