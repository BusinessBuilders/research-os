"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { ProductCard } from "@/lib/types";

export function PriceChart({ products }: { products: ProductCard[] }) {
  const data = products
    .filter((p) => p.price)
    .map((p) => ({ name: p.name.slice(0, 20), price: p.price }));

  if (data.length === 0) return null;

  return (
    <div className="h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
          <XAxis type="number" tickFormatter={(v) => `$${v}`} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
          <Bar dataKey="price" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
