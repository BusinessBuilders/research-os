import React from "react";

/** Multi-line text field. Used for research goals and decision rationale. */
export function Textarea({ rows = 3, className = "", ...props }) {
  const classes = ["ros-field", className].filter(Boolean).join(" ");
  return <textarea rows={rows} className={classes} {...props} />;
}
