import { Badge } from "@/components/ui/badge";

const PRIORITY_MAP = {
  critical: { className: "bg-[var(--danger-soft)] text-[var(--danger-text)] border-[rgba(239,68,68,0.3)]", label: "critical" },
  important: { className: "bg-[var(--info-soft)] text-[var(--info-text)] border-[rgba(59,130,246,0.3)]", label: "important" },
  "nice-to-have": { className: "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--hairline)]", label: "nice-to-have" },
} as const;

export function PriorityBadge({ priority }: { priority: string }) {
  const m = PRIORITY_MAP[priority as keyof typeof PRIORITY_MAP] || PRIORITY_MAP.important;
  return (
    <Badge variant="outline" className={`rounded-full border text-xs ${m.className}`}>
      {m.label}
    </Badge>
  );
}
