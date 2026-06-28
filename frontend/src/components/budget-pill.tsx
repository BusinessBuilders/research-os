export function BudgetPill({
  amount,
  currency = "$",
  label = "available",
  className = "",
}: {
  amount: number | string;
  currency?: string;
  label?: string;
  className?: string;
}) {
  const formatted = typeof amount === "number"
    ? amount.toLocaleString("en-US")
    : amount;
  return (
    <span
      className={`inline-flex items-center gap-2 h-[1.875rem] px-3 rounded-full font-mono text-[0.8125rem] tabular-nums ${className}`}
      style={{
        background: "rgba(200, 246, 249, 0.10)",
        border: "1px solid rgba(200, 246, 249, 0.28)",
        color: "var(--brand-mint)",
      }}
    >
      <span
        className="w-[0.45rem] h-[0.45rem] rounded-full"
        style={{
          background: "var(--brand-mint)",
          boxShadow: "0 0 8px rgba(200, 246, 249, 0.7)",
        }}
      />
      {currency}{formatted} {label}
    </span>
  );
}
