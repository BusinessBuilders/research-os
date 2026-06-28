import React from "react";

const LABELS = { strong: "Strong fit", partial: "Partial fit", poor: "Poor fit" };

/** Product fit indicator — glowing dot + optional label. score: strong | partial | poor. */
export function FitScore({ score = "strong", showLabel = true, label, className = "", ...props }) {
  const classes = ["ros-fit", className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...props}>
      <span className={`ros-fit__dot ros-fit__dot--${score}`} />
      {showLabel && <span className="ros-fit__label">{label || LABELS[score]}</span>}
    </span>
  );
}
