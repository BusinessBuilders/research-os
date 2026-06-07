import React from "react";

/** Hairline divider. orientation: horizontal | vertical. */
export function Separator({ orientation = "horizontal", className = "", ...props }) {
  const classes = [
    "ros-sep",
    orientation === "vertical" ? "ros-sep--v" : "ros-sep--h",
    className,
  ].filter(Boolean).join(" ");
  return <div role="separator" aria-orientation={orientation} className={classes} {...props} />;
}
