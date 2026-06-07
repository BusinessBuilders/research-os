import React from "react";
import { Badge } from "../display/Badge.jsx";

const MAP = {
  created:     { variant: "neutral", label: "created" },
  analyzing:   { variant: "info",    label: "analyzing" },
  researching: { variant: "info",    label: "researching" },
  complete:    { variant: "success", label: "complete" },
  decided:     { variant: "brand",   label: "decided" },
  failed:      { variant: "danger",  label: "failed" },
};

/** Research-session status pill. */
export function StatusBadge({ status = "created", mono = true, ...props }) {
  const m = MAP[status] || MAP.created;
  return <Badge variant={m.variant} mono={mono} {...props}>{m.label}</Badge>;
}
