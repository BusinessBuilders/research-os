import React from "react";

/**
 * Badge / pill. variant: neutral | primary | outline | success | warning |
 * danger | info | brand. Set `mono` for uppercase technical labels.
 */
export function Badge({ variant = "neutral", mono = false, className = "", children, ...props }) {
  const classes = [
    "ros-badge",
    `ros-badge--${variant}`,
    mono ? "ros-badge--mono" : "",
    className,
  ].filter(Boolean).join(" ");
  return <span className={classes} {...props}>{children}</span>;
}
