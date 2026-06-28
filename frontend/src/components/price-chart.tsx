"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import type { ProductCard } from "@/lib/types";

export function PriceChart({ products }: { products: ProductCard[] }) {
  const data = products
    .filter((p): p is ProductCard & { price: number } => p.price != null)
    .map((p) => ({ name: p.name.slice(0, 20), price: p.price }));

  if (data.length === 0) return null;

  return (
    <div
      className="rounded-[var(--radius-xl)] p-4 mt-3"
      style={{ background: "var(--surface-2)", boxShadow: "var(--ring-hairline), var(--elev-1)" }}
    >
      <div className="ros-eyebrow mb-1 flex items-center gap-1.5">
        <BarChart3 size={12} /> Price comparison
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => `$${v}`}
              stroke="var(--text-faint)"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--text-muted-val)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--text-muted-val)" }}
              stroke="var(--text-faint)"
            />
            <Tooltip
              formatter={(v) => `$${Number(v).toFixed(2)}`}
              contentStyle={{
                background: "var(--surface-3)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
              }}
            />
            <Bar dataKey="price" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
