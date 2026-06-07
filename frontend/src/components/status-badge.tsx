import { Badge } from "@/components/ui/badge";

const STATUS_MAP = {
  created: { className: "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--hairline)]", label: "CREATED" },
  analyzing: { className: "bg-[var(--info-soft)] text-[var(--info-text)] border-[rgba(59,130,246,0.3)]", label: "ANALYZING" },
  researching: { className: "bg-[var(--info-soft)] text-[var(--info-text)] border-[rgba(59,130,246,0.3)]", label: "RESEARCHING" },
  complete: { className: "bg-[var(--success-soft)] text-[var(--success-text)] border-[rgba(34,197,94,0.3)]", label: "COMPLETE" },
  decided: { className: "bg-[rgba(189,187,255,0.14)] text-[var(--brand-periwinkle)] border-[rgba(189,187,255,0.32)]", label: "DECIDED" },
  failed: { className: "bg-[var(--danger-soft)] text-[var(--danger-text)] border-[rgba(239,68,68,0.3)]", label: "FAILED" },
} as const;

export function StatusBadge({ status }: { status: string }) {
  const m = STATUS_MAP[status as keyof typeof STATUS_MAP] || STATUS_MAP.created;
  return (
    <Badge variant="outline" className={`font-mono text-[0.75rem] uppercase tracking-[0.08em] rounded-full border ${m.className}`}>
      {m.label}
    </Badge>
  );
}
