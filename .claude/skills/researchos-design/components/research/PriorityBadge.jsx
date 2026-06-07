import React from "react";
import { Badge } from "../display/Badge.jsx";

const MAP = {
  critical: { variant: "danger", label: "critical" },
  important: { variant: "info", label: "important" },
  "nice-to-have": { variant: "neutral", label: "nice-to-have" },
};

/** Need priority pill. priority: critical | important | nice-to-have. */
export function PriorityBadge({ priority = "important", ...props }) {
  const m = MAP[priority] || MAP.important;
  return <Badge variant={m.variant} {...props}>{m.label}</Badge>;
}
