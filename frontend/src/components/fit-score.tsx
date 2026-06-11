const LABELS = { strong: "Strong fit", partial: "Partial fit", poor: "Poor fit" } as const;

const DOT_STYLES = {
  strong: "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]",
  partial: "bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.55)]",
  poor: "bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]",
} as const;

export function FitScore({
  score,
  showLabel = true,
  className = "",
}: {
  score: "strong" | "partial" | "poor";
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${DOT_STYLES[score]}`}
        {...(!showLabel ? { role: "img", "aria-label": LABELS[score] } : { "aria-hidden": true })}
      />
      {showLabel && (
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
          {LABELS[score]}
        </span>
      )}
    </span>
  );
}
